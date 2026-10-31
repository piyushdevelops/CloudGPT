from pathlib import Path
import json
p=Path('D:/june-shop-redesign')
old=(p/'section-03/unboxing/before/sections/june-with-extras.liquid').read_text(encoding='utf-8')
schema=json.loads(old.split('{% schema %}')[1].split('{% endschema %}')[0])
schema['settings'] += [
 {'type':'text','id':'reveal_label','label':'Reveal button','default':"See what’s inside"},
 {'type':'text','id':'close_label','label':'Close reveal button','default':'Pack it back up'},
 {'type':'text','id':'swipe_label','label':'Mobile gift hint','default':'Swipe to explore your extras'}]
for s in schema['settings']:
 if s.get('id')=='scene_height': s['label']='Desktop unboxing stage height'
 if s.get('id')=='mobile_height': s['label']='Mobile planner height'
 if s.get('id')=='motion': s['label']='Enable reveal and selection motion'
b=next(b for b in schema['blocks'] if b['type']=='planner')
b['settings'] += [{'type':'header','content':'Unboxing photographs'},{'type':'paragraph','content':'Select a real photo for each included gift. A gift without a photo displays its name and detail only. Previous scene settings are retained for reference.'}]
for i in range(1,6): b['settings'].append({'type':'image_picker','id':f'gift_image_{i}','label':f'Gift {i} photograph'})
prefix=old.split('{% capture arrow %}')[0]
arrow=old.split('{% capture arrow %}')[1].split('{% endcapture %}')[0]
markup=r'''
{% capture arrow %}ARROW{% endcapture %}
{% if count > 0 %}
<june-limited id="JuneLimited-{{ section.id }}" class="jl" data-motion="{{ section.settings.motion }}" aria-labelledby="JuneLimitedTitle-{{ section.id }}">
 <header class="jl__header">
  <div><p class="jl__label">{{ section.settings.eyebrow | escape }}</p><h2 class="jl__heading" id="JuneLimitedTitle-{{ section.id }}">{{ section.settings.heading | escape }}<br>{{ section.settings.heading_second | escape }}</h2></div>
  <div class="jl__invitation"><div class="jl__body">{{ section.settings.intro }}</div><button class="jl__primary jl__button jl__reveal" type="button" data-reveal aria-expanded="false" hidden><span data-reveal-label>{{ section.settings.reveal_label | escape }}</span>{{ arrow }}</button></div>
 </header>
 <div class="jl__scenes">
 {% assign number = 0 %}{% for block in planners %}{% assign product = block.settings.product %}{% if product != blank %}
  {% liquid
   assign name = block.settings.short_name | default: product.title
   assign cover = block.settings.cover | default: product.featured_image
   assign gifts = 0
   for i in (1..5)
    assign key = 'gift_' | append: i
    if block.settings[key] != blank
     assign gifts = gifts | plus: 1
    endif
   endfor
  %}
  <div class="jl__scene" data-scene="{{ number }}" data-gifts="{{ gifts }}" {% unless number == 0 %}hidden{% endunless %}>
   <div class="jl__planner">
    <span class="jl__paper jl__paper--one" aria-hidden="true"></span><span class="jl__paper jl__paper--two" aria-hidden="true"></span>
    {{ cover | image_url: width: 1000 | image_tag: widths: '400,650,1000', sizes: '(min-width: 901px) 30vw, 80vw', loading: 'lazy', alt: name }}
    {% if gifts > 0 %}<span class="jl__stamp jl__label"><strong>{{ gifts }}</strong>{{ 'june_limited.included' | t }}</span>{% endif %}
   </div>
   <div class="jl__gifts-stage" id="JuneGifts-{{ section.id }}-{{ number }}" role="region" aria-label="{{ 'june_limited.included' | t | escape }}" tabindex="0">
    {% assign gift_number = 0 %}{% for i in (1..5) %}
    {% liquid
     assign gift_key = 'gift_' | append: i
     assign note_key = 'gift_note_' | append: i
     assign image_key = 'gift_image_' | append: i
     assign gift_image = block.settings[image_key]
    %}
    {% if block.settings[gift_key] != blank %}{% assign gift_number = gift_number | plus: 1 %}
    <figure class="jl__gift jl__gift--{{ gift_number }}{% if gift_image == blank %} jl__gift--text{% endif %}">
     {% if gift_image != blank %}{{ gift_image | image_url: width: 650 | image_tag: widths: '240,400,650', sizes: '(min-width: 901px) 18vw, 65vw', loading: 'lazy', alt: block.settings[gift_key] }}{% else %}<span class="jl__gift-type jl__label">{{ 'june_limited.included' | t }}</span>{% endif %}
     <figcaption><span class="jl__number jl__label">0{{ gift_number }}</span><span class="jl__body">{{ block.settings[gift_key] | escape }}{% if block.settings[note_key] != blank %}<small>{{ block.settings[note_key] | escape }}</small>{% endif %}</span></figcaption>
    </figure>
    {% endif %}{% endfor %}
   </div>
   <p class="jl__swipe jl__label">{{ section.settings.swipe_label | escape }} <span aria-hidden="true">→</span></p>
  </div>{% assign number = number | plus: 1 %}{% endif %}{% endfor %}
 </div>
 <div class="jl__shopping">
  <div class="jl__product-heads" aria-live="polite" aria-atomic="true">
   {% assign number = 0 %}{% for block in planners %}{% assign product = block.settings.product %}{% if product != blank %}
   <div data-heading="{{ number }}" {% unless number == 0 %}hidden{% endunless %}><h3 class="jl__subheading">{{ block.settings.short_name | default: product.title | escape }}</h3><p class="jl__caption jl__body">{{ section.settings.product_caption | escape }}</p><p class="jl__price jl__body">{% if product.price_varies %}{{ 'june_limited.from' | t }} {% endif %}{{ product.price | money }}{% unless product.available %} · {{ 'june_limited.sold_out' | t }}{% endunless %}</p></div>
   {% assign number = number | plus: 1 %}{% endif %}{% endfor %}
  </div>
  <div class="jl__choose"><p class="jl__label" id="JuneLimitedChoose-{{ section.id }}">{{ 'june_limited.choose' | t }}</p><div class="jl__covers" role="group" aria-labelledby="JuneLimitedChoose-{{ section.id }}">
   {% assign number = 0 %}{% for block in planners %}{% assign product = block.settings.product %}{% if product != blank %}{% assign cover = block.settings.cover | default: product.featured_image %}{% assign name = block.settings.short_name | default: product.title %}
   <button class="jl__cover" type="button" data-select="{{ number }}" data-block="{{ block.id }}" aria-pressed="{% if number == 0 %}true{% else %}false{% endif %}" aria-label="{{ name | escape }}" {{ block.shopify_attributes }}>{{ cover | image_url: width: 250 | image_tag: widths: '120,250', sizes: '85px', loading: 'lazy', alt: name }}</button>
   {% assign number = number | plus: 1 %}{% endif %}{% endfor %}
  </div></div>
  <div class="jl__actions">
   {% assign number = 0 %}{% for block in planners %}{% assign product = block.settings.product %}{% if product != blank %}<div data-buy="{{ number }}" {% unless number == 0 %}hidden{% endunless %}><a class="jl__primary jl__button" href="{{ product.url }}">{% if product.available %}{{ 'june_limited.shop' | t }}{% else %}{{ 'june_limited.view' | t }}{% endif %}{{ arrow }}</a></div>{% assign number = number | plus: 1 %}{% endif %}{% endfor %}
   {% if section.settings.collection != blank %}<a class="jl__textlink jl__button" href="{{ section.settings.collection.url }}">{{ 'june_limited.view_all' | t }}{{ arrow }}</a>{% endif %}
  </div>
 </div>
 <p class="jl__note jl__body">{{ section.settings.offer_note | escape }}</p>
 <span hidden data-open-copy>{{ section.settings.reveal_label | escape }}</span><span hidden data-close-copy>{{ section.settings.close_label | escape }}</span>
 <noscript><div class="jl__fallback jl__body">{{ 'june_limited.no_script' | t }} {% for block in planners %}{% if block.settings.product != blank %}<a href="{{ block.settings.product.url }}">{{ block.settings.short_name | default: block.settings.product.title | escape }}</a>{% endif %}{% endfor %}</div></noscript>
</june-limited>
{% elsif request.design_mode %}<div class="jl__empty">{{ 'june_limited.setup' | t }}</div>{% endif %}
'''.replace('ARROW',arrow)
roles=old[old.index('.jl .jl__heading{'):old.index('/* The complete catalog')]
css=r'''
june-limited.jl{display:block;max-width:1680px;margin:0 auto;padding:48px clamp(20px,4vw,64px) 20px;background:var(--jl-bg);color:var(--jl-ink);overflow:clip;border-bottom:1px solid #1113}
.jl *{box-sizing:border-box}.jl [hidden]{display:none!important}.jl h2,.jl h3,.jl p,.jl figure{margin:0;color:inherit}.jl a{color:inherit;text-decoration:none}.jl button{appearance:none;font:inherit;color:inherit;cursor:pointer}.jl button:focus-visible,.jl a:focus-visible,.jl [tabindex]:focus-visible{outline:2px solid currentColor;outline-offset:5px}.jl img{display:block;max-width:100%}.jl strong{font-weight:700}
ROLES
.jl__label{text-transform:uppercase}.jl__header{display:flex;align-items:center;justify-content:space-between;gap:32px}.jl .jl__heading{margin-top:12px}.jl__invitation{max-width:350px}.jl__reveal{margin-top:22px}
.jl__arrow{width:30px;height:30px;flex:none;display:inline-flex;align-items:center;justify-content:center;background:#111;color:var(--jl-accent);border-radius:50%}.jl__arrow svg{width:18px;height:18px}
.jl .jl__primary{display:inline-flex;align-items:center;justify-content:space-between;gap:24px;min-height:50px;padding:8px 9px 8px 22px;background:var(--jl-accent);color:#111;border:1px solid #111;border-radius:999px;box-shadow:-2px 1px 0 #111;transition:transform var(--jl-duration) ease}
.jl__scenes{position:relative;margin-top:20px}.jl__scene{position:relative;min-height:var(--jl-scene)}
.jl__scene:before{content:'';position:absolute;width:64%;height:80%;left:18%;top:8%;border-radius:50%;background:radial-gradient(ellipse,color-mix(in srgb,var(--jl-accent) 22%,var(--jl-bg)),transparent 69%);pointer-events:none}
.jl__planner{position:absolute;left:35%;top:7%;width:30%;height:80%;display:grid;place-items:center;z-index:3;transition:transform calc(var(--jl-duration)*2) ease}
.jl__planner>img{position:relative;width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;filter:drop-shadow(12px 18px 10px #3c241b24);transform:rotate(-6deg);transition:transform calc(var(--jl-duration)*2) ease}
.jl__paper{position:absolute;inset:9% 14%;border:1px solid #1112;border-radius:3px;background:color-mix(in srgb,var(--jl-accent) 28%,var(--jl-bg));box-shadow:8px 10px 20px #1111;transform:rotate(5deg)}.jl__paper--two{transform:rotate(13deg);background:var(--jl-bg)}
.jl__stamp{position:absolute;right:-10%;top:8%;width:96px;height:96px;border:1px solid #111;border-radius:50%;background:var(--jl-accent);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center;padding:12px;transform:rotate(11deg);line-height:1.25!important;letter-spacing:.02em!important;font-size:calc(var(--jl-label-size)*.8)!important}.jl__stamp strong{font-size:32px;font-weight:700;line-height:1}
.jl__gifts-stage{position:absolute;inset:0}.jl__gift{position:absolute;width:18%;padding:8px;background:#fffdf8;box-shadow:0 3px 3px #35241612,0 13px 25px #35241612;left:var(--x);top:var(--y);transform:rotate(var(--r));transition:transform calc(var(--jl-duration)*2.5) cubic-bezier(.2,.8,.2,1),opacity calc(var(--jl-duration)*1.8) ease,visibility calc(var(--jl-duration)*1.8);z-index:4}
.jl__gift>img{width:100%;aspect-ratio:1.25;object-fit:cover}.jl__gift figcaption{display:flex;align-items:flex-start;gap:7px;padding:10px 3px 5px}.jl .jl__gift .jl__body{font-size:calc(var(--jl-body-size)*.8);line-height:1.3}.jl__gift small{display:block;font-size:.85em;margin-top:4px;opacity:.7}.jl__number{flex:none;display:grid;place-items:center;width:23px;height:23px;border-radius:50%;background:var(--jl-accent);font-size:10px!important;letter-spacing:0!important}
.jl__gift--1{--x:5%;--y:2%;--r:-9deg}.jl__gift--2{--x:22%;--y:57%;--r:7deg;width:16%}.jl__gift--3{--x:72%;--y:0%;--r:8deg}.jl__gift--4{--x:79%;--y:55%;--r:-7deg}.jl__gift--5{--x:0%;--y:54%;--r:-5deg;width:16%}
.jl__gift--text{min-height:155px;background:var(--jl-accent);display:flex;flex-direction:column;justify-content:space-between;padding:18px}.jl__gift-type{font-size:9px!important}.jl__gift--text .jl__number{background:#fff8}
.jl[data-ready=true]:not([data-open=true]) .jl__gift{opacity:0;visibility:hidden;transform:translate(calc((50 - var(--unused,0))*0px),0) scale(.2) rotate(0deg);left:42%;top:30%;pointer-events:none}
.jl[data-open=true] .jl__planner>img{transform:rotate(-2deg)}.jl[data-open=true] .jl__paper{opacity:0}.jl__swipe{display:none}
.jl__shopping{display:grid;grid-template-columns:1fr 1fr auto;gap:28px;align-items:center;padding-top:26px;border-top:1px solid #1113}.jl .jl__subheading{font-size:calc(var(--jl-subheading-size)*.85)}.jl__caption{margin-top:7px!important;opacity:.7}.jl .jl__caption{font-size:calc(var(--jl-body-size)*.85)}.jl__price{margin-top:8px!important;font-weight:600!important}.jl__choose{text-align:center}.jl__covers{display:flex;justify-content:center;gap:12px;margin-top:12px}.jl__cover{width:72px;border:0;border-bottom:2px solid transparent;padding:0 0 8px;background:transparent;transition:transform var(--jl-duration) ease}.jl__cover img{height:88px;width:100%;object-fit:contain;mix-blend-mode:multiply}.jl__cover[aria-pressed=true]{border-bottom-color:var(--jl-ink);transform:translateY(-7px)}
.jl__actions{display:flex;flex-direction:column;align-items:flex-start;gap:12px}.jl .jl__textlink{display:inline-flex;align-items:center;gap:10px;min-height:44px;text-decoration:underline;text-underline-offset:5px}.jl__textlink .jl__arrow{width:22px;height:22px}.jl__textlink svg{width:14px;height:14px}.jl .jl__note{font-size:calc(var(--jl-body-size)*.8);opacity:.65;margin-top:20px}.jl__fallback{padding:20px}.jl__fallback a{margin:8px;text-decoration:underline}.jl__empty{padding:40px}
@media(min-width:901px) and (max-width:1150px){.jl__gift{width:20%}.jl__gift--4{--x:77%}.jl__gift--1{--x:0%}.jl__gift--2{--x:24%;width:17%}.jl__gift--5{width:19%}.jl__shopping{grid-template-columns:1fr 1fr}.jl__actions{grid-column:1/-1;flex-direction:row;align-items:center;justify-content:space-between}.jl .jl__gift .jl__body{font-size:calc(var(--jl-body-size)*.7)}}
@media(max-width:900px){
 june-limited.jl{padding:30px 20px 20px}.jl__header{display:block}.jl__invitation{max-width:none;margin-top:18px}.jl__reveal{margin-top:16px}.jl .jl__heading{font-size:var(--jl-heading-mobile)}.jl .jl__subheading{font-size:var(--jl-subheading-mobile)}.jl .jl__body{font-size:var(--jl-body-mobile)}.jl .jl__label{font-size:var(--jl-label-mobile)}.jl .jl__button{font-size:var(--jl-button-mobile)}
 .jl__scenes{margin-top:14px}.jl__scene{min-height:0}.jl__scene:before{width:100%;left:0;top:0;height:var(--jl-mobile-scene)}.jl__planner{position:relative;left:auto;top:auto;width:76%;max-width:340px;height:var(--jl-mobile-scene);margin:0 auto 22px}.jl__stamp{right:-6%;top:5%;width:78px;height:78px;font-size:8px!important}.jl__stamp strong{font-size:26px}
 .jl__gifts-stage{position:relative;inset:auto;display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:16px 20px 24px;margin:0 -20px;max-height:550px;transition:max-height calc(var(--jl-duration)*2) ease}.jl__gift{position:relative!important;left:auto!important;top:auto!important;width:65vw;max-width:260px;flex:0 0 65vw;margin:0;transform:none!important;scroll-snap-align:center;opacity:1;visibility:visible}.jl__gift>img{aspect-ratio:1.2}.jl .jl__gift .jl__body{font-size:calc(var(--jl-body-mobile)*.88)}.jl__gift--text{min-height:240px}
 .jl[data-ready=true]:not([data-open=true]) .jl__gifts-stage{max-height:0;padding-top:0;padding-bottom:0;overflow:hidden}.jl__swipe{display:block;text-align:center;margin:0 0 24px!important}.jl[data-ready=true]:not([data-open=true]) .jl__swipe{display:none}.jl__shopping{grid-template-columns:1fr;gap:24px;padding-top:24px}.jl__choose{order:-1}.jl__covers{gap:16px}.jl__cover{width:65px}.jl__cover img{height:85px}.jl__actions{gap:12px}.jl__actions>div{width:100%}.jl__actions .jl__primary{width:100%}.jl .jl__note{font-size:calc(var(--jl-body-mobile)*.8)}
}
@media(hover:hover){.jl[data-motion=true] .jl__primary:hover{transform:translateY(-2px)}.jl[data-motion=true] .jl__cover:hover{transform:translateY(-7px)}}
@media(prefers-reduced-motion:reduce){.jl *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
.jl[data-motion=false] *{transition:none!important;animation:none!important}
'''.replace('ROLES',roles)
js=r'''
if(!customElements.get('june-limited')){
 customElements.define('june-limited',class extends HTMLElement{
  connectedCallback(){
   if(this.controller)return;
   this.controller=new AbortController();const options={signal:this.controller.signal};
   this.buttons=[...this.querySelectorAll('[data-select]')];this.selected=0;
   this.reveal=this.querySelector('[data-reveal]');this.reveal.hidden=false;this.dataset.ready='true';this.setOpen(false);
   this.addEventListener('click',event=>{const button=event.target.closest('[data-select]');if(button&&this.contains(button))this.select(Number(button.dataset.select));if(event.target.closest('[data-reveal]'))this.setOpen(this.dataset.open!=='true');},options);
   this.addEventListener('keydown',event=>{const button=event.target.closest('[data-select]');if(!button)return;const index=this.buttons.indexOf(button);let next;if(event.key==='ArrowRight')next=(index+1)%this.buttons.length;if(event.key==='ArrowLeft')next=(index-1+this.buttons.length)%this.buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=this.buttons.length-1;if(next===undefined)return;event.preventDefault();this.select(next);this.buttons[next].focus();},options);
   this.addEventListener('shopify:block:select',event=>{const button=this.buttons.find(b=>b.dataset.block===event.detail.blockId);if(button){this.select(Number(button.dataset.select));this.setOpen(true);}},options);
  }
  setOpen(open){
   this.dataset.open=String(open);this.reveal.setAttribute('aria-expanded',String(open));
   this.querySelector('[data-reveal-label]').textContent=this.querySelector(open?'[data-close-copy]':'[data-open-copy]').textContent;
   this.querySelectorAll('.jl__gifts-stage').forEach(el=>{el.setAttribute('aria-hidden',String(!open));el.tabIndex=open?0:-1;});
   const scene=this.querySelector('[data-scene="'+this.selected+'"]');this.reveal.setAttribute('aria-controls',scene.querySelector('.jl__gifts-stage').id);this.reveal.hidden=Number(scene.dataset.gifts)===0;
  }
  select(index){if(!this.buttons[index])return;this.selected=index;this.buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));['scene','heading','buy'].forEach(key=>this.querySelectorAll('[data-'+key+']').forEach(el=>el.hidden=Number(el.dataset[key])!==index));this.setOpen(this.dataset.open==='true');this.querySelector('[data-scene="'+index+'"] .jl__gifts-stage').scrollLeft=0;}
  disconnectedCallback(){this.controller?.abort();this.controller=null;}
 });
}
'''
result=prefix+markup+'\n{% stylesheet %}\n'+css+'\n{% endstylesheet %}\n{% javascript %}\n'+js+'\n{% endjavascript %}\n{% schema %}\n'+json.dumps(schema,ensure_ascii=False,indent=2)+'\n{% endschema %}\n'
(p/'current-theme/sections/june-with-extras.liquid').write_text(result,encoding='utf-8')
(p/'section-03/unboxing/june-with-extras.liquid').write_text(result,encoding='utf-8')
print('Section built; planner inputs:',len([s for s in b['settings'] if 'id' in s]))
