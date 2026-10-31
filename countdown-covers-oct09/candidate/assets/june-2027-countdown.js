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
      if (this.playButton) { this.playButton.hidden = false; this.playButton.addEventListener('click', this.onCelebrate); }
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
          this.peekTimers.set(card,setTimeout(()=>this.closePeeks(),(Number(this.dataset.peekDuration)||6)*1000));
        }
      };
      this.onPeekKey=(event)=>{if(event.key==='Escape') this.closePeeks();};
      this.addEventListener('click',this.onPeek);
      this.addEventListener('keydown',this.onPeekKey);
      this.tick();
      if (Number.isFinite(this.target) && this.target > Date.now()) this.timer = setInterval(() => this.tick(), 1000);
    }
    disconnectedCallback() {
      clearInterval(this.timer);
      this.closePeeks();
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
    celebrate() {
      if (this.reduced.matches || this.querySelector('[data-confetti]')) return;
      for (let i=0;i<28;i++) {
        const piece=document.createElement('span');
        piece.className='june-count__spark'; piece.dataset.confetti=''; piece.setAttribute('aria-hidden','true');
        this.appendChild(piece);
        const x=(Math.random()-.5)*Math.min(this.clientWidth,900);
        const y=-80-Math.random()*310;
        const animation=piece.animate([
          {transform:'translate(0,0) rotate(0deg)',opacity:1},
          {transform:`translate(${x*.7}px,${y}px) rotate(${i*30}deg)`,opacity:1,offset:.55},
          {transform:`translate(${x}px,160px) rotate(${i*55}deg)`,opacity:0}
        ],{duration:1100+Math.random()*450,easing:'cubic-bezier(.2,.7,.3,1)'});
        animation.onfinish=()=>piece.remove();
      }
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
