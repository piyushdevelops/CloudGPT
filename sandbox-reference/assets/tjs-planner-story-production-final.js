(() => {
  function init(root) {
    if (!root || root.dataset.storyReady) return;
    root.dataset.storyReady = '1';
    const track=root.querySelector('[data-track]'),slides=[...root.querySelectorAll('[data-slide]')],nav=[...root.querySelectorAll('[data-nav]')],progress=root.querySelector('[data-progress]'),number=root.querySelector('[data-progress-number]'),chapter=root.querySelector('[data-chapter]'),activeLabel=root.querySelector('[data-active-label]'),wash=root.querySelector('[data-wash]'),modal=root.querySelector('[data-modal]'),modalImage=root.querySelector('[data-modal-image]');
    let current=-1,ticking=false;
    if(!track||!slides.length)return;
    const clamp=(n,a,b)=>Math.min(Math.max(n,a),b),label=i=>`${String(i+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    const getProgress=()=>{const rect=track.getBoundingClientRect(),dist=track.offsetHeight-innerHeight;return dist>0?clamp(-rect.top/dist,0,1):0};
    const labels=['Dated planners','Wedding planners','Personal planning','Baby record books','Travel journals','Undated planners'];
    const setCurrent=i=>{if(i===current)return;current=i;nav.forEach((b,n)=>b.classList.toggle('is-active',n===i));if(number)number.textContent=label(i);if(chapter)chapter.textContent=label(i);if(activeLabel)activeLabel.textContent=labels[i]||'Planner collection';if(wash)wash.style.background=slides[i]?.dataset.bg||'#EFA58F'};
    const render=()=>{ticking=false;const p=getProgress(),count=slides.length,active=Math.min(count-1,Math.floor(p*count));setCurrent(active);if(progress)progress.style.transform=`scaleX(${p})`;slides.forEach((slide,i)=>{const seg=1/count,raw=(p-i*seg)/seg,local=clamp(raw,0,1);let opacity=1,x=0;if(raw<0){const a=clamp(-raw,0,1);opacity=1-a;x=24*a}else if(raw>1&&i<count-1){const a=clamp(raw-1,0,1);opacity=1-a;x=-24*a}slide.classList.toggle('is-visible',opacity>.001);slide.classList.toggle('is-current',i===active);slide.style.opacity=opacity;slide.style.transform=`translate3d(${x}px,0,0)`;const media=slide.querySelector('[data-media]');if(media){const intro=clamp(local/.22,0,1);media.style.transform=`translate3d(0,${Math.sin(local*Math.PI)*-4}px,0) scale(${.96+intro*.04}) rotate(${(1-intro)*(i%2?-2:2)}deg)`}const word=slide.querySelector('[data-word]');if(word)word.style.transform=`translate(calc(-50% + ${(local-.5)*(i%2?28:-28)}px),-50%)`;const copy=slide.querySelector('[data-copy]');if(copy){let o=local<.12?local/.12:local>.88?1-(local-.88)/.12:1;o=clamp(o,0,1);copy.style.opacity=o;copy.style.transform=`translate3d(${(1-o)*(i%2?-10:10)}px,0,0)`}})};
    const request=()=>{if(ticking)return;ticking=true;requestAnimationFrame(render)};
    nav.forEach((button,i)=>button.addEventListener('click',()=>{const top=scrollY+track.getBoundingClientRect().top,dist=track.offsetHeight-innerHeight;scrollTo({top:top+dist*((i+.08)/slides.length),behavior:'smooth'})}));
    root.querySelectorAll('[data-expand]').forEach(button=>{if(matchMedia('(max-width:749px)').matches){button.tabIndex=-1;button.setAttribute('aria-disabled','true')}button.addEventListener('click',()=>{if(!matchMedia('(min-width:750px)').matches)return;const slide=button.closest('[data-slide]'),img=button.querySelector('img');if(!slide?.classList.contains('is-current')||!img||!modal||!modalImage)return;modalImage.src=img.currentSrc||img.src;modalImage.alt=img.alt||'';modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden'})});
    const close=()=>{modal?.classList.remove('is-open');modal?.setAttribute('aria-hidden','true');document.documentElement.style.overflow=''};
    root.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',close));
    addEventListener('scroll',request,{passive:true});addEventListener('resize',request);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    if(wash)wash.style.background=slides[0].dataset.bg||'#EFA58F';render();
  }
  document.querySelectorAll('[data-tjs-story]').forEach(init);
  document.addEventListener('shopify:section:load',e=>init(e.target.querySelector('[data-tjs-story]')));
})();
