from pathlib import Path
import json
p=Path(__file__).parent/'theme'
def edit(n,fn):
 f=p/'sections'/f'{n}.liquid';f.write_text(fn(f.read_text(encoding='utf8')),encoding='utf8')
edit('june-inside-discovery',lambda s:s.replace('flex:1;min-width:78px;white-space:nowrap','flex:0 0 auto;min-width:78px;white-space:nowrap'))
edit('my-header',lambda s:s.replace('assign tjs_logo_mobile = section.settings.logo_mobile | default: section.settings.logo','''assign tjs_logo_mobile = section.settings.logo_mobile | default: section.settings.logo
  assign tjs_mobile_logo_src = tjs_logo_mobile.src | downcase
  if tjs_mobile_logo_src contains '.gif'
    assign tjs_logo_mobile = nil
  endif''').replace('#TjsPremiumHeader-{{ section.id }} .tjs-ph__search-wrap.is-search-active{grid-template-rows:auto auto}','#TjsPremiumHeader-{{ section.id }} .tjs-ph__brand-text{font-size:18px;font-weight:900;line-height:1.1;letter-spacing:-.06em;max-width:118px;text-align:center}#TjsPremiumHeader-{{ section.id }} .tjs-ph__search-wrap.is-search-active{grid-template-rows:auto auto}'))
edit('june-pick-your-pour',lambda s:s.replace('<details class="jg__details jg__body">','{% if block.settings.detail != blank or block.settings.specification != blank %}<details class="jg__details jg__body">').replace('</p></div></details>','</p></div></details>{% endif %}'))
f=p/'templates/index.json';s=f.read_text(encoding='utf8');pre=s[:s.index('{')];d=json.loads(s[s.index('{'):])
for sec in d['sections'].values():
 if sec['type']=='june-pick-your-pour':
  sec['settings']['shop']='Shop this piece'
  for b in sec.get('blocks',{}).values():
   if b['settings'].get('product')=='cocktail-glass':b['settings']['short_label']='Cocktail glass';b['settings']['alt']='Cocktail glass with a poured drink'
   if b['settings'].get('product')=='ripple-coffee-mug-with-lid-spoon':b['settings']['alt']='Ripple Coffee Mug with Lid & Spoon'
f.write_text(pre+json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
