
if (!customElements.get('june-make-room')) {
  customElements.define('june-make-room', class extends HTMLElement {
    connectedCallback() {
      if (this.ready) { document.addEventListener('shopify:block:select', this.editorHandler); this.setupTextSequence(); return; }
      this.ready = true;
      this.tabs = [...this.querySelectorAll('[data-target]')];
      this.panels = [...this.querySelectorAll('[data-panel]')];
      this.querySelector('.jh__tabs').setAttribute('role', 'tablist');
      this.tabs.forEach(tab => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', this.id + '-' + tab.dataset.target);
        tab.addEventListener('click', event => { event.preventDefault(); this.select(tab.dataset.target); });
        tab.addEventListener('keydown', event => {
          const index = this.tabs.indexOf(tab);
          let next;
          if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length;
          if (event.key === 'ArrowLeft') next = (index + this.tabs.length - 1) % this.tabs.length;
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = this.tabs.length - 1;
          if (event.key === ' ') { event.preventDefault(); this.select(tab.dataset.target); }
          if (next !== undefined) { event.preventDefault(); this.tabs[next].focus(); this.select(this.tabs[next].dataset.target); }
        });
      });
      this.panels.forEach(panel => {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', this.id + '-tab-' + panel.dataset.panel);
        panel.tabIndex = 0;
      });
      const launch = this.querySelector('.jh__form');
      this.select(launch && (launch.querySelector('.jh__success, .jh__error') || location.hash.startsWith('#' + this.id + '-launch')) ? 'dated' : 'undated');
      launch?.addEventListener('submit', () => { launch.action = launch.action.split('#')[0] + '#' + this.id + '-launch'; });
      this.editorHandler = event => { if (this.contains(event.target) && event.target.closest('.jh__life-item')) this.select('life'); };
      document.addEventListener('shopify:block:select', this.editorHandler);
      this.setupTextSequence();
    }
    disconnectedCallback() {
      document.removeEventListener('shopify:block:select', this.editorHandler);
      this.textObserver?.disconnect();
      this.motionPreference?.removeEventListener('change', this.motionHandler);
      this.stopTextSequence();
    }
    setupTextSequence() {
      this.motionSpeed = Math.max(.5, Math.min(2, Number(this.dataset.motionSpeed) / 100 || 1));
      this.motionPlays = this.dataset.motionLoop === 'true' ? Infinity : Math.max(1, Math.min(10, Number(this.dataset.motionPlays) || 1));
      this.motionGap = Math.max(1, Math.min(20, Number(this.dataset.motionGap) || 4)) * 1000;
      if (this.dataset.textMotion === 'false') return;
      this.motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
      this.motionHandler = () => { if (this.motionPreference.matches) this.stopTextSequence(); };
      this.motionPreference.addEventListener('change', this.motionHandler);
      const panel = this.querySelector('[data-panel="undated"]');
      const body = panel.querySelector('.jh__body');
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        if (node.parentElement.closest('[data-glow]')) return;
        const pieces = node.textContent.split(/(\bany\b|\byours\b)/gi);
        if (pieces.length < 2) return;
        const fragment = document.createDocumentFragment();
        pieces.forEach((part, index) => {
          if (index % 2) {
            const span = document.createElement('span');
            span.className = 'jh__word-glow'; span.dataset.glow = part.toLowerCase(); span.textContent = part;
            fragment.append(span);
          } else fragment.append(document.createTextNode(part));
        });
        node.replaceWith(fragment);
      });
      document.fonts.ready.then(() => {
        if (!this.isConnected || this.motionPreference.matches || !('IntersectionObserver' in window)) return;
        this.textObserver = new IntersectionObserver(entries => {
          const entry = entries[0];
          if (entry.isIntersecting && entry.intersectionRatio >= .6 && !panel.hidden && !this.textPlayed) {
            this.textPlayed = true; this.textStopped = false;
            this.runTextSequence(panel);
          } else if (!entry.isIntersecting && this.textPlayed) this.stopTextSequence();
        }, { threshold: [0, .6] });
        this.textObserver.observe(panel.querySelector('.jh__copy'));
      });
    }
    stopTextSequence() {
      this.textStopped = true;
      this.textRun = (this.textRun || 0) + 1;
      if (this.dataset.motionLoop === 'true') this.textPlayed = false;
      this.textAnimation?.cancel();
      clearTimeout(this.repeatTimer);
      this.repeatResolve?.();
      this.repeatResolve = null;
    }
    async textStep(element, frames, duration, delay = 100) {
      if (!element || this.textStopped || this.motionPreference.matches || !this.isConnected) return;
      this.textAnimation = element.animate(frames, { duration: duration / this.motionSpeed, delay: delay / this.motionSpeed, easing: 'ease-in-out', fill: 'none' });
      await this.textAnimation.finished;
    }
    async runTextSequence(panel) {
      const sequence = this.textRun || 0;
      try {
        for (let play = 0; play < this.motionPlays && !this.textStopped && sequence === (this.textRun || 0); play++) {
        await this.textStep(panel.querySelector('.jh__title-ink'), [
          { transform: 'scale(1)' }, { transform: 'scale(1.025)', offset: .48 }, { transform: 'scale(1)' }
        ], 700, 180);
        const plans = panel.querySelector('.jh__subtitle strong');
        if (plans) {
          const subtitle = plans.parentElement;
          const base = parseFloat(getComputedStyle(plans).letterSpacing) || 0;
          const peak = base + Math.min(.65, parseFloat(getComputedStyle(plans).fontSize) * .025);
          const height = subtitle.getBoundingClientRect().height;
          const savedSpacing = plans.style.letterSpacing;
          plans.style.letterSpacing = peak + 'px';
          const fits = subtitle.getBoundingClientRect().height <= height + 1 && subtitle.scrollWidth <= subtitle.clientWidth;
          plans.style.letterSpacing = savedSpacing;
          await this.textStep(plans, fits ? [
            { letterSpacing: base + 'px' }, { letterSpacing: peak + 'px', offset: .5 }, { letterSpacing: base + 'px' }
          ] : [{ opacity: 1 }, { opacity: .7, offset: .5 }, { opacity: 1 }], 750);
        }
        const accent = getComputedStyle(this).getPropertyValue('--jh-accent').trim() || '#d5ff46';
        const glow = [
          { backgroundColor: `color-mix(in srgb, ${accent} 0%, transparent)`, boxShadow: `0 0 0 color-mix(in srgb, ${accent} 0%, transparent)` },
          { backgroundColor: `color-mix(in srgb, ${accent} 45%, transparent)`, boxShadow: `0 0 12px color-mix(in srgb, ${accent} 60%, transparent)`, offset: .45 },
          { backgroundColor: `color-mix(in srgb, ${accent} 0%, transparent)`, boxShadow: `0 0 0 color-mix(in srgb, ${accent} 0%, transparent)` }
        ];
        await this.textStep(panel.querySelector('[data-glow="any"]'), glow, 650);
        await this.textStep(panel.querySelector('[data-glow="yours"]'), glow, 750);
        if (!this.textStopped && play + 1 < this.motionPlays) {
          await new Promise(resolve => { this.repeatResolve = resolve; this.repeatTimer = setTimeout(resolve, this.motionGap); });
          this.repeatResolve = null;
        }
        }
        if (this.dataset.motionLoop !== 'true') this.textObserver?.disconnect();
      } catch (error) {
        if (error.name !== 'AbortError') console.error('June text sequence:', error);
      }
    }
    select(key) {
      if (key !== 'undated' && this.textPlayed) this.stopTextSequence();
      this.tabs.forEach(tab => { const active = tab.dataset.target === key; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
      this.panels.forEach(panel => { panel.hidden = panel.dataset.panel !== key; });
    }
  });
}
