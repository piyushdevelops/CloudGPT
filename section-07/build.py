from pathlib import Path
import json
p=Path('D:/june-shop-redesign')
ref=(p/'current-theme/sections/june-pick-your-pour.liquid').read_text(encoding='utf-8')
schema_ref=json.loads(ref.split('{% schema %}')[1].split('{% endschema %}')[0])
type_block=next(b for b in schema_ref['blocks'] if b['type']=='typography')
defaults={'heading_size':44,'heading_mobile':34,'title_size':22,'title_mobile':20,'body_size':16,'body_mobile':14}
for s in type_block['settings']:
 if s.get('id') in defaults:s['default']=defaults[s['id']]
prefix=ref.split('{% capture arrow %}')[0].replace('JunePour','JuneCorner').replace('--jg-','--jcorner-').replace('pours','pieces').replace("'pour'","'piece'")
for old,new in [('default: 62','default: 44'),('default: 42','default: 34'),('default: 26','default: 22'),('default: 23','default: 20'),('default: 18','default: 16'),('type.body_mobile | default: 16','type.body_mobile | default: 14')]:prefix=prefix.replace(old,new)
prefix=prefix.replace('--jcorner-height:{{ section.settings.height }}px;--jcorner-mobile-height:{{ section.settings.mobile_height }}px;','')
arrow=ref.split('{% capture arrow %}')[1].split('{% endcapture %}')[0].replace('jg__','jcorner__')
markup=r'''
{% capture arrow %}ARROW{% endcapture %}
{% if count > 0 %}
<june-corner id="JuneCorner-{{ section.id }}" class="jcorner" data-motion="{{ section.settings.motion }}" aria-labelledby="JuneCornerHeading-{{ section.id }}">
 <header class="jcorner__header"><p class="jcorner__eyebrow jcorner__button-type">{{ section.settings.eyebrow | escape }}</p><h2 class="jcorner__heading" id="JuneCornerHeading-{{ section.id }}">{{ section.settings.heading | escape }}<br>{{ section.settings.heading_second | escape }}</h2><div class="jcorner__body">{{ section.settings.body }}</div></header>
 <div class="jcorner__visual">
  <div class="jcorner__canvas">
   {% if section.settings.scene != blank %}
   <picture>{% if section.settings.mobile_scene != blank %}<source media="(max-width:1050px)" srcset="{{ section.settings.mobile_scene | image_url: width: 500 }} 500w, {{ section.settings.mobile_scene | image_url: width: 1000 }} 1000w" sizes="100vw">{% endif %}{{ section.settings.scene | image_url: width: 1800 | image_tag: widths: '500,750,1000,1400,1800', sizes: '(min-width: 1680px) 1075px, (min-width: 1051px) 64vw, 100vw', loading: 'lazy', alt: section.settings.scene_alt }}</picture>
   <div class="jcorner__hotspots" role="group" aria-label="{{ section.settings.choose | escape }}">
   {% assign number = 0 %}{% for block in pieces %}{% if block.settings.product != blank %}
    <button type="button" class="jcorner__spot jcorner__button-type" data-select="{{ number }}" data-block="{{ block.id }}" aria-label="{{ block.settings.product.title | escape }}" aria-pressed="{% if number == 0 %}true{% else %}false{% endif %}" aria-controls="JuneCornerProduct-{{ section.id }}-{{ number }}" style="--spot-x:{{ block.settings.x }}%;--spot-y:{{ block.settings.y }}%;--spot-mobile-x:{{ block.settings.mobile_x }}%;--spot-mobile-y:{{ block.settings.mobile_y }}%" {{ block.shopify_attributes }}><span>{{ number | plus: 1 | prepend: '0' }}</span></button>
    {% assign number = number | plus: 1 %}{% endif %}{% endfor %}
   </div>
   {% else %}{{ 'lifestyle-1' | placeholder_svg_tag: 'jcorner__placeholder' }}{% endif %}
   {% if section.settings.caption != blank %}<p class="jcorner__caption jcorner__body">{{ section.settings.caption | escape }}</p>{% endif %}
  </div>
 </div>
 <div class="jcorner__details" aria-live="polite" aria-atomic="true">
 {% assign number = 0 %}{% for block in pieces %}{% assign product = block.settings.product %}{% if product != blank %}
  {% assign image = block.settings.image | default: product.featured_image %}
  <div class="jcorner__product" id="JuneCornerProduct-{{ section.id }}-{{ number }}" data-product="{{ number }}" {% unless number == 0 %}hidden{% endunless %}>
   <p class="jcorner__count jcorner__button-type">{{ number | plus: 1 | prepend: '0' }} / {{ section.settings.in_corner | escape }}</p>
   <div class="jcorner__item">{% if image != blank %}{{ image | image_url: width: 300 | image_tag: widths: '150,300', sizes: '100px', loading: 'lazy', alt: product.title }}{% endif %}<div><h3 class="jcorner__title">{{ block.settings.name | default: product.title | escape }}</h3><p class="jcorner__price jcorner__body">{% if product.price_varies %}{{ section.settings.from | escape }} {% endif %}{{ product.price | money }}</p><a class="jcorner__link jcorner__button-type" href="{{ product.url }}">{{ section.settings.detail | escape }}{{ arrow }}</a></div></div>
   {% unless product.available %}<p class="jcorner__body">{{ section.settings.unavailable | escape }}</p>{% endunless %}
  </div>{% assign number = number | plus: 1 %}{% endif %}{% endfor %}
 </div>
 <footer class="jcorner__footer">
  <div class="jcorner__nav" role="group" aria-label="{{ section.settings.choose | escape }}">{% assign number = 0 %}{% for block in pieces %}{% if block.settings.product != blank %}<button type="button" class="jcorner__step jcorner__button-type" data-select="{{ number }}" aria-label="{{ block.settings.product.title | escape }}" aria-pressed="{% if number == 0 %}true{% else %}false{% endif %}">{{ number | plus: 1 | prepend: '0' }}</button>{% assign number = number | plus: 1 %}{% endif %}{% endfor %}</div>
  {% if section.settings.collection != blank %}<a class="jcorner__primary jcorner__button-type" href="{{ section.settings.collection.url }}">{{ section.settings.all | escape }}{{ arrow }}</a>{% endif %}
  {% if section.settings.scene_note != blank %}<p class="jcorner__scene-note jcorner__body">{{ section.settings.scene_note | escape }}</p>{% endif %}
 </footer>
 <noscript><style>#JuneCorner-{{ section.id }} .jcorner__product[hidden]{display:block!important}#JuneCorner-{{ section.id }} .jcorner__hotspots,#JuneCorner-{{ section.id }} .jcorner__nav{display:none}</style></noscript>
</june-corner>
{% elsif request.design_mode %}<p>{{ section.settings.setup | escape }}</p>{% endif %}
'''.replace('ARROW',arrow)
roles=ref[ref.index('.jg .jg__heading{'):ref.index('.jg__stage{',ref.index('.jg .jg__heading{'))].replace('.jg','.jcorner').replace('--jg-','--jcorner-')
css=r'''
june-corner.jcorner{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(340px,1fr);grid-template-rows:auto 1fr auto;max-width:1680px;margin:auto;background:var(--jcorner-bg);color:var(--jcorner-ink);border-bottom:1px solid #1112}
.jcorner *{box-sizing:border-box}.jcorner [hidden]{display:none!important}.jcorner h2,.jcorner h3,.jcorner p{margin:0;color:inherit}.jcorner a{color:inherit;text-decoration:none}.jcorner button{cursor:pointer;color:inherit;appearance:none}.jcorner strong{font-weight:700}.jcorner button:focus-visible,.jcorner a:focus-visible{outline:3px solid var(--jcorner-ink);outline-offset:4px}
ROLES
.jcorner__header{grid-column:2;grid-row:1;padding:32px 32px 22px}.jcorner__eyebrow{text-transform:uppercase;font-size:calc(var(--jcorner-button-size)*.75)!important;letter-spacing:.12em!important}.jcorner .jcorner__heading{margin:16px 0 18px;overflow-wrap:break-word}
.jcorner__visual{grid-column:1;grid-row:1/4;min-width:0;background:#e9dfd0;display:flex;align-items:center}.jcorner__canvas{position:relative;width:100%;isolation:isolate}.jcorner__canvas picture,.jcorner__canvas img{display:block;width:100%;height:auto}.jcorner__placeholder{display:block;width:100%;height:auto}
.jcorner__spot{position:absolute;left:var(--spot-x);top:var(--spot-y);width:48px;height:48px;padding:5px;border:1px solid #fff;border-radius:50%;background:#1116;color:#fff!important;transform:translate(-50%,-50%);transition:background var(--jcorner-duration) ease,box-shadow var(--jcorner-duration) ease;box-shadow:0 2px 9px #0003}.jcorner__spot span{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:#111}.jcorner__spot[aria-pressed=true]{background:var(--jcorner-accent);border-color:var(--jcorner-accent);box-shadow:0 0 0 5px #fff7,0 3px 10px #0003}.jcorner__spot[aria-pressed=true] span{color:var(--jcorner-accent)}
.jcorner__caption{position:absolute;bottom:0;left:0;right:0;padding:30px 28px 20px;background:linear-gradient(transparent,#0009);color:#fff!important;pointer-events:none}
.jcorner__details{grid-column:2;grid-row:2;padding:0 32px;align-self:center}.jcorner__product{border-top:1px solid #1114;padding-top:18px}.jcorner__count{text-transform:uppercase;font-size:calc(var(--jcorner-button-size)*.75)!important;letter-spacing:.09em!important;margin-bottom:18px!important}.jcorner__item{display:grid;grid-template-columns:88px 1fr;gap:18px;align-items:center}.jcorner__item>img{display:block;width:88px;height:112px;object-fit:contain;mix-blend-mode:multiply}.jcorner__price{margin-top:8px!important}.jcorner__arrow{display:grid;place-items:center;width:30px;height:30px;flex:none;border-radius:50%;background:#111;color:var(--jcorner-accent)}.jcorner__arrow svg{width:18px;height:18px}.jcorner .jcorner__link{display:inline-flex;align-items:center;gap:9px;min-height:44px;text-decoration:underline;text-underline-offset:5px;margin-top:8px}.jcorner__link .jcorner__arrow{width:22px;height:22px}.jcorner__link svg{width:14px;height:14px}
.jcorner__footer{grid-column:2;grid-row:3;padding:22px 32px 28px}.jcorner__nav{display:flex;justify-content:center;gap:16px;border-top:1px solid #1114;padding-top:18px;margin-bottom:20px}.jcorner__step{width:44px;height:44px;border:1px solid #111;border-radius:50%;background:none}.jcorner__step[aria-pressed=true]{background:#111;color:var(--jcorner-accent)}.jcorner .jcorner__primary{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:50px;padding:8px 9px 8px 22px;border:1px solid #111;border-radius:999px;background:var(--jcorner-accent);color:#111;box-shadow:-2px 1px 0 #111;transition:transform var(--jcorner-duration) ease}.jcorner .jcorner__scene-note{font-size:calc(var(--jcorner-body-size)*.67);margin-top:12px;opacity:.65}
@media(hover:hover){.jcorner[data-motion=true] .jcorner__primary:hover{transform:translateY(-2px)}.jcorner__spot:hover{background:var(--jcorner-accent)}}
@media(max-width:1050px){june-corner.jcorner{display:flex;flex-direction:column}.jcorner__header{padding:28px 20px 22px}.jcorner .jcorner__heading{font-size:var(--jcorner-heading-mobile);margin:12px 0 16px}.jcorner .jcorner__title{font-size:var(--jcorner-title-mobile)}.jcorner .jcorner__body{font-size:var(--jcorner-body-mobile)}.jcorner .jcorner__button-type{font-size:var(--jcorner-button-mobile)}.jcorner__eyebrow{font-size:calc(var(--jcorner-button-mobile)*.75)!important}.jcorner__spot{left:var(--spot-mobile-x);top:var(--spot-mobile-y);width:44px;height:44px;padding:4px}.jcorner__caption{padding:22px 20px 14px;font-size:calc(var(--jcorner-body-mobile)*.9)!important}.jcorner__details{padding:20px 20px 0;align-self:stretch}.jcorner__product{padding:0;border:0}.jcorner__count{font-size:calc(var(--jcorner-button-mobile)*.75)!important;margin-bottom:12px!important}.jcorner__item{grid-template-columns:72px 1fr;gap:18px}.jcorner__item>img{width:72px;height:86px}.jcorner__footer{padding:18px 20px 22px}.jcorner__nav{padding-top:16px;margin-bottom:18px}.jcorner .jcorner__scene-note{font-size:calc(var(--jcorner-body-mobile)*.75)}}
@media(prefers-reduced-motion:reduce){.jcorner *{transition:none!important;animation:none!important}.jcorner .jcorner__primary{transform:none!important}}.jcorner[data-motion=false] *{transition:none!important}
'''.replace('ROLES',roles)
js=r'''
if(!customElements.get('june-corner')){
 customElements.define('june-corner',class extends HTMLElement{
  connectedCallback(){
   this.controller?.abort();this.controller=new AbortController();const options={signal:this.controller.signal};
   this.addEventListener('click',event=>{const b=event.target.closest('[data-select]');if(b&&this.contains(b))this.select(Number(b.dataset.select));},options);
   this.addEventListener('keydown',event=>{const b=event.target.closest('[data-select]');if(!b)return;const group=[...b.parentElement.querySelectorAll('[data-select]')];let i=group.indexOf(b),n;if(event.key==='ArrowRight')n=(i+1)%group.length;if(event.key==='ArrowLeft')n=(i-1+group.length)%group.length;if(event.key==='Home')n=0;if(event.key==='End')n=group.length-1;if(n===undefined)return;event.preventDefault();this.select(Number(group[n].dataset.select));group[n].focus();},options);
   this.addEventListener('shopify:block:select',event=>{const b=[...this.querySelectorAll('[data-block]')].find(b=>b.dataset.block===event.detail.blockId);if(b)this.select(Number(b.dataset.select));},options);
  }
  select(index){this.querySelectorAll('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.select)===index)));this.querySelectorAll('[data-product]').forEach(p=>p.hidden=Number(p.dataset.product)!==index);}
  disconnectedCallback(){this.controller?.abort();}
 });
}
'''
def text(id,label,default):return {'type':'text','id':id,'label':label,'default':default}
settings=[text('eyebrow','Eyebrow','Life beyond the pages / Home décor'),text('heading','Heading','Small details.'),text('heading_second','Heading second line','A space that’s you.'),{'type':'inline_richtext','id':'body','label':'Supporting copy','default':'Find the pieces that make a corner feel <strong>yours.</strong>'},{'type':'image_picker','id':'scene','label':'Styled scene'},{'type':'image_picker','id':'mobile_scene','label':'Optional mobile scene'},text('scene_alt','Scene description','A sunlit corner with a ceramic vase, gold bird figurine and carved picture frame'),text('caption','Scene caption','A little corner. A lot of you.'),text('scene_note','Scene note','Styled visual. See product photos for details.'),text('in_corner','Product eyebrow','In this corner'),text('choose','Navigation label','Explore the pieces in this corner'),text('detail','Product link label','Explore this detail'),text('all','Collection button','Explore home décor'),{'type':'collection','id':'collection','label':'Home décor collection'},text('from','Price prefix','From'),text('unavailable','Unavailable label','Currently unavailable'),text('setup','Setup message','Choose a scene and add your featured pieces.'),{'type':'color','id':'background','label':'Background','default':'#FFFBF1'},{'type':'color','id':'ink','label':'Text','default':'#111111'},{'type':'color','id':'accent','label':'Accent and button fill','default':'#D5FF46'},{'type':'font_picker','id':'fallback_font','label':'Fallback font','default':'poppins_n4'},{'type':'checkbox','id':'motion','label':'Enable button and selection motion','default':True},{'type':'range','id':'speed','label':'Motion speed','min':50,'max':200,'step':10,'default':100,'unit':'%'}]
piece=[{'type':'product','id':'product','label':'Product'},{'type':'text','id':'name','label':'Short display name'},{'type':'image_picker','id':'image','label':'Product photo override'},{'type':'paragraph','content':'Position the numbered point over this product. Coordinates are relative to the entire scene image. Keep the image uncropped.'}]
for id,label,value in [('x','Desktop horizontal position',30),('y','Desktop vertical position',60),('mobile_x','Mobile horizontal position',30),('mobile_y','Mobile vertical position',60)]:piece.append({'type':'range','id':id,'label':label,'min':0,'max':100,'step':1,'unit':'%','default':value})
schema={'name':'June · Shop the corner','tag':'section','class':'june-corner-section','max_blocks':4,'settings':settings,'blocks':[{'type':'piece','name':'Corner piece','limit':3,'settings':piece},type_block],'presets':[{'name':'June · Shop the corner','blocks':[{'type':'piece'},{'type':'piece'},{'type':'piece'},{'type':'typography'}]}]}
code=prefix+markup+'\n{% stylesheet %}\n'+css+'\n{% endstylesheet %}\n{% javascript %}\n'+js+'\n{% endjavascript %}\n{% schema %}\n'+json.dumps(schema,ensure_ascii=False,indent=2)+'\n{% endschema %}\n'
for f in ['current-theme/sections/june-shop-the-corner.liquid','section-07/june-shop-the-corner.liquid']:(p/f).write_text(code,encoding='utf-8')
print('Built Section7',len(code))
