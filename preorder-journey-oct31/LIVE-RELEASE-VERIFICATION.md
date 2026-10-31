# Live release verification — 31 October 2026

- Shopify theme `187625799875` is now `MAIN`. Theme `187527266499` is unpublished.
- The 13 preorder journey files on MAIN retain the draft MD5 values in `release-manifest.json`.
- The separate Shopify page `2027-planner-preorders` was updated after publication: title `2027 Dated Planners — Pre-orders Open`; body says pre-orders are open and dispatches start 10 November 2026. GraphQL readback matched exactly. Page handle and template suffix were preserved.
- The `2027-dated-planners` collection contains 25 active products, all on template `june_dated_2027`. Each has two available variants: Add Name at ₹2,099 and Without Name at ₹1,999.
- Existing orders `#304741` and `#304742` are still paid and unfulfilled. Both captured an incorrect 31 October expected-dispatch property before the correction. Customer correction message is drafted in `dated-planner-live-oct31/README.md` and has not been sent.
- Physical/browser visual verification of the published homepage, preorder page, collection, product, cart and checkout is still open because local browser use is disabled in Work settings. Shopify checkout payment methods and automatic country selection remain unverified.

## 2027 listing galleries from Drive

- Read the supplied `Dated Planner all 27` Drive folder: 25 clean covers, 25 distinct lifestyle photos, and 27 shared inside-page photos.
- Preserved each product's existing first two images. Added the visually matched lifestyle photo as image 3 for all 25 planners.
- Added 12 representative shared inside-page photos as images 4–15: opening, vision board, life list, ideal self, monthly calendar, habit/meal tracker, weekly, daily, expense/reflection, postcard, memories, and one monthly divider.
- Shopify GraphQL readback: all 25 products have exactly 15 media items in the intended order; all 375 media items are `READY` with image URLs, and no gallery contains a duplicate media ID. All 12 inside images are 1080×1080.
- `drive-gallery-manifest.json` records the exact Drive-to-product lifestyle mapping and shared inside-file IDs. The remaining inside images stay in Drive for later use. No existing product images were removed.
