from pathlib import Path
import re
p=Path(__file__).parent/'theme/sections/june-other-chapters.liquid'
s=p.read_text(encoding='utf-8')
s=s.replace("&&this.dataset.editor!=='true'",'')
s=s.replace('this.setup()}\n setup()', "this.addEventListener('shopify:block:select',e=>{const i=this.scenes.findIndex(s=>s.dataset.block===e.detail?.blockId);if(i>=0&&this.pinned){cancelAnimationFrame(this.selectionFrame);this.selectionFrame=requestAnimationFrame(()=>this.seekScene(i))}},o);this.setup()}\n seekScene(index){const phase=[2,5,8][index];if(phase===undefined)return;const beat=this.durations.slice(0,phase).reduce((a,b)=>a+b,0)+this.durations[phase]*.6;window.scrollTo({top:window.scrollY+this.getBoundingClientRect().top-this.offset+beat*this.unit,behavior:'instant'});this.render()}\n setup()")
s=s.replace('disconnectedCallback(){this.controller?.abort();','disconnectedCallback(){this.controller?.abort();cancelAnimationFrame(this.selectionFrame);')
p.write_text(s,encoding='utf-8')
(p.parents[2]/'sequence.js').write_text(re.search(r'{% javascript %}(.*?){% endjavascript %}',s,re.S)[1],encoding='utf-8')
