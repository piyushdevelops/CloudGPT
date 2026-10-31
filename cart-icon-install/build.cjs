const fs=require('fs'),path=require('path');
const root=__dirname, out=path.join(root,'theme');
for(const dir of ['sections','snippets','assets'])fs.mkdirSync(path.join(out,dir),{recursive:true});
let header=fs.readFileSync(path.join(root,'before/sections/my-header.liquid'),'utf8');
const schema=JSON.parse(header.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
if(schema.settings.some(s=>s.id==='june_happy_cart'))throw Error('Already installed: reconcile manually');
const additions=[
{type:'header',content:'Happy planner cart'},
{type:'checkbox',id:'june_happy_cart',label:'Use happy planner cart icon',default:true},
{type:'checkbox',id:'june_happy_cart_motion',label:'Animate successful quantity changes',default:true},
{type:'range',id:'june_happy_cart_mobile_size',label:'Happy cart size on mobile',min:18,max:32,step:1,unit:'px',default:24},
{type:'range',id:'june_happy_cart_desktop_size',label:'Happy cart size on desktop',min:18,max:32,step:1,unit:'px',default:24},
{type:'color',id:'june_happy_cart_body',label:'Bag front',default:'#929292'},
{type:'color',id:'june_happy_cart_accent',label:'Planner and full bag accent',default:'#BFAEE9'},
{type:'paragraph',content:'States follow total units: 0, 1, 2–3, 4+. Counter visibility, colours and placement are in the Cart count badge block. Turn off this icon to restore your existing icon uploads.'}
];
// Insert settings without reformatting the rest of the large shared header.
const schemaStart=header.indexOf('{% schema %}');
const settingsAt=header.indexOf('"settings": [',header.indexOf('"type": "cart_badge_controls"',schemaStart))+'"settings": ['.length;
header=header.slice(0,settingsAt)+'\n'+additions.map(s=>'    '+JSON.stringify(s)).join(',\n')+','+header.slice(settingsAt);
for(const variable of ['tjs_desktop_cart_icon_url','tjs_cart_icon_url']){
 const marker='{% if '+variable+' != blank %}';
 if(header.split(marker).length!==2)throw Error('Unexpected icon markup '+variable);
 header=header.replace(marker,"{% if tjs_cart_badge_block.settings.june_happy_cart != false %}\n              {% render 'june-happy-cart', cart_count: cart.item_count, header_settings: tjs_cart_badge_block.settings %}\n            {% elsif "+variable+" != blank %}");
}
header=header.replaceAll('aria-label="Cart"','aria-label="Cart, {{ cart.item_count }} items"');
header="{% comment %}June happy cart: isolated assets, existing counter and drawer preserved.{% endcomment %}\n{{ 'june-happy-cart.css' | asset_url | stylesheet_tag }}\n<script src=\"{{ 'june-happy-cart.js' | asset_url }}\" defer=\"defer\"></script>\n"+header;
fs.writeFileSync(path.join(out,'sections/my-header.liquid'),header);
let snippet=`{% doc %}
  Renders the quantity-based planner bag while preserving the header cart link.
  @param {number} cart_count - Total units in the cart.
  @param {object} header_settings - Header appearance and motion controls.
{% enddoc %}
{% liquid
  assign mood = 0
  if cart_count >= 4
    assign mood = 3
  elsif cart_count >= 2
    assign mood = 2
  elsif cart_count == 1
    assign mood = 1
  endif
%}
<june-happy-cart data-count="{{ cart_count }}" data-mood="{{ mood }}" data-motion="{{ header_settings.june_happy_cart_motion }}" aria-hidden="true" style="--jhc-mobile-size:{{ header_settings.june_happy_cart_mobile_size | default: 24 }}px;--jhc-desktop-size:{{ header_settings.june_happy_cart_desktop_size | default: 24 }}px;--jhc-body:{{ header_settings.june_happy_cart_body | default: '#929292' }};--jhc-accent:{{ header_settings.june_happy_cart_accent | default: '#BFAEE9' }}">
`;
for(let i=0;i<4;i++){
 let svg=fs.readFileSync(path.join(root,'../animated-filter-icon/happy-full-cart/bag-'+i+'.svg'),'utf8').trim();
 svg=svg.replace('<svg ','<svg style="width:100%!important;height:100%!important;animation:none!important" ').replaceAll('#929292','var(--jhc-body)').replaceAll('#BFAEE9','var(--jhc-accent)');
 snippet+=`<span data-jhc-state="${i}" {% unless mood == ${i} %}hidden{% endunless %}>${svg}</span>\n`;
}
snippet+='</june-happy-cart>\n';
fs.writeFileSync(path.join(out,'snippets/june-happy-cart.liquid'),snippet);
JSON.parse(header.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
console.log('Built header patch and snippet; schema parsed.');
