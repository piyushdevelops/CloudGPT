from pathlib import Path
import json,re
P=Path('mobile-fixes/theme')
def read(n):return (P/'sections'/(n+'.liquid')).read_text(encoding='utf-8')
def save(n,s):(P/'sections'/(n+'.liquid')).write_text(s,encoding='utf-8')
def css(s,t):return s.replace('{% endstylesheet %}',t+'\n{% endstylesheet %}')
def schema(s,fn):
 m=re.search(r'{% schema %}(.*?){% endschema %}',s,re.S);j=json.loads(m.group(1));fn(j);return s[:m.start(1)]+'\n'+json.dumps(j,ensure_ascii=True,indent=2)+'\n'+s[m.end(1):]
def obj(s):return json.loads(re.sub(r'^\s*/\*.*?\*/\s*','',s,flags=re.S))
idx=obj((P/'templates/index.json').read_text(encoding='utf-8'))

# Mobile header: compact row, explicit search trigger, viewport-fixed search host.
n='my-header';s=read(n)
anchor='        <div class="tjs-ph__search-wrap" data-tjs-search-root data-tjs-mobile-search>'
s=s.replace(anchor,'        <div id="JuneMobileSearch-{{ section.id }}" class="tjs-ph__search-wrap" data-tjs-search-root data-tjs-mobile-search>')
start=s.index('<div class="tjs-ph__mobile">');end=s.index(anchor.split(' data-tjs-search-root')[0],start) if anchor.split(' data-tjs-search-root')[0] in s[start:] else s.index('<div id="JuneMobileSearch-',start)
piece=s[start:end]
cart=piece.index('          <a\n            class="tjs-ph__icon-link')
piece=piece[:cart]+'''          <button type="button" class="tjs-ph__mobile-search-toggle tjs-ph__icon-link" data-june-search-open aria-label="Open search" aria-expanded="false" aria-controls="JuneMobileSearch-{{ section.id }}"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.2 4.2" stroke="currentColor" stroke-width="1.8"/></svg></button>
'''+piece[cart:]
s=s[:start]+piece+s[end:]
s=s.replace('        this.setupSearches();','''        this.setupSearches();
        this.querySelector('[data-june-search-open]')?.addEventListener('click', () => {
          const root=this.querySelector('[data-tjs-mobile-search]');
          this.openMobileSearch(root,root.querySelector('input[name="q"]'));
        });''')
