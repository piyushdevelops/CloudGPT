import json,re,pathlib
r=pathlib.Path(__file__).parent
b=json.loads((r/'before.json').read_text(encoding='utf-8-sig'))
files={x['filename']:x['body']['content'] for x in b['files']['nodes']}
s=files['sections/june-pick-your-pour.liquid']
schema=json.loads(s.split('{% schema %}')[1].split('{% endschema %}')[0])
start=s[:s.index('{% capture arrow %}')]
start=start.replace('--jg-ink:var(--june-ink,{{ section.settings.ink }})','--jg-ink:{{ section.settings.reference_ink }};--jg-button-bg:{{ section.settings.reference_button }};--jg-button-ink:{{ section.settings.reference_button_text }}')
start=start.replace('default: 900','default: 400',2).replace('default: 62','default: 248').replace('default: 42','default: 72')
roles='\n'.join(re.findall(r'\.jg \.jg__(?:heading|title|body|button-type)\{[^}]+\}',s)[:4])
js=s.split('{% javascript %}')[1].split('{% endjavascript %}')[0]
js=js.replace("['scene','product']","['scene','foreground','product']")
js=js.replace('this.buttons=[...this.querySelectorAll', 'this.buttons=[...this.querySelectorAll')
js=js.replace("this.addEventListener('click'", "this.resizeObserver?.disconnect();this.resizeObserver=new ResizeObserver(()=>this.fitTitle());this.resizeObserver.observe(this);document.fonts.ready.then(()=>{if(this.isConnected)this.fitTitle();});\n   this.addEventListener('click'")
js=js.replace('  select(index)', '''  fitTitle(){const h=this.querySelector('.jg__heading');if(!h)return;h.style.fontSize='';if(matchMedia('(min-width:901px)').matches&&h.scrollWidth>h.clientWidth){h.style.fontSize=(parseFloat(getComputedStyle(h).fontSize)*h.clientWidth/h.scrollWidth*.99)+'px';}}
  select(index)''')
js=js.replace('this.controller?.abort();}', 'this.controller?.abort();this.resizeObserver?.disconnect();}')
for x in schema['settings']:
 if x.get('id')=='heading':x['default']='PICK YOUR POUR.'
 if x.get('id')=='choose':x['default']='What are you pouring?'
 if x.get('id')=='shop':x['default']='Shop this glass'
 if x.get('id')=='height':x['label']='Minimum desktop height';x['info']='The photographic stage maintains a 1.92:1 ratio unless this minimum needs more room.'
 if x.get('id')=='mobile_height':x['label']='Mobile photograph height'
schema['settings'] += [{'type':'header','content':'Reference styling'},{'type':'color','id':'reference_ink','label':'Photograph text','default':'#101010'},{'type':'color','id':'reference_button','label':'Rectangular button fill','default':'#101010'},{'type':'color','id':'reference_button_text','label':'Rectangular button text','default':'#FFFFFF'}]
for block in schema['blocks']:
 if block['type']=='pour':
  block['settings'] += [{'type':'image_picker','id':'foreground_mask','label':'Foreground alpha mask','info':'Transparent PNG mask, same dimensions as the desktop scene. White/opaque pixels bring the scene in front of the headline.'},{'type':'image_picker','id':'mask_source','label':'Image this mask belongs to','info':'Select the matching desktop scene. A different scene disables the mask automatically.'}]
 if block['type']=='typography':
  for x in block['settings']:
   key=x.get('id')
   if key=='heading_font':x['default']='anton_n4'
   if key=='heading_weight':x['default']=400
   if key=='heading_size':x.update(min=60,max=300,step=4,default=248)
   if key=='heading_mobile':x.update(default=72)
   if key=='heading_tracking':x['default']=-2
   if key=='heading_leading':x['default']=100
(r/'theme/sections').mkdir(parents=True,exist_ok=True)
markup=(r/'markup.liquid').read_text()
masklogic=markup[markup.index("  if scene_key =="):markup.index('\n %}',markup.index("  if scene_key =="))]
markup=markup.replace('<!-- BUILTIN_MASKS -->','{% liquid\n'+masklogic+'\n%}')
(r/'theme/sections/june-pick-your-pour.liquid').write_text(start+markup+'\n{% stylesheet %}\n'+roles+'\n'+(r/'layout.css').read_text()+'\n{% endstylesheet %}\n{% javascript %}\n'+js+'\n{% endjavascript %}\n{% schema %}\n'+json.dumps(schema,indent=2,ensure_ascii=False)+'\n{% endschema %}\n',encoding='utf-8')
raw=files['templates/index.json'];i=raw.index('{');idx=json.loads(raw[i:]);sec=next(x for x in idx['sections'].values() if x['type']=='june-pick-your-pour')
sec['settings'].update(heading='PICK YOUR POUR.',body='Make the everyday a little more special.',choose='What are you pouring?',shop='Shop this glass',reference_ink='#101010',reference_button='#101010',reference_button_text='#FFFFFF',height=400,mobile_height=360)
sec['blocks']['typography']['settings'].update(heading_font='anton_n4',heading_weight=400,heading_size=248,heading_mobile=72,heading_tracking=-2,heading_leading=100,title_size=24,title_mobile=22,body_size=16,body_mobile=14)
(r/'theme/templates').mkdir(exist_ok=True)
(r/'theme/templates/index.json').write_text(raw[:i]+json.dumps(idx,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
