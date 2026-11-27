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
const makeInput=(body='Ein schneller Gedanke',extra={})=>({id:webcrypto.randomUUID(),body,title:'',project:'',...extra});
const quickRecord=(p,id)=>p.knowledge.find(r=>r.meta.quickNote===1&&r.meta.id===id);
async function capture(f,body='Ein schneller Gedanke',extra={}){const input=makeInput(body,extra),result=await f.p.kbQuickCapture(input);return {input,note:quickRecord(f.p,result.id),result};}
const filesIn=(f,dir)=>[...f.files.keys()].filter(p=>p.startsWith(k.KB_ROOT+'/'+dir+'/'));
const promoteInput=note=>({title:note.meta.title,kind:'page',project:note.meta.project||''});


function record(id,body='Netzwerk Programme dokumentieren.',extra={}){const meta={knowledgeflowKnowledge:1,id,title:id,kind:'page',state:'published',sourceRefs:[],tags:[],related:[],provenance:'inferred',...extra},raw=k.encode(meta,body);return {file:{path:k.KB_ROOT+'/Seiten/'+id+'.md'},raw,meta,body};}
async function src(id,body,extra={}){const r=record(id,body,{kind:'source',state:'inbox',revision:await k.kbHash(body),...extra});r.file.path=k.KB_ROOT+'/Quellen/'+id+'--'+r.meta.revision+'.md';return r;}
function put(f,...records){for(const r of records)f.files.set(r.file.path,r.raw);}
const tagKey=t=>JSON.stringify(['tag',k.kbHubFold(t)]);

