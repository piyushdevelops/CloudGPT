import json,re,pathlib
p=pathlib.Path(__file__).parent
b=json.loads((p/'before.json').read_text(encoding='utf8'))
files={f['filename']:f['body']['content'] for f in b['files']['nodes']}
s=files['sections/june-next-chapter.liquid']
s=s.replace('class="jn"','class="jn jn--portal" data-portal-motion="{{ section.settings.portal_motion }}" style="--portal-glow:{{ section.settings.portal_glow }};--portal-duration:{{ section.settings.portal_duration }}s;--portal-tilt:{{ section.settings.portal_tilt }}deg"')
start=s.index('  <div class="jn__paper-wrap">')
end=s.index('\n </div>\n <div class="jn__ticket">',start)
s=s[:start]+'''  <div class="jn__portal-scene">
   <div class="jn__doorway" aria-hidden="true"><div class="jn__door-light"></div></div>
   <div class="jn__light-spill" aria-hidden="true"></div>
   <div class="jn__stars" aria-hidden="true">{% for i in (1..9) %}<i style="--i:{{ i }}"></i>{% endfor %}</div>
   <div class="jn__portal-year"><span class="jn__year">{{ section.settings.year | escape }}</span><span class="jn__badge jn__button-type">{{ section.settings.badge | escape }}</span></div>
  </div>'''+s[end:]
css=(p/'portal.css').read_text(encoding='utf8')
s=s.replace('{% endstylesheet %}',css+'\n{% endstylesheet %}')
js='''{% javascript %}
(() => {
 const initialise = (root=document) => root.querySelectorAll('.jn--portal:not([data-portal-ready])').forEach(section => {
  section.dataset.portalReady = 'true';
  if (!window.IntersectionObserver) return;
  const observer = new IntersectionObserver(entries => {
   if (entries.some(entry => entry.isIntersecting)) { section.classList.add('is-revealed'); observer.disconnect(); }
  }, {threshold: .18});
  observer.observe(section);
  const unload = event => { if (event.target.contains(section)) { observer.disconnect(); document.removeEventListener('shopify:section:unload', unload); } };
  document.addEventListener('shopify:section:unload', unload);
 });
 initialise();
 document.addEventListener('shopify:section:load', event => initialise(event.target));
})();
{% endjavascript %}
'''
s=s.replace('{% schema %}',js+'{% schema %}')
schema=json.loads(s.split('{% schema %}')[1].split('{% endschema %}')[0])
schema['settings'] += [
 {'type':'header','content':'Portal illustration'},
 {'type':'color','id':'portal_glow','label':'Portal light colour','default':'#D2BBFF'},
 {'type':'checkbox','id':'portal_motion','label':'Enable one-time portal reveal','default':True},
 {'type':'range','id':'portal_duration','label':'Reveal duration','min':1,'max':4,'step':0.5,'unit':'s','default':2},
 {'type':'range','id':'portal_tilt','label':'Year tilt','min':-12,'max':0,'step':1,'unit':'deg','default':-7}]
s=s.split('{% schema %}')[0]+'{% schema %}\n'+json.dumps(schema,indent=2,ensure_ascii=False)+'\n{% endschema %}\n'
idx=json.loads(re.sub(r'/\*.*?\*/', '', files['templates/index.json'], flags=re.S))
for sec in idx['sections'].values():
 if sec['type']=='june-next-chapter':
  sec['settings'].update(heading='Something wonderful',heading_second='is on its way.',caption='2027 dated planners. Coming soon.',signup_heading='Be first through the door.',portal_glow='#D2BBFF',portal_motion=True,portal_duration=2,portal_tilt=-7)
for name,body in [('sections/june-next-chapter.liquid',s),('templates/index.json',json.dumps(idx,indent=2,ensure_ascii=False)+'\n')]:
 target=p/'theme'/name
 target.parent.mkdir(parents=True,exist_ok=True)
 target.write_text(body,encoding='utf8')

