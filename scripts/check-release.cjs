const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),r=path.join(__dirname,'..');
const m=JSON.parse(fs.readFileSync(r+'/manifest.json')),p=JSON.parse(fs.readFileSync(r+'/package.json')),v=JSON.parse(fs.readFileSync(r+'/versions.json'));
assert.equal(m.id,'knowledgeflow');assert.equal(m.version,p.version);assert.match(m.version,/^\d+\.\d+\.\d+$/);assert.equal(v[m.version],m.minAppVersion);assert.ok(fs.readFileSync(r+'/CHANGELOG.md','utf8').includes('## ['+m.version+']'));
const code=fs.readFileSync(r+'/main.js','utf8');assert.ok(!code.includes("folder:'TaskFlow/"));assert.ok(!code.includes("const VIEW = 'taskflow-board'"));console.log('Release metadata and independent identity verified.');
