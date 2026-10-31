import json, re, pathlib
ROOT=pathlib.Path(__file__).parent
P=ROOT/'theme'
IVORY='#FAF7EF'; INK='#191816'; APRICOT='#F5A477'; LILAC='#E7E1F0'; OAT='#EEE8DD'; ESPRESSO='#241C18'
def readjson(p):return json.loads(re.sub(r'^\s*/\*.*?\*/','',p.read_text(encoding='utf-8'),flags=re.S))
def writejson(p,j):p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
backgrounds={'june-inside-discovery':LILAC,'june-a-little-curious':LILAC,'june-find-your-glow':ESPRESSO,'june-footer':OAT}
for p in (P/'sections').glob('june-*.liquid'):
 s=p.read_text(encoding='utf-8')
 mapping={'#fffbf1':IVORY,'#f7f3eb':IVORY,'#ffb790':APRICOT,'#d5ff46':APRICOT,'#111111':INK,'#111':INK,'#140d09':ESPRESSO,'#f4e5df':LILAC,'#f5f5f5':OAT,'#fffdf8':IVORY,'#e9dfd0':OAT}
 s=re.sub(r'#[0-9a-fA-F]{3,8}\b',lambda m:mapping.get(m.group().lower(),m.group()),s)
 m=re.search(r'{% schema %}(.*?){% endschema %}',s,re.S);j=json.loads(m.group(1))
 for setting in j.get('settings',[]):
  if setting.get('type')=='color' and setting['id']=='background':setting['default']=backgrounds.get(p.stem,IVORY)
 # Chapter colour settings and new-section presets follow the chosen palette.
 if p.stem=='june-other-chapters':
  for block in j.get('blocks',[]):
   for setting in block.get('settings',[]):
    if setting.get('type')=='color':
     if setting['id']=='background':setting['default']=OAT
     elif setting['id']=='decoration':setting['default']=APRICOT
  for preset in j.get('presets',[]):
   for i,b in enumerate(preset.get('blocks',[])):
    if b.get('type')!='typography':
     b.setdefault('settings',{})['background']=[OAT,IVORY,LILAC][i%3]
     b['settings']['decoration']=APRICOT
 s=s[:m.start(1)]+'\n'+json.dumps(j,ensure_ascii=False,indent=2)+'\n'+s[m.end(1):]
 p.write_text(s,encoding='utf-8')
for name in ['templates/index.json','sections/footer-group.json']:
 p=P/name;j=readjson(p)
 for section in j['sections'].values():
  typ=section['type']
  if not typ.startswith('june-'):continue
  settings=section.setdefault('settings',{});settings['background']=backgrounds.get(typ,IVORY)
  if typ=='june-make-room':
   settings['text_color']=INK
   for block in section.get('blocks',{}).values():
    if block['type']=='typography':block['settings']['button_accent']=APRICOT
  else:settings.update(ink=IVORY if typ=='june-find-your-glow' else INK,accent=APRICOT)
  if typ=='june-other-chapters':
   for key,b in section.get('blocks',{}).items():
    if key in ['wedding','rewritable','baby']:b['settings'].update(background={'wedding':OAT,'rewritable':IVORY,'baby':LILAC}[key],decoration=APRICOT)
 writejson(p,j)
p=P/'sections/header-group.json';j=readjson(p)
for s in j['sections'].values():
 if s['type']=='my-header':s['settings'].update(background=IVORY,text_color=INK,muted_color='#625C57',accent=APRICOT,border_color=OAT)
writejson(p,j)
p=P/'snippets/june-photo-viewer.liquid';s=p.read_text(encoding='utf-8');s=re.sub(r'#fffbf1\b',IVORY,s,flags=re.I);s=re.sub(r'#111\b',INK,s);p.write_text(s,encoding='utf-8')
p=P/'config/settings_data.json';j=readjson(p);c=j['current']
# Existing scheme IDs and assignments retained. Semantic error/sale/badge colours retained.
for k,v in {'color_text':INK,'color_focus':INK,'tooltip_bg':ESPRESSO,'priClr':INK,'secClr':IVORY,'btnBClr':APRICOT,'color_accent':INK}.items():
 if k in c:c[k]=v
for scheme in c.get('color_schemes',{}).values():
 s=scheme['settings'];dark=s.get('background','').lower()=='#000000'
 s.update(background=ESPRESSO if dark else IVORY,background2=ESPRESSO if dark else OAT,text=IVORY if dark else INK,text2=OAT if dark else '#625C57',button=APRICOT,button_label=INK,button_border=INK,secondary_button_label=IVORY if dark else INK,accent_color=APRICOT if dark else INK,pr_text=IVORY if dark else INK,price=IVORY if dark else INK,input_primary=IVORY,input_secondary=INK)
writejson(p,j)
before=json.loads((ROOT/'before.json').read_text(encoding='utf-8'))['data']['theme']['files']['nodes'];changed=[]
for f in before:
 p=P/f['filename']
 if p.read_text(encoding='utf-8')!=f['body']['content']:changed.append(f['filename'])
writejson(ROOT/'changed.json',changed)
print('\n'.join(changed))
