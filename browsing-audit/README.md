# Homepage browsing improvements and Lighting backdrop — 1 October 2026

## Status

Installed on unpublished theme **187527266499**. Nothing published; MAIN not changed. All 11 changed files were read back exactly and synced to `current-theme`. Overall audit sign-off remains open: the three-gate requirement is not claimed complete where coverage below is incomplete.

Latest user steering: rebuild Lighting to accept a full-size backdrop matching the supplied 611 × 265 reference. Implemented a 2.3:1 desktop stage, overlaid heading, bottom selector panel, mobile stacked purchase block, shared or per-lamp backdrop image pickers, separate mobile image, focal points, shading, panel opacity and text colour. Existing approved Poppins typography and master accent are retained. No clean backdrop was supplied; genuine existing lamp images remain contained fallbacks. Do not upload the screenshot with its text/buttons baked in as the backdrop.

### Merchant controls

Theme editor → June · Find your glow → **Full-width backdrop**. Recommended clean desktop artwork: **2400 × 1044 px**. Optional mobile crop. Individual Lamp blocks also offer **Wide backdrop for this lamp**; a shared full-section backdrop overrides these. Controls were confirmed present in the actual theme editor; Save was disabled, with no unsaved editor changes.

## Implemented changes

- Other Chapters: independent desktop/mobile pace (32/19); blank distances (18vh/10vh) capped at 20vh/12vh. All ten phases and the same pinned stage retained. Visible 45px-high Skip to shopping transfers focus to the next shopping heading and scrolls below the header.
- Undated: buying block moved before interior preview in mobile DOM; compare follows preview. Existing product state preserved.
- Limited Edition: mobile main product image moved ahead of the selection/buy block; four accessible thumbnails with selected borders; long labels visually hidden; image/name/price/link/extras stay coordinated. Product heading space reserves equal height across all four covers. Extras follow the purchase block.
- Décor: mobile navigation moved ahead of purchase details; specifications follow the primary action visually. Scoped spacing reduction.
- Lighting: superseded the older split composition with the latest user-requested backdrop composition. Mobile action before extended specifications.
- Glassware: mobile price/action before details; contain treatment preserves full image. Scoped spacing reduction.
- Dining: arrangement remains open at every breakpoint, appears before buying information, retains both arrangement modes. Product photo sits beside title/price in a compact mobile grid, followed by action then specifications.
- 2027 signup, Inside Discovery and Mystery Box: reduced padding/gaps, retaining text size and useful imagery.
- Planner actions: neutral merchant-editable Delivery details / Returns policy links. No timing, eligibility or free-shipping promises added.

## Three verification gates — evidence ledger

| Change | Gate 1: source/data | Gate 2: rendered behaviour | Gate 3: saved draft/regression |
|---|---|---|---|
| Story pacing / skip | Passed source/math tests at 1440×1000,375×667,393×852,430×932; reduced-motion and short-landscape fallback tested with source harness. Phase order unchanged. | Measured ~39.8% desktop / ~59.6% mobile reduction. Click and Enter skip transfer focus to Décor with ~101px desktop/~80px mobile clearance. Reverse scroll observed wedding, rewritable and footsteps. Full slow/fast/bidirectional visual sequence still needs final pass. | Exact readback + fresh storefront reload passed. Theme-editor story scroll/skip repeat remains pending. |
| Product grouping | Liquid/schema + JS syntax checks passed. Product and URL mappings unchanged. | All 3 Undated, 4 Limited, 3 Décor, 3 Glassware, 3 Dining selections exercised at 393px; all 3 Lighting choices exercised on desktop. | Fresh reload and representative desktop selections passed. Sold-out/missing-image fixture coverage not exercised against catalog data. |
| Limited cover selector | Labels, aria-pressed, mapped scene/heading/buy keys inspected. | All 4 names, images, prices, URLs and gift lists checked at 393px. Three 5-extra covers and one 3-extra cover correctly differentiated. Final all-cover section height was 1086px with no variation. | Exact readback, reload, desktop first/last selection passed. Narrow 375px requirement is not claimed fully signed off (browser actual viewport was 374×666; a later intended narrow selection loop ran at393px because editor had viewport focus). |
| Dining | Default-open and breakpoint-change logic verified; source validation passed. | Both arrangement modes and all 3 products exercised. Visible mobile arrangement screenshot saved. | Exact readback + fresh mobile reload passed; desktop remained open. Final compact product-grid refinement checked at393px. |
| Spacing / imagery | Scoped CSS; existing image sources retained. Full planner covers contained; Glassware corrected to contain. | Measurements at1440×1000,393×852,430×932 and actual374×666. No horizontal overflow. Images unchanged; missing better originals not invented. | Fresh preview checks completed; exhaustive before/after screenshots and post-refinement captures for all four widths remain incomplete. |
| Lighting backdrop | Liquid/schema validated. Existing controls retained; new image fields and 2.3:1 sizing verified. | Desktop/mobile rendered fallback screenshots inspected; all three product choices update correct image/name/URL. | Exact saved file readback; new controls confirmed in theme editor. Final crop of a user-supplied clean backdrop awaits that asset. |
| Reassurance / reviews | Policy URLs verified on public store. Reviews deferred: public generic snippets/search-indexed testimonials did not establish adequate original attribution evidence. | Neutral policy links present beside planner actions in fresh storefront and editor. | Exact wording/readback verified. No invented reviews, ratings, customer counts or customer photos added. Proof section **blocked by content**. |

