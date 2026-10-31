    setupYearSequence() {
      this.year = this.querySelector('.jh__year[data-year-effect]');
      this.yearControl = this.querySelector('.jh__year-control');
      if (!this.year || !this.yearControl) return;
      this.yearMedia = matchMedia('(prefers-reduced-motion: reduce)');
      this.yearInView = false;
      this.yearMotionHandler = () => {
        if (this.yearMedia.matches) this.stopYearSequence();
        else if (this.activeTab === 'dated') this.startYearSequence();
        this.updateYearPlayback();
      };
      this.yearVisibilityHandler = () => this.updateYearPlayback();
      this.yearControlHandler = () => {
        if (this.yearDone) { this.yearUserPaused = false; this.startYearSequence(); }
        else { this.yearUserPaused = !this.yearUserPaused; this.updateYearPlayback(); }
      };
      this.yearControl.addEventListener('click', this.yearControlHandler);
      this.yearMedia.addEventListener('change', this.yearMotionHandler);
      document.addEventListener('visibilitychange', this.yearVisibilityHandler);
      if ('IntersectionObserver' in window) {
        this.yearObserver = new IntersectionObserver(entries => {
          this.yearInView = entries[0].isIntersecting;
          this.updateYearPlayback();
        }, { threshold: 0 });
        this.yearObserver.observe(this.year);
      } else this.yearInView = true;
      if (this.activeTab === 'dated') this.startYearSequence();
    }
    updateYearPlayback() {
      if (!this.yearControl) return;
      const enabled = this.year.dataset.enabled !== 'false' && !this.yearMedia.matches;
      this.yearControl.hidden = !enabled;
      this.yearControl.textContent = this.yearDone ? this.yearControl.dataset.replayLabel : this.yearUserPaused ? this.yearControl.dataset.playLabel : this.yearControl.dataset.pauseLabel;
      this.yearControl.setAttribute('aria-pressed', String(Boolean(this.yearUserPaused)));
      if (!this.yearAnimation || this.yearDone) return;
      const paused = !enabled || this.activeTab !== 'dated' || !this.yearInView || document.hidden || this.yearUserPaused;
      if (paused) this.yearAnimation.pause();
      else this.yearAnimation.play();
    }
    stopYearSequence() {
      this.yearRun = (this.yearRun || 0) + 1;
      this.yearAnimation?.cancel();
      this.yearAnimation = null;
      this.yearDone = false;
      if (this.year) { delete this.year.dataset.activeDigit; delete this.year.dataset.sequencePlay; }
    }
    async yearStep(element, frames, duration, iterations = 1) {
      if (!this.isConnected || this.yearMedia.matches) return;
      this.yearAnimation = element.animate(frames, { duration, iterations, fill: 'none', easing: 'linear' });
      this.updateYearPlayback();
      await this.yearAnimation.finished;
    }
    async startYearSequence() {
      this.stopYearSequence();
      this.updateYearPlayback();
      if (this.year.dataset.enabled === 'false' || this.yearMedia.matches || this.activeTab !== 'dated') return;
      const run = this.yearRun;
      const number = (key, fallback) => Number.isFinite(Number(this.year.dataset[key])) ? Number(this.year.dataset[key]) : fallback;
      const speed = Math.max(.5, Math.min(2, number('speed', 100) / 100));
      const duration = Math.max(400, number('rate', 700) / speed);
      const fade = Math.max(.001, Math.min(.4, number('fade', 20) / 100));
      const opacity = Math.max(.2, Math.min(1, number('intensity', 100) / 100));
      const frames = [{opacity:0,offset:0},{opacity,offset:fade},{opacity,offset:.5},{opacity:0,offset:.5+fade},{opacity:0,offset:1}];
      const digits = [...this.year.querySelectorAll('.jh__digit')];
      const plays = this.year.dataset.loop === 'true' ? Infinity : Math.max(1, Math.min(10, number('plays', 1)));
      const wait = ms => ms > 0 ? this.yearStep(this.year, [{opacity:1},{opacity:1}], ms / speed) : Promise.resolve();
      try {
        await wait(number('start', 600));
        for (let play = 0; play < plays && run === this.yearRun; play++) {
          this.year.dataset.sequencePlay = String(play + 1);
          for (let i = 0; i < digits.length && run === this.yearRun; i++) {
            this.year.dataset.activeDigit = String(i + 1);
            await this.yearStep(digits[i].querySelector('.jh__digit-flash'), frames, duration, Math.max(1, Math.min(12, Number(digits[i].dataset.blinks) || i + 2)));
            delete this.year.dataset.activeDigit;
            if (i < digits.length - 1) await wait(number('gap', 400));
          }
          if (play + 1 < plays && run === this.yearRun) await wait(number('repeatGap', 3000));
        }
        if (run === this.yearRun) { this.yearDone = true; this.yearAnimation = null; this.updateYearPlayback(); }
      } catch (error) {
        if (error.name !== 'AbortError') console.error('June year effect:', error);
      }
    }
