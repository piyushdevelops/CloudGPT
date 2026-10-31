import json,re
from pathlib import Path
ROOT=Path(__file__).parent
THEME=ROOT/'theme'
def clean(s):
    for c in '\u2019\u2018\u201c\u201d\u2014\u2013\u2026\u00b7\u00d7\u2192\u2197\u00e9\u00a0':
        try:s=s.replace(c.encode('utf-8').decode('cp1252'),c)
        except UnicodeDecodeError:pass
    return s
def read(n):return clean((THEME/'sections'/f'{n}.liquid').read_text(encoding='utf-8'))
def schema(s,fn):
    m=re.search(r'{% schema %}(.*?){% endschema %}',s,re.S);j=json.loads(m[1]);fn(j)
    return s[:m.start(1)]+'\n'+json.dumps(j,ensure_ascii=True,indent=2)+'\n'+s[m.end(1):]
def add(j,settings,block=None):
    a=j['settings'] if not block else next(b['settings'] for b in j['blocks'] if b['type']==block)
    for x in settings:
        if not any(v.get('id')==x['id'] for v in a):a.append(x)
def text(id,label,default=None):
    x={'type':'text','id':id,'label':label}
    if default:x['default']=default
    return x
def css(s,c):return s.replace('{% endstylesheet %}',c+'\n{% endstylesheet %}',1)
def save(n,s): (THEME/'sections'/f'{n}.liquid').write_text(s,encoding='utf-8')
def repl(s,a,b):
    assert a in s,a[:100]
    return s.replace(a,b)
idx=json.loads(re.sub(r'/\*.*?\*/','',clean((THEME/'templates/index.json').read_text(encoding='utf-8')),flags=re.S))
def cfg(n):return idx['sections'][n]['settings']
def blocks(n):return idx['sections'][n]['blocks']

n='june-make-room';s=read(n)
s=s.replace("[{ transform: 'scaleX(1)' }, { transform: 'scaleX(1.025)', offset: .5 }, { transform: 'scaleX(1)' }]","[{ opacity: 1 }, { opacity: .7, offset: .5 }, { opacity: 1 }]")
s=re.sub(r'transform:scaleX\(\.[0-9]+\)', 'transform:none',s)
s=s.replace("this.textPlayed = true;\n            this.runTextSequence(panel);","this.textPlayed = true; this.textStopped = false;\n            this.runTextSequence(panel);")
s=s.replace('this.textStopped = true;','this.textStopped = true;\n      if (this.dataset.motionLoop === \'true\') this.textPlayed = false;')
s=s.replace("if (this.ready) return;","if (this.ready) { this.setupTextSequence(); return; }")
s=s.replace("const pieces = node.textContent.split", "if (node.parentElement.closest('[data-glow]')) return;\n        const pieces = node.textContent.split")
s=s.replace("<a class=\"jh__life-item\" href=\"{{ block.settings.collection.url | default: life_url }}\"", "<a class=\"jh__life-item\" href=\"{% if block.settings.unavailable %}#JuneChapters-{{ section.id | split: '__' | first }}__june_other_chapters{% else %}{{ block.settings.collection.url | default: life_url }}{% endif %}\"")
s=s.replace('{{ block.settings.label | escape }}','{{ block.settings.label | escape }}{% if block.settings.unavailable %}<small>{{ block.settings.availability_note | escape }}</small>{% endif %}')
s=schema(s,lambda j:add(j,[{'type':'checkbox','id':'unavailable','label':'Show unavailable notice','default':False},text('availability_note','Availability notice','Currently unavailable')],'life_link'))
s=css(s,'''
.jh{scroll-margin-top:110px}.jh__life-item small{display:block;font-size:.75em;font-weight:400}.jh__life-item:has(small){align-items:center}
@media(max-width:749px){.jh .jh__panel[data-panel=undated] .jh__actions,.jh .jh__panel[data-panel=limited] .jh__actions{order:1;margin-top:16px}.jh .jh__copy{order:0}.jh .jh__panel[data-panel=undated] .jh__art,.jh .jh__panel[data-panel=limited] .jh__scene-image{order:2;height:260px;min-height:0;margin:12px -10px 0}.jh .jh__full-art,.jh .jh__full-art img{height:100%!important;object-fit:contain}.jh .jh__tab{min-height:68px;padding:8px 3px}.jh .jh__mystery{min-height:48px}.jh .jh__eyebrow{margin-bottom:12px!important}.jh .jh__subtitle{margin-top:12px!important}.jh .jh__body{margin-top:8px!important}.jh .jh__panel{padding-top:22px;padding-bottom:16px}}
''')
save(n,s);cfg('june_make_room')['heading_size_mobile']=54
blocks('june_make_room')['baby']['settings'].update(unavailable=True,availability_note='Currently unavailable')