## Measurements

`baseline.json` and `final-measurements.json` contain DOM measurements. Browser zoom made the requested375×667 resolve to374×666; do not call this exact375 or physical iPhone testing. Baseline and final use the same actual dimensions.

- 1440×1000 story: **7708.9 → 4642.2px** (~39.8% shorter).
- 393×852 story: **6638.9 → 2680.2px** (~59.6% shorter).
- 430×932 story: **7312.9 → 2951.0px** (~59.6% shorter).
- 374×666 story: **5071.8 → 2050.6px** (~59.6% shorter).

At393px, supporting-section reductions before final minor refinements: 2027 ~7%, Inside ~9.5%, Décor ~4.4%, Lighting ~15.3%, Glassware ~5.9%, Mystery ~10.2%. Kept useful content instead of forcing10–20% everywhere. Dining is taller than its previously **closed** baseline because its arrangement is now visible; compacted purchase grid reduces that added height. Planner policy links intentionally add some height.

`final-measurements.json` 393px entry includes final cover-height/Dining-grid refinements; other widths were captured before those last two mobile-only refinements. Do not treat them as fully final mobile regression sign-off.

## Additional regression evidence

- Mobile search opens as dialog, focuses search input, Back restores trigger focus; no query submitted.
- Category shortcut disclosure opens and exposes correct collection URLs.
- All four hero tabs retain identical measured height854.83px at393px.
- Interior viewer opens, next-page and zoom controls work, close works.
- Dining Stack together / See each piece toggles true/false correctly.
- No application console errors observed in captured log check.
- No signup submitted and no orders placed. Existing cart state was not modified.

## Sources and limitations

- https://thejuneshop.com/pages/shipping-delivery
- https://thejuneshop.com/pages/return-and-refund-policy
- Review discovery included public product pages and search-indexed testimonials; no original review IDs or reliable verification trail established for reuse. Need three attributable approved reviews (and customer imagery permission if used).
- Need clean wide Lighting artwork, genuine alphabet keychain photo and better interior originals where existing photography lacks detail. No replacements generated.
- Physical iPhone Safari, software-keyboard behaviour and browser-rendered reduced-motion checks remain separate checks. Source reduced-motion fallback is covered by `verify-story.cjs`, not a physical-device test.
- Viewport screenshots intermittently returned blank/compositor timeout; full-page capture with zoom-scaled clipping worked. Sticky header/preview bar can appear in section screenshots. Do not mistake these for backdrop artwork.

## Files / reconciliation

Fresh baseline: `before.json`; batch readbacks: `story-readback.json`, `products-readback.json`, `policy-readback.json`; final authority: `final-readback.json` (11/11 exact matches).

Changed: ten `sections/june-*.liquid` files represented in final readback and `templates/index.json` (only story settings changed). No settings_data palette edits, header edits, MAIN writes or publishing. Shopify initially rejected URL setting defaults for the policy fields; removed unsupported defaults and used Liquid fallback URLs, then successful save/readback and validation.

Build scripts are historical one-time transformations, not idempotent. Do not rerun against final files. Always pull fresh remote state before further work.
