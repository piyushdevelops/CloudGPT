# Mobile-first PDP rollout — 28 October 2026

Installed on unpublished theme `187527266499` only. Nothing was published.

## Installed

- New reusable `sections/june-mobile-product.liquid` purchase shell.
- Square gallery, swipe/thumbnail navigation, compact product summary, responsive variants, conditional animated name field, quantity control, mobile sticky CTA, preorder state, accessible product-information tabs and product discovery rails.
- Added product metafield definition `custom.preorder_dispatch_date` (`date`, pinned).
- Migrated the default, planner, preorder, campaign, 2027, Photo Book, Our Days and Mystery Box product templates. Existing category stories remain after the shared shell where the template has separate story sections.
- Photo Book uses `Start creating` and routes to `/pages/photo-book-studio`.
- `product.only_config` remains unchanged because it is the quick-view/quick-add configuration template, not a full PDP.

## Verification

- Shopify Liquid validator: passed, final revision 8.
- Exact remote readback: shared section exact; all 16 full PDP templates contain the shell, place it in order and have no active replaced purchase section.
- Browser tests at 360×640, 393×852, 430×932 and 1440×1000 on an undated planner and a 2027 preorder planner.
- Confirmed square stage, thumbnails, sticky mobile CTA, three tabs, quantity control, no page overflow and no console errors.
- Confirmed name field is hidden for Classic, revealed/required for Name Customisation, saved to the cart line item, and the isolated QA cart was cleared afterward.
- Confirmed preorder CTA and dispatch fallback. The first information phase begins at 966px on a 393×852 viewport while the sticky CTA remains visible.
- The Photo Book product is draft/unavailable at its storefront handle, so its live rendered adapter could not be browser-tested; its template and Studio link were verified structurally.

## Merchant follow-up

- Populate `Pre-order dispatch date` on preorder products to replace the fallback message.
- Select a bestseller collection in the new section settings where a third discovery rail is wanted.
- Physical Safari and theme-editor drag/drop checks remain recommended before publishing.

