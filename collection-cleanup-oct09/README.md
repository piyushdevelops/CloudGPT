# Collection cleanup — 9 October 2026

Installed only `sections/collection-new.liquid` on unpublished theme `187527266499` (The June Shop test store). No publishing or shared-file write.

## Changes

- Removed the scroll-cloned filter/sort toolbar so controls no longer cover cards.
- Moved the optional product-type selector into normal page flow after the grid. Updated its editor setting label to match.
- Prioritized six useful filter groups, keeping the other 14 available behind **More filters**. Active groups stay visible. Improved drawer control sizing and spacing.
- Gave sort controls room for option text.
- Increased mobile card title and current price defaults, and made compare-at prices easier to read. Preserved merchant typography controls and the active June master palette.
- Hid ratings unless both a real positive score and review count exist, removing the misleading “0 out of 5, 5 reviews” display.

## Reconciliation and verification

- Fresh remote preflight matched the intended baseline for both the section and collection template.
- Uploaded only the section. Exact remote readback matched the local source, MD5 `b0826830f1c8648c7526ee27f5f7836c`; final readback remained exact. Theme role: `UNPUBLISHED`.
- Liquid schema JSON parsed; embedded JavaScript passed `node --check` before upload.
- Preview tested at 1440×900 and 393×852. See `qa-results.json` and screenshots here. Poppins rendered, 24 cards loaded, no horizontal overflow or JavaScript page errors, no cloned sticky controls, product-type links appeared after the grid, and no zero-score ratings rendered.
- Filter drawer opened with six prominent groups and 14 more available; selecting Ambient Lighting showed five in the live count and returned five products after Apply.
- Product type selection returned four Undated Planners. Sort preserved the type URL. The all-products ascending price result was in ascending order at both widths.

The Shopify preview bar was hidden by test-only CSS during interaction checks because it covered the drawer's Apply button at the test viewport. The theme itself was not changed for this. Physical Safari and a final theme-editor interaction pass remain unverified.