n='june-your-year';s=read(n)
s=s.replace('<div class="ju__preview">','<div class="ju__preview">')
s=s.replace("<div data-picture=\"inside\">{{ inside | image_url: width: 900 | image_tag: widths: '300,600,900', sizes: '(min-width: 901px) 32vw, 90vw', loading: 'lazy', alt: inside.alt }}</div>","<div data-picture=\"inside\">{% render 'june-photo-viewer', image: inside, title: name, type_class: 'ju__body' %}</div>")
s=s.replace('<p class="ju__body">{{ product.price | money }}</p>','<p class="ju__body">{% if product.price_varies %}{{ \'june_audit.from\' | t }} {% endif %}{{ product.price | money }}</p>')
s=s.replace('<a class="ju__textlink" href="{{ product.url }}">{{ \'june_undated.explore_short\' | t }}',"{% if block.settings.comparison != blank %}<div class=\"ju__specs ju__body\">{{ block.settings.comparison | newline_to_br }}</div>{% endif %}<a class=\"ju__textlink\" href=\"{{ product.url }}\">{{ 'june_undated.explore_short' | t }}")
s=s.replace('</june-undated>',"<noscript><div class=\"ju__fallback ju__body\">{% for block in planners %}{% if block.settings.product != blank %}<a class=\"ju__textlink\" href=\"{{ block.settings.product.url }}\">{{ block.settings.short_name | default: block.settings.product.title | escape }}{{ arrow }}</a>{% endif %}{% endfor %}</div></noscript></june-undated>")
s=schema(s,lambda j:add(j,[{'type':'textarea','id':'comparison','label':'Verified comparison details'}],'planner'))
s=css(s,'''
.ju{scroll-margin-top:110px}.ju__cover-art{height:var(--ju-stage)}.ju__selected{display:none}.ju__caption{padding-bottom:16px}.ju__preview{height:180px}.ju__panel{padding-block:22px}.ju__specs{padding:12px 0;border-block:1px solid #1113}.ju__fallback{padding:20px;display:flex;flex-wrap:wrap;gap:20px}.ju__comparison article{align-content:start}.ju__comparison .ju__specs{grid-column:1/-1}
@media(max-width:900px){.ju__panel{display:grid;grid-template-columns:112px 1fr;gap:14px;padding:18px 20px}.ju__buy{grid-column:1/-1;grid-row:1;align-items:stretch;border-bottom:1px solid #1113;padding-bottom:14px}.ju__buy>.ju__subheading,.ju__buy>.ju__body{display:block!important}.ju__buy>.ju__subheading{font-size:var(--ju-subheading-mobile)}.ju__preview{height:130px}.ju__inside-copy .ju__body{font-size:var(--ju-body-mobile)}.ju__inside-copy .ju__label{font-size:var(--ju-label-mobile)}.ju__toggles{gap:12px;font-size:var(--ju-button-mobile)!important}.ju__toggles button{min-height:44px}.ju__status{display:none}.ju__thumbs{margin-bottom:16px}.ju__inside-copy h3{font-size:var(--ju-body-mobile)}.ju__header .ju__intro{position:static}.ju__header{align-items:end}.ju__heading{max-width:240px}.ju__comparison img{height:125px}}
''')
save(n,s);cfg('june_your_year').update(cover_height=300,mobile_height=240,inside_heading='See the layout',inside_body='Tap the spread to inspect it.')
for key,b in blocks('june_your_year').items():
    if b['type']=='planner':
        extra='Goals, routines, travel lists and quarterly check-ins.\n250+ stickers included.' if key!='planner2' else 'Monthly reflections, gratitude and de-stress colouring.\n200+ stickers included.'
        b['settings']['comparison']='19.5 x 23 x 3.2 cm\n286 sides | 100 GSM paper\nHardbound with wire binding and back pocket.\n'+extra

