const fs=require('fs'),path=require('path');
const root=__dirname,out=path.join(root,'theme');
fs.mkdirSync(path.join(out,'sections'),{recursive:true});fs.mkdirSync(path.join(out,'assets'),{recursive:true});
let h=fs.readFileSync(path.join(root,'before/sections/my-header.liquid'),'utf8');
for(const variable of ['tjs_desktop_search_icon_url','tjs_search_icon_url']){
 const marker='{% if '+variable+' != blank %}';
 if(h.split(marker).length!==2)throw Error('Unexpected search markup');
 h=h.replace(marker,`{% if tjs_desktop_icons_block.settings.year_search_enabled != false %}
                  <img class="tjs-ph__year-search" src="{{ 'june-search-year.svg' | asset_url }}" width="34" height="24" alt="" aria-hidden="true">
                {% elsif ${variable} != blank %}`);
}
const controls=[{type:'header',content:'2027 search icon'},{type:'checkbox',id:'year_search_enabled',label:'Use animated 2027 search on all devices',default:true},{type:'range',id:'year_search_mobile_height',label:'2027 search height on mobile',min:18,max:28,step:1,unit:'px',default:24},{type:'range',id:'year_search_desktop_height',label:'2027 search height on desktop',min:18,max:28,step:1,unit:'px',default:24},{type:'paragraph',content:'Plays once on load and rests on 2027. Reduced motion shows 2027 immediately. Disable to restore existing search icon uploads. Width follows the full-year proportions.'}];
const block=h.indexOf('"type": "desktop_icon_uploads"',h.indexOf('{% schema %}'));
const at=h.indexOf('"settings": [',block)+'"settings": ['.length;
if(block<0)throw Error('Missing icon block');
h=h.slice(0,at)+'\n'+controls.map(c=>JSON.stringify(c)).join(',\n')+','+h.slice(at);
h+=`\n{% style %}
/* Approved 2027 artwork; keep the existing search buttons and events. */
#TjsPremiumHeader-{{ section.id }} img.tjs-ph__year-search{display:block!important;object-fit:contain;max-width:none!important;pointer-events:none;width:calc({{ tjs_desktop_icons_block.settings.year_search_mobile_height | default: 24 }}px * 34 / 24)!important;height:{{ tjs_desktop_icons_block.settings.year_search_mobile_height | default: 24 }}px!important;flex:none;filter:none!important}
#TjsPremiumHeader-{{ section.id }}.is-scrolled img.tjs-ph__year-search{background:#faf7ff;border-radius:5px}
@media(min-width:1150px){#TjsPremiumHeader-{{ section.id }} img.tjs-ph__year-search{width:calc({{ tjs_desktop_icons_block.settings.year_search_desktop_height | default: 24 }}px * 34 / 24)!important;height:{{ tjs_desktop_icons_block.settings.year_search_desktop_height | default: 24 }}px!important}}
{% endstyle %}\n`;
const schema=JSON.parse(h.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
if(schema.blocks.find(b=>b.type==='desktop_icon_uploads').settings.length!==18)throw Error('Unexpected settings count');
fs.writeFileSync(path.join(out,'sections/my-header.liquid'),h);
fs.copyFileSync(path.join(root,'../animated-filter-icon/search-year-playful/search-year.svg'),path.join(out,'assets/june-search-year.svg'));
console.log('Built two-file integration; schema valid; existing search handlers retained.');
