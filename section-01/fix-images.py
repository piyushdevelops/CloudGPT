import pathlib,json
p=pathlib.Path(__file__).parent/'theme';f=p/'sections/june-make-room.liquid';s=f.read_text();code,sch=s.split('{% schema %}');schema=json.loads(sch.split('{% endschema %}')[0]);aliases={'cover_left':'left_image','cover_right':'right_image','inside_image':'spread_image','limited_image':'edition_image'}
for k,v in aliases.items():code=code.replace('section.settings.'+k,v)
assign='''  assign left_image = section.settings.cover_left | default: section.settings.left_product.featured_image
  assign right_image = section.settings.cover_right | default: section.settings.right_product.featured_image
  assign image_index = section.settings.interior_number | minus: 1
  assign spread_image = section.settings.inside_image | default: section.settings.left_product.images[image_index]
  assign edition_image = section.settings.limited_image | default: section.settings.edition_product.featured_image
'''
code=code.replace('  assign title_font',assign+'  assign title_font')
schema['settings'].extend([{'type':'header','content':'Product image defaults'},{'type':'product','id':'left_product','label':'Left planner / interior source'},{'type':'product','id':'right_product','label':'Right planner'},{'type':'range','id':'interior_number','label':'Interior image number in left product gallery','min':1,'max':40,'step':1,'default':10},{'type':'product','id':'edition_product','label':'Limited Edition planner'}]);f.write_text(code+'{% schema %}\n'+json.dumps(schema,indent=2)+'\n{% endschema %}\n')
f=p/'templates/index.json';d=json.loads(f.read_text());s=d['sections']['june_make_room']['settings'];
for k in aliases:s.pop(k,None)
s.update(left_product='undated-yearly-planner-serendipity-ultimate-sticker-book',right_product='undated-yearly-planner-quite-the-mind-ultimate-sticker-book',interior_number=10,edition_product='limited-edition-undated-planner-dolce-far-niente');f.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