n='june-with-extras';s=read(n)
s=s.replace("alt: name }}</button>","alt: name }}<span class=\"jl__cover-name jl__button\">{{ name | escape }}</span></button>")
s=s.replace('<p class="jl__swipe jl__label">','<p class="jl__swipe jl__label"><span>{{ gifts }} {{ \'june_audit.extras\' | t }} &middot; </span>')
s=s.replace('<div class="jl__gifts-stage"',"<details class=\"jl__gift-summary jl__body\"><summary>{{ 'june_audit.included_list' | t }}</summary><ul>{% for i in (1..5) %}{% assign gift_key = 'gift_' | append: i %}{% if block.settings[gift_key] != blank %}<li>{{ block.settings[gift_key] | escape }}</li>{% endif %}{% endfor %}</ul></details><div class=\"jl__gifts-stage\"")
s=css(s,'''
.jl{scroll-margin-top:110px;display:flex!important;flex-direction:column}.jl__header{order:0}.jl__shopping{order:1}.jl__scenes{order:2}.jl__note{order:3}.jl__cover-name{display:block;font-size:.8em!important;line-height:1.25;margin-top:5px}.jl .jl__cover{height:auto;min-height:95px}.jl .jl__cover img{height:65px;width:100%;object-fit:contain}.jl__gift-summary{position:relative;z-index:4;max-width:360px;padding:10px 16px;background:var(--jl-bg);border:1px solid #1113;border-radius:10px}.jl__gift-summary summary{cursor:pointer;min-height:44px;display:flex;align-items:center}.jl__gift-summary ul{margin:0 0 10px;padding-left:20px}.jl__gift-summary li{margin:6px 0}.jl__shopping{border-bottom:1px solid #1113;padding-block:18px!important}.jl__scene .jl__gift-summary{margin:0 auto}.jl__gifts-stage{scrollbar-width:thin}.jl__gift small{opacity:1}
@media(min-width:901px){.jl__gift-summary{position:absolute;right:24px;top:16px}.jl__planner{max-height:350px}.jl__scene{min-height:400px}}
@media(max-width:900px){.jl__header{padding-bottom:16px}.jl__shopping{gap:14px!important}.jl__choose{order:0}.jl__product-heads{order:1}.jl__actions{order:2}.jl__planner{height:230px!important;margin-bottom:8px!important}.jl__scene:before{height:230px}.jl__gift-summary{margin:8px 20px!important}.jl__cover-name{font-size:var(--jl-label-mobile)!important}.jl__gift>img{height:130px}.jl__gift{min-height:0}.jl__gifts-stage{padding-block:18px!important}.jl__invitation{gap:12px}.jl__swipe{font-size:var(--jl-label-mobile)!important}}
''')
save(n,s);cfg('june_with_extras').update(scene_height=400,mobile_height=230,offer_note='Each cover has its own included extras. See the full list above.')
for k,b in blocks('june_with_extras').items():
    if b['type']=='planner' and k!='planner3':b['settings']['gift_image_2']=''
blocks('june_with_extras')['planner3']['settings']['gift_image_1']=''

n='june-next-chapter';s=read(n)
s=css(s,'''
.jn{scroll-margin-top:110px}.jn__paper-note:empty{display:none}
@media(max-width:749px){.jn__ticket{padding:22px!important}.jn__layout{gap:20px!important}.jn__paper{max-height:180px}.jn__signup{padding:20px!important}}
''');save(n,s)
cfg('june_next_chapter').update(padding=30,mobile_padding=22,paper_note='',list_label='2027 launch updates',consent='Join our email list for the 2027 planner launch and June Shop updates. Unsubscribe anytime.',success_body='You are subscribed. We will share planner launch news and June Shop updates by email.')

