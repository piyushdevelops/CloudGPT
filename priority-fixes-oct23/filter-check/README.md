# Fix 2 — collection filters, 23 October 2026

Installed only sections/collection-new.liquid on unpublished theme 187527266499. Fresh target fetched, intended changes merged, target compared again immediately before each upload, exact remote readback confirmed. Nothing published. Merchant typography and layout preserved.

Changes: reject reversed price ranges with native validation; update count while typing numeric prices; abort obsolete preview requests; Escape closes filter drawer and returns focus; focus enters drawer and Tab/Shift+Tab wraps; cleanup restores page scrolling on section disconnection; visible keyboard focus outline for filter labels.

Responsive Chrome checks at 393x852 and 1440x900:
- New & Bestsellers: colour filter Blue -> 1; Blue plus max price 400 -> zero results; clear restores 59.
- Price 800–400 previously applied invalid range; now blocked, clear native message, URL unchanged. Corrected desktop 300–700 previews/applies 24; mobile max400 previews/applies 8.
- Ascending and descending prices verified. Sort survives filter changes and Clear.
- Mobile multi-select Blue + Green -> 5; removing Blue preserves Green. Everyday Glassware category combines with Green -> 1. Clear removes colour while retaining selected category and sort (existing intended behavior).
- Browser Back restores preceding price filter and 24 results.
- Load more mobile 24 -> 48 unique cards; desktop 24 -> 48 unique -> 59 and button disappears.
- Desktop Escape and focus restoration verified; Tab and Shift+Tab wrap verified.
- Undated Planners: mobile Personalisation Yes previews/applies 70; desktop No previews/applies 10; Clear restores full collection.

The draft preview toolbar can obscure controls; hidden using its own Hide bar action for checks. Inputs are custom hidden checkboxes: visible labels were used for reliable pointer testing.

Final JS syntax parsed successfully. Shopify bundled Liquid validator unavailable because @shopify/theme-check-common is missing. Physical Safari and exhaustive device coverage remain outside these responsive browser checks. final-collection-new.liquid is the exact remote readback content; sections/ holds the earlier validation candidate. Screenshots: mobile-filters.png and desktop-filters.png.
