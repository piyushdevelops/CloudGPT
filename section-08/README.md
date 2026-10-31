# Section 8 — Find your glow

28 September 2026: **installed and checked on unpublished theme187527266499; awaiting user review.** User explicitly cancelled the teammate protocol because they are now the sole editor. Nothing published.

Approved board: references/generated-history/exec-c5e31b5c-e3a4-4557-81cb-43b88e610bff.png. Dark warm lighting scene, three lamp choices and compact shopping panel. Shared locked Poppins/capsule defaults replace the board's historical serif styling. Uses existing real catalog room photos; no generated product artwork.

## Files and setup

- `june-find-your-glow.liquid`: validated source, also copied into current-theme/sections. Installed source.
- `section-config.json`: installed section configuration. Inserted as `june_find_your_glow` immediately after `june_shop_the_corner` and before `june_pick_your_pour` in fresh remote templates/index.json.
- `products.json`: freshly retrieved catalog details; `before/remote.json` is the pre-build unpublished theme snapshot.
- `preview.cjs` and `preview.html`: local LiquidJS fixture renderer with mocked Shopify image/font/money filters. Tests layout/interaction but does not establish Shopify rendering or Theme Editor behavior. Regenerate with `node section-08/preview.cjs` from project root. Requires liquidjs in preview-tools/node_modules.
- Local preview server: http://127.0.0.1:8088/preview.html (only on this computer while running).

## Selected live catalog products

Vespera Luminous Tower Table Lamp (8046554579139), Gilded Wave Radiance Luxe Table Lamp (8046564966595), Sovereign Flow Glow Table Lamp (8046605959363). At build: stocked 6/6/4; Rs3,849 / Rs3,099 / Rs2,149. Shopify source derives prices/availability dynamically. All use catalog photo index1 (second image), assigned through editable image pickers. Collection lamps-lighting verified (289189068995, 38 products at build).

## Controls and behavior

Three product blocks support product, name, selector label, desktop scene, mobile scene and thumbnail overrides. Typography block offers heading/title/body/button font family, weight, desktop/mobile size, tracking and leading; included in preset and config with fallback Poppins. Accent controls button fill, selected underline and arrow color. Motion toggle and speed; no autoplay. Click, ArrowLeft/Right, Home/End and Theme Editor block selection synchronize scene/details/link. No-JS CSS exposes all product links; reduced-motion CSS removes transitions and entry animation. These fallback modes were source-inspected, not dynamically emulated.

## Checks and integration

Shopify Liquid validator revisions1/2 passed. Local browser desktop/mobile inspected. All three choices changed scene, price/name and product URL; Home returned selection/focus to first lamp. Widths320/390/750/1051/1440/2560 had no horizontal overflow; 2560 retained1680 stage. Images loaded. Evidence: desktop-local.png, mobile-local.png, interactions-local.json, responsive-local.json.

Installed source first, then merged into freshly fetched index after7/before9. Verified remote UNPUBLISHED role and readback; earlier source checksums and section settings preserved. Live Shopify desktop/mobile inspected; all three lamp scenes/details/links synchronized, Home keyboard navigation passed, visible images loaded. Widths320/390/750/1440/2560 had no overflow;1680px maximum retained. Evidence: desktop-shopify.png, mobile-shopify.png, interactions-shopify.json, responsive-shopify.json, verified-remote.json.

Source checksum: 1027ca91cab0000c2b504a4f970551ec; index checksum: 88713108936970d7bb26ddde2e5a9052.