a=s.index('      openMobileSearch(root, input) {');b=s.index('      async requestSuggestions',a)
s=s[:a]+'''      openMobileSearch(root, input) {
        if (!root?.hasAttribute('data-tjs-mobile-search') || !matchMedia('(max-width:1149px)').matches || root.classList.contains('is-search-active')) return;
        this.mobileSearchScroll=window.scrollY;
        this.mobileSearchBody={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width};
        this.mobileSearchInert=[...document.body.children].filter(e=>e!==this.closest('.shopify-section')&&!e.contains(this)&&!['SCRIPT','STYLE'].includes(e.tagName)).map(e=>[e,e.inert]);
        this.mobileSearchInert.forEach(([e])=>e.inert=true);
        root.classList.add('is-search-active');root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Search the shop');
        this.classList.add('is-mobile-search-open');document.documentElement.classList.add('tjs-ph-search-open');
        document.body.style.position='fixed';document.body.style.top=-this.mobileSearchScroll+'px';document.body.style.width='100%';
        this.querySelector('[data-june-search-open]')?.setAttribute('aria-expanded','true');
        this.mobileSearchViewport=()=>{const v=window.visualViewport;root.style.setProperty('--june-search-height',(v?.height||innerHeight)+'px');root.style.setProperty('--june-search-top',(v?.offsetTop||0)+'px')};
        this.mobileSearchViewport();window.visualViewport?.addEventListener('resize',this.mobileSearchViewport);window.visualViewport?.addEventListener('scroll',this.mobileSearchViewport);
        this.mobileSearchTrap=e=>{if(e.key!=='Tab')return;const items=[...root.querySelectorAll('a[href],button,input:not([type="hidden"])')].filter(el=>el.getClientRects().length&&!el.disabled);if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}};
        root.addEventListener('keydown',this.mobileSearchTrap);
        input?.focus({preventScroll:true});
      }

      closeMobileSearch(root = null) {
        const targets=root?[root]:[...this.querySelectorAll('[data-tjs-mobile-search].is-search-active')];
        const wasOpen=this.classList.contains('is-mobile-search-open');
        targets.forEach(target=>{target.classList.remove('is-search-active');target.removeAttribute('role');target.removeAttribute('aria-modal');target.removeAttribute('aria-label');target.removeEventListener('keydown',this.mobileSearchTrap)});
        if(!this.querySelector('[data-tjs-mobile-search].is-search-active')){
          this.classList.remove('is-mobile-search-open');document.documentElement.classList.remove('tjs-ph-search-open');
          if(wasOpen){
            Object.assign(document.body.style,this.mobileSearchBody||{});
            this.mobileSearchInert?.forEach(([e,inert])=>e.inert=inert);this.mobileSearchInert=null;
            window.visualViewport?.removeEventListener('resize',this.mobileSearchViewport);window.visualViewport?.removeEventListener('scroll',this.mobileSearchViewport);
            window.scrollTo({top:this.mobileSearchScroll||0,behavior:'instant'});
            this.querySelector('[data-june-search-open]')?.setAttribute('aria-expanded','false');
            this.querySelector('[data-june-search-open]')?.focus({preventScroll:true});
          }
        }
      }

'''+s[b:]
s=s.replace('      disconnectedCallback() {','      disconnectedCallback() {\n        this.closeMobileSearch();',1)
s=s.replace('              input.focus();\n            }','              this.querySelector(\'[data-june-search-open]\')?.focus({preventScroll:true});\n            }',1)
s+='''
{% style %}
@media(max-width:1149px){
 #shopify-section-{{ section.id }}{top:0!important;padding:0!important}
 #TjsPremiumHeader-{{ section.id }}{margin:0!important;padding:0!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__shell{margin:0!important;border-radius:0!important;box-shadow:none!important;border-bottom:1px solid #1112;background:var(--tjs-ph-bg)!important;transform:none!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__mobile{display:block!important;padding:max(6px,env(safe-area-inset-top)) 12px 6px!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__mobile-top{display:grid!important;grid-template-columns:44px minmax(0,1fr) 44px 44px!important;align-items:center;gap:4px}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__mobile-top>*{grid-column:auto!important;grid-row:auto!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__mobile-top .tjs-ph__brand{display:flex!important;justify-content:center}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__mobile-top .tjs-ph__brand img{max-height:40px;max-width:110px;width:auto;object-fit:contain}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__mobile-search-toggle{display:grid;place-items:center;padding:0;border:0;background:transparent;color:inherit}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__mobile-search-toggle svg{width:22px;height:22px}
 #TjsPremiumHeader-{{ section.id }} [data-tjs-mobile-search]:not(.is-search-active){display:none!important}
 html.tjs-ph-search-open #shopify-section-{{ section.id }}{position:fixed!important;inset:0!important;height:100dvh!important;z-index:10000!important}
 #TjsPremiumHeader-{{ section.id }}.is-mobile-search-open,#TjsPremiumHeader-{{ section.id }}.is-mobile-search-open .tjs-ph__shell{position:static!important;isolation:auto!important;overflow:visible!important}
 #TjsPremiumHeader-{{ section.id }} [data-tjs-mobile-search].is-search-active{position:fixed!important;inset:auto 0!important;top:var(--june-search-top,0px)!important;height:var(--june-search-height,100dvh)!important;max-height:100dvh;box-sizing:border-box;width:100%!important;z-index:10001!important;display:grid!important;grid-template-columns:minmax(0,1fr);grid-template-rows:50px minmax(0,1fr);gap:12px;padding:max(10px,env(safe-area-inset-top)) 12px max(10px,env(safe-area-inset-bottom));background:var(--tjs-ph-bg);overflow:hidden;backdrop-filter:none!important}
 #TjsPremiumHeader-{{ section.id }} [data-tjs-mobile-search].is-search-active .tjs-ph__search{width:100%;margin:0;align-self:stretch}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__search input{font-size:16px!important}
 #TjsPremiumHeader-{{ section.id }} [data-tjs-mobile-search].is-search-active .tjs-ph__predictive{position:static!important;min-height:0;height:auto!important;max-height:none!important;margin:0!important;width:100%!important;overflow:auto!important;overscroll-behavior:contain;box-shadow:none;border-radius:0}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-title,#TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-link{font-size:14px!important}
 #TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-meta,#TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-label,#TjsPremiumHeader-{{ section.id }} .tjs-ph__predictive-price{font-size:13px!important}
}
{% endstyle %}
'''
save(n,s)

