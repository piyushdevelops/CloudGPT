const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=__dirname;fs.mkdirSync(path.join(root,'theme/sections'),{recursive:true});
let h=fs.readFileSync(path.join(root,'before/sections/my-header.liquid'),'utf8');
const pattern=/\{"type":"range","id":"year_search_desktop_height"[^\n]+\}/;
const match=h.match(pattern);if(!match)throw Error('Search size setting missing');
const setting=JSON.parse(match[0].replace(/,$/,''));setting.max=34;h=h.replace(match[0],JSON.stringify(setting));
let g=fs.readFileSync(path.join(root,'before/sections/header-group.json'),'utf8');
const before=JSON.parse(g.replace(/\/\*[\s\S]*?\*\//g,''));
const header=Object.values(before.sections).find(s=>s.type==='my-header');
const changes={desktop_header_placement:{search_button_size:48,account_button_size:44,cart_button_size:44,actions_gap:12},desktop_icon_uploads:{year_search_desktop_height:30},cart_badge_controls:{june_happy_cart_desktop_size:30,desktop_font_size:9}};
for(const[type,updates]of Object.entries(changes)){
 const id=Object.keys(header.blocks).find(k=>header.blocks[k].type===type);if(!id)throw Error(type);
 const re=new RegExp('("'+id+'":\\s*\\{[\\s\\S]*?"settings":\\s*\\{)([\\s\\S]*?)(\\n\\s*\\})');
 if(!re.test(g))throw Error('Block not found');
 g=g.replace(re,(all,open,body,close)=>{for(const[key,val]of Object.entries(updates)){const field=new RegExp('("'+key+'":\\s*)(?:"[^"\\n]*"|true|false|-?[0-9.]+)');if(field.test(body))body=body.replace(field,(_,prefix)=>prefix+JSON.stringify(val));else body='\n            "'+key+'": '+JSON.stringify(val)+','+body;}return open+body+close;});
}
const after=JSON.parse(g.replace(/\/\*[\s\S]*?\*\//g,''));
const expected=structuredClone(before),eh=Object.values(expected.sections).find(s=>s.type==='my-header');
for(const[type,updates]of Object.entries(changes))Object.assign(Object.values(eh.blocks).find(b=>b.type===type).settings,updates);
assert.deepEqual(after,expected);
JSON.parse(h.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
fs.writeFileSync(path.join(root,'theme/sections/my-header.liquid'),h);fs.writeFileSync(path.join(root,'theme/sections/header-group.json'),g);
console.log('Only 7 requested desktop values changed; all other settings preserved. Schema parsed.');