n='june-inside-discovery';s=read(n)
s=s.replace('data-panel="{{ number }}"','data-panel="{{ number }}" data-full-image="{{ page_image | image_url: width: 2400 }}"')
s=s.replace('<p class="ji__shown ji__body">','{% if product != blank %}<a class="ji__secondary ji__button-type" href="{{ product.url }}">{{ section.settings.product_link | escape }}{{ arrow }}</a>{% endif %}<p class="ji__shown ji__body">')
s=s.replace('<p class="ji__viewer-hint ji__body">','<button class="ji__button-type ji__zoom-button" type="button" data-zoom aria-pressed="false">{{ section.settings.zoom_label | escape }}</button><p class="ji__viewer-hint ji__body" hidden>')
s=s.replace("this.dialog.showModal();","this.dialog.showModal();this.updateZoom();")
s=s.replace("if(e.target.closest('[data-close]'))", "if(e.target.closest('[data-zoom]')){this.zoomed=!this.zoomed;this.updateZoom()}if(e.target.closest('[data-close]'))")
s=s.replace('target.src=source.src;',"target.src=this.panels[this.active].dataset.fullImage||source.src;target.onload=()=>this.updateZoom();")
s=s.replace(' syncViewer(){'," updateZoom(){const frame=this.querySelector('.ji__zoom-frame');frame.dataset.zoomed=String(!!this.zoomed);this.querySelector('[data-zoom]').setAttribute('aria-pressed',String(!!this.zoomed));requestAnimationFrame(()=>{this.querySelector('.ji__viewer-hint').hidden=frame.scrollWidth<=frame.clientWidth+1})}\n syncViewer(){")
s=schema(s,lambda j:add(j,[text('product_link','Shown product action','Shop the planner shown'),text('zoom_label','Zoom action','Zoom in / fit page')]))
s=css(s,'''
.ji{scroll-margin-top:110px}.ji .ji__shown{opacity:1;font-size:var(--ji-body-mobile)}.ji__zoom-button{min-height:44px;padding:8px 16px;border:1px solid currentColor;border-radius:999px;background:transparent;color:inherit}.ji__zoom-frame .ji__zoom{min-width:0!important;width:100%;height:auto}.ji__zoom-frame[data-zoomed=true] .ji__zoom{width:1600px;max-width:none;min-width:100%!important}.ji__viewer-hint[hidden]{display:none}.ji__controls{gap:12px}.ji__descriptions{min-height:0}
@media(max-width:900px){.ji__images{height:270px!important}.ji__header{padding-block:24px!important}.ji__controls{padding-top:16px!important}.ji__tabs{margin-bottom:8px}.ji .ji__shown{margin-top:6px}}
''');save(n,s)
cfg('june_inside_discovery').update(height=480,mobile_height=270,collection='limited-edition',all='Explore Limited Edition',viewer_hint='Swipe or scroll across the enlarged page.',shown='Shown: Dolce Far Niente, a Limited Edition undated planner.')
descs={'goals':'Give each goal its own space, then break it into smaller steps.','weekly':'Plan day-to-day to-dos and priorities, then note your wins and lessons.','habits':'Track habits alongside health and period notes through the month.','reflection':'Pause for monthly reflections and look back with the year-end review.'}
for k,v in descs.items():blocks('june_inside_discovery')[k]['settings']['description']=v

n='june-other-chapters';s=read(n)
s=s.replace("this.small=matchMedia('(max-height: 699px)')","this.small=matchMedia('(max-height: 699px), (max-width: 900px)')")
s=s.replace('if(!this.pinned||this.paused)return','if(!this.pinned)return')
s=s.replace('if(this.pinned&&!this.paused)','if(this.pinned)')
s=css(s,'''
.jc{scroll-margin-top:110px}.jc .jc__skip{position:absolute;top:10px;left:20px;clip:auto;clip-path:none;width:auto;height:auto;overflow:visible;z-index:8;padding:8px 12px;min-height:44px;background:var(--jc-current,var(--jc-bg));border:1px solid #1114;border-radius:999px}.jc .jc__pause{min-height:44px}.jc__copy{padding-top:65px}.jc .jc__note{opacity:1}
@media(max-width:900px){.jc[data-ready=true] .jc__stage{height:auto;min-height:660px}.jc[data-ready=true] .jc__scene{min-height:660px;padding-bottom:100px}.jc[data-ready=true] .jc__visual{flex:none;height:260px;min-height:0}.jc[data-ready=true] .jc__copy{padding:18px 20px}.jc__navigation{min-height:88px}.jc .jc__pause{font-size:var(--jc-button-mobile)}.jc__motion:has(.jc__hint[hidden]){display:none}.jc .jc__skip{top:8px;left:12px}}
''');save(n,s);cfg('june_other_chapters').update(step=220,height=600,pause='Pause effects',resume='Resume effects')
blocks('june_other_chapters')['rewritable']['settings'].update(note='Demonstration artwork varies by design. Marker and duster included.',body='<p>Plan your priorities on a <strong>reusable framed board.</strong> Write, wipe and start again.</p>')
blocks('june_other_chapters')['wedding']['settings']['body']='<p>Keep outfits, guest lists, appointments and <strong>your wedding budget</strong> in one place.</p>'

