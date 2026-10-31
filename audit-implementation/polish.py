from pathlib import Path
import re,json
P=Path(__file__).parent/'theme'
def update(n,fn):
 p=P/'sections'/f'{n}.liquid';p.write_text(fn(p.read_text(encoding='utf-8')),encoding='utf-8')
def css(s,x):return s.replace('{% endstylesheet %}',x+'\n{% endstylesheet %}',1)
def limited(s):
 m=re.search(r'<details class="jl__gift-summary.*?</details>',s,re.S);summary=m[0];s=s[:m.start()]+s[m.end():]
 token='<p class="jl__caption jl__body">{{ section.settings.product_caption | escape }}</p>'
 s=s.replace(token,token+summary)
 return css(s,'.jl .jl__gift-summary{position:static;margin:8px 0!important;max-width:100%;padding:0;border:0;background:transparent}.jl__gift-summary summary{min-height:44px;text-decoration:underline;text-underline-offset:4px}.jl__gift-summary ul{max-width:360px}.jl__shopping{align-items:start}.jl__scene{overflow:visible}@media(max-width:900px){.jl__planner{height:200px!important}.jl__scene:before{height:200px}.jl__header{gap:12px!important;padding-top:24px!important}.jl__shopping{padding-inline:20px!important}.jl__cover-name{font-size:var(--jl-label-mobile)!important}}')
update('june-with-extras',limited)
update('june-find-your-glow',lambda s:css(s,'.jglow__stage{margin:0;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.jglow__header{width:100%!important}.jglow__scene{inset:0!important}.jglow__scene:after{display:none}.jglow__header .jglow__body{max-width:none}.jglow__choice img{width:72px;height:72px}.jglow__heading{max-width:600px}@media(max-width:749px){.jglow__choice img{width:54px;height:54px}.jglow__scenes{flex:none}.jglow__header{padding-top:24px!important}.jglow__heading{margin:12px 0 16px!important}}'))
update('june-layer-the-table',lambda s:css(s,'.jt__modes{transform:none}.jt__original .jphoto__open>span{font-size:.75em;gap:4px}@media(max-width:900px){.jt__layout{padding:24px 20px}.jt__header{padding-top:0!important}.jt__visual{margin:8px auto 12px;padding:0!important}.jt__stack{height:225px!important;max-width:275px}.jt__piece{top:calc(var(--jt-order)*53px);height:calc(95px + var(--jt-order)*16px)}.jt[data-stacked=true] .jt__piece{top:calc(95px - var(--jt-order)*10px)}.jt__plinth{bottom:0;height:36px}.jt .jt__hint{font-size:var(--jt-body-mobile);margin-top:8px}.jt__products{padding-top:12px}.jt__choices{gap:4px}.jt__choice .jt__number{display:none}.jt__footer{gap:0;padding:8px 20px}.jt__footer a{min-height:44px}.jt .jt__primary{margin-top:14px}}'))
update('june-your-year',lambda s:css(s,'@media(max-width:900px){.ju .ju__cover-art{height:var(--ju-mobile-stage)}.ju .ju__cover-art img{transform:none}.ju .ju__cover.is-selected .ju__cover-art{transform:scale(1)}}'))
update('june-next-chapter',lambda s:s.replace('.jn__signup{padding:20px!important}','.jn__signup{padding:0!important}'))
update('june-next-chapter',lambda s:css(s,'@media(max-width:900px){.jn__teaser{margin-bottom:12px}.jn__paper-wrap{padding:8px 0}.jn__paper{min-height:135px}.jn__perforation{margin-block:14px}.jn__ticket{padding:20px}.jn .jn__note{font-size:var(--jn-body-mobile)}}'))
update('june-make-room',lambda s:s.replace('.jh__limited-scene{order:2','.jh__limited-background{order:2'))
update('my-header',lambda s:s+'\n{% style %}#TjsPremiumHeader-{{ section.id }}[data-typing-enabled="false"] [data-tjs-typing]{display:none!important}{% endstyle %}\n')
idxpath=P/'templates/index.json';idx=json.loads(idxpath.read_text(encoding='utf-8'));idx['sections']['june_layer_the_table']['settings']['hint']='Sold separately. Inspect the photo for exact details.';idxpath.write_text(json.dumps(idx,ensure_ascii=True,indent=2),encoding='utf-8')
print('Polished responsive layouts and fixed disabled search overlay.')
