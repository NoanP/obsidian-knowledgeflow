const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const sandbox={module:{exports:{}},console,Date,URL,TextEncoder,structuredClone,crypto:require('node:crypto').webcrypto,require:()=>({Plugin:class{},ItemView:class{},Modal:class{},PluginSettingTab:class{},parseYaml:JSON.parse,stringifyYaml:JSON.stringify,normalizePath:s=>s,Notice:class{}})};
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
test('force layout is deterministic, finite, bounded and safe for empty or isolated nodes',()=>{
 assert.equal(k.kbGraphLayout(k.kbGraph([])).length,0);const g=k.kbGraph([page('a',{related:['b']}),page('b'),page('isolated')]);const a=k.kbGraphLayout(g),b=k.kbGraphLayout(g);assert.equal(JSON.stringify(a),JSON.stringify(b));for(const n of a){assert.ok(Number.isFinite(n.x)&&Number.isFinite(n.y));assert.ok(n.x>=26&&n.x<=974&&n.y>=26&&n.y<=434);}assert.equal(JSON.stringify(g),JSON.stringify(k.kbGraph([page('a',{related:['b']}),page('b'),page('isolated')])));
});
test('reset view fits a small graph into the viewport with room around the nodes',()=>{
 const nodes=k.kbGraphLayout(k.kbGraph([page('a',{related:['b']}),page('b'),page('c')])),fit=k.kbGraphFit(nodes);assert.ok(fit.scale>1);for(const n of nodes){assert.ok(n.x*fit.scale+fit.x>=49&&n.x*fit.scale+fit.x<=951);assert.ok(n.y*fit.scale+fit.y>=49&&n.y*fit.scale+fit.y<=411);}assert.equal(k.kbGraphFit([]).scale,1);
});
