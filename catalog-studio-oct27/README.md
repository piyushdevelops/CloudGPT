# Catalog + Studio integration — 27 October 2026

Installed on unpublished Shopify theme `187527266499` and deployed to the production June Photo Studio. Nothing was published and all eight new products remain Draft.

## What changed

- The product template now presents every product image as a square, responsive cover gallery with accessible thumbnails.
- Product CTAs pass the product handle, occasion, storefront and all 22 variant IDs into the Studio.
- The Studio page wrapper preserves product/occasion parameters and resolves active product variants before loading the cross-origin Studio iframe.
- Landing-page occasion cards now pass the matching new product handle into the Studio.
- The Studio now contains all 62 approved listing covers, grouped across Travel, Couples, Wedding, Baby, Birthday, Pets, Year in review and For Mum.
- Year in review and For Mum are now first-class Studio occasions.
- Selected occasion, product and cover are saved with the design and recorded as cart line-item properties.
- Existing general categories keep the original June cover library as a fallback.

## Verification

- Shopify Liquid validator passed all three changed sections.
- Fresh pre-write fetch matched the starting snapshot for all three files.
- Post-write Shopify readback matched the local files exactly, 3/3.
- All eight product handles selected the correct occasion and exact cover count in local and production browser tests.
- Mobile 390×844, wide phone 430×932 and desktop 1440×1000 Studio tests passed with square canvas, no overflow and no page errors.
- Autosave/restore, 10-photo restore, page reorder, layer order, text move/edit/resize, PDF export and cart handoff passed.
- The Shopify page → Railway iframe bridge passed on the unpublished theme preview with Travel selected and eight Travel covers.

## Remaining release gate

The new products are intentionally Draft and the theme is intentionally unpublished. Draft product PDPs cannot be exercised as public storefront URLs until product activation/sales-channel publication. The gallery code itself passed Liquid validation and exact remote readback.
