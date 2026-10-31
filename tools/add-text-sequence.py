from pathlib import Path
r=Path('/home/codespace/june-shop-redesign/section-01');s=(r/'before/text-sequence.liquid').read_text()
s=s.replace('<h1 class="jh__title">{{ section.settings.heading | escape }}</h1>','<h1 class="jh__title"><span class="jh__title-ink">{{ section.settings.heading | escape }}</span></h1>')
s=s.replace('{% endstylesheet %}','''
.jh__title-ink{display:inline-block;width:100%;transform-origin:left center}
.jh__word-glow{border-radius:.2em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.jh__subtitle strong{display:inline-block;white-space:nowrap;transform-origin:left center}
{% endstylesheet %}''',1)
s=s.replace("      document.addEventListener('shopify:block:select', this.editorHandler);", "      document.addEventListener('shopify:block:select', this.editorHandler);\n      this.setupTextSequence();")
s=s.replace("    disconnectedCallback() { document.removeEventListener('shopify:block:select', this.editorHandler); }", """    disconnectedCallback() {
      document.removeEventListener('shopify:block:select', this.editorHandler);
      this.textObserver?.disconnect();
      this.motionPreference?.removeEventListener('change', this.motionHandler);
      this.stopTextSequence();
    }
    setupTextSequence() {
      this.motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
      this.motionHandler = () => { if (this.motionPreference.matches) this.stopTextSequence(); };
      this.motionPreference.addEventListener('change', this.motionHandler);
      const panel = this.querySelector('[data-panel="undated"]');
      const body = panel.querySelector('.jh__body');
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const pieces = node.textContent.split(/(\\bany\\b|\\byours\\b)/gi);
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
            this.textPlayed = true;
            this.runTextSequence(panel);
          } else if (!entry.isIntersecting && this.textPlayed) this.stopTextSequence();
        }, { threshold: [0, .6] });
        this.textObserver.observe(panel.querySelector('.jh__copy'));
      });
    }
    stopTextSequence() {
      this.textStopped = true;
      this.textAnimation?.cancel();
    }
    async textStep(element, frames, duration, delay = 100) {
      if (!element || this.textStopped || this.motionPreference.matches || !this.isConnected) return;
      this.textAnimation = element.animate(frames, { duration, delay, easing: 'ease-in-out', fill: 'none' });
      await this.textAnimation.finished;
    }
    async runTextSequence(panel) {
      try {
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
          ] : [{ transform: 'scaleX(1)' }, { transform: 'scaleX(1.025)', offset: .5 }, { transform: 'scaleX(1)' }], 750);
        }
        const glow = [
          { backgroundColor: 'rgba(213,255,70,0)', boxShadow: '0 0 0 rgba(213,255,70,0)' },
          { backgroundColor: 'rgba(213,255,70,.45)', boxShadow: '0 0 12px rgba(213,255,70,.6)', offset: .45 },
          { backgroundColor: 'rgba(213,255,70,0)', boxShadow: '0 0 0 rgba(213,255,70,0)' }
        ];
        await this.textStep(panel.querySelector('[data-glow="any"]'), glow, 650);
        await this.textStep(panel.querySelector('[data-glow="yours"]'), glow, 750);
        this.textObserver?.disconnect();
      } catch (error) {
        if (error.name !== 'AbortError') console.error('June text sequence:', error);
      }
    }""")
s=s.replace('    select(key) {','    select(key) {\n      if (key !== \'undated\') this.stopTextSequence();')
# Do not mark as stopped during initial non-undated selection unless a sequence actually started.
s=s.replace("if (key !== 'undated') this.stopTextSequence();", "if (key !== 'undated' && this.textPlayed) this.stopTextSequence();")
(r/'theme/sections/june-make-room.liquid').write_text(s)
