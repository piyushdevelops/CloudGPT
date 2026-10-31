# Header search icon fallback — 9 October 2026

The supplied screenshot showed a broken image where the desktop search icon belongs. A fresh preview loaded the animated `june-search-year.svg` successfully, so the defect was intermittent. The same screenshot also showed a product image and product text before their normal presentation loaded; those loaded in current product-page checks.

Installed a small fallback in `sections/my-header.liquid` on unpublished theme `187527266499`: desktop and mobile search controls show an inline magnifier until the animated SVG loads. If the asset request fails, the magnifier remains and the broken-image glyph stays hidden. Search button behavior and merchant-controlled icon sizes remain in place.

Fresh preflight matched the remote header before upload. Uploaded only `sections/my-header.liquid`, then exact remote readback matched MD5 `b4602fb8b0fc75b8d320d4feeea5af6a`. Final readback was unchanged. Nothing published.

`qa-results.json` and screenshots record desktop 1360×820 and mobile 393×852 checks with normal and deliberately blocked SVG requests. The animated image appeared normally; the fallback appeared under blocked requests; there was no visible broken-image glyph, horizontal header overflow, or page JavaScript error. Shopify Liquid validator could not run because its bundled `@shopify/theme-check-common` dependency is unavailable; the affected embedded JavaScript passed syntax checking.

## Follow-up verification, 9 October

- Opened the product page in the Shopify draft theme editor at desktop and mobile widths. Header, main product image, and Poppins styling rendered. Save remained disabled; no editor setting was changed.
- On the custom-domain storefront, the product page had no broken visible images or JavaScript errors at 1440, 393, 375, or 320px. Search opened and focused its input on desktop and mobile.
- Opened New & Bestsellers in the editor at desktop and mobile widths. Saved 48/34px heading settings rendered as expected. Product images, filters, sort, prices, and the category rail appeared; the collection had no document-level horizontal overflow at the four tested widths. Screenshots and measurements are in `followup-*.png` and `followup-results.json`.
- The product page has a separate 4px document-level horizontal overflow at 393, 375, and 320px. `find-overflow.cjs` traced it to four lower custom Liquid sections (`tjs-main-character-section`, `tjs-monthly-mood-section`, `tjs-sticker-real-section`, `tjs-cover-gallery-section`) sized 8px wider than the viewport and offset 4px left. These live in a shared product template and were left untouched in this header/collection pass.
