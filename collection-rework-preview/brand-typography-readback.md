# Collection typography — 8 October 2026

Installed on unpublished theme `187527266499` only. No publishing or MAIN change.

- `sections/collection-new.liquid`: Poppins 900 collection heading; Poppins 700 product titles, tabs and controls; Archivo Black 900 prices; clearer Poppins labels. Existing desktop/mobile heading sizes remain editable in the section settings.
- Added a **Collection typography** block with font, weight, size, tracking and leading controls by text role. The configured default collection template now contains the block.
- Kept the filtering, sorting, product type tabs, AJAX updates, products and card behavior untouched.
- Exact readback: section MD5 `31050bb6f9adc5e94644a8d10a072e36`; template MD5 `1caf5af6c1cd8b033e52391fac7a1139`.
- Browser checked at 1440 × 900 and 393 × 852: computed font families/weights/sizes matched; filter drawer and product type tab worked; 24 cards rendered; no horizontal overflow. See `current-desktop.png` and `current-mobile.png`.
- Shopify Liquid skill validator could not start because its bundled `@shopify/theme-check-common` dependency is absent. Section schema parsed locally, Shopify accepted both files, and rendered checks passed.

`current-theme/sections/collection-new.liquid` and `current-theme/templates/collection.json` are older snapshots. Fetch the live unpublished files before later edits; do not upload those local snapshots.
