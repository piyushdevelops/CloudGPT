from pathlib import Path
import json
root=Path('/home/codespace/june-shop-redesign/section-01')
p=root/'theme/sections/june-make-room.liquid';s=p.read_text();a,b=s.split('{% schema %}');r,e=b.split('{% endschema %}');d=json.loads(r)
start=next(i for i,x in enumerate(d['settings']) if x.get('content')=='Typography · Font families')
new=d['settings'][start:];keep=[x for x in new if x.get('id') in ['title_font','heading_size','heading_size_mobile']]
block=[x for x in new if x not in keep]
for x in block:
 if x.get('id','').endswith('_leading'):x['max']=190
 if 'id' in x:a=a.replace('section.settings.'+x['id'],'typography.'+x['id'])
d['settings']=d['settings'][:start]+[{'type':'header','content':'Typography · Display font'}]+keep
d['max_blocks']=4;d['blocks'][0]['limit']=3;d['blocks'].append({'type':'typography','name':'Typography controls','limit':1,'settings':block});d['presets'][0]['blocks'].insert(0,{'type':'typography'})
a=a.replace("  assign title_font =", "  assign typography_block = section.blocks | where: 'type', 'typography' | first\n  assign typography = typography_block.settings\n  assign title_font =",1)
a=a.replace('{% for block in section.blocks %}','{% for block in section.blocks %}\n          {% if block.type == \'life_link\' %}').replace('        {% endfor %}','          {% endif %}\n        {% endfor %}')
a=a.replace('<div class="jh__stage">','<div class="jh__stage" {{ typography_block.shopify_attributes }}>')
p.write_text(a+'{% schema %}\n'+json.dumps(d,indent=2)+'\n{% endschema %}'+e)
p=root/'before/index-before-typography.json';s=p.read_text();prefix=s[:s.index('{')];d=json.loads(s[s.index('{'):]);sec=d['sections']['june_make_room'];sec['blocks']['typography']={'type':'typography','settings':{}};sec['block_order'].insert(0,'typography');(root/'theme/templates/index.json').write_text(prefix+json.dumps(d,indent=2))
