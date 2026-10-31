const fs=require('fs'),{parse}=require('../tools/node_modules/jsonc-parser');const before=JSON.parse(fs.readFileSync(__dirname+'/before.json'));
const palettes=[
 ['midnight_copper','12 — Midnight & Copper',['#F6F7F9','#E9E5E0','#202B40','#596273','#B56E48','#171717','#CFD1D6','#202B40','#F6F7F9']],
 ['olive_peach','13 — Olive & Peach',['#FCFAF4','#FBE3D2','#41452B','#666951','#EFB28C','#41452B','#D9D8C9','#41452B','#FCFAF4']],
 ['graphite_mint','14 — Graphite & Mint',['#FFFFFF','#EAF4F0','#25292D','#62696A','#8EDFC1','#25292D','#D3DFDA','#25292D','#FFFFFF']],
 ['aubergine_chartreuse','15 — Aubergine & Chartreuse',['#FCFAF7','#F0F2DA','#36253E','#6D6072','#CFD64B','#36253E','#DCDACF','#36253E','#FCFAF7']]
];
const schema=parse(before.find(x=>x.filename==='config/settings_schema.json').body.content);const select=schema.flatMap(x=>x.settings||[]).find(x=>x.id==='june_palette_preset');if(palettes.some(p=>select.options.some(o=>o.value===p[0])))throw Error('Already exists');select.options.splice(select.options.findIndex(x=>x.value==='custom'),0,...palettes.map(([value,label])=>({value,label})));
const roles=['bg','surface','ink','muted','accent','on_accent','border','dark','on_dark'];let snippet=before.find(x=>x.filename==='snippets/june-master-palette.liquid').body.content;snippet=snippet.replace('  endcase',palettes.map(([id,,colors])=>`    when '${id}'\n`+roles.map((role,i)=>`      assign jp_${role} = '${colors[i]}'`).join('\n')).join('\n')+'\n  endcase');
for(const [name,body] of [['config/settings_schema.json',JSON.stringify(schema,null,2)+'\n'],['snippets/june-master-palette.liquid',snippet]]){fs.mkdirSync(__dirname+'/theme/'+name.split('/')[0],{recursive:true});fs.writeFileSync(__dirname+'/theme/'+name,body)}fs.writeFileSync(__dirname+'/palettes.json',JSON.stringify(palettes,null,2));console.log('Added four presets without modifying settings_data');