# Compact comparison with a persistent header and shared facts only once.
n='june-your-year';s=read(n)
s=s.replace('<div class="ju__comparison">','<div class="ju__compare-scroll"><p class="ju__shared ju__body">{{ section.settings.shared_specs | escape }}</p><div class="ju__comparison">',1)
s=s.replace(' </div></dialog>',' </div></div></dialog>',1)
s=schema(s,lambda j:j['settings'].append({'type':'textarea','id':'shared_specs','label':'Shared planner specifications','default':'All three: 19.5 × 23 × 3.2 cm · 286 sides · 100 GSM paper · Hardbound, wire binding and back pocket.'}))
idx['sections']['june_your_year']['settings']['shared_specs']='All three: 19.5 × 23 × 3.2 cm · 286 sides · 100 GSM paper · Hardbound, wire binding and back pocket.'
for b in idx['sections']['june_your_year']['blocks'].values():
 if b['type']=='planner':
  lines=b['settings'].get('comparison','').splitlines();b['settings']['comparison']='\n'.join(lines[3:])
s=css(s,'''.ju .ju__dialog[open]{display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box}.ju__dialog-head{flex:none;margin:0;padding-bottom:14px}.ju__compare-scroll{min-height:0;overflow:auto;overscroll-behavior:contain;padding:2px}.ju .ju__shared{margin:0 0 16px;padding:12px;background:color-mix(in srgb,var(--ju-accent) 15%,transparent);border-radius:8px}.ju__dialog-head h3{margin:0}
@media(max-width:900px){.ju .ju__dialog{width:calc(100vw - 20px);max-width:none;max-height:calc(100dvh - 20px);padding:14px;margin:auto}.ju__comparison{gap:12px}.ju__comparison article{grid-template-columns:70px minmax(0,1fr);column-gap:12px;padding-bottom:12px}.ju__comparison img{height:90px}.ju__comparison .ju__specs{grid-column:2;margin:4px 0;padding:0;border:0}.ju__comparison .ju__textlink{grid-column:2;justify-self:start;min-height:44px}.ju .ju__shared{font-size:var(--ju-body-mobile)}.ju .jphoto__open>span{font-size:var(--ju-body-mobile);gap:5px}.ju__toggles button{min-width:44px}}
''');save(n,s)

# Fullscreen mobile interior viewer: fixed controls, one pan area, modest zoom.
n='june-inside-discovery';s=read(n)
s=s.replace('this.syncViewer();this.dialog.showModal();this.updateZoom();','this.zoomed=false;this.syncViewer();this.dialog.showModal();this.updateZoom();')
s=s.replace("requestAnimationFrame(()=>{this.querySelector('.ji__viewer-hint').hidden=frame.scrollWidth<=frame.clientWidth+1})", "requestAnimationFrame(()=>{this.querySelector('.ji__viewer-hint').hidden=frame.scrollWidth<=frame.clientWidth+1;frame.scrollLeft=this.zoomed?(frame.scrollWidth-frame.clientWidth)/2:0;frame.scrollTop=this.zoomed?(frame.scrollHeight-frame.clientHeight)/2:0})")
s=css(s,'''
@media(max-width:900px){.ji .ji__dialog[open]{position:fixed;inset:0;box-sizing:border-box;width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;border:0;border-radius:0;padding:max(12px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom));display:flex;flex-direction:column;overflow:hidden}.ji__dialog-bar{flex:none;align-items:center;padding-bottom:8px}.ji__dialog [data-image-view]:not([hidden]){display:flex;flex-direction:column;flex:1;min-height:0;gap:8px}.ji__dialog [data-zoom]{align-self:flex-start;flex:none}.ji .ji__viewer-hint{margin:0;font-size:13px}.ji__dialog .ji__zoom-frame{flex:1;min-height:0;max-height:none;overscroll-behavior:contain;overflow:auto}.ji__zoom-frame:not([data-zoomed=true]) .ji__zoom{width:100%;height:100%;object-fit:contain;margin:0}.ji__zoom-frame[data-zoomed=true] .ji__zoom{width:200%;min-width:200%!important;max-width:none;height:auto;margin:0}.ji__dialog-nav{flex:none;margin:0;align-items:center}.ji__dialog-nav button{font-size:14px;min-height:44px}.ji__controls>.ji__secondary:not([href*="/products/"]){display:none}.ji__shown{font-size:var(--ji-body-mobile)}.ji__images{height:230px!important}.ji__header{padding-block:20px!important}}
''');save(n,s)

