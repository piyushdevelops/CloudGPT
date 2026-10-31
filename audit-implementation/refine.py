import json,re
from pathlib import Path
P=Path(__file__).parent/'theme'
def rw(n,fn):
 p=P/'sections'/f'{n}.liquid';p.write_text(fn(p.read_text(encoding='utf-8')),encoding='utf-8')
rw('june-your-year',lambda s:s.replace("this.querySelector('dialog')","this.querySelector('.ju__dialog')").replace("if(e.target.closest('[data-close]'))","if(e.target.closest('.ju__dialog [data-close]'))"))
rw('june-pick-your-pour',lambda s:s.replace('.jp','.jg').replace('--jp-','--jg-').replace('jg__choice small','jg__tab small').replace('jg__choice{','jg__tab{').replace('jg__dock','jg__footer').replace('<p class="jg__body jg__price">','<p class="jg__body jg__spec">{{ block.settings.specification | escape }}</p><p class="jg__body jg__price">'))
rw('june-footer',lambda s:s.replace('<label class="jfooter__sr-only" for="{{ locale_id }}-country">','<label class="jfooter__country-label" for="{{ locale_id }}-country">'))
rw('june-make-room',lambda s:s.replace('.jh__scene-image','.jh__limited-scene'))
rw('june-a-little-curious',lambda s:s.replace('{{ cart.currency.symbol }}{{ variant.title | escape }}+','{{ variant.title | times: 100 | money }}+'))
for path in P.glob('sections/june-*.liquid'):
 s=path.read_text(encoding='utf-8')
 s=s.replace('type.heading_tracking | default: -4','type.heading_tracking | default: -2').replace('type.signup_tracking | default: -4','type.signup_tracking | default: -2')
 m=re.search(r'{% schema %}(.*?){% endschema %}',s,re.S);j=json.loads(m[1])
 for b in j.get('blocks',[]):
  for v in b.get('settings',[]):
   if v.get('id') in ['heading_tracking','signup_tracking']:v['default']=-2
 s=s[:m.start(1)]+'\n'+json.dumps(j,ensure_ascii=True,indent=2)+'\n'+s[m.end(1):]
 path.write_text(s,encoding='utf-8')
locale=P/'locales/en.default.json';j=json.loads(re.sub(r'/\*.*?\*/','',locale.read_text(encoding='utf-8'),flags=re.S))
j['june_audit']={'from':'From','inspect':'Inspect photo','close':'Close','zoom':'Zoom in / fit image','original':'Open full image','extras':'extras included','included_list':'See every included extra'}
print('Hero translation keys',j.get('june_hero',{}).keys())
def consent(d):
 for k,v in d.items():
  if isinstance(v,dict):consent(v)
  elif isinstance(v,str) and 'Sign up for the 2027 planner launch email' in v:d[k]='Join our email list for the 2027 planner launch and June Shop updates. Unsubscribe anytime.'
consent(j.get('june_hero',{}))
locale.write_text(json.dumps(j,ensure_ascii=True,indent=2),encoding='utf-8')
h=P/'sections/header-group.json';j=json.loads(re.sub(r'/\*.*?\*/','',h.read_text(encoding='utf-8'),flags=re.S))
for s in j['sections'].values():
 if 'enable_typing_effect' in s['settings']:s['settings']['enable_typing_effect']=False;s['settings']['search_placeholder']='Search the shop'
h.write_text(json.dumps(j,ensure_ascii=True,indent=2),encoding='utf-8')
for p in P.glob('sections/june-*.liquid'):
 s=p.read_text(encoding='utf-8');j=json.loads(re.search(r'{% schema %}(.*?){% endschema %}',s,re.S)[1])
 assert len([v for v in j['settings'] if 'id'in v])<=40,p.name
 for b in j.get('blocks',[]):assert len([v for v in b.get('settings',[]) if 'id'in v])<=40,(p.name,b['type'])
 for i,js in enumerate(re.findall(r'{% javascript %}(.*?){% endjavascript %}',s,re.S)):(p.parent.parent.parent/(p.stem+'.js')).write_text(js,encoding='utf-8')
print('Schema setting limits pass.')