for n in ['june-shop-the-corner','june-find-your-glow','june-pick-your-pour']:
    s=read(n);block='pour' if n=='june-pick-your-pour' else 'piece'
    s=schema(s,lambda j:add(j,[text('specification','Verified product specification'),text('short_label','Short product type')],block))
    prefix={'june-shop-the-corner':'jcorner','june-find-your-glow':'jglow','june-pick-your-pour':'jp'}[n]
    if n=='june-shop-the-corner':
        s=s.replace("{{ image | image_url: width: 300 | image_tag: widths: '150,300', sizes: '100px', loading: 'lazy', alt: product.title }}","{% render 'june-photo-viewer', image: image, title: product.title, type_class: 'jcorner__body' %}")
        s=s.replace('<p class="jcorner__price', '<p class="jcorner__body jcorner__spec">{{ block.settings.specification | escape }}</p><p class="jcorner__price')
        s=s.replace("{{ number | plus: 1 | prepend: '0' }}</button>","{{ block.settings.short_label | default: block.settings.name | escape }}</button>")
        note='{% if section.settings.scene_note != blank %}<p class="jcorner__scene-note jcorner__body">{{ section.settings.scene_note | escape }}</p>{% endif %}'
        s=s.replace(note,'').replace(' </footer>',' </footer>').replace(' <div class="jcorner__details"',note+'\n <div class="jcorner__details"')
        s=css(s,'''
.jcorner{scroll-margin-top:110px}.jcorner>.jcorner__scene-note{grid-column:1;grid-row:4;font-size:var(--jcorner-body-mobile);padding:8px 24px;opacity:1}.jcorner__item{grid-template-columns:130px 1fr!important}.jcorner__item june-photo-viewer{height:150px}.jcorner__spec{margin:8px 0}.jcorner .jcorner__link{display:inline-flex;min-height:50px;padding:8px 10px 8px 18px;background:var(--jcorner-accent);border:1px solid #111;border-radius:999px;text-decoration:none;gap:12px}.jcorner .jcorner__step{width:auto;min-width:75px;padding:8px 14px;border-radius:999px}.jcorner__footer>.jcorner__primary{background:transparent;box-shadow:none;border:0;text-decoration:underline;justify-content:center}.jcorner__nav{gap:8px}
@media(max-width:1050px){.jcorner>.jcorner__scene-note{grid-row:auto;order:2;padding:8px 20px}.jcorner__details{order:3}.jcorner__footer{order:4}.jcorner__item{grid-template-columns:95px 1fr!important}.jcorner__item june-photo-viewer{height:125px}.jcorner__header{padding:22px 20px!important}.jcorner__details{padding:16px 20px!important}}
''')
    elif n=='june-find-your-glow':
        s=s.replace('</div><a class="jglow__primary', '</div><p class="jglow__spec jglow__body">{{ block.settings.specification | escape }}</p><a class="jglow__primary')
        s=css(s,'''
.jglow{scroll-margin-top:110px}.jglow__stage{min-height:0!important;height:390px!important;display:grid;grid-template-columns:1fr 1fr;gap:24px}.jglow__scenes{position:relative!important;inset:auto!important;grid-column:2;height:100%;width:100%!important}.jglow__header{position:relative!important;inset:auto!important;grid-column:1;grid-row:1;padding:50px 24px!important;max-width:none!important}.jglow__scene{height:100%;border:1px solid #fffbf133;border-radius:16px;overflow:hidden}.jglow__scene picture,.jglow__scene img{height:100%;width:100%;object-fit:cover!important;mask-image:none!important}.jglow__spec{margin:10px 0 16px!important}.jglow__choice{opacity:1!important}.jglow__choice img{object-fit:cover;object-position:50% 42%;border:1px solid #fffbf155}.jglow__dock{margin-top:20px!important}
@media(max-width:749px){.jglow__stage{height:auto!important;display:flex;flex-direction:column;gap:12px}.jglow__header{order:0;padding:26px 0 8px!important}.jglow__scenes{order:1;height:260px;width:100%}.jglow__scene img{object-fit:contain!important}.jglow__dock{margin-top:14px!important;padding:16px!important}.jglow__spec{font-size:var(--jglow-body-mobile)}}
''')
    else:
        s=s.replace('{{ block.settings.label | escape }}</button>', '{{ block.settings.label | escape }}{% if block.settings.short_label != blank %}<small>{{ block.settings.short_label | escape }}</small>{% endif %}</button>')
        s=s.replace('<p class="jp__price', '<p class="jp__body jp__spec">{{ block.settings.specification | escape }}</p><p class="jp__price')
        s=css(s,'''
.jp{scroll-margin-top:110px}.jp__choice small{display:block;font-size:.85em;font-weight:400;margin-top:4px}.jp__spec{margin-top:6px!important}.jp__dock{padding-block:20px!important}
@media(max-width:900px){.jp__header{padding-block:24px!important}.jp__scene,.jp__scenes{max-height:260px}.jp__scene img{object-fit:cover}.jp__dock{gap:16px!important}.jp__choice{min-height:58px}}
''')
    save(n,s)
