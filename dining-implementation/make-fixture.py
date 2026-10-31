from pathlib import Path
import re
p=Path(__file__).parent
html=(p/'rendered.html').read_text(encoding='utf-8')
article=re.search(r'<article[\s\S]*?</article>',html).group(0)
second=article.replace('data-initial="1"','data-initial="2"').replace('data-block="base"','data-block="test-second"').replace('The table edit','Second test scene').replace('-0-','-test-')
html=html.replace('</article>','</article>'+second,1).replace('</june-dining-scene>','<div class="jds__controls"><button data-prev>Previous scene</button><span data-count></span><button data-next>Next scene</button><button data-play>Pause</button></div></june-dining-scene>')
html=html.replace('src="//','src="https://').replace('srcset="//','srcset="https://').replace(', //',', https://')
style='body{margin:0} .jds{--jt-bg:#f8f7fc;--jt-ink:#242329;--jt-accent:#c2afea;--jt-body-font:Poppins,sans-serif;--jt-body-size:16px;--jt-heading-font:Poppins,sans-serif;--jt-heading-weight:900;--jt-heading-size:54px;--jt-heading-mobile:40px;--jt-heading-leading:1.05;--jt-title-font:Poppins,sans-serif;--jt-title-weight:700;--jt-title-size:26px;--jt-title-mobile:23px;--jt-title-leading:1.3;--jt-button-font:Poppins,sans-serif;--jt-button-size:14px;--jt-button-mobile:14px;--jt-button-weight:700;--jt-button-leading:1.3}'
test='''const report=document.getElementById('test-log');const t=performance.now();const root=document.querySelector('june-dining-scene');const log=[];new MutationObserver(()=>{const a=root.querySelector('[data-scene]:not([hidden])');log.push({ms:Math.round(performance.now()-t),scene:a.dataset.title,product:a.querySelector('[data-product]:not([hidden]) h3').textContent});report.textContent=JSON.stringify(log)}).observe(root,{subtree:true,attributes:true,attributeFilter:['hidden']});'''
out='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet"><style>'+style+(p/'scene.css').read_text(encoding='utf-8')+'</style>'+html+'<output id="test-log"></output><script>'+ (p/'scene.js').read_text(encoding='utf-8')+test+'</script>'
(p.parent/'interactive-proof-prototype/dining-slideshow-test.html').write_text(out,encoding='utf-8')
