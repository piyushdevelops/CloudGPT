# Glassware reference rebuild — 5 October 2026

Installed on unpublished theme 187527266499. Nothing published; MAIN unchanged. Fresh snapshot: before.json. Exact final remote readback: after.json. Verified files synced to current-theme.

## Delivered layout
- Continuous 1.92:1 desktop photographic stage, max 1680px; native-width Anton PICK YOUR POUR. heading, foreground image overlap, bottom-corner controls and rectangular black purchase actions.
- The three current wide images remain selected. Built-in foreground clip masks are keyed to exact image filenames. Custom alpha-mask + matching source-image pickers allow replacement artwork; mismatched custom sources disable that mask.
- Editable reference ink/button colours; all typography roles and sizes remain editable. Global merchant palette and unrelated sections preserved.
- Mobile: two-line headline, central complete glass silhouette, compact controls/purchase information on the same warm canvas with blended photograph edges. Foreground/title overlap is desktop-only. No pouring animation.
- Specifications moved to Details; prices/availability/links still use selected Shopify products. All three tabs retain synchronized state and keyboard controls.

## Change ledger / gates
1. Source: final Liquid validator passed. All selected product and image values preserved; schema accepted by Shopify. Mask-source guard, ARIA states, no-JS links, focus styles and reduced-motion stylesheet retained. No raster product art generated or altered.
2. Rendered: 1440x1000 browser test: three tabs, scene + mask + product synchronization, price and URLs, no horizontal overflow, 740px stable section. At 393x852 initial testing found a 4px height variation; corrected minimum purchase-area height. After correction all tabs were stable at 957px in 374x666 and 943px in 430x932; 393x852 default height 957px. ArrowRight/Home selection and Details disclosure worked; mobile tab targets measured 58px. Anton loaded successfully. Screenshots saved for desktop and 393px mobile; sticky site header appears in some capture regions. Exact 375x667 unavailable due current Chrome zoom and integer-only viewport tool; 374x666 tested instead, not physical iPhone Safari.
3. Saved draft: both edited files matched exact remote readback. Fresh storefront and fresh theme editor loaded revised headline, reference colour controls and mask/source pickers. Save disabled, no unsaved editor changes. Current-theme synced.

## Content blocker — not signed off as fully complete
Fresh merchant settings already map the champagne-flute artwork glasses_3.1 to Ripple Coffee Mug under Slow mornings. The third artwork Glasses_1.1 is a rounded cocktail glass, while its saved display name/specification say gold-rimmed champagne flutes/set of 2 (product handle cocktail-glass). These mismatches predate this rebuild. User was asked whether to retain products and correct imagery or retain wide imagery and correct product mappings; no answer received yet. Preserved values pending that decision rather than inventing product identities or changing catalog assignments.

Full plan acceptance remains pending this content resolution, final visual checks of the other two foreground contours, and a clean set of every requested viewport screenshot. Before-desktop.png is the user's supplied baseline; no before-mobile comparison was captured. Do not claim all gates completely signed off. Physical device and rendered reduced-motion checks remain unperformed.

Changed files: sections/june-pick-your-pour.liquid and templates/index.json. build.py is snapshot-based: do not rerun against newer remote merchant state without reconciliation.
