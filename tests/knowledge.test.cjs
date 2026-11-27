const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const sandbox={module:{exports:{}},console,Date,URL,TextEncoder,structuredClone,crypto:webcrypto,require:()=>({Plugin:class{},ItemView:class{},Modal:class{},PluginSettingTab:class{},parseYaml:JSON.parse,stringifyYaml:JSON.stringify,normalizePath:s=>s,Notice:class{}})};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../main.js'),'utf8'),sandbox);
const Plugin=sandbox.module.exports,k=Plugin.testing;
function fixture(){
 const files=new Map(),folders=new Map(),trash=[],p=new Plugin();p.settings={folder:'KnowledgeFlow/Aufgaben'};p.tasks=[];p.knowledge=[];p.app={workspace:{getLeavesOfType:()=>[]},vault:{
  getMarkdownFiles:()=>[...files.keys()].filter(path=>path.endsWith('.md')).map(path=>({path})),
  getAbstractFileByPath:path=>files.has(path)?{path}:folders.get(path),
  read:async file=>{if(!files.has(file.path))throw Error('missing file');return files.get(file.path);},
  createFolder:async path=>{folders.set(path,{path});},
  create:async(path,raw)=>{if(files.has(path))throw Error('exists');files.set(path,raw);return {path};},
  process:async(file,fn)=>{files.set(file.path,fn(files.get(file.path)));},
  trash:async file=>{trash.push([file.path,files.get(file.path)]);files.delete(file.path);}
 }};return {p,files,folders,trash};
}
async function source(p,text='A documented support procedure.'){await p.kbCapture({title:'Support source',url:'https://example.org/support',body:text});return p.knowledge.find(r=>r.meta.kind==='source'&&r.body===text);}
function proposal(s,extra={}){return {title:'Support guide',kind:'page',body:'Check the connection, then the configuration.',sourceRefs:[{id:s.meta.id,revision:s.meta.revision,passage:'Procedure'}],tags:['support'],area:'Work',related:[],provenance:'source',...extra};}
test('capture is opt-in, isolated and preserves source text byte-for-byte',async()=>{
 const {p,files}=fixture();await p.kbScan();assert.equal(files.size,0);const text='Original\r\n- [ ] unchanged\r\n';const s=await source(p,text);assert.equal(s.body,text);assert.ok([...files.keys()].every(path=>path.startsWith(k.KB_ROOT+'/')));assert.equal(await k.kbHash(text),s.meta.revision);
});
test('canonical URLs remove tracking but preserve meaningful queries and reject executable URLs',()=>{
 assert.equal(k.kbCanonical('https://EXAMPLE.org/a?b=2&utm_source=x&a=1#fragment'),'https://example.org/a?a=1&b=2');assert.throws(()=>k.kbCanonical('javascript:alert(1)'));assert.throws(()=>k.kbCanonical('https://secret:password@example.org'));assert.equal(k.kbCanonical(''),'');
});
test('repeated captures deduplicate; changed source creates a new immutable revision',async()=>{
 const {p,files}=fixture();const first=await source(p);const raw=first.raw;const again=await p.kbCapture({title:'Other label',body:first.body,url:'https://example.org/support?utm_medium=test'});assert.equal(again.duplicate,true);await source(p,'Updated procedure');const snapshots=p.knowledge.filter(r=>r.meta.kind==='source');assert.equal(snapshots.length,2);assert.equal(snapshots[0].meta.id,snapshots[1].meta.id);assert.equal(files.get(first.file.path),raw);
});
test('simultaneous duplicate captures serialize to a single snapshot',async()=>{
 const {p}=fixture();await Promise.all([source(p),source(p)]);assert.equal(p.knowledge.filter(r=>r.meta.kind==='source').length,1);
});
test('external modification of source text is quarantined rather than accepted',async()=>{
 const {p,files}=fixture();const s=await source(p);files.set(s.file.path,k.encode(s.meta,'tampered'));await p.kbScan();assert.equal(p.knowledge.length,0);assert.equal(p.knowledgeInvalid.length,1);
});
test('draft validation rejects missing sources, malformed refs and invalid types',async()=>{
 const {p}=fixture(),s=await source(p);assert.throws(()=>k.kbFields(proposal(s,{sourceRefs:[]})));assert.throws(()=>k.kbFields(proposal(s,{kind:'source'})));assert.throws(()=>k.kbFields(proposal(s,{sourceRefs:[{id:'../escape',revision:s.meta.revision}]})));await assert.rejects(()=>p.kbDraft(proposal(s,{sourceRefs:[{id:'missing',revision:s.meta.revision}]})),/Missing|fehlt/);
});
test('publishing requires review and does not modify original source or create tasks',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));assert.equal(p.knowledge.filter(r=>r.meta.state==='published').length,0);const draft=p.knowledge.find(r=>r.meta.state==='review');const id=await p.kbApprove(draft);assert.ok(p.knowledge.some(r=>r.meta.id===id&&r.meta.state==='published'));assert.ok(p.knowledge.some(r=>r.meta.id===draft.meta.id&&r.meta.state==='archived'));assert.equal(files.get(s.file.path),s.raw);assert.equal(p.tasks.length,0);await assert.rejects(()=>p.kbApprove(draft));
});
test('editing a source or a published page through an inappropriate draft is rejected',async()=>{
 const {p}=fixture(),s=await source(p);await assert.rejects(()=>p.kbDraft(proposal(s),s));await assert.rejects(()=>p.kbAnnotate(s,'overwrite'));await assert.rejects(()=>p.kbArchive(s));
});
test('stale target approval fails without publishing over newer annotations',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));const page=p.knowledge.find(r=>r.meta.state==='published');await p.kbDraft(proposal(s,{body:'New guide'}),page);const draft=p.knowledge.find(r=>r.meta.state==='review');await p.kbAnnotate(page,'My notes');const snapshot=new Map(files);await assert.rejects(()=>p.kbApprove(draft),/Zielseite|Target/);assert.deepEqual(files,snapshot);
});
test('new approved revisions preserve annotations, unknown metadata and restorable history',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));let page=p.knowledge.find(r=>r.meta.state==='published');await p.kbAnnotate(page,'Personal notes');page=p.knowledge.find(r=>r.meta.state==='published');files.set(page.file.path,k.encode({...page.meta,custom:'keep'},page.body));await p.kbFresh();page=p.knowledge.find(r=>r.meta.state==='published');await p.kbDraft(proposal(s,{body:'Revised text'}),page);await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));const revised=p.knowledge.find(r=>r.meta.state==='published');assert.equal(revised.meta.userNotes,'Personal notes');assert.equal(revised.meta.custom,'keep');assert.ok(revised.body.startsWith('Revised text'));assert.ok(revised.body.includes('[['+s.file.path.replace(/\.md$/,'')+'|'));assert.equal(k.kbStripLinks(revised.body),'Revised text');const history=await p.kbHistory(revised);assert.ok(history.some(r=>r.body===page.body&&r.meta.custom==='keep'));assert.equal(p.knowledgeInvalid.length,0);
});
test('failed multi-file publish keeps snapshots, quarantines partial output and resumes after review',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));const draft=p.knowledge.find(r=>r.meta.state==='review'),process=p.app.vault.process;let failed=false;p.app.vault.process=async(file,fn)=>{if(file.path===draft.file.path&&!failed){failed=true;throw Error('disk failure');}return process(file,fn);};await assert.rejects(()=>p.kbApprove(draft),/disk failure/);assert.equal(p.knowledge.filter(r=>r.meta.state==='published').length,0);assert.equal(files.get(draft.file.path),draft.raw);assert.equal(files.get(s.file.path),s.raw);const pending=p.kbTransactions.find(e=>!e.done),entry=await k.kbInspectTransaction(p,pending.id);await p.kbRecover(pending.id,entry.previewHash);assert.equal(p.knowledge.filter(r=>r.meta.state==='published').length,1);
});
test('failed audit write keeps the transaction pending until the audit is restored',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));const draft=p.knowledge.find(r=>r.meta.state==='review'),create=p.app.vault.create;p.app.vault.create=async(path,raw)=>{if(path.includes('/Protokoll/'))throw Error('audit failed');return create(path,raw);};await assert.rejects(()=>p.kbApprove(draft),/audit failed/);assert.notEqual(files.get(draft.file.path),draft.raw);assert.equal(p.knowledge.filter(r=>r.meta.state==='published').length,0);const pending=p.kbTransactions.find(e=>!e.done);p.app.vault.create=create;const entry=await k.kbInspectTransaction(p,pending.id);await p.kbRecover(pending.id,entry.previewHash);assert.equal(p.knowledge.filter(r=>r.meta.state==='published').length,1);
});
test('search matches accents, annotations and filters without duplicate results',async()=>{
 const {p}=fixture(),s=await source(p);await p.kbDraft(proposal(s,{title:'Geräte prüfen',body:'SIM configuration'}));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));const page=p.knowledge.find(r=>r.meta.state==='published');await p.kbAnnotate(page,'Sonderfall Zürich');assert.equal(k.kbSearch(p.knowledge,'gerate zurich',{state:'published',area:'Work'}).length,1);assert.equal(k.kbSearch(p.knowledge,'SIM',{state:'published',area:'Private'}).length,0);
});
test('health flags missing references, newer snapshots and duplicates rather than guessing truth',async()=>{
 const {p}=fixture(),s=await source(p);await p.kbDraft(proposal(s,{related:['missing-page'],provenance:'ambiguous'}));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));await new Promise(r=>setTimeout(r,3));await source(p,'New source revision');let result=k.kbHealth(p.knowledge);assert.ok(result.some(r=>r.type==='stale-source'));assert.ok(result.some(r=>r.type==='broken-link'));assert.ok(result.some(r=>r.type==='ambiguous'));const page=p.knowledge.find(r=>r.meta.state==='published');result=k.kbHealth([...p.knowledge,{...page,meta:{...page.meta,id:'duplicate'}}]);assert.ok(result.some(r=>r.type==='duplicate'));
});
test('knowledge writes reject paths outside owned root',async()=>{const {p,files}=fixture();await assert.rejects(()=>p.kbCommit([{path:'TaskFlow/Aufgaben/do-not-touch.md',before:null,after:'bad'}],'invalid'),/Unsafe/);assert.equal(files.size,0);});
test('fork has independent plugin identity, defaults, selectors and release version',()=>{
 const root=require('node:path').join(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));assert.equal(manifest.id,'knowledgeflow');assert.equal(manifest.version,'1.19.0');const code=fs.readFileSync(root+'/main.js','utf8');assert.ok(code.includes("const VIEW = 'knowledgeflow-board'"));assert.ok(!code.includes("folder:'TaskFlow/"));assert.ok(!fs.readFileSync(root+'/styles.css','utf8').includes('.tf-root'));assert.throws(()=>k.decode(k.encode({taskflow:1,title:'Old task'},'untouched')));
});
test('assistant work requests include only selected complete sources and report omissions',async()=>{
 const {p}=fixture(),s=await source(p);const pack=k.kbAssistantContext([s]);assert.equal(pack.included,1);assert.equal(pack.omitted,0);assert.ok(pack.text.includes(s.meta.id));assert.ok(pack.text.includes(s.body));const small=k.kbAssistantContext([s],10);assert.equal(small.included,0);assert.equal(small.omitted,1);assert.ok(!small.text.includes(s.body));assert.throws(()=>k.kbAssistantContext([]));
});
test('archived published pages restore with their original identity and annotations',async()=>{
 const {p}=fixture(),s=await source(p);await p.kbDraft(proposal(s));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));let page=p.knowledge.find(r=>r.meta.state==='published');await p.kbAnnotate(page,'Keep these notes');page=p.knowledge.find(r=>r.meta.state==='published');await p.kbArchive(page);const archived=p.knowledge.find(r=>r.meta.id===page.meta.id);await p.kbReactivate(archived);const restored=p.knowledge.find(r=>r.meta.id===page.meta.id);assert.equal(restored.meta.state,'published');assert.equal(restored.meta.userNotes,'Keep these notes');await assert.rejects(()=>p.kbReactivate(p.knowledge.find(r=>r.meta.publishedTarget)));
});
test('generated link blocks do not leak into excerpts or duplicate on later publish',async()=>{
 const {p}=fixture(),s=await source(p),data=proposal(s),body=k.kbWithLinks(data,p.knowledge);assert.equal(k.kbStripLinks(body),data.body);assert.ok(!k.kbExcerpt(body).includes('knowledgeflow:links'));const twice=k.kbWithLinks({...data,body},p.knowledge);assert.equal((twice.match(/knowledgeflow:links:start/g)||[]).length,1);assert.ok(twice.includes(s.file.path.replace(/\.md$/,'')));
});

