# Live PDP repair — 29 October 2026

Installed on live theme `187527266499` after a private duplicate-theme QA pass.

## Fixed

- First product image now loads eagerly with high fetch priority.
- Thumbnail selection scrolls only the thumbnail rail and no longer jumps the page vertically.
- Variant media uses the Shopify media ID instead of fragile URL matching.
- Three information tabs fit fully at 360–430px and remain keyboard operable.
- Specifications show available product data instead of the generic dispatch placeholder.
- Mobile sticky CTA is hidden on the initial purchase view, appears only after the purchase controls pass, and hides over the footer.
- Preorder dispatch information now sits inside the preorder button; standard products do not show it.
- Recommendations use a dedicated scoped card with reliable square images, title and price.
- Recommendation rails are moved after the product-specific story/content sections once the document is ready.
- Product description media and headings are constrained to the PDP content width.

## Files

- `sections/june-mobile-product.liquid`
- `snippets/june-pdp-card.liquid`

## Verification

- Fresh live pre-write checksum matched the previous exact readback before both writes.
- Final exact readback passed for both files.
- Shopify CLI Theme Check reported no offenses for either changed file. The rest of the legacy theme still has pre-existing Theme Check findings outside this scope.
- Private QA and live storefront checks covered dated preorder and standard undated products at 360×640, 393×852, 430×932 and 1440×1000.
- All eight live cases returned HTTP 200, loaded the first image, kept a square stage, fit tabs, avoided thumbnail page jumps, displayed useful specifications, showed correct sticky CTA behaviour, placed recommendations after story content, had no horizontal overflow and produced no console errors.
- Additional live checks passed for keyboard tab navigation, variant media matching and footer CTA hiding.

Evidence: `live-qa.json`, `qa-phone-tabs.png`, `qa-phone-discovery.png`, `qa-desktop-discovery.png`, and `final-readback.json`.
