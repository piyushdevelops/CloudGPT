import json,pathlib
root=pathlib.Path('/home/codespace/june-shop-redesign/section-02/theme')
roles={'heading':(62,40,900,-4,105),'subheading':(26,21,600,-2,120),'body':(16,14,400,-1,150),'label':(11,10,500,12,150),'button':(14,13,600,-1,130)}
settings=[{'type':'font_picker','id':'font','label':'Font family','default':'poppins_n4'}]
styles=''
fonts=''
for role,(d,m,w,t,l) in roles.items():
 settings.append({'type':'header','content':role.title()})
 for k,label,mi,ma,step,default in [('size','Desktop size',10,100,1,d),('mobile','Mobile size',10,70,1,m),('weight','Thickness',100,900,100,w),('tracking','Letter spacing (hundredths em)',-6,20,1,t),('leading','Line spacing (%)',90,180,5,l)]:
  settings.append({'type':'range','id':role+'_'+k,'label':label,'min':mi,'max':ma,'step':step,'default':default})
 styles+=f"--ju-{role}-size: {{{{ type.{role}_size | default: {d} }}}}px; --ju-{role}-mobile: {{{{ type.{role}_mobile | default: {m} }}}}px; --ju-{role}-weight: {{{{ type.{role}_weight | default: {w} }}}}; --ju-{role}-tracking: {{{{ type.{role}_tracking | default: {t} | divided_by: 100.0 }}}}em; --ju-{role}-leading: {{{{ type.{role}_leading | default: {l} | divided_by: 100.0 }}}};\n"
 fonts+=f"{{% assign weight = type.{role}_weight | default: {w} | append: '' %}}{{% assign variant = font | font_modify: 'weight', weight %}}{{{{ variant | font_face: font_display: 'swap' }}}}\n"
schema={'name':'June · Your year','tag':'section','class':'june-undated-section','settings':[
 {'type':'text','id':'eyebrow','label':'Eyebrow','default':'Undated yearly planners'},
 {'type':'text','id':'heading','label':'Heading','default':'Your year. Your rules.'},
 {'type':'text','id':'intro','label':'Supporting line','default':'Three covers. One place to begin.'},
 {'type':'collection','id':'collection','label':'Undated collection'},
 {'type':'text','id':'inside_heading','label':'Inside heading','default':'Space for your kind of day.'},
 {'type':'text','id':'inside_body','label':'Inside description','default':'Explore the layout before you choose.'},
 {'type':'color','id':'background','label':'Background','default':'#FFFBF1'},
 {'type':'color','id':'ink','label':'Text','default':'#111111'},
 {'type':'color','id':'accent','label':'Button accent','default':'#FFB790'},
 {'type':'range','id':'cover_height','label':'Desktop cover stage height','min':280,'max':520,'step':10,'default':390},
 {'type':'range','id':'mobile_height','label':'Mobile cover stage height','min':220,'max':380,'step':10,'default':280},
 {'type':'checkbox','id':'motion','label':'Animate selection and buttons','default':True},
 {'type':'range','id':'speed','label':'Animation speed (%)','min':50,'max':200,'step':10,'default':100}],
 'blocks':[{'type':'planner','name':'Planner','limit':3,'settings':[
 {'type':'product','id':'product','label':'Product'},
 {'type':'text','id':'short_name','label':'Short display name'},
 {'type':'image_picker','id':'cover','label':'Cover image override'},
 {'type':'image_picker','id':'inside','label':'Inside image override'},
 {'type':'range','id':'inside_number','label':'Interior product image number','min':1,'max':40,'step':1,'default':10}]},
 {'type':'typography','name':'Typography controls','limit':1,'settings':settings}],
 'presets':[{'name':'June · Your year','blocks':[{'type':'planner'},{'type':'planner'},{'type':'planner'},{'type':'typography'}]}]}
