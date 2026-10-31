from pathlib import Path
import json,re
P=Path('mobile-fixes/theme')
def update(n,fn):
 p=P/'sections'/(n+'.liquid');p.write_text(fn(p.read_text(encoding='utf-8')),encoding='utf-8')
def css(s,c):return s.replace('{% endstylesheet %}',c+'\n{% endstylesheet %}')
def header(s):
 s=s.replace('this.mobileSearchScroll=window.scrollY;','this.mobileSearchScroll=window.scrollY;this.mobileSearchWidth=document.documentElement.clientWidth;')
 s=s.replace("document.body.style.width='100%'", "document.body.style.width=this.mobileSearchWidth+'px'")
 s=s.replace("window.scrollTo({top:this.mobileSearchScroll||0,behavior:'instant'});", "const returnY=this.mobileSearchScroll||0;window.scrollTo({top:returnY,behavior:'instant'});requestAnimationFrame(()=>{if(!this.classList.contains('is-mobile-search-open'))window.scrollTo({top:returnY,behavior:'instant'})});")
 s=s.replace('      handleDocumentClick(event) {','      handleDocumentClick(event) {\n        if(event.target.closest(\'[data-june-search-open]\')) return;')
 s+='''
{% style %}
@media(max-width:1149px){
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__shell{width:100%!important;max-width:none!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-copy>strong{font-size:14px!important;line-height:1.4!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-price strong{font-size:14px!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-price s,#TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-saving{font-size:12px!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-meta{font-size:12px!important;font-weight:400!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-image{width:64px!important;height:64px!important;flex-basis:64px!important}
}
{% endstyle %}
<noscript><style>@media(max-width:1149px){#TjsPremiumHeader-{{ section.id }} [data-tjs-mobile-search]:not(.is-search-active){display:block!important}#TjsPremiumHeader-{{ section.id }} [data-june-search-open]{display:none!important}}</style></noscript>
'''
 return s
update('my-header',header)
update('june-inside-discovery',lambda s:s.replace('width:100vw;height:100dvh','width:auto;height:100dvh'))
p=P/'snippets/june-photo-viewer.liquid';s=p.read_text(encoding='utf-8').replace('width:100vw;height:100dvh','width:auto;height:100dvh');p.write_text(s,encoding='utf-8')
update('june-with-extras',lambda s:css(s,'@media(max-width:900px){.jl .jl__planner{grid-template-rows:minmax(0,1fr)}.jl .jl__planner>img{min-height:0;max-height:100%;width:100%;height:100%;object-fit:contain}}'))
update('june-layer-the-table',lambda s:s.replace('<p class="jt__price jt__body">','<p class="jt__detail jt__body">{{ \'june_audit.sold_separately\' | t }}</p><p class="jt__price jt__body">'))
def hero(s):
 m=re.search(r'{% schema %}(.*?){% endschema %}',s,re.S);j=json.loads(m.group(1))
 links=[('Planners','/collections/undated-yearly-planners'),('Home décor','/collections/home-all'),('Lighting','/collections/lamps-lighting'),('Glassware','/collections/glassware'),('Tableware','/collections/dining')]
 for p in j.get('presets',[]):
  for label,url in links:p.setdefault('blocks',[]).append({'type':'quick_link','settings':{'label':label,'url':url}})
 return s[:m.start(1)]+'\n'+json.dumps(j,ensure_ascii=True,indent=2)+'\n'+s[m.end(1):]
update('june-make-room',hero)
p=P/'templates/index.json';j=json.loads(p.read_text(encoding='utf-8'));j['sections']['june_with_extras']['settings']['note']='Each cover has its own included extras.';p.write_text(json.dumps(j,ensure_ascii=True,indent=2),encoding='utf-8')
p=P/'locales/en.default.json';j=json.loads(p.read_text(encoding='utf-8'));j['june_audit']['sold_separately']='Sold separately.';p.write_text(json.dumps(j,ensure_ascii=True,indent=2),encoding='utf-8')
print('Refinements prepared')
