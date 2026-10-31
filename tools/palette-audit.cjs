const fs=require('fs'),path=require('path'),{parse}=require('jsonc-parser');
const root=path.resolve(__dirname,'../palette-vivid-orange/theme');
let rows={},types=new Set();
function walk(v,file){if(Array.isArray(v))return v.forEach(x=>walk(x,file));if(!v||typeof v!=='object')return; if(v.type&&file.startsWith('templates/'))types.add(v.type);for(const[k,x]of Object.entries(v)){if(typeof x==='string'&&/^#[\da-f]{3,8}$/i.test(x)){let key=k+' '+x;rows[key]??={n:0,file};rows[key].n++}else walk(x,file)}}
function scan(d){for(let e of fs.readdirSync(d,{withFileTypes:true})){let p=path.join(d,e.name);if(e.isDirectory())scan(p);else if(e.name.endsWith('.json')){let j=parse(fs.readFileSync(p,'utf8'));walk(j,path.relative(root,p).replaceAll('\\','/'));}}}
scan(root);fs.writeFileSync(path.join(root,'../colours.json'),JSON.stringify(rows,null,2));console.log(Object.entries(rows).sort((a,b)=>b[1].n-a[1].n).slice(0,110));console.log('CUSTOM TYPES', [...types].filter(x=>/custom|tjs|planner|mystery|collection|main-product/.test(x)));
