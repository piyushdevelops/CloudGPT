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
      this.tick();
      if (Number.isFinite(this.target) && this.target > Date.now()) this.timer = setInterval(() => this.tick(), 1000);
    }
    disconnectedCallback() { clearInterval(this.timer); }
    tick() {
      const remaining = JuneLaunchCountdown.remaining(this.target, Date.now());
      if (!remaining) {
        this.querySelector('[data-grid]').hidden = true;
        this.querySelector('[data-intro]').hidden = true;
        this.querySelector('[data-date]').textContent = 'Launch date to be announced';
        return;
      }
      this.querySelector('[data-date]').textContent = new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'}).format(this.target) + ' IST';
      for (const unit of ['days','hours','minutes','seconds']) this.querySelector(`[data-unit="${unit}"]`).textContent = String(remaining[unit]).padStart(2,'0');
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
