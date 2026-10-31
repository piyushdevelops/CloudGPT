const fs=require('fs'),path=require('path');const root=__dirname;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v);};
const range=(id,label,min,max,step,def,unit)=>({type:'range',id,label,min,max,step,default:def,...unit?{unit}:{}});
const settings=[{type:'checkbox',id:'desktop',label:'Enable on desktop',default:true},{type:'checkbox',id:'mobile',label:'Enable on mobile',default:true},{type:'checkbox',id:'motion',label:'Animate messages',default:true},range('logo_hold','Logo hold',4,30,1,8,'s'),range('message_hold','Minimum message hold',2,12,1,3,'s'),range('transition','Entry and exit duration',100,800,20,360,'ms'),range('speed','Long message scroll speed',20,100,5,45),range('inset_desktop','Desktop side inset',16,120,2,60,'px'),range('inset_mobile','Mobile side inset',10,60,2,28,'px'),{type:'font_picker',id:'font',label:'Announcement font family',default:'poppins_n6'},range('weight','Font weight',300,900,100,600),range('size','Desktop font size',12,24,1,15,'px'),range('size_mobile','Mobile font size',10,18,1,12,'px'),range('tracking','Letter spacing',-1,2,.1,-.2,'px'),range('line','Line height',1,2,.1,1.3),{type:'color',id:'color',label:'Text colour (blank follows theme)'},{type:'text',id:'pause_label',label:'Pause label',default:'Pause announcements'},{type:'text',id:'resume_label',label:'Resume label',default:'Resume announcements'}];
for(let i=1;i<=4;i++){settings.push({type:'text',id:'message_'+i,label:'Message '+i,...i===1?{default:'Big plans for 2027. Coming soon ↗'}:{}},{type:'url',id:'link_'+i,label:'Message '+i+' link'});}
const block={type:'scoop_announcements',name:'Scoop announcements',limit:1,settings};
let h=read('before/sections/my-header.liquid');if(h.includes('"type": "scoop_announcements"'))throw Error('Already present');
const match=h.match(/{% schema %}([\s\S]*?){% endschema %}/);let schema=match[1];schema=schema.replace(/"blocks"\s*:\s*\[/,'"blocks": [\n'+JSON.stringify(block,null,2)+',');schema=schema.replace(/("presets"\s*:\s*\[[\s\S]*?"blocks"\s*:\s*\[)/,'$1\n{"type":"scoop_announcements"},');h=h.replace(match[0],'{% schema %}'+schema+'{% endschema %}');
h=h.replace('</tjs-premium-header>',`</tjs-premium-header>
{% assign scoop_announcements = section.blocks | where: 'type', 'scoop_announcements' | first %}
{% render 'june-scoop-announcements', section: section, block: scoop_announcements %}`);write('theme/sections/my-header.liquid',h);
const raw=read('before/sections/header-group.json'),start=raw.indexOf('{'),g=JSON.parse(raw.slice(start));const header=Object.values(g.sections).find(s=>s.type==='my-header');header.blocks.june_scoop_announcements={type:block.type,settings:Object.fromEntries(settings.filter(s=>'default'in s).map(s=>[s.id,s.default]))};header.block_order.push('june_scoop_announcements');write('theme/sections/header-group.json',raw.slice(0,start)+JSON.stringify(g,null,2)+'\n');
write('theme/snippets/june-scoop-announcements.liquid',`{% doc %}
 @param {section} section - Header section.
 @param {block} block - Optional announcement controls.
{% enddoc %}
{% if block != blank %}
{% assign s = block.settings %}
{% assign announcement_font = s.font | font_modify: 'weight', s.weight %}
{% style %}{{ s.font | font_face: font_display: 'swap' }}{{ announcement_font | font_face: font_display: 'swap' }}{% endstyle %}
{{ 'june-scoop-announcements.css' | asset_url | stylesheet_tag }}
<script src="{{ 'june-scoop-announcements.js' | asset_url }}" defer="defer"></script>
<june-scoop-announcements data-header="TjsPremiumHeader-{{ section.id }}" {{ block.shopify_attributes }} style="--jsa-font:{{ s.font.family | escape }},{{ s.font.fallback_families | escape }};--jsa-size:{{ s.size }}px;--jsa-size-mobile:{{ s.size_mobile }}px;--jsa-weight:{{ s.weight }};--jsa-tracking:{{ s.tracking }}px;--jsa-line:{{ s.line }};{% if s.color != blank %}--jsa-color:{{ s.color }};{% endif %}">
<script type="application/json">{${['desktop','mobile','motion','logo_hold','message_hold','transition','speed','inset_desktop','inset_mobile','pause_label','resume_label'].map(k=>`"${k}":{{ s.${k} | json }}`).join(',')}}</script>
{% for i in (1..4) %}
 {% assign message_key = 'message_' | append: i %}{% assign link_key = 'link_' | append: i %}
 {% if s[message_key] != blank %}<template>{% if s[link_key] != blank %}<a class="jsa-clip" href="{{ s[link_key] }}">{% else %}<span class="jsa-clip">{% endif %}<span class="jsa-track">{{ s[message_key] | escape }}</span>{% if s[link_key] != blank %}</a>{% else %}</span>{% endif %}</template>{% endif %}
{% endfor %}
</june-scoop-announcements>
{% endif %}
`);
console.log('Announcement controls: '+settings.length);
