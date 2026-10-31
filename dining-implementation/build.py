from pathlib import Path
import json,re
p=Path(__file__).parent
source=(p/'before.liquid').read_text(encoding='utf-8')
prefix=source[:source.index('{% capture arrow %}')]
schema=json.loads(source.split('{% schema %}')[1].split('{% endschema %}')[0])
def setting(t,id,label,**kw):return dict(type=t,id=id,label=label,**kw)
def range_(id,label,default):return setting('range',id,label,min=0,max=100,step=1,unit='%',default=default)
schema['settings'] += [dict(type='header',content='Photographic scenes'),setting('image_picker','scene_image','First scene image'),setting('image_picker','scene_mobile','First scene mobile image'),setting('checkbox','autoplay','Auto-slide scenes',default=True),setting('range','interval','Seconds between scenes',min=3,max=10,step=1,unit='s',default=4),setting('text','scene_hint','Scene instruction',default='Tap a piece. Make it yours.'),setting('color','scene_ink','Mobile heading colour',default='#ffffff'),setting('range','scene_shade','Mobile heading shading',min=0,max=80,step=5,unit='%',default=55)]
piece=next(b for b in schema['blocks'] if b['type']=='piece')
piece['name']='First scene product'
piece['settings'] += [dict(type='paragraph',content='Enable custom positions when replacing the first scene photograph. Mobile artwork must show the same products.'),setting('checkbox','custom_position','Use custom hotspot position',default=False),range_('x','Horizontal position',50),range_('y','Vertical position',50),range_('mx','Mobile horizontal position',50),range_('my','Mobile vertical position',50)]
scene={'type':'scene','name':'Table scene','limit':8,'settings':[setting('text','title','Scene name',default='Table scene'),setting('image_picker','image','Desktop scene image'),setting('image_picker','mobile','Mobile scene image'),dict(type='paragraph',content='Add the exact products visible in this photograph. Position each hotspot separately on desktop and mobile. Scenes without an image and at least one product stay hidden.'),setting('range','initial','Starting product',min=1,max=3,step=1,default=1)]}
for i in range(1,4):
 scene['settings'] += [dict(type='header',content=f'Product {i}'),setting('product',f'product_{i}','Product'),setting('text',f'label_{i}','Short hotspot label'),range_(f'x_{i}','Horizontal position',20+i*15),range_(f'y_{i}','Vertical position',25+i*15),range_(f'mx_{i}','Mobile horizontal position',20+i*15),range_(f'my_{i}','Mobile vertical position',25+i*15)]
