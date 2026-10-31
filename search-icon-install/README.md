# Approved 2027 search icon installation

Installed only on unpublished theme 187527266499. Source: animated-filter-icon/search-year-playful/search-year.svg. Nothing published.

Changed files: sections/my-header.liquid and assets/june-search-year.svg. Fresh header retrieved and compared again immediately before upload; unchanged. Both files exactly matched remote readback. No header-group, settings, cart, layout or other section files saved.

Controls: TJS premium header → Desktop icon uploads → 2027 search icon. The enable switch applies to desktop and mobile. Separate height controls default to 24px with proportional 34px width. Disabling restores previous custom/default search artwork. Existing search inputs, buttons, handlers, predictive search and cart remain in place. A light backing keeps the dark artwork visible on scrolled dark controls.

Animation plays once per asset load: downward 2020–2027 ticker, slower 2026, playful landing, sparkle, then lilac 27 at rest. Reduced motion shows 2027 immediately.

Checks: SVG validation; section schema JSON; Shopify accepted upload without errors; exact 2/2 readback; fresh preview HTTP response confirms unpublished ID, two year-icon images, both search hooks, both happy-cart icons and no Liquid errors. Local validator passed SVG and reported existing header complexity/settings/unused-variable findings plus absent dependencies in the partial checkout (see validation.txt). Header was not broadly refactored.

Remaining: browser automation has been unavailable in this session. Actual mobile/desktop visual checks, theme-editor control interactions, search interaction regression and physical Safari remain pending; HTTP markup verification is not a rendered browser test.
