import json,pathlib
p=pathlib.Path(__file__).parent
s=json.loads((p/'before.json').read_text(encoding='utf8'))['files']['nodes'][0]['body']['content']
s=s.replace('class="ju"','class="ju ju--type-preview"')
old='<p class="ju__body">{% if product.price_varies %}{{ \'june_audit.from\' | t }} {% endif %}{{ product.price | money }}</p>'
new='<p class="ju__price">{% if product.price_varies %}<span class="ju__price-prefix">{{ \'june_audit.from\' | t }}</span> {% endif %}<span class="ju__price-amount">{{ product.price | money }}</span></p>'
assert s.count(old)==2
s=s.replace(old,new)
style=''
for role in ['price','small']:
 style+="{% assign chosen = section.settings."+role+"_font %}{% assign requested = section.settings."+role+"_weight | append: '' %}{% assign face = chosen | font_modify: 'weight', requested | default: chosen %}{{ face | font_face: font_display: 'swap' }}\n"
 style+="#JuneUndated-{{ section.id }}{--preview-"+role+"-font:{{ chosen.family }},{{ chosen.fallback_families }};--preview-"+role+"-weight:{{ section.settings."+role+"_weight }};--preview-"+role+"-size:{{ section.settings."+role+"_size }}px;--preview-"+role+"-mobile:{{ section.settings."+role+"_mobile }}px;--preview-"+role+"-tracking:{{ section.settings."+role+"_tracking | divided_by: 100.0 }}em;--preview-"+role+"-leading:{{ section.settings."+role+"_leading | divided_by: 100.0 }};}\n"
s=s.replace('{% endstyle %}',style+'{% endstyle %}',1) if False else s
# Typography must load regardless of whether master palette is enabled.
pos=s.index('{% capture arrow %}')
s=s[:pos]+'{% style %}\n'+style+'{% endstyle %}\n'+s[pos:]
s=s.replace('{% endstylesheet %}',(p/'preview.css').read_text(encoding='utf8')+'\n{% endstylesheet %}')
schema=json.loads(s.split('{% schema %}')[1].split('{% endschema %}')[0])
for role,font,weight,size,mobile in [('price','archivo_black_n4',400,34,30),('small','poppins_n7',700,15,14)]:
 schema['settings'] += [
 {'type':'header','content':('Price' if role=='price' else 'Small text')+' — approval preview'},
 {'type':'font_picker','id':role+'_font','label':'Font family','default':font},
 {'type':'range','id':role+'_weight','label':'Font weight','min':100,'max':900,'step':100,'default':weight},
 {'type':'range','id':role+'_size','label':'Desktop size','min':12,'max':48,'step':1,'unit':'px','default':size},
 {'type':'range','id':role+'_mobile','label':'Mobile size','min':12,'max':40,'step':1,'unit':'px','default':mobile},
 {'type':'range','id':role+'_tracking','label':'Letter spacing / 100 em','min':-5,'max':10,'step':1,'default':-2 if role=='price' else -1},
 {'type':'range','id':role+'_leading','label':'Line height / 100','min':100,'max':180,'step':5,'default':110 if role=='price' else 140}]
s=s.split('{% schema %}')[0]+'{% schema %}\n'+json.dumps(schema,indent=2,ensure_ascii=False)+'\n{% endschema %}\n'
(p/'june-your-year.liquid').write_text(s,encoding='utf8')
