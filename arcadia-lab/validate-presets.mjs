import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),up=path.join(root,'upstream');
globalThis.window=globalThis;
for(const f of ['utils','track','curve','path','sprites','model','sim','fxpresets','sokon-presets']){
 const file=path.join(up,'js/core',f+'.js');vm.runInThisContext(fs.readFileSync(file,'utf8'),{filename:file});
}
const dir=path.join(root,'dist','presets');fs.mkdirSync(dir,{recursive:true});
const files=AFX.Factory.map(p=>{const d=p.build();const file=path.join(dir,p.id+'.json');fs.writeFileSync(file,JSON.stringify(d,null,2));return file;});
const args=tool=>[path.join(up,'tools',tool+'.mjs'),...files];
execFileSync(process.execPath,args('validate'),{stdio:'inherit'});
const a=execFileSync(process.execPath,args('simhash'),{encoding:'utf8'});
const b=execFileSync(process.execPath,args('simhash'),{encoding:'utf8'});
assert.equal(a,b,'Simulação não determinística');
fs.writeFileSync(path.join(root,'dist','simhash.txt'),a);
console.log('Validação estrutural e simhash dos '+files.length+' presets concluídos');