# Chapter controls precede changing content on phones; natural content height.
n='june-other-chapters';s=read(n)
a=s.index('  <div class="jc__navigation">');b=s.index('\n </div>\n</june-chapters>',a);nav=s[a:b];s=s[:a]+s[b:];target='  <div class="jc__scenes">';s=s.replace(target,nav+'\n'+target,1)
s=css(s,'''
@media(max-width:900px){.jc[data-ready=true] .jc__stage{height:auto;min-height:0;display:flex;flex-direction:column;padding-top:0}.jc[data-ready=true] .jc__navigation{position:relative;inset:auto;order:0;min-height:0;padding:12px 16px;background:var(--jc-current);z-index:3}.jc__tabs{padding:0}.jc__dot{display:none}.jc[data-ready=true] .jc__scenes{position:relative;order:1;min-height:0}.jc[data-ready=true] .jc__scene{position:relative;inset:auto;display:none;min-height:0;padding:0 0 18px;opacity:1}.jc[data-ready=true] .jc__scene[data-active=true]{display:flex}.jc[data-ready=true] .jc__visual{height:210px;min-height:0}.jc[data-ready=true] .jc__copy{padding:18px 20px 4px}.jc[data-ready=true] .jc__skip{position:relative;inset:auto;order:2;align-self:center;margin:0 0 12px}.jc__scene .jc__heading{margin-top:8px}.jc__scene .jc__primary{margin-top:16px}}
''');save(n,s)

# One mobile extras disclosure placed directly before the revealed gift rail.
n='june-with-extras';s=read(n)
s=s.replace("this.reveal=this.querySelector('[data-reveal]');this.reveal.hidden=false;this.dataset.ready='true';this.setOpen(false);", "this.reveal=this.querySelector('[data-reveal]');this.reveal.hidden=false;this.dataset.ready='true';this.revealHome=document.createComment('reveal home');this.reveal.before(this.revealHome);this.phone=matchMedia('(max-width:900px)');this.placeReveal=()=>{const scene=this.querySelector('[data-scene=\"'+this.selected+'\"]');if(this.phone.matches)scene.querySelector('.jl__gifts-stage').before(this.reveal);else this.revealHome.after(this.reveal)};this.phone.addEventListener('change',this.placeReveal,options);this.placeReveal();this.setOpen(false);")
s=s.replace("this.setOpen(this.dataset.open==='true');this.querySelector('[data-scene", "this.placeReveal();this.setOpen(this.dataset.open==='true');this.querySelector('[data-scene")
s=css(s,'''
@media(max-width:900px){.jl__gift-summary{display:none}.jl__scene .jl__reveal{position:relative;z-index:10;margin:12px auto;display:flex;width:calc(100% - 40px);max-width:350px;justify-content:space-between}.jl .jl__scene{height:auto!important;min-height:0!important}.jl .jl__cover{width:auto;flex:1;min-width:0}.jl .jl__cover-name{font-size:var(--jl-button-mobile)!important;line-height:1.35}.jl .jl__covers{gap:8px}.jl__shopping{gap:12px!important}.jl__planner{height:170px!important}.jl__swipe{margin-bottom:12px!important}}
''');save(n,s)

# Table arrangement becomes optional, after the selected product purchase group.
n='june-layer-the-table';s=read(n)
a=s.index('  <div class="jt__visual">');b=s.index('  <div class="jt__selection">',a)
s=s[:a]+'  <details class="jt__arrangement" open><summary class="jt__button-type">{{ section.settings.arrangement_label | escape }}</summary>\n'+s[a:b]+'  </details>\n'+s[b:]
s=s.replace(' this.select(Math.min'," this.phone=matchMedia('(max-width:900px)');const arrangement=this.querySelector('.jt__arrangement');const layout=()=>{arrangement.open=!this.phone.matches};this.phone.addEventListener('change',layout,o);layout();\n this.select(Math.min")
s=schema(s,lambda j:j['settings'].append({'type':'text','id':'arrangement_label','label':'Mobile arrangement disclosure','default':'See the table arrangement'}))
s=css(s,'''.jt__arrangement{display:contents}.jt__arrangement>summary{display:none}@media(max-width:900px){.jt__layout{display:flex;flex-direction:column;align-items:stretch}.jt__header{order:0}.jt__selection{order:1}.jt__arrangement{display:block;order:2;border-top:1px solid #1113;margin-top:8px}.jt__arrangement>summary{display:flex;min-height:48px;align-items:center;justify-content:center;text-decoration:underline;cursor:pointer}.jt__arrangement .jt__visual{margin-top:8px}.jt__choices{margin-bottom:0}.jt__original{width:100px;height:110px}.jt__footer{padding-block:4px}.jt__products{padding-top:10px}}
''');save(n,s)