specs={'vase':('Vase','Ceramic | 8 x 8 x 13 cm'),'birds':('Birds','Resin | 5 x 9 x 13 cm | One figurine'),'frame':('Frame','23.7 x 18.5 cm | Photo area 17.5 x 12.5 cm')}
for k,(label,spec) in specs.items():blocks('june_shop_the_corner')[k]['settings'].update(short_label=label,specification=spec)
for k,b in blocks('june_find_your_glow').items():
    if b['type']=='piece':b['settings']['specification']=('14 x 14 x 31 cm' if k=='lamp2' else '14 x 14 x 34.5 cm')+' | 2-pin plug | Yellow, white and off-white light'
cfg('june_find_your_glow')['body']='Three light colours. <strong>One easy cable switch.</strong>'
for k,label,spec in [('everyday','Tumbler','Glass | 7 x 7 x 9.5 cm'),('morning','Mug + lid','Borosilicate glass | Lid and spoon included'),('celebrate','Flute pair','Glass | 26 cm tall | Two glasses')]:blocks('june_pick_your_pour')[k]['settings'].update(short_label=label,specification=spec)
cfg('june_pick_your_pour').update(height=400,mobile_height=260,shop='Explore this piece',view='View product details')

n='june-layer-the-table';s=read(n)
s=s.replace('data-stacked="false"','data-stacked="false" data-initial="{{ section.settings.initial | minus: 1 }}"',1)
s=s.replace('if(this.choices.length>1)this.select(1);','this.select(Math.min(this.choices.length-1,Math.max(0,Number(this.dataset.initial)||0)));')
s=s.replace('<h3 class="jt__product-name',"<div class=\"jt__original\">{% render 'june-photo-viewer', image: product.featured_image, title: product.title, type_class: 'jt__body' %}</div><h3 class=\"jt__product-name")
s=schema(s,lambda j:add(j,[{'type':'range','id':'initial','label':'Initially selected piece','min':1,'max':3,'step':1,'default':2}]))
s=css(s,'''
.jt{scroll-margin-top:110px}.jt__original{width:105px;height:105px;float:right;margin:0 0 12px 12px}.jt__primary{clear:both}.jt__piece[aria-pressed=true]{filter:drop-shadow(0 0 3px var(--jt-accent)) drop-shadow(0 0 2px #111)}.jt__modes{transform:scale(.93);transform-origin:center}.jt .jt__hint{opacity:1}.jt__products{min-height:0}
@media(max-width:900px){.jt__stack{height:280px!important;max-width:340px;margin:auto}.jt__visual{padding-block:10px!important}.jt__layout{gap:12px!important}.jt__header{padding-top:24px!important}.jt__selection{padding-top:8px!important}.jt__choices{margin-bottom:12px}.jt__modes{margin-top:4px!important}.jt__original{width:85px;height:85px}}
''');save(n,s);cfg('june_layer_the_table').update(initial=2,hint='Pieces sold separately. Styled illustration; tap the product photo for details.',stacked_label='Stack together',open_label='See each piece')

