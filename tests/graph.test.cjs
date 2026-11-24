const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const sandbox={setTimeout,clearTimeout,module:{exports:{}},console,Date,URL,TextEncoder,structuredClone,crypto:require('node:crypto').webcrypto,require:()=>({Plugin:class{},ItemView:class{},Modal:class{},PluginSettingTab:class{},parseYaml:JSON.parse,stringifyYaml:JSON.stringify,normalizePath:s=>s,Notice:class{}})};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../main.js'),'utf8'),sandbox);const k=sandbox.module.exports.testing;
function page(id,extra={},body=''){return {file:{path:'KnowledgeFlow/Wissen/Seiten/'+id+'.md'},meta:{id,title:id,kind:'page',state:'published',related:[],sourceRefs:[],...extra},body};}
function source(revision='a'.repeat(64)){return {file:{path:'KnowledgeFlow/Wissen/Quellen/s--'+revision+'.md'},meta:{id:'s',title:'Source',kind:'source',state:'inbox',revision},body:'Source'};}
test('graph uses only published KnowledgeFlow pages and opt-in sources; it does not mutate records',()=>{
 const records=[page('a'),page('draft',{state:'review'}),page('old',{state:'archived'}),source(),{...page('foreign'),file:{path:'TaskFlow/Aufgaben/foreign.md'}}],before=JSON.stringify(records),g=k.kbGraph(records);assert.equal(g.nodes.length,2);assert.equal(g.edges.length,0);assert.equal(k.kbGraph(records,{sources:false}).nodes.length,1);assert.equal(JSON.stringify(records),before);
});
test('actual related and exact source-revision references form deduplicated undirected edges',()=>{
 const s=source(),a=page('a',{related:['b','b','a'],sourceRefs:[{id:'s',revision:s.meta.revision}]}),b=page('b',{related:['a']});const g=k.kbGraph([a,b,s,source('b'.repeat(64))]);assert.equal(g.edges.length,2);assert.equal(g.nodes.find(n=>n.id===a.file.path).degree,2);assert.equal(g.nodes.find(n=>n.id.endsWith('--'+'b'.repeat(64)+'.md')).degree,0);
});
test('wikilinks resolve paths, aliases and relative headings without guessing ambiguous titles',()=>{
 const a=page('a',{},'[[b|Alias]] [[KnowledgeFlow/Wissen/Seiten/c#Section]] [[./c]] [[Same title]] [[missing]]'),b=page('b'),c=page('c'),d=page('d',{title:'Same title'}),e=page('e',{title:'Same title'});const g=k.kbGraph([a,b,c,d,e]);assert.equal(g.edges.length,2);assert.ok(g.edges.every(edge=>edge.source===a.file.path||edge.target===a.file.path));
});
test('fenced examples, inline code, embeds and generated markup do not invent graph connections',()=>{
 const a=page('a',{},'```md\n[[b]]\n```\n`[[c]]`\n![[d]]\n<!-- knowledgeflow:links:start -->\n[[e]]\n<!-- knowledgeflow:links:end -->');assert.equal(k.kbGraph([a,page('b'),page('c'),page('d'),page('e')]).edges.length,0);
});
test('shared tags or projects do not create synthetic links',()=>{assert.equal(k.kbGraph([page('a',{tags:['same'],project:'x'}),page('b',{tags:['same'],project:'x'})]).edges.length,0);});
test('large graphs explicitly cap visible nodes and keep only edges with visible endpoints',()=>{
 const records=Array.from({length:220},(_,i)=>page('p'+i,{related:i?['p0']:[]})),g=k.kbGraph(records);assert.equal(g.nodes.length,180);assert.equal(g.totalNodes,220);assert.equal(g.omitted,40);assert.ok(g.nodes.some(n=>n.title==='p0'));assert.ok(g.edges.every(e=>g.nodes.some(n=>n.id===e.source)&&g.nodes.some(n=>n.id===e.target)));assert.ok(g.nodes.every(n=>n.degree===g.edges.filter(e=>e.source===n.id||e.target===n.id).length));
});
test('3D force layout is deterministic, bounded, non-planar and leaves records untouched',()=>{
 const records=Array.from({length:14},(_,i)=>page('p'+i,{related:i?['p'+Math.floor((i-1)/2)]:[]})),g=k.kbGraph(records),before=JSON.stringify(records),a=k.kbGraphLayout3D(g),b=k.kbGraphLayout3D(g);assert.equal(JSON.stringify(a),JSON.stringify(b));assert.equal(k.kbGraphLayout3D(k.kbGraph([])).length,0);for(const n of a){assert.ok(Number.isFinite(n.x)&&Number.isFinite(n.y)&&Number.isFinite(n.z));assert.ok(Math.hypot(n.x,n.y,n.z)<=230.001);}assert.ok(new Set(a.map(n=>Math.round(n.z))).size>3);assert.equal(JSON.stringify(records),before);
});
test('perspective projects near nodes larger and orbit changes position/depth',()=>{
 const camera={yaw:0,pitch:0,zoom:1},near=k.kbProject3D({x:50,y:40,z:150},camera,1000,700),far=k.kbProject3D({x:50,y:40,z:-150},camera,1000,700);assert.ok(near.scale>far.scale);const a=k.kbProject3D({x:100,y:50,z:40},camera,1000,700),b=k.kbProject3D({x:100,y:50,z:40},{...camera,yaw:Math.PI/2,pitch:.5},1000,700);assert.notEqual(a.x,b.x);assert.notEqual(a.y,b.y);assert.notEqual(a.z,b.z);assert.equal(k.kbProject3D({x:0,y:0,z:700},camera,1000,700).visible,false);
});
test('camera fitting keeps every point in view on wide and narrow canvases',()=>{
 const nodes=k.kbGraphLayout3D(k.kbGraph(Array.from({length:30},(_,i)=>page('p'+i,{related:i?['p0']:[]}))));for(const [w,h]of [[1600,700],[360,480]]){const camera=k.kbFit3D(nodes,{yaw:.35,pitch:-.18},w,h);for(const node of nodes){const p=k.kbProject3D(node,camera,w,h);assert.ok(p.visible);assert.ok(p.x>=40&&p.x<=w-40);assert.ok(p.y>=40&&p.y<=h-40);}}assert.equal(k.kbFit3D([],{yaw:0},100,100).zoom,1);
});
test('hit testing selects the frontmost node rather than a hidden node behind it',()=>{
 const a={id:'front',x:50,y:50,z:30,radius:8,visible:true},b={...a,id:'back',z:-30},hidden={...a,id:'hidden',z:1000,visible:false};assert.equal(k.kbGraphHit([b,a,hidden],51,51).id,'front');assert.equal(k.kbGraphHit([a,b],100,100),null);
});
test('local graph shows exact breadth-first neighborhoods for depths one through three',()=>{
 const g=k.kbGraph([page('a',{related:['b']}),page('b',{related:['c']}),page('c',{related:['d']}),page('d'),page('isolated')]),root=g.nodes.find(n=>n.title==='a').id;
 for(const [depth,count]of [[1,2],[2,3],[3,4]]){const local=k.kbGraphExplore(g,{root,depth});assert.equal(local.nodes.length,count);assert.equal(local.edges.length,count-1);}assert.equal(k.kbGraphExplore(g,{root:'missing'}).nodes.length,0);assert.equal(k.kbGraphExplore(g,{}).nodes.length,5);
});
test('connection-type, orphan and text filters retain only actual matching endpoints',()=>{
 const src=source(),g=k.kbGraph([page('a',{related:['b'],tags:['guide'],sourceRefs:[{id:'s',revision:src.meta.revision}]},'Connection testing'),page('b'),page('alone'),src]);assert.equal(k.kbGraphExplore(g,{orphans:false}).nodes.length,3);const refs=k.kbGraphExplore(g,{edgeType:'source',orphans:false});assert.equal(refs.nodes.length,2);assert.equal(refs.edges.length,1);assert.equal(k.kbGraphExplore(g,{query:'guide testing'}).nodes.length,1);assert.equal(k.kbGraphExplore(g,{query:'unknown'}).nodes.length,0);
});
test('3D graph caps layout size explicitly and recalculates visible degrees after filters',()=>{
 const g=k.kbGraph(Array.from({length:280},(_,i)=>page('p'+i,{related:i?['p0']:[]})),{limit:500}),filtered=k.kbGraphExplore(g,{});assert.equal(filtered.nodes.length,240);assert.equal(filtered.omitted,40);for(const n of filtered.nodes)assert.equal(n.degree,filtered.edges.filter(e=>e.source===n.id||e.target===n.id).length);
});
test('homepage contains only the graph and eight navigation tiles, without daily task/stat rendering',()=>{
 const method=k.TaskView.prototype.renderHome.toString();assert.ok(method.includes('renderKnowledgeGraph'));assert.ok(method.includes('kf-network-actions'));for(const forbidden of ['homeOverview','renderDayInsight','homeTask','kf-day-summary','kf-day-more'])assert.ok(!method.includes(forbidden));const entries=method.match(/\['board','calendar','projects','series','stats','archive','trash','settings'\]/);assert.ok(entries);
});
test('3D renderer selection, neighborhood navigation, orbit and cleanup work without data writes',()=>{
 const frames=new Map();let serial=0,draws=0,resizeRemoved=false;
 const context={setTransform(){},clearRect(){draws++},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fill(){},createRadialGradient(){return {addColorStop(){}}},measureText(text){return {width:text.length*6}},strokeText(){},fillText(){}};
 const win={devicePixelRatio:1,requestAnimationFrame:fn=>{const id=++serial;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id),addEventListener(){},removeEventListener(){resizeRemoved=true;},getComputedStyle:()=>({fontFamily:'system-ui',getPropertyValue:name=>name==='--kf-canvas'?'#222':'#ddd'})};
 const doc={defaultView:win};class Element{
  constructor(tag,o={}){this.tag=tag;this.options=o;this.children=[];this.ownerDocument=doc;this.isConnected=true;this.style={};this.value='';this.hidden=false;this.listeners={};}
  createEl(tag,o={}){const el=new Element(tag,o);this.children.push(el);return el;}createDiv(o){return this.createEl('div',o)}createSpan(o){return this.createEl('span',o)}setAttribute(k,v){this.options.attr={...this.options.attr,[k]:v}}addEventListener(k,fn){this.listeners[k]=fn}setText(text){this.text=text}empty(){this.children=[]}getContext(){return context}getBoundingClientRect(){return {width:1400,height:700,left:0,top:0}}setPointerCapture(){}focus(){} }
 const root=new Element('root'),records=[page('a',{related:['b']}),page('b',{related:['c']}),page('c'),page('isolated')],snapshot=JSON.stringify(records);let writes=0;const view={plugin:{knowledge:records,app:{workspace:{getLeaf:()=>({openFile:()=>{}})},vault:{process:()=>writes++}}},openKnowledge(){}};
 const all=()=>{const nodes=[];const walk=e=>{nodes.push(e);e.children.forEach(walk)};walk(root);return nodes;},findLabel=text=>all().find(e=>e.options.attr?.['aria-label']===text),findButton=text=>all().find(e=>e.tag==='button'&&e.options.text===text);
 const flush=()=>{for(const [id,fn]of [...frames]){frames.delete(id);fn();}};
 k.renderKnowledgeGraph(view,root);flush();assert.ok(draws>0);const picker=findLabel('Notiz auswählen');picker.value=records[0].file.path;picker.onchange();assert.equal(view.kbGraphSelected,records[0].file.path);assert.ok(findButton('Notiz öffnen'));
 const local=findButton('Umgebung');assert.equal(local.disabled,false);local.listeners.click();flush();assert.equal(view.kbGraphRoot,records[0].file.path);assert.ok(all().some(e=>e.text?.includes('2 Notizen')));
 const canvas=all().find(e=>e.tag==='canvas'),yaw=view.kbGraphCamera?.yaw||.35;canvas.onpointerdown({button:0,pointerId:1,clientX:20,clientY:20,shiftKey:false});canvas.onpointermove({pointerId:1,clientX:80,clientY:45});canvas.onpointerup({pointerId:1});flush();assert.notEqual(view.kbGraphCamera.yaw,yaw);assert.equal(writes,0);assert.equal(JSON.stringify(records),snapshot);
 canvas.onkeydown({key:'ArrowLeft',preventDefault(){}});assert.ok(frames.size>0);view.graphCleanup();assert.equal(frames.size,0);assert.equal(resizeRemoved,true);
});
