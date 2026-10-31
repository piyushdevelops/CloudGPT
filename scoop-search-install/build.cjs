const fs=require('fs'),path=require('path');const root=__dirname;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');const write=(p,v)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),v);};
const checkbox=(id,label,value=true)=>({type:'checkbox',id,label,default:value});
const range=(id,label,min,max,step,value,unit)=>({type:'range',id,label,min,max,step,default:value,...(unit?{unit}:{})});
const text=(id,label,value)=>({type:'text',id,label,default:value});
const color=(id,label,value)=>({type:'color',id,label,...(value?{default:value}:{})});
const settings=[
 checkbox('desktop','Enable on desktop'),checkbox('mobile','Enable on mobile'),checkbox('motion','Animate scoop into search'),
 range('duration','Morph duration',200,1400,20,720,'ms'),range('width_desktop','Desktop total width',280,600,10,360,'px'),range('width_mobile','Mobile maximum total width',260,420,4,340,'px'),
 range('height_desktop','Desktop capsule height',44,64,2,48,'px'),range('height_mobile','Mobile capsule height',44,64,2,48,'px'),range('edge','Minimum screen edge clearance',8,32,2,12,'px'),range('drop','Drop below scoop top',0,30,2,8,'px'),range('gap','Gap to search circle',4,20,2,8,'px'),range('radius','Capsule corner radius',8,32,2,24,'px'),
 color('fill','Search fill (blank follows scoop)'),color('text_color','Search text','#FFFFFF'),color('placeholder_color','Placeholder','#DCD6E5'),color('accent','Focus and links','#C6B1E8'),color('rim_color','Inset rim','#635D70'),range('rim','Inset rim thickness',0,3,1,1,'px'),range('inset','Inset rim spacing',2,8,1,4,'px'),range('shadow','Shadow strength',0,30,2,12,'%'),range('icon','Search glyph size',16,28,2,22,'px'),range('stroke','Search glyph thickness',1,4,.5,2.5),
 text('placeholder','Search placeholder','Find your next chapter'),text('search_label','Search button label','Search'),text('close_label','Close button label','Close search'),
 {type:'font_picker',id:'input_font',label:'Input font family',default:'poppins_n6'},range('input_weight','Input weight',300,900,100,600),range('input_size','Desktop input size',14,22,1,16,'px'),range('input_size_mobile','Mobile input size',16,22,1,16,'px'),range('input_tracking','Input letter spacing',-1,2,.1,-.3,'px'),range('input_line','Input line height',1,2,.1,1.3),
 checkbox('suggestions','Show product suggestions'),checkbox('images','Show product thumbnails'),range('limit','Maximum suggestions',1,6,1,3),range('min_chars','Characters before suggestions',1,4,1,2),range('debounce','Typing delay',100,600,50,250,'ms'),range('results_height','Maximum results height',120,420,10,240,'px'),range('results_radius','Results corner radius',4,24,2,16,'px'),
 {type:'font_picker',id:'result_font',label:'Results font family',default:'poppins_n6'},range('result_weight','Results weight',300,900,100,600),range('result_size','Desktop result size',12,20,1,14,'px'),range('result_size_mobile','Mobile result size',12,20,1,13,'px'),range('result_tracking','Results letter spacing',-1,2,.1,0,'px'),range('result_line','Results line height',1,2,.1,1.4),
 text('all_label','View all link','See all results →'),text('results_label','Results announcement','Suggested products'),text('empty_label','Empty results announcement','No suggestions. Search all products.'),text('fallback_label','Unavailable announcement','Search all products to continue.'),checkbox('outside_close','Close when clicking outside')
];
if(settings.length>50)throw Error('Too many settings');
const block={type:'scoop_search',name:'Scoop search',limit:1,settings};
let header=read('before/sections/my-header.liquid');
const match=header.match(/{% schema %}([\s\S]*?){% endschema %}/);const schema=JSON.parse(match[1]);
if(schema.blocks.some(b=>b.type==='scoop_search'))throw Error('Already exists; reconcile');
schema.blocks.push(block);schema.max_blocks=Math.max(schema.max_blocks||0,10);schema.presets?.forEach(p=>(p.blocks||=[]).push({type:'scoop_search'}));
let schemaText=match[1].replace(/"max_blocks"\s*:\s*\d+/, '"max_blocks": '+schema.max_blocks);
schemaText=schemaText.replace(/"blocks"\s*:\s*\[/, '"blocks": [\n'+JSON.stringify(block,null,2)+',');
schemaText=schemaText.replace(/("presets"\s*:\s*\[[\s\S]*?"blocks"\s*:\s*\[)/,'$1\n        { "type": "scoop_search" },');
header=header.replace(match[0],'{% schema %}'+schemaText+'{% endschema %}');
header=header.replace('</tjs-premium-header>',`</tjs-premium-header>
{% for scoop_search_block in section.blocks %}
  {% if scoop_search_block.type == 'scoop_search' %}
    {% render 'june-scoop-search', section: section, block: scoop_search_block %}
  {% endif %}
{% endfor %}`);
write('theme/sections/my-header.liquid',header);
let groupText=read('before/sections/header-group.json'),prefix=groupText.slice(0,groupText.indexOf('{'));const group=JSON.parse(groupText.slice(groupText.indexOf('{'))),entry=Object.values(group.sections).find(s=>s.type==='my-header');if(!entry)throw Error('Missing header');
entry.blocks.june_scoop_search={type:'scoop_search',settings:Object.fromEntries(settings.filter(s=>'default'in s).map(s=>[s.id,s.default]))};entry.block_order.push('june_scoop_search');
write('theme/sections/header-group.json',prefix+JSON.stringify(group,null,2)+'\n');
const configKeys=['desktop','mobile','motion','duration','width_desktop','width_mobile','height_desktop','height_mobile','edge','drop','gap','radius','fill','outside_close','suggestions','images','limit','min_chars','debounce','all_label','results_label','empty_label','fallback_label'];
write('theme/snippets/june-scoop-search.liquid',`{% doc %}
  Scoop search with editable geometry, motion and typography.
  @param {section} section - Header section.
  @param {block} block - Scoop search controls.
{% enddoc %}
{% assign s = block.settings %}
{% assign input_font = s.input_font | font_modify: 'weight', s.input_weight %}
{% assign result_font = s.result_font | font_modify: 'weight', s.result_weight %}
{% style %}
{{ s.input_font | font_face: font_display: 'swap' }}
{{ input_font | font_face: font_display: 'swap' }}
{{ s.result_font | font_face: font_display: 'swap' }}
{{ result_font | font_face: font_display: 'swap' }}
{% endstyle %}
{{ 'june-scoop-search.css' | asset_url | stylesheet_tag }}
<script src="{{ 'june-scoop-search.js' | asset_url }}" defer="defer"></script>
<june-scoop-search data-header="TjsPremiumHeader-{{ section.id }}" data-predictive="{{ routes.predictive_search_url }}" {{ block.shopify_attributes }} style="--jss-font:{{ s.input_font.family | escape }},{{ s.input_font.fallback_families | escape }};--jss-result-font:{{ s.result_font.family | escape }},{{ s.result_font.fallback_families | escape }};--jss-weight:{{ s.input_weight }};--jss-size:{{ s.input_size }}px;--jss-size-mobile:{{ s.input_size_mobile }}px;--jss-tracking:{{ s.input_tracking }}px;--jss-line:{{ s.input_line }};--jss-result-weight:{{ s.result_weight }};--jss-result-size:{{ s.result_size }}px;--jss-result-size-mobile:{{ s.result_size_mobile }}px;--jss-result-tracking:{{ s.result_tracking }}px;--jss-result-line:{{ s.result_line }};--jss-text:{{ s.text_color }};--jss-placeholder:{{ s.placeholder_color }};--jss-accent:{{ s.accent }};--jss-rim-color:{{ s.rim_color }};--jss-rim:{{ s.rim }}px;--jss-inset:{{ s.inset }}px;--jss-shadow:{{ s.shadow | divided_by: 100.0 }};--jss-icon:{{ s.icon }}px;--jss-stroke:{{ s.stroke }};--jss-results-height:{{ s.results_height }}px;--jss-results-radius:{{ s.results_radius }}px;">
<script type="application/json" data-config>{${configKeys.map(k=>`"${k}":{{ s.${k} | json }}`).join(',')}}</script>
<template>
<div id="JuneScoopSearch-{{ section.id }}" class="jss-overlay" hidden>
  <svg class="jss-shape" preserveAspectRatio="none" aria-hidden="true"><path data-shape/><circle data-orb/></svg>
  <form class="jss-form" action="{{ routes.search_url }}" method="get" role="search" aria-label="{{ s.search_label | escape }}">
    <input type="hidden" name="type" value="product"><input type="hidden" name="options[prefix]" value="last">
    <input class="jss-input" type="search" name="q" autocomplete="off" enterkeyhint="search" placeholder="{{ s.placeholder | escape }}" aria-label="{{ s.search_label | escape }}" aria-controls="JuneScoopResults-{{ section.id }}">
    <button class="jss-close" type="button" data-close aria-label="{{ s.close_label | escape }}">×</button>
    <button class="jss-submit" type="submit" aria-label="{{ s.search_label | escape }}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button>
  </form>
  <div class="jss-results-wrap"><div class="jss-results" id="JuneScoopResults-{{ section.id }}" data-results hidden></div></div>
  <span class="jss-status" role="status" data-status></span>
</div>
</template>
</june-scoop-search>
`);
console.log(JSON.stringify({settings:settings.length,blocks:entry.block_order.length,files:5}));
