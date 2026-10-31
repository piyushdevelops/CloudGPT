# Priorities 2–5 repair — 23 October 2026

Installed only on unpublished theme 187527266499. Nothing published. All 13 changed files matched exact remote readback after final edits; see final-readback.json. Fresh remote reads and pre-upload rechecks were used. Merchant settings, product assignments, checkout calculations and approved visual designs were preserved.

## Implemented

- Standalone cart uses a scoped mutation handler and fresh server-rendered cart section. Quantity/removal updates lines, subtotal, compare-at savings and header count. Stable line keys, an in-flight guard and disabled controls prevent duplicate interactions. Failed updates restore the displayed input and announce an error. Empty cart appears without reload; focus moves to Return to shop.
- Fixed offer text replaced with Subtotal. Compare-at savings use actual variant compare-at prices and quantities against original line prices, excluding genuine applied discounts. Zero comparison savings are hidden. Existing native discount and checkout calculations remain.
- Sticky quantity translations receive the product name. Gallery controls have descriptive names. Our Story retains all four artwork images and adds an H1 and an expandable readable transcription.
- Predictive/full-search empty responses say No matching products found. Full-search rendering and predictive responses have stale-response guards. Scoop design remains intact.

## Search limitation — unresolved

The storefront predictive endpoint returns unrelated products inside resources.results.products for a nonsense query (zzqaunfindable), without a field identifying them as fallback recommendations. Full search also showed irrelevant results during the audit. We cannot safely distinguish those results from genuine matches from the available response; _ss=e also occurs on relevant results. No title-only filter or store-wide search setting was changed. The requested You might also like classification is NOT implemented, and nonsense-query handling is not signed off. A reliable match/fallback signal from the search provider is still required.

## Verification

- Desktop: native add-to-cart popup; standalone quantity change; removal from a two-product cart; last-item removal; matching subtotal and header counts.
- Mobile browser emulation at 393×852: quantity change from 1 to 2, subtotal ₹598 and header count 2; last-item removal to empty and header 0; no horizontal overflow.
- GoKwik opened with 2 items and ₹598 total, ₹1,998 comparison total and ₹1,400 savings. No order placed and no customer information entered. Test cart was returned to empty.
- Node tests: duplicate pending updates issue one request; failure restores input, reports error and unlocks controls; comparison arithmetic checks. JavaScript syntax checks passed.
- Product accessible names checked in the rendered page. Our Story text disclosure opens using Enter. Search closes using Escape and returns focus to Open search. Empty-cart focus returns to Return to shop.
- Desktop relevant planner search and mobile rapid planner→mug search returned relevant products for the latest query. Clearing input hid suggestions. Mobile Escape restored focus and page had no horizontal overflow.
- New savings/story snippets passed stateless Liquid validation. Full partial-theme validation was not clean because the fixture lacks theme dependencies and locale/schema references; do not treat it as a full theme-check pass.

## Remaining checks

- Physical iPhone/Safari and other physical-device checks were not performed; mobile results above are browser emulation.
- Real applied-discount, no-sale and mixed-price cart journeys are not fully verified. Arithmetic checks do not replace those storefront tests.
- Search fallback classification remains blocked as described above. Exhaustive full-search filter/sort and all product-template regression were not completed.
- Personalisation remains outside this repair scope.

## Evidence

- empty-cart.png / empty-cart-mobile.png
- gokwik-total-mobile.png
- story-accessible.png
- cart-tests.cjs, validation.json, story-validation.json, savings-validation.json

The candidate directory records the exact uploaded files; before contains the fetched input versions. Do not use these snapshots to overwrite later concurrent edits: fetch remote again before any new change.