const options={day:'2026-11-27'};
test('Monday-to-Sunday week ranges cover year transitions and DST without millisecond arithmetic',()=>{assert.equal(k.kbWeekRange('2026-11-29').start,'2026-11-23');assert.equal(k.kbWeekRange('2027-01-01').start,'2026-12-28');assert.equal(k.kbWeekRange('2026-03-29').next,'2026-03-30');assert.throws(()=>k.kbWeekRange('2026-02-30'));assert.equal(k.kbWeekDay('invalid'),'');});
test('published creations and updates are separate and dated at inclusive start/exclusive next week',async()=>{const f=fixture();put(f,record('new','Knowledge',{created:'2026-11-23',updated:'2026-11-25'}),record('updated','Knowledge',{created:'2026-01-01',updated:'2026-11-29'}),record('next','Knowledge',{created:'2026-11-30'}),record('old','Knowledge',{created:'2026-11-22'}));const r=await f.p.kbWeeklyReview(options);assert.deepEqual(Array.from(r.newKnowledge,x=>x.meta.id),['new']);assert.deepEqual(Array.from(r.updatedKnowledge,x=>x.meta.id),['updated']);});
test('inbox and drafts are current backlog independent of the selected week; processed and archived records are excluded',async()=>{const f=fixture(),x=await capture(f,'Thought');put(f,record('draft','Proposal',{state:'review',created:'2020-01-01'}));const draft=f.files.get(k.KB_ROOT+'/Seiten/draft.md');f.files.delete(k.KB_ROOT+'/Seiten/draft.md');f.files.set(k.KB_ROOT+'/Entwuerfe/draft.md',draft);let r=await f.p.kbWeeklyReview({day:'2020-01-01'});assert.equal(r.inbox.length,1);assert.equal(r.reviews.length,1);await f.p.kbQuickArchive(x.note);r=await f.p.kbWeeklyReview(options);assert.equal(r.inbox.length,0);assert.equal(r.reviews.length,1);});
test('overview and repeated refresh are read-only, with no task, setting, journal or provider writes',async()=>{const f=fixture();put(f,record('new','Text',{created:'2026-11-27'}));await capture(f,'Thought');const before=new Map(f.files),settings=JSON.stringify(f.p.settings);f.p.aiRequest=()=>{throw Error('provider');};await f.p.kbWeeklyReview(options);await f.p.kbWeeklyReview(options);assert.deepEqual(f.files,before);assert.equal(JSON.stringify(f.p.settings),settings);assert.equal(f.p.tasks.length,0);});
test('missing and malformed dates are disclosed and do not pretend to be new knowledge',async()=>{const f=fixture();put(f,record('undated','Text'),record('bad','Text',{created:'2026-02-30'}),record('fallback','Text',{reviewedAt:'2026-11-27T12:00:00Z'}));const r=await f.p.kbWeeklyReview(options);assert.equal(r.undated,2);assert.equal(r.newKnowledge.length,1);});
test('project filter scopes content and preserves other projects',async()=>{const f=fixture();put(f,record('p','Text',{created:'2026-11-27',project:'p'}),record('q','Text',{created:'2026-11-27',project:'q'}));const before=new Map(f.files),r=await f.p.kbWeeklyReview({...options,project:'p'});assert.equal(r.newKnowledge.length,1);assert.equal(r.newKnowledge[0].meta.id,'p');assert.deepEqual(f.files,before);});
test('outside files, raw sources and unreviewed pages do not become insights',async()=>{const f=fixture(),s=await src('s','Private',{created:'2026-11-27'});put(f,s,record('review','Text',{state:'review',created:'2026-11-27'}));f.files.set('Outside.md',record('outside','Text',{created:'2026-11-27'}).raw);const read=f.p.app.vault.read;f.p.app.vault.read=async file=>{if(file.path==='Outside.md')throw Error('Outside read');return read(file);};const r=await f.p.kbWeeklyReview(options);assert.equal(r.newKnowledge.length,0);assert.equal(r.reviews.length,0);});
test('duplicate active identities are excluded without choosing a winner',async()=>{const f=fixture(),r=record('same','Text',{created:'2026-11-27'});put(f,r);f.files.set(k.KB_ROOT+'/Seiten/copy.md',r.raw);const result=await f.p.kbWeeklyReview(options);assert.equal(result.newKnowledge.length,0);assert.equal(result.excluded.length,2);});
test('stale and deleted entries cannot be opened as a fresh approval',async()=>{const f=fixture();put(f,record('n','Text',{created:'2026-11-27'}));let r=await f.p.kbWeeklyReview(options);await k.kbVerifyWeekly(f.p,r,r.newKnowledge[0]);f.files.set(r.newKnowledge[0].file.path,r.newKnowledge[0].raw+' edited');await assert.rejects(()=>k.kbVerifyWeekly(f.p,r,r.newKnowledge[0]));r=await f.p.kbWeeklyReview(options);f.files.delete(r.newKnowledge[0].file.path);await assert.rejects(()=>k.kbVerifyWeekly(f.p,r,r.newKnowledge[0]));});
test('actions cannot redirect to another path or a forged record hash',async()=>{const f=fixture();put(f,record('n','Text',{created:'2026-11-27'}));const r=await f.p.kbWeeklyReview(options),item=r.newKnowledge[0];await assert.rejects(()=>k.kbVerifyWeekly(f.p,r,{...item,file:{path:'Outside.md'}}));await assert.rejects(()=>k.kbVerifyWeekly(f.p,r,{...item,hash:'0'.repeat(64)}));});
test('backlog refresh removes an archived inbox item without acknowledging other items',async()=>{const f=fixture(),a=await capture(f,'A'),b=await capture(f,'B');let r=await f.p.kbWeeklyReview(options);assert.equal(r.inbox.length,2);await f.p.kbQuickArchive(a.note);r=await f.p.kbWeeklyReview(options);assert.equal(r.inbox.length,1);assert.equal(r.inbox[0].meta.id,b.note.meta.id);});
test('large collections disclose bounded processing',async()=>{const rows=Array.from({length:1003},(_,i)=>record('p-'+i,'Text',{created:'2026-11-27'}));const r=await k.kbBuildWeekly(rows,options);assert.equal(r.newKnowledge.length,1000);assert.equal(r.limits.records,3);});
