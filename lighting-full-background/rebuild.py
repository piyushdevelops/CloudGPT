import json,re,pathlib
root=pathlib.Path(__file__).parent
p=root/'theme/sections/june-find-your-glow.liquid'
snap=json.loads((root/'before.json').read_text(encoding='utf-8-sig'))
s=next(x['body']['content'] for x in snap if x['filename']=='sections/june-find-your-glow.liquid')
old=s[s.index('{% stylesheet %}'):s.index('{% endstylesheet %}')+len('{% endstylesheet %}')]
roles='\n'.join(re.findall(r'\.jglow \.jglow__(?:heading|title|body|button-type)\{[^}]+\}',old)[:4])
css=(root/'layout.css').read_text()
s=s.replace(old,'{% stylesheet %}\n'+roles+'\n'+css+'\n{% endstylesheet %}')
s=s.replace('block.settings.image | default: block.settings.scene | default: block.settings.product.featured_image','block.settings.image | default: block.settings.product.featured_image')
s=s.replace('data-scene="{{ number }}"','style="--jglow-art-scale:{{ 100.0 | divided_by: 100.0 | times: 100 | divided_by: 100 }};--jglow-crop:{{ block.settings.crop_bottom | default: 0 | divided_by: 100.0 }}" data-scene="{{ number }}"')
s=s.replace('--jglow-art-scale:{{ 100.0 | divided_by: 100.0 | times: 100 | divided_by: 100 }};','')
s=s.replace('<p class="jglow__spec jglow__body">{{ block.settings.specification | escape }}</p>','{% if block.settings.specification != blank %}<details class="jglow__spec jglow__body"><summary>Details</summary><p>{{ block.settings.specification | escape }}</p></details>{% endif %}')
schema=json.loads(s.split('{% schema %}')[1].split('{% endschema %}')[0])
piece=next(b for b in schema['blocks'] if b['type']=='piece')
piece['settings'].append({'type':'range','id':'crop_bottom','label':'Crop artwork bottom','info':'Hide a panel or unwanted area baked into the scene image. Applies to this lamp’s background.','min':0,'max':40,'step':1,'unit':'%','default':0})
s=s[:s.index('{% schema %}')]+ '{% schema %}\n'+json.dumps(schema,indent=2,ensure_ascii=False)+'\n{% endschema %}\n'
p.write_text(s,encoding='utf-8')
snap=json.loads((root/'before.json').read_text(encoding='utf-8-sig'))
raw=next(x['body']['content'] for x in snap if x['filename']=='templates/index.json')
idx=json.loads(raw[raw.index('{'):])
sec=next(x for x in idx['sections'].values() if x['type']=='june-find-your-glow')
sec['blocks']['lamp0']['settings']['crop_bottom']=30
(root/'theme/templates').mkdir(exist_ok=True)
(root/'theme/templates/index.json').write_text(json.dumps(idx,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
