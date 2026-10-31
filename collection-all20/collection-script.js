
  (() => {
    const showSectionToast = (root, message) => {
      const toast = root?.querySelector?.('[data-toast]');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('is-visible');
      clearTimeout(toast._tjsTimer);
      toast._tjsTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
    };







    if (customElements.get('tjs-final-collection')) {
      return;
    }

    class TjsFinalCollection extends HTMLElement {
      connectedCallback() {
        if (this.dataset.ready === 'true') return;
        this.dataset.ready = 'true';

        this.sectionId = this.dataset.sectionId;
        this.grid = this.querySelector('[data-grid]');
        this.drawer = this.querySelector('[data-filter-drawer]');
        this.status = this.querySelector('[data-status]');
        this.toast = this.querySelector('[data-toast]');
        this.floatingType = this.querySelector('[data-floating-type]');
        this.floatingAnchor = this.querySelector('[data-floating-anchor]');
        this.lastTrigger = null;
        this.requestController = null;
        this.previewController = null;
        this.scrollTicking = false;

        this.boundClick = this.handleClick.bind(this);
        this.boundChange = this.handleChange.bind(this);
        this.boundSubmit = this.handleSubmit.bind(this);
        this.boundScroll = this.handleScroll.bind(this);
        this.boundResize = this.handleResize.bind(this);
        this.addEventListener('click', this.boundClick);
        this.addEventListener('change', this.boundChange);
        this.addEventListener('submit', this.boundSubmit);

        this.initializeProductCards(this);
        this.initializeFilterSwatches();
        this.initializeTypeTabs();
        this.rankFilterGroups();
        this.observeCards();
        this.setupStickyControls();
        this.setupFloatingType();
        window.addEventListener('scroll', this.boundScroll, { passive: true });
        window.addEventListener('resize', this.boundResize);
        this.ensureInStockFilter();
        this.restoreCollectionPosition();
      }

      disconnectedCallback() {
        this.removeEventListener('click', this.boundClick);
        this.removeEventListener('change', this.boundChange);
        this.removeEventListener('submit', this.boundSubmit);
        window.removeEventListener('scroll', this.boundScroll);
        window.removeEventListener('resize', this.boundResize);
        this.revealObserver?.disconnect();
        this.requestController?.abort();
        this.previewController?.abort();
        clearTimeout(this.previewTimer);
      }

      initializeTypeTabs() {
        const priorities = (this.dataset.typePriority || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
        const maximum = Number(this.dataset.maxTypeTabs) || 8;
        this.querySelectorAll('[data-type-rail]').forEach(rail => {
          const tabs = [...rail.querySelectorAll('[data-type-count]')];
          tabs.sort((a, b) => {
            const aName = (a.dataset.tabValue || a.querySelector('span')?.textContent || '').trim().toLowerCase();
            const bName = (b.dataset.tabValue || b.querySelector('span')?.textContent || '').trim().toLowerCase();
            const aPriority = priorities.indexOf(aName);
            const bPriority = priorities.indexOf(bName);
            if (aPriority !== bPriority) return (aPriority < 0 ? 999 : aPriority) - (bPriority < 0 ? 999 : bPriority);
            return (Number(b.dataset.typeCount) || 0) - (Number(a.dataset.typeCount) || 0) || aName.localeCompare(bName);
          });
          tabs.forEach((tab, index) => {
            rail.appendChild(tab);
            tab.hidden = index >= maximum && !tab.classList.contains('is-active');
          });
          if (rail.classList.contains('tjs-final-collection__tabs')) {
            rail.addEventListener('scroll', () => this.updateTypeScrollCue(), { passive: true });
          }
        });
        const editorial = this.querySelector('.tjs-final-collection__editorial-types');
        if (editorial) {
          const links = [...editorial.querySelectorAll('[data-type-count]')];
          links.sort((a, b) => {
            const aName = a.dataset.tabValue?.toLowerCase() || '';
            const bName = b.dataset.tabValue?.toLowerCase() || '';
            const aPriority = priorities.indexOf(aName);
            const bPriority = priorities.indexOf(bName);
            return (aPriority < 0 ? 999 : aPriority) - (bPriority < 0 ? 999 : bPriority) || (Number(b.dataset.typeCount) || 0) - (Number(a.dataset.typeCount) || 0);
          });
          links.forEach((link, index) => { editorial.appendChild(link); link.hidden = index >= 4; });
        }
        requestAnimationFrame(() => this.updateTypeScrollCue());
      }

      updateTypeScrollCue() {
        const rail = this.querySelector('.tjs-final-collection__tabs');
        const button = this.querySelector('[data-scroll-types]');
        if (!rail || !button) return;
        button.hidden = rail.scrollWidth <= rail.clientWidth + 8 || rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 8;
      }

      rankFilterGroups() {
        const form = this.querySelector('[data-filter-form]');
        if (!form) return;
        const groups = [...form.querySelectorAll('[data-filter-group]')];
        groups.sort((a, b) => {
          const active = group => group.querySelectorAll('input:checked').length + (group.querySelector('input[type="number"]:not([value=""])') ? 1 : 0);
          const price = group => group.querySelector('input[type="number"]') ? 1 : 0;
          const available = group => group.querySelectorAll('.tjs-filter-option').length;
          return active(b) - active(a) || price(a) - price(b) || available(b) - available(a);
        });
        const sortField = form.querySelector('input[name="sort_by"]');
        groups.forEach(group => form.insertBefore(group, sortField));
      }

      setupStickyControls() {
        const source = this.querySelector('.tjs-final-collection__header .tjs-final-collection__controls');
        if (!source) return;
        this.stickyControls = source.cloneNode(true);
        this.stickyControls.classList.add('tjs-final-collection__sticky-controls');
        this.stickyControls.setAttribute('aria-label', 'Collection tools');
        this.appendChild(this.stickyControls);
        this.syncStickyControls();
      }

      syncStickyControls() {
        if (!this.stickyControls) return;
        const header = this.querySelector('.tjs-final-collection__header');
        const topOffset = window.innerWidth < 1150 ? 50 : 60;
        const show = header?.getBoundingClientRect().bottom < topOffset && this.getBoundingClientRect().bottom > topOffset + 140;
        this.stickyControls.classList.toggle('is-visible', Boolean(show));
      }

      restoreCollectionPosition() {
        try {
          const key = `tjs-collection:${location.pathname}${location.search}`;
          const saved = sessionStorage.getItem(key);
          if (!saved) return;
          sessionStorage.removeItem(key);
          requestAnimationFrame(() => setTimeout(() => window.scrollTo({ top: Number(saved) || 0, behavior: 'instant' }), 80));
        } catch (error) { /* Storage may be unavailable. */ }
      }

      ensureInStockFilter() {
        if (this.dataset.forceInStock !== 'true') return;
        const param = this.dataset.availabilityParam;
        const value = this.dataset.availabilityValue;
        if (!param || !value) return;
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.getAll(param).includes(value)) return;
        currentUrl.searchParams.set(param, value);
        currentUrl.searchParams.delete('page');
        this.fetchSection(currentUrl.toString(), { updateUrl: true, replaceUrl: true, preserveScroll: true });
      }

      initializeFilterSwatches() {
        this.querySelectorAll('[data-filter-colour]').forEach(swatch => {
          const label = swatch.dataset.filterColour || '';
          const colour = this.resolveFilterColour(label);
          swatch.style.background = colour;
        });
      }

      resolveFilterColour(label) {
        const key = String(label || '').toLowerCase().replace(/[_-]+/g, ' ').trim();

        if (/(multi|rainbow|assorted)/.test(key)) {
          return 'conic-gradient(#E15B64, #F3C969, #58A66C, #4AA7C8, #7B61A8, #E15B64)';
        }
        if (key.includes('black') && key.includes('gold')) {
          return 'linear-gradient(135deg, #151515 0 50%, #D4AF37 50% 100%)';
        }
        if (key.includes('white') && key.includes('gold')) {
          return 'linear-gradient(135deg, #FFFFFF 0 50%, #D4AF37 50% 100%)';
        }
        if (key.includes('cyan') && key.includes('purple')) {
          return 'linear-gradient(135deg, #31B7D7 0 50%, #7E57A2 50% 100%)';
        }
        if (/(clear|transparent)/.test(key)) {
          return 'linear-gradient(135deg, #FFFFFF 0 44%, #D8D8D8 45% 55%, #FFFFFF 56% 100%)';
        }

        const colours = [
          [/rose gold/, '#B76E79'],
          [/navy/, '#1F3155'],
          [/sky blue/, '#87CEEB'],
          [/royal blue/, '#3157A4'],
          [/turquoise|cyan/, '#35B6B4'],
          [/teal/, '#267A78'],
          [/blue/, '#3F6FB5'],
          [/lavender/, '#B7A1D6'],
          [/lilac/, '#C8A2C8'],
          [/violet|purple/, '#7E57A2'],
          [/magenta/, '#C13A8D'],
          [/burgundy|wine/, '#722F37'],
          [/maroon/, '#800000'],
          [/coral/, '#F07F73'],
          [/peach/, '#F6B58D'],
          [/rose|pink/, '#F2A7C2'],
          [/red/, '#C53B38'],
          [/mustard/, '#D4A017'],
          [/orange/, '#E87822'],
          [/yellow/, '#F2CF3A'],
          [/sage/, '#A8B89A'],
          [/mint/, '#A8E6CF'],
          [/olive/, '#7C833A'],
          [/green/, '#3F7D4A'],
          [/wood|natural/, '#A67C52'],
          [/camel|tan/, '#C19A6B'],
          [/khaki/, '#BDB76B'],
          [/brown/, '#7A4E2D'],
          [/beige/, '#D8C3A5'],
          [/cream/, '#FFF3D6'],
          [/ivory/, '#FFF8E7'],
          [/silver/, '#C0C0C0'],
          [/gold/, '#D4AF37'],
          [/charcoal/, '#4A4A4A'],
          [/grey|gray/, '#9A9A9A'],
          [/white/, '#FFFFFF'],
          [/black/, '#161616']
        ];

        return colours.find(([pattern]) => pattern.test(key))?.[1] || '#D9D5CF';
      }

      observeCards() {
        const cards = [...this.querySelectorAll('[data-reveal]:not(.is-visible)')];
        if (!cards.length) return;

        cards.forEach((card, index) => {
          const staggerIndex = index % 8;
          card.style.setProperty('--tjs-reveal-delay', `${staggerIndex * 45}ms`);
        });

        if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          cards.forEach(card => card.classList.add('is-visible'));
          return;
        }

        this.revealObserver?.disconnect();
        this.revealObserver = new IntersectionObserver((entries, observer) => {
          entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            .forEach(entry => {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            });
        }, { rootMargin: '90px 0px', threshold: .06 });

        cards.forEach(card => this.revealObserver.observe(card));
      }

      handleClick(event) {
        const scrollTypes = event.target.closest('[data-scroll-types]');
        if (scrollTypes) {
          const rail = this.querySelector('.tjs-final-collection__tabs');
          rail?.scrollBy({ left: Math.max(rail.clientWidth * .72, 180), behavior: 'smooth' });
          setTimeout(() => this.updateTypeScrollCue(), 350);
          return;
        }

        const productLink = event.target.closest('.tjs-product-card a[href]');
        if (productLink) {
          try { sessionStorage.setItem(`tjs-collection:${location.pathname}${location.search}`, String(window.scrollY)); } catch (error) { /* Storage may be unavailable. */ }
        }

        const singleTab = event.target.closest('[data-single-tab]');
        if (singleTab && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
          event.preventDefault();
          const url = new URL(window.location.href);
          const param = singleTab.dataset.tabParam;
          const value = singleTab.dataset.tabValue;
          const active = singleTab.dataset.tabActive === 'true';
          url.searchParams.delete(param);
          if (value && !active) url.searchParams.append(param, value);
          url.searchParams.delete('page');
          this.fetchSection(url.toString(), { updateUrl: true, preserveScroll: Boolean(singleTab.closest('[data-floating-type]')) });
          return;
        }

        const ajaxLink = event.target.closest('[data-ajax-link]');
        if (ajaxLink && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.button === 0) {
          event.preventDefault();
          this.fetchSection(ajaxLink.href, {
            updateUrl: true,
            preserveScroll: ajaxLink.hasAttribute('data-preserve-scroll')
          });
          return;
        }

        const openFilters = event.target.closest('[data-open-filters]');
        if (openFilters) { this.openDrawer(openFilters); return; }
        if (event.target.closest('[data-close-filters]')) { this.closeDrawer(); return; }

        const clearFilters = event.target.closest('[data-clear-filters]');
        if (clearFilters) {
          const url = new URL(window.location.href);
          const sortValue = url.searchParams.get('sort_by');
          const keepAvailabilityParam = this.dataset.availabilityParam;
          const keepAvailabilityValue = this.dataset.availabilityValue;
          const productTypeControl = this.querySelector('[data-single-tab][data-tab-param]');
          const productTypeParam = productTypeControl?.dataset.tabParam || '';
          const productTypeValues = productTypeParam ? url.searchParams.getAll(productTypeParam) : [];

          url.search = '';

          if (sortValue) url.searchParams.set('sort_by', sortValue);
          productTypeValues.forEach(value => url.searchParams.append(productTypeParam, value));

          if (
            this.dataset.forceInStock === 'true' &&
            keepAvailabilityParam &&
            keepAvailabilityValue
          ) {
            url.searchParams.set(keepAvailabilityParam, keepAvailabilityValue);
          }

          this.closeDrawer(false);
          this.fetchSection(url.toString(), {
            updateUrl: true,
            preserveScroll: true
          });
          return;
        }

        const loadMore = event.target.closest('[data-load-more]');
        if (loadMore) { this.loadMore(loadMore); return; }

        const moreVariants = event.target.closest('[data-card-option-more]');
        if (moreVariants) {
          this.toggleVariantValues(moreVariants);
          return;
        }

        const cardOption = event.target.closest('[data-card-option-value]');
        if (cardOption) {
          this.selectCardVariant(cardOption);
          return;
        }


      }

      handleChange(event) {
        if (event.target.closest('[data-filter-form]')) {
          event.target.closest('.tjs-filter-option')?.classList.toggle('is-selected', event.target.checked);
          this.scheduleFilterPreview();
          return;
        }
        if (!event.target.matches('[data-sort]')) return;
        const url = new URL(window.location.href);
        url.searchParams.set('sort_by', event.target.value);
        url.searchParams.delete('page');
        this.fetchSection(url.toString(), {
          updateUrl: true,
          preserveScroll: true
        });
      }

      handleSubmit(event) {
        const form = event.target.closest('[data-filter-form]');
        if (!form) return;
        event.preventDefault();
        const url = this.buildFilterUrl(form);
        this.closeDrawer(false);
        this.fetchSection(url.toString(), {
          updateUrl: true,
          preserveScroll: true
        });
      }

      buildFilterUrl(form) {
        const url = new URL(window.location.href);
        const typeParam = this.querySelector('[data-single-tab][data-tab-param]')?.dataset.tabParam;
        const selectedTypes = typeParam ? url.searchParams.getAll(typeParam) : [];
        url.search = new URLSearchParams(new FormData(form)).toString();
        selectedTypes.forEach(value => url.searchParams.append(typeParam, value));
        url.searchParams.delete('page');
        return url;
      }

      scheduleFilterPreview() {
        clearTimeout(this.previewTimer);
        this.previewTimer = setTimeout(() => this.previewFilterCount(), 280);
      }

      async previewFilterCount() {
        const form = this.querySelector('[data-filter-form]');
        if (!form) return;
        const count = this.querySelector('[data-preview-count]');
        if (count) count.textContent = '…';
        this.previewController?.abort();
        this.previewController = new AbortController();
        try {
          const url = this.buildFilterUrl(form);
          url.searchParams.set('section_id', this.sectionId);
          const response = await fetch(url.toString(), { signal: this.previewController.signal, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
          if (!response.ok) throw new Error('Preview unavailable');
          const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
          const nextCount = doc.querySelector('[data-result-count]')?.textContent.trim();
          if (nextCount) {
            if (count) count.textContent = nextCount;
            const drawerCount = this.querySelector('[data-drawer-count]');
            if (drawerCount) drawerCount.textContent = `${nextCount} ${drawerCount.dataset.countLabel || 'products'}`;
          }
        } catch (error) {
          if (error.name !== 'AbortError' && count) count.textContent = '—';
        }
      }

      async fetchSection(url, { updateUrl = false, replaceUrl = false, preserveScroll = false } = {}) {
        this.requestController?.abort();
        this.requestController = new AbortController();
        const scrollY = window.scrollY;
        const requestUrl = new URL(url, window.location.origin);
        requestUrl.searchParams.set('section_id', this.sectionId);
        this.setBusy(true);
        this.announce('Updating products');

        try {
          const response = await fetch(requestUrl.toString(), { signal: this.requestController.signal, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
          if (!response.ok) throw new Error('Unable to update products');
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const nextRoot = doc.querySelector(`#TjsFinalCollection-${CSS.escape(this.sectionId)}`);
          if (!nextRoot) throw new Error('Updated collection was not found');

          if (updateUrl) {
            const cleanUrl = new URL(url, window.location.origin);
            cleanUrl.searchParams.delete('section_id');
            history[replaceUrl ? 'replaceState' : 'pushState']({ tjsCollection: true }, '', cleanUrl.toString());
          }

          this.replaceWith(nextRoot);
          requestAnimationFrame(() => {
            const currentRoot = document.getElementById(`TjsFinalCollection-${this.sectionId}`);
            if (currentRoot && currentRoot.dataset.ready !== 'true' && typeof currentRoot.connectedCallback === 'function') {
              currentRoot.connectedCallback();
            }
            if (preserveScroll) window.scrollTo({ top: scrollY, behavior: 'auto' });
          });
        } catch (error) {
          if (error.name === 'AbortError') return;
          this.setBusy(false);
          this.announce(error.message || 'Unable to update products');
        }
      }

      async loadMore(button) {
        const nextUrl = button.dataset.nextUrl;
        if (!nextUrl) return;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Loading…';
        try {
          const requestUrl = new URL(nextUrl, window.location.origin);
          requestUrl.searchParams.set('section_id', this.sectionId);
          const response = await fetch(requestUrl.toString(), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
          if (!response.ok) throw new Error('Unable to load more');
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const nextRoot = doc.querySelector(`#TjsFinalCollection-${CSS.escape(this.sectionId)}`);
          const appendedCards = [];
          nextRoot?.querySelectorAll('.tjs-product-card').forEach(card => {
            this.grid.appendChild(card);
            appendedCards.push(card);
          });
          this.initializeProductCards(this.grid);
          const shownCount = this.querySelector('[data-shown-count]');
          if (shownCount) shownCount.textContent = String(this.grid.querySelectorAll('.tjs-product-card').length);
          const nextButton = nextRoot?.querySelector('[data-load-more]');
          if (nextButton) {
            button.dataset.nextUrl = nextButton.dataset.nextUrl;
            button.disabled = false;
            button.textContent = originalText;
          } else {
            button.closest('.tjs-final-collection__load-wrap')?.remove();
          }
          this.observeCards();
        } catch (error) {
          button.disabled = false;
          button.textContent = originalText;
          this.showToast(error.message || 'Unable to load more');
        }
      }

      setBusy(isBusy) { this.grid?.setAttribute('aria-busy', isBusy ? 'true' : 'false'); }
      announce(message) { if (this.status) this.status.textContent = message; }

      setupFloatingType() {
        if (!this.floatingType || !this.floatingAnchor) return;
        this.measureFloatingType();
        this.syncFloatingType();

        const activeChip = this.floatingType.querySelector('.tjs-floating-type__chip.is-active');
        if (activeChip) {
          requestAnimationFrame(() => activeChip.scrollIntoView({ block: 'nearest', inline: 'center' }));
        }
      }

      handleResize() {
        this.measureFloatingType();
        this.syncFloatingType();
        this.syncStickyControls();
        this.updateTypeScrollCue();
      }

      handleScroll() {
        if (this.scrollTicking) return;
        this.scrollTicking = true;
        requestAnimationFrame(() => {
          this.scrollTicking = false;
          this.syncFloatingType();
          this.syncStickyControls();
        });
      }

      measureFloatingType() {
        if (!this.floatingType) return;
        const height = this.floatingType.offsetHeight || 72;
        this.style.setProperty('--tjs-floating-space', `${height + 18}px`);
      }

      syncFloatingType() {
        if (!this.floatingType || !this.floatingAnchor) return;
        const anchorRect = this.floatingAnchor.getBoundingClientRect();
        const sectionRect = this.getBoundingClientRect();
        const floatingHeight = this.floatingType.offsetHeight || 72;
        const hasEnteredProducts = anchorRect.top < 0;
        const hasRoomBelow = sectionRect.bottom > window.innerHeight + floatingHeight + 44;
        const shouldShow = hasEnteredProducts && hasRoomBelow;

        this.floatingType.classList.toggle('is-visible', shouldShow);
        this.classList.toggle('has-floating-type', shouldShow);
      }

      openDrawer(trigger) {
        this.lastTrigger = trigger;
        this.drawer.hidden = false;
        this.previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
      }

      closeDrawer(restoreFocus = true) {
        if (!this.drawer) return;
        this.drawer.hidden = true;
        document.documentElement.style.overflow = this.previousOverflow || '';
        if (restoreFocus) this.lastTrigger?.focus?.();
      }

      initializeProductCards(scope = this) {
        this.setupMediaTracks(scope);
        this.setupImageFallbacks(scope);
        scope.querySelectorAll?.('[data-card-option-group]').forEach(group => this.refreshVariantGroup(group));
      }

      setupImageFallbacks(scope = this) {
        scope.querySelectorAll?.('.tjs-product-card__image').forEach(image => {
          if (image.dataset.imageFallbackReady === 'true') return;
          image.dataset.imageFallbackReady = 'true';

          image.addEventListener('error', () => {
            const slide = image.closest('[data-card-media-slide]');
            const track = image.closest('[data-card-media-track]');
            const card = image.closest('[data-card-product]');

            if (slide?.classList.contains('tjs-product-card__image-slide--secondary')) {
              slide.remove();
              card?.querySelector('[data-card-media-dots]')?.remove();
              if (track) track.scrollLeft = 0;
            }
          }, { once: true });
        });
      }

      setupMediaTracks(scope = this) {
        scope.querySelectorAll?.('[data-card-media-track]').forEach(track => {
          if (track.dataset.mediaReady === 'true') return;
          track.dataset.mediaReady = 'true';

          const card = track.closest('[data-card-product]');
          const dots = [...(card?.querySelectorAll('[data-card-media-dot]') || [])];

          const setActiveDot = index => {
            dots.forEach((dot, dotIndex) => {
              dot.classList.toggle('is-active', dotIndex === index);
            });
          };

          const syncDots = () => {
            const slides = [...track.querySelectorAll('[data-card-media-slide]')];
            if (slides.length < 2) {
              setActiveDot(0);
              return;
            }

            const slideWidth = Math.max(track.getBoundingClientRect().width, 1);
            const index = Math.max(
              0,
              Math.min(slides.length - 1, Math.round(track.scrollLeft / slideWidth))
            );
            setActiveDot(index);
          };

          track.addEventListener('scroll', () => {
            if (track._tjsScrollFrame) cancelAnimationFrame(track._tjsScrollFrame);
            track._tjsScrollFrame = requestAnimationFrame(syncDots);
          }, { passive: true });

          // Prevent browsers from restoring a product card to slide two after
          // AJAX replacement, resize, or back/forward navigation.
          track.scrollLeft = 0;
          setActiveDot(0);

          requestAnimationFrame(() => {
            track.scrollLeft = 0;
            setActiveDot(0);
          });
        });
      }

      toggleVariantValues(button) {
        const group = button.closest('[data-card-option-group]');
        if (!group) return;
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        group.dataset.expanded = expanded ? 'false' : 'true';
        this.refreshVariantGroup(group);
      }

      refreshVariantGroup(group) {
        if (!group) return;

        const expanded = group.dataset.expanded === 'true';
        const buttons = [...group.querySelectorAll('[data-card-option-value]')];
        const availableButtons = buttons.filter(button => !button.disabled);
        const activeButton = availableButtons.find(button => button.classList.contains('is-active'));
        const visibleWhenCollapsed = new Set(availableButtons.slice(0, 4));
        if (activeButton) visibleWhenCollapsed.add(activeButton);

        buttons.forEach(button => {
          if (button.disabled) {
            button.hidden = true;
            return;
          }
          button.hidden = expanded ? false : !visibleWhenCollapsed.has(button);
        });

        const hiddenCount = availableButtons.filter(button => button.hidden).length;
        const moreButton = group.querySelector('[data-card-option-more]');
        if (!moreButton) return;

        const hasExpandableValues = availableButtons.length > visibleWhenCollapsed.size;
        if (expanded) {
          moreButton.hidden = availableButtons.length <= 4;
          moreButton.textContent = 'Show less';
        } else {
          moreButton.hidden = !hasExpandableValues;
          moreButton.textContent = `+${hiddenCount} more`;
        }
      }

      getCardVariants(card) {
        if (!card) return [];
        if (card._tjsVariants) return card._tjsVariants;
        const script = card.querySelector('[data-card-variants]');
        try {
          card._tjsVariants = JSON.parse(script?.textContent || '[]');
        } catch (error) {
          card._tjsVariants = [];
        }
        return card._tjsVariants;
      }

      getCardSelectedOptions(card) {
        try {
          return JSON.parse(card.dataset.selectedOptions || '[]');
        } catch (error) {
          return [];
        }
      }

      selectCardVariant(button) {
        const card = button.closest('[data-card-product]');
        if (!card || button.disabled) return;

        const variants = this.getCardVariants(card);
        if (!variants.length) return;

        const optionIndex = Number(button.dataset.optionIndex);
        const optionValue = button.dataset.optionValue;
        const selected = this.getCardSelectedOptions(card);
        selected[optionIndex] = optionValue;

        let selectedVariant = variants.find(variant =>
          variant.available && variant.options.every((value, index) => value === selected[index])
        );

        if (!selectedVariant) {
          const candidates = variants
            .filter(variant => variant.available && variant.options[optionIndex] === optionValue)
            .map(variant => ({
              variant,
              score: variant.options.reduce((total, value, index) => {
                if (index === optionIndex) return total;
                return total + (selected[index] === value ? 1 : 0);
              }, 0)
            }))
            .sort((a, b) => b.score - a.score);
          selectedVariant = candidates[0]?.variant || variants.find(variant => variant.available);
        }

        if (!selectedVariant) return;

        card.dataset.selectedOptions = JSON.stringify(selectedVariant.options);
        this.updateCardVariant(card, selectedVariant, variants);
      }

      updateCardVariant(card, variant, variants) {
        card.querySelectorAll('[data-card-option-value]').forEach(button => {
          const index = Number(button.dataset.optionIndex);
          const value = button.dataset.optionValue;
          const active = variant.options[index] === value;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', active ? 'true' : 'false');

          const available = variants.some(candidate => {
            if (!candidate.available || candidate.options[index] !== value) return false;
            return candidate.options.every((candidateValue, candidateIndex) => {
              if (candidateIndex === index) return true;
              return candidateValue === variant.options[candidateIndex];
            });
          });
          button.disabled = !available;
          button.hidden = !available;
        });

        card.querySelectorAll('[data-card-option-group]').forEach(group => this.refreshVariantGroup(group));

        const price = card.querySelector('[data-card-price]');
        const compare = card.querySelector('[data-card-compare]');
        if (price) price.textContent = this.formatMoney(variant.price);
        if (compare) {
          const showCompare = Number(variant.compare_at_price || 0) > Number(variant.price || 0);
          compare.hidden = !showCompare;
          compare.textContent = showCompare ? this.formatMoney(variant.compare_at_price) : '';
        }

        const image = card.querySelector('.tjs-product-card__image--primary');
        const variantImage = variant.featured_image?.src || variant.featured_image || null;
        if (image && variantImage) {
          this.transitionVariantImage(card, image, variantImage);
        }

        const mediaTrack = card.querySelector('[data-card-media-track]');
        if (mediaTrack && mediaTrack.scrollLeft > 0) {
          mediaTrack.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }

      transitionVariantImage(card, image, nextSrc) {
        if (!card || !image || !nextSrc) return;

        const absoluteNextSrc = new URL(nextSrc, window.location.origin).href;
        const currentSrc = image.currentSrc || image.src || '';
        if (currentSrc === absoluteNextSrc || image.src === absoluteNextSrc) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const preloader = new Image();

        preloader.onload = () => {
          if (reduceMotion) {
            image.src = absoluteNextSrc;
            image.removeAttribute('srcset');
            return;
          }

          clearTimeout(card._tjsVariantExitTimer);
          clearTimeout(card._tjsVariantEnterTimer);

          card.classList.remove('is-variant-entering');
          card.classList.add('is-variant-exiting');

          card._tjsVariantExitTimer = setTimeout(() => {
            image.src = absoluteNextSrc;
            image.removeAttribute('srcset');

            card.classList.remove('is-variant-exiting');
            card.classList.add('is-variant-entering');

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.classList.remove('is-variant-entering');
              });
            });
          }, 125);
        };

        preloader.src = absoluteNextSrc;
      }

      formatMoney(cents) {
        if (window.Shopify?.formatMoney) return window.Shopify.formatMoney(cents);
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format((Number(cents) || 0) / 100);
      }


      showToast(message) {
        showSectionToast(this, message);
      }
    }

    customElements.define('tjs-final-collection', TjsFinalCollection);

    if (!window.__tjsFinalCollectionPopstate) {
      window.__tjsFinalCollectionPopstate = true;
      window.addEventListener('popstate', () => {
        const current = document.querySelector('tjs-final-collection');
        current?.fetchSection(window.location.href);
      });
    }
  })();
