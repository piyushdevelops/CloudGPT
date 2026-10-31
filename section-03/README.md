# Section 3 — Your planner. With extras.

Latest: user-approved unboxing direction implemented 28 September. Read unboxing/README.md for current source, controls, asset caveats and validation. The split-panel revision below is historical. Current source MD5 87bb4678edbe49c081801db868a070f0. Awaiting review; not published.

## Review revision — 28 September 2026
User requested fixes after screenshot review. Revision 4 contains the full source scene without CSS cropping, places the heading and photo on one softly tinted editorial panel, enlarges/framing cover choices, sizes the capsule action to its label, makes the gift-count badge upright and clearer, uses a two-column desktop gift layout, and displays a true minus when expanded. Typography controls and merchant settings preserved. Source photograph itself still partially frames the bag; CSS cannot recover content outside that photo.

Only june-with-extras.liquid changed remotely. Sections 1/2, homepage settings and locale checksums unchanged. Liquid validation passed. Checked 320/390/750/1440/2560 widths with no overflow, 1680px max stage, cover selection, keyboard Home and mobile gift accordion. Evidence: revision-4-checks.json, revision-4-browser.json, revised-desktop.png and revised-mobile.png. Earlier screenshots below record the previous version. Awaiting user review; not published.

Built 28 September 2026 at the user's request while Section 2 awaits review. Installed on UNPUBLISHED working theme 187527266499. MAIN untouched. Section 1 remains locked; Section 2 and Section 3 await user review.

Preview: https://thejuneshop.com/?preview_theme_id=187527266499#JuneLimited-template--27363580018883__june_with_extras

## Design and controls
Based on approved reference exec-911b50fd-5a25-4ffd-9e52-5987cca1599e.png, with real catalog photographs rather than generated products. Desktop has a large scene and product/gift panel; mobile stacks these with a collapsed gift accordion. Four cover buttons synchronize scene, product title, live price, product URL, gift list and count. Keyboard arrows/Home/End and Theme Editor block selection supported. No automatic carousel.

Merchant controls include four product blocks, per-product gifts and image/cover overrides, desktop/mobile scene overrides, scene image index, accent/background, spacing and optional hover motion. Typography block groups family, weight, desktop/mobile size, tracking and line height for five text roles. Included in preset and configured instance; fallback Poppins remains if removed. Current peach accent #FFB790 and cream #FFFBF1 follow existing settings; schema default accent remains lime. Centered 1680px stage retained.

## Verified offers
- Dolce Far Niente: five gifts; current price Rs. 1,399.
- Old Ways Don't Open New Doors: five gifts; current price Rs. 1,749.
- Soul On Fleek: five gifts; current price Rs. 1,749.
- Remember Why You Started: three catalog-listed gifts (notebook, socks, sticker book); current price Rs. 1,749. Await any updated offer from user; no invented fourth/fifth gift.

Product data is preserved in products.json. Five-gift sets include notebook, personalized first shipping-name initial keychain, sticker book, canvas bag and easel calendar. Counts are derived from configured nonblank gift entries. Prices and availability render from Shopify; gift copy is merchant-managed.

## Files and validation
Only sections/june-with-extras.liquid, templates/index.json and locales/en.default.json were uploaded, after fresh remote comparison/backups in before/. New section uploaded before its configured instance. theme/ is a partial validation snapshot, never a full deployment target. Local final files match remote MD5. Section 1 checksum bf79951765103d6e089af3d1d0d89d7d and Section 2 checksum abdc92980f30bc15780a4152a05a7a15 remain unchanged, as do their configured settings.

Shopify Liquid validator passed all three changed files initially and section revisions 2/3. Browser checked four cover selections, corresponding prices/URLs/gift counts, keyboard Home and mobile accordion; all selected scene images loaded. No horizontal overflow at 320, 390, 750, 1440 or 2560px; 2560px stage aligns with hero at width1680. No captured console errors. Evidence: checks.json, interactions.json, review-1440.png and review-390.png.

Reduced-motion styling and no-JavaScript fallback exist but were not dynamically tested. No checkout/order changes or publishing performed. Visual implementation awaits user review; actual product photography differs from generated reference art.
