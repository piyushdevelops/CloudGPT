(() => {
  if (customElements.get('june-launch-countdown')) return;
  class JuneLaunchCountdown extends HTMLElement {
    static remaining(target, now) {
      if (!Number.isFinite(target)) return null;
      const total = Math.max(0, Math.ceil((target - now) / 1000));
      return {days:Math.floor(total / 86400),hours:Math.floor(total / 3600) % 24,minutes:Math.floor(total / 60) % 60,seconds:total % 60,total};
    }
    connectedCallback() {
      clearInterval(this.timer);
      const value = this.dataset.launch || '';
      this.target = /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? Date.parse(value) : NaN;
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.playButton = this.querySelector('[data-celebrate]');
      this.onCelebrate = () => this.celebrate();
      if (this.playButton) { this.playButton.hidden = !this.querySelector('[data-button-covers] img'); this.playButton.addEventListener('click', this.onCelebrate); }
      this.peekTimers = new Map();
      this.onPeek = (event) => {
        const button=event.target.closest('[data-peek]');
        if (!button || !this.contains(button)) return;
        const card=button.closest('.has-peek');
        const opening=!card.classList.contains('is-revealed');
        this.closePeeks();
        if (opening) {
          card.classList.add('is-revealed'); button.setAttribute('aria-expanded','true');
          button.setAttribute('aria-label','Hide secret planner cover');
          this.peekTimers.set(card,setTimeout(()=>this.closePeeks(),(Number(this.dataset.peekDuration)||1)*1000));
        }
      };
      this.onPeekKey=(event)=>{if(event.key==='Escape') {this.closePeeks();this.clearParty();}};
      this.addEventListener('click',this.onPeek);
      this.addEventListener('keydown',this.onPeekKey);
      this.tick();
      if (Number.isFinite(this.target) && this.target > Date.now()) this.timer = setInterval(() => this.tick(), 1000);
    }
    disconnectedCallback() {
      clearInterval(this.timer);
      this.closePeeks();
      this.clearParty();
      this.removeEventListener('click',this.onPeek);
      this.removeEventListener('keydown',this.onPeekKey);
      if (this.playButton) this.playButton.removeEventListener('click', this.onCelebrate);
      this.querySelectorAll('[data-confetti]').forEach(el => el.remove());
    }
    closePeeks() {
      if(this.peekTimers) {this.peekTimers.forEach(timer=>clearTimeout(timer));this.peekTimers.clear();}
      this.querySelectorAll('.is-revealed').forEach(card=>{
        card.classList.remove('is-revealed');
        const button=card.querySelector('[data-peek]');
        button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Reveal a secret planner cover');
      });
    }
    clearParty() {
      clearTimeout(this.partyTimer);
      if (this.partyLayer) {this.partyLayer.remove();this.partyLayer=null;}
    }
    celebrate() {
      if(this.partyLayer) return;
      const covers=Array.from(this.querySelectorAll('[data-button-covers] img'));
      if(!covers.length) return;
      this.closePeeks();
      const layer=document.createElement('div');
      layer.className='june-count__party';layer.setAttribute('aria-hidden','true');
      this.appendChild(layer);this.partyLayer=layer;
      const stage=document.createElement('div');stage.className='june-count__party-stage';layer.appendChild(stage);
      covers.slice(0,2).forEach((source,i)=>{
        const cover=document.createElement('div');
        const artwork=source.cloneNode(true);artwork.removeAttribute('loading');artwork.alt='';
        cover.className='june-count__party-cover june-count__planner';cover.appendChild(artwork);stage.appendChild(cover);
        const sign=i===0?-1:1;
        cover.style.setProperty('--fan',sign*12+'deg');
        if(!this.reduced.matches) cover.animate([
          {transform:'translateY(110px) scale(.35) rotate(0deg)',opacity:0},
          {transform:`translateY(0) scale(1) rotate(${sign*12}deg)`,opacity:1,offset:.22},
          {transform:`translateY(-6px) scale(1.04) rotate(${sign*15}deg)`,opacity:1,offset:.8},
          {transform:`translateY(-35px) scale(.85) rotate(${sign*20}deg)`,opacity:0}
        ],{duration:1000,easing:'cubic-bezier(.2,.7,.3,1)'});
      });
      if(!this.reduced.matches) for(let i=0;i<36;i++){
        const piece=document.createElement('span');piece.className='june-count__party-bit';
        piece.innerHTML=i%3===0?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16 0C18 11 21 14 32 16C21 18 18 21 16 32C14 21 11 18 0 16C11 14 14 11 16 0Z"/></svg>':i%3===1?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="4" aria-hidden="true" focusable="false"><path d="M16 2v28M2 16h28M6 6l20 20M6 26L26 6"/></svg>':'';
        piece.style.setProperty('--bit-color',i%2?'var(--count-accent)':'var(--count-bg)');
        layer.appendChild(piece);
        const angle=i/36*Math.PI*2;
        const radius=Math.min(window.innerWidth*.46,420)*( .65+Math.random()*.35);
        const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;
        piece.animate([
          {transform:'translate(-50%,-50%) scale(0)',opacity:0},
          {transform:`translate(calc(-50% + ${x*.8}px),calc(-50% + ${y*.8}px)) rotate(${i*20}deg) scale(1)`,opacity:1,offset:.35},
          {transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) rotate(${i*35}deg) scale(.5)`,opacity:0}
        ],{duration:1000,easing:'cubic-bezier(.2,.6,.4,1)'});
      }
      this.querySelector('[data-status]').textContent='Two secret planner covers. Just a glimpse!';
      this.partyTimer=setTimeout(()=>this.clearParty(),1000);
    }
    tick() {
      const remaining = JuneLaunchCountdown.remaining(this.target, Date.now());
      if (!remaining) {
        this.querySelector('[data-grid]').hidden = true;
        this.querySelector('[data-intro]').hidden = true;
        this.querySelector('[data-date]').textContent = 'Launch date to be announced';
        return;
      }
      this.querySelector('[data-date]').textContent = new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'}).format(this.target) + ' IST';
      for (const unit of ['days','hours','minutes','seconds']) {
        const el=this.querySelector(`[data-unit="${unit}"]`);
        const value=String(remaining[unit]).padStart(2,'0');
        if (el.textContent !== value) {
          const initialized=el.textContent !== '—';
          el.textContent=value;
          if (initialized && this.dataset.motion === 'true' && !this.reduced.matches) el.animate(
            [{transform:'translateY(-10px)',opacity:.45},{transform:'translateY(0)',opacity:1}],
            {duration:280,easing:'cubic-bezier(.2,.8,.2,1)'}
          );
        }
      }
      if (remaining.total === 0) {
        clearInterval(this.timer);
        this.querySelector('[data-grid]').hidden = true;
        this.querySelector('[data-intro]').hidden = true;
        this.querySelector('[data-complete]').hidden = false;
        const status = this.querySelector('[data-status]');
        if (!status.textContent) status.textContent = this.querySelector('[data-complete] p').textContent;
      }
    }
  }
  customElements.define('june-launch-countdown', JuneLaunchCountdown);
})();