n='june-a-little-curious';s=read(n)
s=s.replace('<a class="jmystery__primary',"<ul class=\"jmystery__tiers jmystery__body\">{% for variant in product.variants %}<li><a href=\"{{ product.url }}?variant={{ variant.id }}\"><strong>{{ variant.price | money }}</strong><span>{{ section.settings.value_label | escape }} {{ cart.currency.symbol }}{{ variant.title | escape }}+</span></a></li>{% endfor %}</ul><a class=\"jmystery__primary")
s=schema(s,lambda j:add(j,[text('value_label','Value tier label','Guaranteed value')]))
s=css(s,'''
.jmystery{scroll-margin-top:110px}.jmystery__tiers{list-style:none;padding:0;margin:16px 0}.jmystery__tiers li+li{border-top:1px solid #1113}.jmystery__tiers a{display:flex;flex-wrap:wrap;gap:5px 16px;justify-content:space-between;min-height:48px;align-items:center;text-decoration:underline;text-underline-offset:4px}.jmystery__tiers span{font-size:.9em}.jmystery__note{opacity:1!important}
@media(max-width:899px){.jmystery__art{height:210px!important}.jmystery__reveal{position:static!important;transform:none!important;width:auto!important;margin:12px 0;max-width:none}.jmystery__peek[open]{display:flex;flex-direction:column}.jmystery__peek summary{order:0}.jmystery__reveal{order:1}.jmystery__offer{margin-top:16px!important}}
''');save(n,s);cfg('june_a_little_curious').update(peek='How the surprise works',close='Close the details',offer_heading='Choose your box value.',reveal_heading='Your value, guaranteed.',reveal_body='<p>A curated mix from our lifestyle, home, gifting and stationery collections. The combined value meets or exceeds your chosen tier.</p><p>There are no product previews or custom selections. Multiple boxes may contain overlapping products.</p>',note='Contents vary and cannot be customised. Pieces are revealed on delivery.')

n='june-footer';s=read(n)
s=s.replace('<p class="jfooter__note', '<p class="jfooter__note')
s=s.replace('{{ section.settings.signup_note | escape }}</p>',"{{ section.settings.signup_note | escape }} <a href=\"{{ shop.privacy_policy.url }}\">{{ section.settings.privacy | escape }}</a></p>")
s=s.replace('<select name="country_code"', '<label class="jfooter__country-label">{{ section.settings.country_label | escape }}<select name="country_code"')
if '<label class="jfooter__country-label">' in s:
    start=s.index('<label class="jfooter__country-label">');end=s.index('</select>',start)+len('</select>');s=s[:end]+'</label>'+s[end:]
s=css(s,'''
.jfooter{scroll-margin-top:100px}.jfooter__country-label{display:grid;gap:5px;font-size:inherit}.jfooter__localization{align-items:end}.jfooter__localization button{min-height:44px}.jfooter__brand{padding-block:26px}.jfooter__bottom{gap:16px}.jfooter__payments{margin-top:14px}.jfooter__note a{text-decoration:underline}.jfooter .jfooter__note,.jfooter__bottom{font-size:var(--jfooter-body-mobile)!important}
@media(max-width:749px){.jfooter__brand{padding-block:20px}.jfooter__bottom{gap:12px}.jfooter__localization{width:100%}}
''');save(n,s)
group_path=THEME/'sections/footer-group.json';group=json.loads(re.sub(r'/\*.*?\*/','',clean(group_path.read_text(encoding='utf-8')),flags=re.S))
for v in group['sections'].values():
    if v['type']=='june-footer':v['settings'].update(signup_heading='New finds & June Shop news',signup_note='Join our email list for new arrivals and June Shop updates. Unsubscribe anytime.',country_label='Deliver to',update='Apply')
group_path.write_text(json.dumps(group,ensure_ascii=True,indent=2),encoding='utf-8')

for v in idx['sections'].values():
    if not v['type'].startswith('june-'):continue
    for b in v.get('blocks',{}).values():
        if b['type']=='typography':
            if 'heading_tracking' in b['settings']:b['settings']['heading_tracking']=-2
            if 'heading_spacing' in b['settings']:b['settings']['heading_spacing']=-2
(THEME/'templates/index.json').write_text(json.dumps(idx,ensure_ascii=True,indent=2),encoding='utf-8')
print('Updated all 12 section sources and their configured settings.')