schema['blocks'].append(scene)
markup=r'''
{% assign scenes = section.blocks | where: 'type', 'scene' %}
{% assign fallback = pieces[1].settings.product %}
{% assign base_image = section.settings.scene_image | default: fallback.featured_image %}
<june-dining-scene id="JuneTable-{{ section.id }}" class="jds" data-autoplay="{{ section.settings.autoplay }}" data-interval="{{ section.settings.interval | default: 4 | times: 1000 }}" data-editor="{{ request.design_mode }}" style="--jd-white:{{ section.settings.scene_ink }};--jd-shade:{{ section.settings.scene_shade | divided_by: 100.0 }}">
{% assign visible_count = 0 %}
{% for scene_index in (0..scenes.size) %}
 {% assign valid = false %}
 {% if scene_index == 0 %}
  {% assign scene_image = base_image %}{% assign mobile_image = section.settings.scene_mobile %}{% assign initial = section.settings.initial | minus: 1 %}{% assign scene_title = 'The table edit' %}{% assign scene_id = 'base' %}
  {% if count > 0 and scene_image != blank %}{% assign valid = true %}{% endif %}
 {% else %}
  {% assign block_index = scene_index | minus: 1 %}{% assign scene = scenes[block_index] %}{% assign scene_image = scene.settings.image %}{% assign mobile_image = scene.settings.mobile %}{% assign initial = scene.settings.initial | minus: 1 %}{% assign scene_title = scene.settings.title %}{% assign scene_id = scene.id %}
  {% if scene_image != blank %}{% if scene.settings.product_1 != blank or scene.settings.product_2 != blank or scene.settings.product_3 != blank %}{% assign valid = true %}{% endif %}{% endif %}
 {% endif %}
 {% if valid %}
 <article class="jds__stage" data-scene data-initial="{{ initial }}" data-block="{{ scene_id }}" data-title="{{ scene_title | escape }}" aria-label="{{ scene_title | escape }}" {% if visible_count > 0 %}hidden{% endif %} {% if scene_index > 0 %}{{ scene.shopify_attributes }}{% endif %}>
  <header class="jds__header"><p class="jds__eyebrow">{{ section.settings.eyebrow | escape }}</p><h2 class="jds__heading">{{ section.settings.heading | escape | replace: '. ', '.<br>' }}</h2><div class="jds__intro">{{ section.settings.body }}</div></header>
  <div class="jds__photo">
   <picture>{% if mobile_image != blank %}<source media="(max-width:700px)" srcset="{{ mobile_image | image_url: width: 900 }}">{% endif %}{{ scene_image | image_url: width: 1800 | image_tag: widths: '500,900,1400,1800', sizes: '(max-width:700px) 100vw, 56vw', loading: 'lazy', class: 'jds__image' }}</picture>
   <span class="jds__cue">{{ section.settings.scene_hint | escape }}</span>
   {% for n in (1..3) %}
    {% assign pi = n | minus: 1 %}
    {% if scene_index == 0 %}
     {% assign piece = pieces[pi] %}{% assign product = piece.settings.product %}{% assign label = piece.settings.label %}
     {% case n %}{% when 1 %}{% assign dx = 18 %}{% assign dy = 88 %}{% assign dmy = 88 %}{% when 2 %}{% assign dx = 47 %}{% assign dy = 50 %}{% assign dmy = 50 %}{% when 3 %}{% assign dx = 22 %}{% assign dy = 26 %}{% assign dmy = 33 %}{% endcase %}
     {% assign x = dx %}{% assign y = dy %}{% assign mx = dx %}{% assign my = dmy %}{% if piece.settings.custom_position %}{% assign x = piece.settings.x %}{% assign y = piece.settings.y %}{% assign mx = piece.settings.mx %}{% assign my = piece.settings.my %}{% endif %}
    {% else %}
     {% assign key = 'product_' | append: n %}{% assign product = scene.settings[key] %}{% assign key = 'label_' | append: n %}{% assign label = scene.settings[key] | default: product.title %}
     {% assign key = 'x_' | append: n %}{% assign x = scene.settings[key] %}{% assign key = 'y_' | append: n %}{% assign y = scene.settings[key] %}{% assign key = 'mx_' | append: n %}{% assign mx = scene.settings[key] %}{% assign key = 'my_' | append: n %}{% assign my = scene.settings[key] %}
    {% endif %}
    {% if product != blank %}<button type="button" class="jds__spot" data-product-select="{{ pi }}" style="--x:{{ x }}%;--y:{{ y }}%;--mx:{{ mx }}%;--my:{{ my }}%" aria-label="{{ label | escape }}" aria-controls="DiningProduct-{{ section.id }}-{{ scene_index }}-{{ pi }}" aria-pressed="false" {% if scene_index == 0 %}data-piece-block="{{ piece.id }}" {{ piece.shopify_attributes }}{% endif %}><span aria-hidden="true">+</span><span class="jds__label">{{ label | escape }}</span></button>{% endif %}
   {% endfor %}
  </div>
  <div class="jds__buying" aria-live="off">
  {% for n in (1..3) %}{% assign pi = n | minus: 1 %}
   {% if scene_index == 0 %}{% assign piece = pieces[pi] %}{% assign product = piece.settings.product %}{% assign product_name = piece.settings.name | default: product.title %}
   {% else %}{% assign key = 'product_' | append: n %}{% assign product = scene.settings[key] %}{% assign product_name = product.title %}{% endif %}
   {% if product != blank %}<div class="jds__product" data-product="{{ pi }}" id="DiningProduct-{{ section.id }}-{{ scene_index }}-{{ pi }}" {% unless pi == initial %}hidden{% endunless %}>
    <h3>{{ product_name | escape }}</h3><p class="jds__price">{% if product.price_varies %}<small>From </small>{% endif %}{% render 'june-price', amount: product.price %}</p>
    <a class="jds__buy" href="{{ product.url }}">{{ section.settings.shop | escape }}<span class="jds__arrow" aria-hidden="true">→</span></a><p class="jds__note">{% unless product.available %}Sold out. {% endunless %}Sold separately.</p>
   </div>{% endif %}
  {% endfor %}
  </div>
 </article>{% assign visible_count = visible_count | plus: 1 %}
 {% endif %}
{% endfor %}
{% if visible_count == 0 and request.design_mode %}<p>Add an image and products to a Table scene block.</p>{% endif %}
<div class="jds__footer">{% if section.settings.collection != blank %}<a class="jds__all" href="{{ section.settings.collection.url }}">{{ section.settings.all | escape }} ↗</a>{% endif %}
{% if visible_count > 1 %}<div class="jds__controls" role="group" aria-label="Table scenes"><button type="button" data-prev aria-label="Previous scene">←</button><span data-count>1 / {{ visible_count }}</span><button type="button" data-next aria-label="Next scene">→</button><button type="button" data-play aria-label="Play slideshow">Play</button></div>{% endif %}</div>
</june-dining-scene>
'''
(p/'june-layer-the-table.liquid').write_text(prefix+markup+'\n{% stylesheet %}\n'+(p/'scene.css').read_text(encoding='utf-8')+'\n{% endstylesheet %}\n{% javascript %}\n'+(p/'scene.js').read_text(encoding='utf-8')+'\n{% endjavascript %}\n{% schema %}\n'+json.dumps(schema,indent=2)+'\n{% endschema %}\n',encoding='utf-8')
