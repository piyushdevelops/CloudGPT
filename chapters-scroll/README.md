# Other Chapters — scroll story, 29 September 2026

User requested a complete rebuild of Other Chapters (called Section 7 in the request; stored as june_other_chapters / historically Section 6). Installed on **unpublished theme 187527266499**, awaiting visual review. Nothing published; MAIN unchanged.

## Sequence

One empty ivory stage pins to the viewport. Normal page scrolling drives these beats: empty opening → 26 flowers burst outwards → wedding planner PNG, bold heading and short subtitle → wedding exits upwards → empty pause → rewritable board PNG and text → duster scrubs away the scene in six alternating passes → 16 alternating baby footprints run across the stage → baby book PNG and text → scene exits and the next website section resumes.

No chapter tabs, persistent navigation or shopping buttons clutter the stage. Baby has no shopping action. A keyboard-focus-visible Skip the story link bypasses the scroll runway and focuses its end marker. The sequence reverses when scrolling back. No wheel/touch interception or timed auto-scroll.

The pause is scroll-distance based: 1.3 beats by default, approximately 1–2 seconds at an ordinary scrolling pace; there is no guaranteed wall-clock delay. Pace, pause distance, desktop/mobile product size, background, flower colours and image overrides are editable. Existing merchant typography roles remain editable, with Poppins defaults. Typography block remains in the preset and configured instance.

Reduced-motion preference, disabled motion/pinning, editor mode and viewports below 480px tall use an unpinned three-scene flow. Without JavaScript, all three products/texts appear in normal document flow. Decorative SVGs are hidden from assistive technology; inactive scenes are inert/aria-hidden.

## Assets

Transparent PNG cutouts created from the existing catalog source photographs using built-in image generation (background removal). Original artwork retained as the visual reference; cutouts require normal visual approval. Full prompt pattern: “Remove the background from this exact catalog photograph. Keep ONLY the complete product as a single isolated product cutout. Preserve its product design, printed text, artwork, proportions and viewing angle. Remove all surrounding props, table, backdrop and cast background shadows. Output genuine transparent alpha PNG.” For rewritable, the separate marker/duster were excluded.

- Local cutouts: theme/assets/june-chapter-wedding.png, june-chapter-rewritable.png, june-chapter-baby.png.
- Original reference images: assets/*-source.jpg, sourced from section-06/products.json.
- Shopify CDN records and file IDs: cutouts.json. Uploaded via Shopify upload-image, not product record edits.
- Merchant image pickers configured with uploaded cutouts; CDN fallback supports fresh section instances. Flowers, footprints and duster are lightweight inline SVGs.

## Verification

- Liquid/schema validation passed, revisions 1–3; JavaScript syntax passed node --check.
- Desktop 1440×1000: verified opening, flower burst, wedding, fully empty pause, rewritable, wipe, footsteps, baby and section release.
- Mobile 375×667: wedding image/heading/subtitle fit; duster and footsteps checked. At 430×932: baby scene fits, zero baby links and no horizontal document overflow.
- Reverse scroll returned from baby to wedding. Keyboard Skip focused the end marker and moved to the following section. Final browser error log empty.
- All three CDN PNGs loaded; local files have alpha channels. Screenshots in this folder cover the key phases. desktop-duster.png is the first wipe iteration; mobile-duster-375x667.png shows the final path-following wipe.
- Fresh remote files were captured before editing and checked again before first upload. Only sections/june-other-chapters.liquid and templates/index.json changed. All other homepage sections, settings and order were preserved from the fresh remote snapshot, including differences from earlier local snapshots.
- Final readback: 2/2 files match; role UNPUBLISHED. See remote-checks.json. Verified copies synced to current-theme.
- Physical iPhone/Safari and OS reduced-motion toggling were not tested; fallback path was reviewed in source.

before.json is the rollback snapshot; after.json is verified installed content. build.py is a historical one-time helper, not the final authoritative source (subsequent refinements were applied). Do not rerun against newer state.

[Preview](https://thejuneshop.com/?preview_theme_id=187527266499#JuneChapters-template--27363580018883__june_other_chapters)