async function readyRevision(){const f=fixture(),{p}=f,s=await source(p);await p.kbDraft(proposal(s));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));const page=p.knowledge.find(r=>r.meta.state==='published');await p.kbDraft(proposal(s,{body:'New complete version'}),page);return {...f,s,page,draft:p.knowledge.find(r=>r.meta.state==='review')};}
async function restart(p){const q=new Plugin();q.app={...p.app,vault:{...p.app.vault}};q.settings=p.settings;q.tasks=[];q.knowledge=[];await q.kbJournalScan();await q.kbFresh();return q;}
async function interruptPublish(f){const original=f.p.app.vault.process;f.p.app.vault.process=async(file,fn)=>{if(file.path===f.draft.file.path)throw Error('interrupted write');return original(file,fn);};await assert.rejects(()=>f.p.kbApprove(f.draft),/interrupted write/);f.p.app.vault.process=original;return f.p.kbTransactions.find(e=>!e.done).id;}
test('write-ahead recovery survives reload at every create/process boundary, including a late API error',async()=>{
 for(const phase of ['before','after'])for(let fault=1;fault<=7;fault++){
  const f=await readyRevision(),{p,files,s,page,draft}=f,create=p.app.vault.create,process=p.app.vault.process;let count=0;
  const call=async(fn,args)=>{count++;const fail=count===fault;if(fail&&phase==='before')throw Error('injected stop');const result=await fn(...args);if(fail&&phase==='after')throw Error('injected stop');return result;};
  p.app.vault.create=(...args)=>call(create,args);p.app.vault.process=(...args)=>call(process,args);try{await p.kbApprove(draft);}catch(e){assert.match(e.message,/injected stop/);}p.app.vault.create=create;p.app.vault.process=process;
  const before=new Map(files),q=await restart(p);assert.deepEqual(files,before,'loading must be read-only');const pending=q.kbTransactions.filter(e=>!e.done);
  if(pending.length){assert.equal(pending.length,1);const entry=await k.kbInspectTransaction(q,pending[0].id);assert.ok(entry.items.some(w=>w.before===page.raw));assert.ok(entry.items.some(w=>w.before===draft.raw));await q.kbRecover(pending[0].id,entry.previewHash);const stable=new Map(files),again=await k.kbInspectTransaction(q,pending[0].id);await q.kbRecover(pending[0].id,again.previewHash);assert.deepEqual(files,stable,'repeated recovery must not duplicate writes');}
  else if(phase==='before'&&fault===1)await q.kbApprove(draft);
  assert.ok(q.knowledge.some(r=>r.meta.state==='published'&&r.body.startsWith('New complete version')));assert.equal(files.get(s.file.path),s.raw);assert.equal(q.kbTransactions.filter(e=>!e.done).length,0);assert.equal(q.knowledgeInvalid.length,0);
 }
});
test('stale recovery previews and divergent external edits are rejected without changing files',async()=>{
 const f=await readyRevision(),id=await interruptPublish(f),q=await restart(f.p),entry=await k.kbInspectTransaction(q,id);f.files.set(f.draft.file.path,f.draft.raw+'\nExternal annotation');const snapshot=new Map(f.files);await assert.rejects(()=>q.kbRecover(id,entry.previewHash),/Vorschau|Preview/);assert.deepEqual(f.files,snapshot);const latest=await k.kbInspectTransaction(q,id);assert.ok(latest.items.some(w=>w.state==='conflict'));await assert.rejects(()=>q.kbRecover(id,latest.previewHash),/Konflikt|Conflict/);assert.deepEqual(f.files,snapshot);await assert.rejects(()=>q.kbAnnotate(f.page,'blocked'),/Offene|Pending/);assert.deepEqual(f.files,snapshot);
});
test('source dependencies are pinned and block recovery when edited or removed',async()=>{
 for(const remove of [false,true]){const f=await readyRevision(),id=await interruptPublish(f),q=await restart(f.p);if(remove)f.files.delete(f.s.file.path);else f.files.set(f.s.file.path,f.s.raw+'\nExternal source edit');const entry=await k.kbInspectTransaction(q,id),snapshot=new Map(f.files);assert.ok(entry.readChecks.some(r=>r.state==='conflict'));await assert.rejects(()=>q.kbRecover(id,entry.previewHash),/Konflikt|Conflict/);assert.deepEqual(f.files,snapshot);}
});
test('a race inside Vault.process preserves the concurrent text and remains recoverable',async()=>{
 const f=await readyRevision(),original=f.p.app.vault.process;let changed=false;f.p.app.vault.process=async(file,fn)=>{if(file.path===f.page.file.path&&!changed){changed=true;f.files.set(file.path,f.page.raw+'\nExternal edit');}return original(file,fn);};await assert.rejects(()=>f.p.kbApprove(f.draft),/Concurrent/);assert.equal(f.files.get(f.page.file.path),f.page.raw+'\nExternal edit');assert.ok(f.p.kbTransactions.some(e=>!e.done));assert.ok(!f.p.knowledge.some(r=>r.meta.state==='published'));
});
test('corrupt, truncated, transplanted and inconsistent journal plans block writes read-only',async()=>{
 for(const kind of ['checksum','truncated','vault','snapshot','unsafe']){const f=await readyRevision(),id=await interruptPublish(f),path=k.KB_JOURNAL+'/'+id+'.md';let raw=f.files.get(path);if(kind==='checksum')raw=raw.replace('publish','tampered');else if(kind==='truncated')raw=raw.slice(0,-20);else{const plan=await k.kbUnseal(raw);if(kind==='vault')plan.vault='0'.repeat(64);if(kind==='snapshot')plan.writes[0].after+='tampered';if(kind==='unsafe')plan.writes[0].path='TaskFlow/Aufgaben/foreign.md';raw=await k.kbSeal(plan);}f.files.set(path,raw);const snapshot=new Map(f.files),q=await restart(f.p);assert.equal(q.kbJournalInvalid.length,1);assert.equal(q.knowledge.length,0);assert.deepEqual(f.files,snapshot);await assert.rejects(()=>q.kbCapture({title:'blocked',body:'blocked'}),/Offene|Pending/);await assert.rejects(()=>q.kbRecover(id,'anything'),/Beschädigt|invalid/);assert.deepEqual(f.files,snapshot);}
});
test('missing, corrupt and orphan completion receipts never silently mark a transaction complete',async()=>{
 for(const kind of ['missing','corrupt','orphan']){const {p,files}=fixture();await source(p);const item=p.kbTransactions[0],path=k.KB_JOURNAL+'/'+item.id+'.done.md';if(kind==='missing')files.delete(path);if(kind==='corrupt')files.set(path,'{}');if(kind==='orphan')files.delete(k.KB_JOURNAL+'/'+item.id+'.md');const snapshot=new Map(files),q=await restart(p);assert.deepEqual(files,snapshot);if(kind==='missing'){assert.equal(q.kbTransactions.filter(e=>!e.done).length,1);const entry=await k.kbInspectTransaction(q,item.id);await q.kbRecover(item.id,entry.previewHash);assert.equal(q.kbTransactions.filter(e=>!e.done).length,0);}else assert.ok(q.kbJournalInvalid.length>0);}
});
test('unsafe and duplicate record paths are rejected before creating journals or folders',async()=>{
 for(const path of ['TaskFlow/a.md',k.KB_ROOT+'/Seiten/../escape.md',k.KB_ROOT+'/Seiten/x\\evil.md',k.KB_ROOT+'/Seiten//x.md',k.KB_ROOT+'/Seiten/a:stream.md',k.KB_ROOT+'/Aenderungen/x.md',k.KB_ROOT+'/Protokoll/x.md']){const {p,files,folders}=fixture();await assert.rejects(()=>p.kbCommit([{path,before:null,after:'new'}],'invalid'),/Unsafe/);assert.equal(files.size,0);assert.equal(folders.size,0);}
 const {p,files}=fixture();await assert.rejects(()=>p.kbCommit([{path:k.KB_ROOT+'/Seiten/a.md',before:null,after:'a'},{path:k.KB_ROOT+'/Seiten/A.md',before:null,after:'b'}],'duplicate'),/Unsafe/);assert.equal(files.size,0);
});
test('direct concurrent commits serialize and reject stale expected content',async()=>{
 const f=await readyRevision(),{p,page,files}=f,before=p.kbTransactions.length;
 const results=await Promise.allSettled(['one','two'].map(value=>p.kbCommit([{path:page.file.path,before:page.raw,after:k.encode({...page.meta,userNotes:value},page.body)}],'annotate')));assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.filter(r=>r.status==='rejected').length,1);assert.equal(p.kbTransactions.length,before+1);assert.equal(k.kbDecode(files.get(page.file.path)).meta.userNotes,'one');
});
test('journal plan persistence failure leaves all content files untouched',async()=>{
 const f=await readyRevision(),create=f.p.app.vault.create,snapshot=new Map(f.files);f.p.app.vault.create=async(path,raw)=>{if(path.startsWith(k.KB_JOURNAL+'/'))throw Error('journal offline');return create(path,raw);};await assert.rejects(()=>f.p.kbApprove(f.draft),/journal offline/);assert.deepEqual(f.files,snapshot);
});
test('a new-file collision during apply preserves the competing file',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));const draft=p.knowledge.find(r=>r.meta.state==='review'),create=p.app.vault.create;let collision='';p.app.vault.create=async(path,raw)=>{if(path.startsWith(k.KB_ROOT+'/Seiten/')){collision=path;files.set(path,'External competing content');}return create(path,raw);};await assert.rejects(()=>p.kbApprove(draft),/exists/);assert.equal(files.get(collision),'External competing content');const id=p.kbTransactions.find(e=>!e.done).id,entry=await k.kbInspectTransaction(p,id);assert.ok(entry.items.some(w=>w.state==='conflict'));assert.equal(files.get(draft.file.path),draft.raw);
});
test('journal root identity prevents replay in another named vault',async()=>{
 const f=await readyRevision(),id=await interruptPublish(f),q=await restart(f.p);q.app.vault.getName=()=> 'Other vault';const snapshot=new Map(f.files);await q.kbJournalScan();assert.ok(q.kbJournalInvalid.length>0);await assert.rejects(()=>q.kbRecover(id,'anything'));assert.deepEqual(f.files,snapshot);
});
test('source changes during a write prevent a completion receipt',async()=>{
 const f=await readyRevision(),process=f.p.app.vault.process;let edited=false;f.p.app.vault.process=async(file,fn)=>{const result=await process(file,fn);if(!edited){edited=true;f.files.set(f.s.file.path,f.s.raw+'\nConcurrent source change');}return result;};await assert.rejects(()=>f.p.kbApprove(f.draft),/Source changed/);const pending=f.p.kbTransactions.find(e=>!e.done);assert.ok(pending);assert.ok(!f.files.has(k.KB_JOURNAL+'/'+pending.id+'.done.md'));assert.equal(f.files.get(f.s.file.path),f.s.raw+'\nConcurrent source change');
});
