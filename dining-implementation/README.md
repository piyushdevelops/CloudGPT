# Dining photographic scene — 8 October 2026

Implemented on unpublished theme 187527266499. Nothing published. Only sections/june-layer-the-table.liquid uploaded; templates/index.json unchanged at exact readback. Fresh remote section checked before every upload. See before.liquid and readback.json.

## Merchant controls

Open June · Layer the table in the theme editor. First scene image/mobile image controls override the current product photograph. Existing First scene product blocks retain their product selection. Enable Use custom hotspot position to change those hotspot coordinates for replacement photography; desktop/mobile coordinates are independent.

Add block → Table scene to add another setup. Choose desktop image, optional mobile image, up to three products, short labels and hotspot coordinates. Starting product determines the purchase card shown when that scene loads. Up to eight additional scenes are supported. Empty/incomplete scenes stay hidden.

Auto-slide scenes defaults on, Seconds between scenes defaults to 4 (editable 3–10). Carousel controls appear with two or more valid scenes. Hover/offscreen/background pauses temporarily; product selection, keyboard focus and manual navigation pause until Play. Reduced-motion preference and theme editor disable initial autoplay. Block selection reveals the relevant scene. Existing typography block, font loading, product destinations/prices and palette controls are retained. Compact mobile type scales existing role sizes proportionally.

## Changes

- Replaced floating plate stack, arrangement toggle and numbered sidebar with real scene photography and clickable product hotspots.
- Desktop stage 16:9; mobile stage 1:1 with heading and compact purchase card in the scene.
- Removed Lunch essentials and Kitchen organisation links; retained Shop the table edit.
- Product price, name, availability and destination come from selected Shopify products.
- No shared theme files, global settings or other sections changed. Retired stack-related settings are preserved in schema so historical merchant values are not discarded.

## Validation

- Liquid/theme schema validation passed using isolated validation theme with existing june-price snippet. JavaScript syntax passed.
- Final source uploaded as UTF-8; exact readback true, MD5 8349c30906efd58db05a8f33a8703cf9. Theme role UNPUBLISHED.
- Saved storefront checked visually at 393×852 and 1440×1000; all three product selections exercised, keyboard activation confirmed. No horizontal overflow in these checks.
- Local two-scene fixture uses the production JS/CSS and saved markup. Automatic changes observed at 4047, 8048 and 12063ms, alternating the starter/dinner products. Manual navigation changed the control to Play and stopped subsequent automatic advances. 430px fixture stage measured exactly 430×430 without overflow.
- desktop.png and mobile.png show saved storefront. slideshow-test.json records fixture observations. Test-only duplicate scene was never uploaded to Shopify.
- No physical Safari or live theme-editor interaction check completed. Additional merchant artwork will need its hotspot positions checked after upload.

Source generation: build.py combines preserved typography/schema with scene.css and scene.js. Use explicit UTF-8 when regenerating. Fetch fresh remote before future changes; never upload this historical snapshot over concurrent edits.
