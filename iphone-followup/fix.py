from pathlib import Path
root=Path(__file__).parent/'theme'/'sections'
def edit(name,fn):
 p=root/(name+'.liquid');s=p.read_text(encoding='utf-8');p.write_text(fn(s),encoding='utf-8',newline='')
def css(s,text):return s.replace('{% endstylesheet %}',text+'\n{% endstylesheet %}',1)
def story(s):
 s=s.replace('setup(){const mobile=innerWidth<=900;', 'setup(){const mobile=innerWidth<=900;this.mobile=mobile;if(!mobile||this.viewportWidth!==innerWidth){this.viewportWidth=innerWidth;this.viewportHeight=innerHeight}const viewportHeight=this.viewportHeight;')
 s=s.replace('Math.max(240,innerHeight-this.offset)','Math.max(240,viewportHeight-this.offset)').replace('&&innerHeight>=480','&&viewportHeight>=480').replace('*innerHeight/100/this.unit','*viewportHeight/100/this.unit')
 return s.replace('if(phase===9)show(2,1-ease(p),-p*this.height*.45);','if(phase===9){if(this.mobile)show(2,1,0);else show(2,1-ease(p),-p*this.height*.45);}')
edit('june-other-chapters',story)
def limited(s):
 s=s.replace("el.setAttribute('aria-hidden',String(!open));el.tabIndex", "el.setAttribute('aria-hidden',String(!open));el.inert=!open;el.tabIndex")
 return css(s,'''/* iPhone follow-up: a closed disclosure must occupy no space. */
@media(max-width:749px){
.jl[data-ready=true]:not([data-open=true]) .jl__gifts-stage{display:none!important;padding:0!important}
.jl.jl.jl .jl__stamp{box-sizing:border-box;width:66px;height:66px;padding:5px;gap:2px;font-size:8px!important;line-height:1.12!important;letter-spacing:0!important;right:-2%}
.jl.jl.jl .jl__stamp strong{font-size:21px;line-height:1}
.jl.jl.jl .jl__scene .jl__reveal{background:transparent!important;box-shadow:none!important;border:1px solid currentColor!important;min-height:44px;padding:8px 14px;margin:8px 0;border-radius:6px;transform:none!important}
.jl .jl__shopping{gap:8px}.jl .jl__cover{min-height:68px}.jl .jl__cover img{height:54px}.jl .jl__mobile-products .jl__planner{margin-bottom:10px}
}''')
edit('june-with-extras',limited)
edit('june-layer-the-table',lambda s:css(s,'''/* Compact mobile arrangement and continuous purchase card. */
@media(max-width:749px){
.jt .jt__stack{height:195px!important}.jt .jt__piece{top:calc(var(--jt-order)*44px);height:calc(88px + var(--jt-order)*14px)}
.jt[data-stacked=true] .jt__piece{top:calc(65px - var(--jt-order)*8px)}
.jt.jt.jt .jt__modes{display:grid;grid-template-columns:1fr 1fr;border:0;border-radius:0;padding:0;gap:8px;margin-top:8px!important}
.jt.jt.jt .jt__modes button{border:1px solid currentColor;border-radius:6px;padding:8px;transform:none!important;min-height:44px}
.jt .jt__products>[data-product]{display:grid;grid-template-columns:128px minmax(0,1fr);gap:6px 14px;align-items:start}
.jt .jt__original{grid-column:1;grid-row:1/span 2;width:128px;height:165px;margin:0}
.jt .jt__product-name{grid-column:2;grid-row:1;align-self:end}.jt .jt__price{grid-column:2;grid-row:2;align-self:start}
.jt .jt__primary,.jt .jt__detail{grid-column:1/-1}.jt .jt__primary{margin-top:8px}
.jt .jt__products{padding-top:8px}
}'''))
edit('june-shop-the-corner',lambda s:css(s,'''/* Keep the real product image beside its buying information on mobile. */
@media(max-width:749px){
.jcorner .jcorner__item{grid-template-columns:128px minmax(0,1fr)!important;gap:8px 14px;align-items:start}
.jcorner .jcorner__item june-photo-viewer{grid-column:1;grid-row:1/span 2;width:128px;height:178px}
.jcorner .jcorner__item>div{display:contents}.jcorner .jcorner__title{grid-column:2;grid-row:1;align-self:end;margin:0}
.jcorner .jcorner__price{grid-column:2;grid-row:2;margin:0!important}.jcorner .jcorner__link{grid-column:1/-1;justify-content:space-between;margin-top:8px}
.jcorner .jcorner__spec{grid-column:1/-1}.jcorner .jcorner__spec:empty{display:none}
.jcorner .jcorner__footer{padding-top:0}.jcorner .jcorner__footer>.jcorner__primary{justify-content:flex-start;padding-left:0}
}'''))
def mystery(s):
 s=s.replace('</span></a></li>', '</span><svg class="jmystery__tier-arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a></li>')
 return css(s,''' .jmystery__tier-arrow{display:none}
@media(max-width:749px){
.jmystery .jmystery__tiers a:after{content:none}.jmystery .jmystery__tier-arrow{display:block;position:absolute;right:0;top:50%;width:18px;height:18px;transform:translateY(-50%)}
.jmystery .jmystery__tiers a{display:grid;grid-template-columns:minmax(95px,.7fr) minmax(0,1fr);gap:12px;min-height:64px;text-decoration:none}
.jmystery .jmystery__tiers a>span{text-align:right;line-height:1.4}.jmystery .jmystery__tiers .jmoney{white-space:nowrap}
}''')
edit('june-a-little-curious',mystery)