# Early merchant-editable category links in a compact mobile disclosure.
n='june-make-room';s=read(n)
a=s.index('<june-make-room');b=s.index('>',a)+1
nav='''
  {% assign quick_links = section.blocks | where: 'type', 'quick_link' %}{% if quick_links.size > 0 %}<details class="jh__browse"><summary>{{ 'june_audit.browse_categories' | t }}</summary><nav aria-label="{{ 'june_audit.browse_categories' | t }}">{% for block in quick_links %}<a href="{{ block.settings.url }}" {{ block.shopify_attributes }}>{{ block.settings.label | escape }} <span aria-hidden="true">↗</span></a>{% endfor %}</nav></details>{% endif %}
'''
s=s[:b]+nav+s[b:]
def hero_schema(j):
 j['max_blocks']=10;j['blocks'].append({'type':'quick_link','name':'Mobile category shortcut','limit':6,'settings':[{'type':'text','id':'label','label':'Label','default':'Browse'},{'type':'url','id':'url','label':'Destination'}]})
s=schema(s,hero_schema)
s=css(s,'''.jh__browse{display:none}@media(max-width:749px){.jh__browse{display:block;border-bottom:1px solid #1112;padding:0 18px;font-size:var(--jh-mobile-nav,13px);font-weight:500}.jh__browse summary{min-height:44px;display:flex;align-items:center;justify-content:space-between;cursor:pointer}.jh__browse summary:after{content:'+';font-size:20px}.jh__browse[open] summary:after{content:'−'}.jh__browse nav{display:grid;grid-template-columns:1fr 1fr;gap:0 16px;padding-bottom:10px}.jh__browse a{display:flex;justify-content:space-between;align-items:center;min-height:44px;color:inherit;text-decoration:underline;text-underline-offset:4px}.jh .jh__tab{font-size:var(--jh-mobile-nav,13px)!important}.jh .jh__mystery{font-size:var(--jh-mobile-nav,13px)!important}}
''')
s=s.replace('--jh-bg: {{ section.settings.background }};','--jh-bg: {{ section.settings.background }};\n    --jh-mobile-nav: {{ typography.nav_size_mobile | default: 13 }}px;')
h=idx['sections']['june_make_room'];links=[('Planners','/collections/undated-yearly-planners'),('Home décor','/collections/home-all'),('Lighting','/collections/lamps-lighting'),('Glassware','/collections/glassware'),('Tableware','/collections/dining')]
for i,(label,url) in enumerate(links):
 key='mobile_browse_'+str(i);h['blocks'][key]={'type':'quick_link','settings':{'label':label,'url':url}};h['block_order'].append(key)
for b in h['blocks'].values():
 if b['type']=='typography':b['settings']['nav_size_mobile']=13
save(n,s)

# Shared original-photo dialog gets the same single-scroll-area mobile treatment.
p=P/'snippets/june-photo-viewer.liquid';s=p.read_text(encoding='utf-8')
s=s.replace("img.src=img.dataset.src;dialog.showModal()", "img.src=img.dataset.src;frame.dataset.zoomed='false';this.querySelector('[data-zoom]').setAttribute('aria-pressed','false');dialog.showModal();frame.scrollTo(0,0)")
s=s.replace("e.currentTarget.setAttribute('aria-pressed',String(active))", "e.currentTarget.setAttribute('aria-pressed',String(active));requestAnimationFrame(()=>{frame.scrollLeft=active?(frame.scrollWidth-frame.clientWidth)/2:0;frame.scrollTop=active?(frame.scrollHeight-frame.clientHeight)/2:0})")
s=css(s,'''
@media(max-width:900px){.jphoto .jphoto__dialog[open]{position:fixed;inset:0;width:100vw;height:100dvh;max-width:none;max-height:none;box-sizing:border-box;padding:max(12px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom));margin:0;border:0;display:flex;flex-direction:column;overflow:hidden;font-size:14px}.jphoto__bar,.jphoto__tools{flex:none}.jphoto__bar{align-items:start}.jphoto__bar button{flex:none}.jphoto__tools{gap:8px;flex-wrap:wrap;margin:8px 0}.jphoto .jphoto__frame{flex:1;min-height:0;max-height:none;overscroll-behavior:contain}.jphoto__frame:not([data-zoomed=true]) img{height:100%!important;object-fit:contain!important}.jphoto__frame[data-zoomed=true] img{width:200%!important;min-width:200%!important;height:auto!important}.jphoto__open>span{font-size:inherit}}
''');p.write_text(s,encoding='utf-8')
loc=P/'locales/en.default.json';j=obj(loc.read_text(encoding='utf-8'));j['june_audit']['browse_categories']='Shop by category';loc.write_text(json.dumps(j,ensure_ascii=True,indent=2),encoding='utf-8')
(P/'templates/index.json').write_text(json.dumps(idx,ensure_ascii=True,indent=2),encoding='utf-8')
print('Mobile fixes prepared')
