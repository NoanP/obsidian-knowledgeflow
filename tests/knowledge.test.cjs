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
test('failed multi-file publish rolls back its own changes and preserves draft',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));const draft=p.knowledge.find(r=>r.meta.state==='review'),process=p.app.vault.process;let failed=false;p.app.vault.process=async(file,fn)=>{if(file.path===draft.file.path&&!failed){failed=true;throw Error('disk failure');}return process(file,fn);};await assert.rejects(()=>p.kbApprove(draft),/disk failure/);assert.equal(p.knowledge.filter(r=>r.meta.state==='published').length,0);assert.equal(files.get(draft.file.path),draft.raw);assert.equal(files.get(s.file.path),s.raw);
});
test('failed audit write rolls back a successful page and draft update',async()=>{
 const {p,files}=fixture(),s=await source(p);await p.kbDraft(proposal(s));const draft=p.knowledge.find(r=>r.meta.state==='review'),create=p.app.vault.create;p.app.vault.create=async(path,raw)=>{if(path.includes('/Protokoll/'))throw Error('audit failed');return create(path,raw);};await assert.rejects(()=>p.kbApprove(draft),/audit failed/);assert.equal(files.get(draft.file.path),draft.raw);assert.equal(p.knowledge.filter(r=>r.meta.state==='published').length,0);
});
test('search matches accents, annotations and filters without duplicate results',async()=>{
 const {p}=fixture(),s=await source(p);await p.kbDraft(proposal(s,{title:'Geräte prüfen',body:'SIM configuration'}));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));const page=p.knowledge.find(r=>r.meta.state==='published');await p.kbAnnotate(page,'Sonderfall Zürich');assert.equal(k.kbSearch(p.knowledge,'gerate zurich',{state:'published',area:'Work'}).length,1);assert.equal(k.kbSearch(p.knowledge,'SIM',{state:'published',area:'Private'}).length,0);
});
test('health flags missing references, newer snapshots and duplicates rather than guessing truth',async()=>{
 const {p}=fixture(),s=await source(p);await p.kbDraft(proposal(s,{related:['missing-page'],provenance:'ambiguous'}));await p.kbApprove(p.knowledge.find(r=>r.meta.state==='review'));await new Promise(r=>setTimeout(r,3));await source(p,'New source revision');let result=k.kbHealth(p.knowledge);assert.ok(result.some(r=>r.type==='stale-source'));assert.ok(result.some(r=>r.type==='broken-link'));assert.ok(result.some(r=>r.type==='ambiguous'));const page=p.knowledge.find(r=>r.meta.state==='published');result=k.kbHealth([...p.knowledge,{...page,meta:{...page.meta,id:'duplicate'}}]);assert.ok(result.some(r=>r.type==='duplicate'));
});
test('knowledge writes reject paths outside owned root',async()=>{const {p,files}=fixture();await assert.rejects(()=>p.kbCommit([{path:'TaskFlow/Aufgaben/do-not-touch.md',before:null,after:'bad'}],'invalid'),/Unsafe/);assert.equal(files.size,0);});
test('fork has independent plugin identity, defaults, selectors and release version',()=>{
 const root=require('node:path').join(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));assert.equal(manifest.id,'knowledgeflow');assert.equal(manifest.version,'1.1.0');const code=fs.readFileSync(root+'/main.js','utf8');assert.ok(code.includes("const VIEW = 'knowledgeflow-board'"));assert.ok(!code.includes("folder:'TaskFlow/"));assert.ok(!fs.readFileSync(root+'/styles.css','utf8').includes('.tf-root'));assert.throws(()=>k.decode(k.encode({taskflow:1,title:'Old task'},'untouched')));
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