head='''{% liquid
 assign type_block = section.blocks | where: 'type', 'typography' | first
 assign type = type_block.settings
 assign font = type.font | default: section.settings.fallback_font
 assign planners = section.blocks | where: 'type', 'planner'
 assign count = 0
 for block in planners
  if block.settings.product != blank
   assign count = count | plus: 1
  endif
 endfor
 assign selected = 1
 if count > 1
  assign selected = 2
 endif
%}
{% style %}
'''+fonts+'''
#JuneUndated-{{ section.id }} {
 --ju-bg: {{ section.settings.background }}; --ju-ink: {{ section.settings.ink }}; --ju-accent: {{ section.settings.accent }};
 --ju-font: {{ font.family | default: 'Poppins' }}, {{ font.fallback_families | default: 'sans-serif' }};
 --ju-stage: {{ section.settings.cover_height }}px; --ju-mobile-stage: {{ section.settings.mobile_height }}px;
 --ju-duration: {{ 36000 | divided_by: section.settings.speed }}ms;
'''+styles+'''}
{% endstyle %}
{% capture arrow %}<span class="ju__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>{% endcapture %}
{% if count > 0 %}
<june-undated id="JuneUndated-{{ section.id }}" class="ju" data-motion="{{ section.settings.motion }}" data-initial="{{ selected | minus: 1 }}" aria-labelledby="JuneUndatedHeading-{{ section.id }}">
 <header class="ju__header">
  <div><p class="ju__label">{{ section.settings.eyebrow | escape }}</p><h2 id="JuneUndatedHeading-{{ section.id }}" class="ju__heading">{{ section.settings.heading | escape }}</h2></div>
  <div class="ju__intro"><p class="ju__body">{{ section.settings.intro | escape }}</p><a class="ju__textlink" href="{{ section.settings.collection.url | default: routes.all_products_collection_url }}"><span class="ju__desktop-label">{{ 'june_undated.view_all' | t }}</span><span class="ju__mobile-label">{{ 'june_undated.view_all_short' | t }}</span>{{ arrow }}</a></div>
 </header>
 <div class="ju__showcase">
  <div class="ju__track" role="group" aria-label="{{ 'june_undated.choose' | t | escape }}">
  {% assign number = 0 %}
  {% for block in planners %}
   {% assign product = block.settings.product %}
   {% if product != blank %}
    {% liquid
     assign number = number | plus: 1
     assign name = block.settings.short_name | default: product.title
     assign cover = block.settings.cover | default: product.featured_image
    %}
    <button type="button" class="ju__cover{% if number == selected %} is-selected{% endif %}" data-select="{{ number | minus: 1 }}" aria-pressed="{% if number == selected %}true{% else %}false{% endif %}" aria-label="{{ name | escape }}" {{ block.shopify_attributes }}>
     <span class="ju__cover-art">{{ cover | image_url: width: 1000 | image_tag: widths: '300,500,750,1000', sizes: '(min-width: 750px) 30vw, 75vw', loading: 'lazy', alt: name }}</span>
     <span class="ju__caption"><span class="ju__number">0{{ number }}</span><span class="ju__name">{{ name | escape }}</span><span class="ju__selected">{{ 'june_undated.selected' | t }}</span></span>
    </button>
   {% endif %}
  {% endfor %}
  </div>
  {% if count > 1 %}<button class="ju__step ju__prev" type="button" data-step="-1" aria-label="{{ 'june_undated.previous' | t | escape }}">{{ arrow }}</button><button class="ju__step ju__next" type="button" data-step="1" aria-label="{{ 'june_undated.next' | t | escape }}">{{ arrow }}</button>{% endif %}
 </div>
 <div class="ju__thumbs" aria-label="{{ 'june_undated.choose' | t | escape }}">
 {% assign number = 0 %}{% for block in planners %}{% if block.settings.product != blank %}
 {% assign name = block.settings.short_name | default: block.settings.product.title %}{% assign cover = block.settings.cover | default: block.settings.product.featured_image %}
 <button type="button" data-select="{{ number }}" aria-label="{{ name | escape }}" aria-pressed="{% if number == selected | minus: 1 %}true{% else %}false{% endif %}">{{ cover | image_url: width: 140 | image_tag: loading: 'lazy', alt: name }}</button>{% assign number = number | plus: 1 %}
 {% endif %}{% endfor %}</div>
 <p class="ju__status ju__body" aria-live="polite" aria-atomic="true"></p>
 <div class="ju__details">
 {% assign number = 0 %}{% for block in planners %}{% assign product = block.settings.product %}{% if product != blank %}
 {% liquid
  assign number = number | plus: 1
  assign name = block.settings.short_name | default: product.title
  assign cover = block.settings.cover | default: product.featured_image
  assign inside_index = block.settings.inside_number | minus: 1
  assign inside = block.settings.inside | default: product.images[inside_index] | default: cover
 %}
 <div class="ju__panel" data-panel="{{ number | minus: 1 }}" data-name="{{ name | escape }}" {% unless number == selected %}hidden{% endunless %}>
  <div class="ju__preview">
   <div data-picture="cover" hidden>{{ cover | image_url: width: 800 | image_tag: widths: '300,500,800', sizes: '(min-width: 750px) 30vw, 45vw', loading: 'lazy', alt: name }}</div>
   <div data-picture="inside">{{ inside | image_url: width: 900 | image_tag: widths: '300,600,900', sizes: '(min-width: 750px) 30vw, 45vw', loading: 'lazy', alt: inside.alt }}</div>
  </div>
  <div class="ju__inside-copy"><p class="ju__label">{{ 'june_undated.look_inside' | t }}</p><h3 class="ju__subheading">{{ section.settings.inside_heading | escape }}</h3><p class="ju__body">{{ section.settings.inside_body | escape }}</p>
   <div class="ju__toggles"><button type="button" data-view="cover" aria-pressed="false">{{ 'june_undated.cover' | t }}</button><button type="button" data-view="inside" aria-pressed="true">{{ 'june_undated.inside' | t }}</button></div>
  </div>
  <div class="ju__buy"><h3 class="ju__subheading">{{ name | escape }}</h3><p class="ju__body">{{ product.price | money }}</p><a class="ju__primary" href="{{ product.url }}">{{ 'june_undated.explore' | t }}{{ arrow }}</a><button type="button" class="ju__textlink" data-compare>{{ 'june_undated.compare' | t }}{{ arrow }}</button></div>
 </div>
 {% endif %}{% endfor %}
 </div>
 <dialog class="ju__dialog" aria-labelledby="JuneCompare-{{ section.id }}"><div class="ju__dialog-head"><h3 id="JuneCompare-{{ section.id }}" class="ju__subheading">{{ 'june_undated.compare' | t }}</h3><button class="ju__close" type="button" data-close aria-label="{{ 'june_undated.close' | t | escape }}">×</button></div><div class="ju__comparison">
 {% for block in planners %}{% assign product = block.settings.product %}{% if product != blank %}{% assign cover = block.settings.cover | default: product.featured_image %}<article>{{ cover | image_url: width: 400 | image_tag: loading: 'lazy', alt: product.title }}<h4 class="ju__body">{{ block.settings.short_name | default: product.title | escape }}</h4><p class="ju__body">{{ product.price | money }}</p><p class="ju__body">{% if product.available %}{{ 'june_undated.available' | t }}{% else %}{{ 'june_undated.sold_out' | t }}{% endif %}</p><a class="ju__textlink" href="{{ product.url }}">{{ 'june_undated.explore_short' | t }}{{ arrow }}</a></article>{% endif %}{% endfor %}
 </div></dialog>
</june-undated>
{% endif %}
'''
head=head.replace("{% if number == selected | minus: 1 %}","{% assign selected_index = selected | minus: 1 %}{% if number == selected_index %}")
(root/'sections/june-your-year.liquid').write_text(head)
(root/'sections/june-your-year.liquid').open('a').write('\n{% schema %}\n'+json.dumps(schema,indent=2)+'\n{% endschema %}\n')
loc=root/'locales/en.default.json';s=loc.read_text();d=json.loads(s[s.index('{'):]);d['june_undated']={'view_all':'View all undated planners','view_all_short':'View all','choose':'Choose a planner','selected':'Selected','previous':'Previous planner','next':'Next planner','look_inside':'A look inside','cover':'Cover','inside':'Inside pages','explore':'Explore this planner','compare':'Compare the three','close':'Close comparison','available':'Available','sold_out':'Sold out','explore_short':'Explore'};loc.write_text(json.dumps(d,indent=2))
p=root/'templates/index.json';s=p.read_text();d=json.loads(s[s.index('{'):]);products=json.loads((root.parent/'products.json').read_text());blocks={}
for i,(prod,name,idx) in enumerate(zip(products,['Too creative for 9 to 5','Too glam to give a damn','On a mission'],[10,10,8])):blocks['planner'+str(i)]={'type':'planner','settings':{'product':prod['handle'],'short_name':name,'inside_number':idx}}
blocks['typography']={'type':'typography','settings':{'font':'poppins_n4'}}
d['sections']['june_your_year']={'type':'june-your-year','blocks':blocks,'block_order':list(blocks),'settings':{'collection':'undated-yearly-planners','accent':'#FFB790','background':'#FFFBF1'}}
if 'june_your_year' not in d['order']:d['order'].insert(d['order'].index('june_make_room')+1,'june_your_year')
p.write_text(json.dumps(d,indent=2))
