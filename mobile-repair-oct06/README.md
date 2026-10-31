# Mobile repairs — 6 October 2026

Installed on unpublished theme **187527266499**. Nothing published; MAIN untouched. User requested implementation after the visual audit in `../mobile-visual-oct06/`.

## Saved changes

| Area | Change | Evidence / limitations |
|---|---|---|
| Header | Animated GIF now falls back to a stable text wordmark on mobile; a merchant-selected non-GIF mobile logo still works. Compact predictive panel rule; evergreen popular searches replace Rakhi suggestions. | `search-375.png`, `footer-375.png`. A proper static brand-logo asset is still preferable to the text fallback. No suitable existing logo file was found. |
| Hero | Actions share a row; shorter artwork area; consistent tab alignment; Limited image loads eagerly. | `hero-393.png`, `hero-final-393.png`. All four stage heights measured 575px at 393px. Cold-network test not performed. |
| Undated | Fixed a `display:block!important` override that joined policy links. Thumbnail row becomes compact accessible dot controls; enlarged interior preview. | `undated-393.png`. Existing names and selected states retained. |
| Limited Edition | Smaller cover stage and count badge, removed reserved title height, quieter upper unboxing action, wider extras cards with retained swipe cue. | `limited-393.png`. Selected Soul On Fleek correctly shows sold out. All four cover controls exercised at 375px before the browser batch timed out later. |
| 2027 | Shorter portal, smaller secondary signup heading, tighter portal/form spacing. | `year-393.png`. Existing motion and signup retained; no submission. |
| Inside Discovery | Enlarged image region; horizontally scrollable natural-width page tabs; shorter descriptive tail. | `inside-final-430.png`. First visual check caught overlapping Weekly plans; corrected and rechecked. Higher-resolution original artwork remains a content limitation. |
| Other Chapters | Shorter mobile empty lead-in, content positioned higher, label changed to Skip to shopping. | `story-430.png`. Same pinned stage and phase order retained. Enter on skip focused Décor heading at y≈80px. Complete forward/backward animation matrix remains pending. |
| Décor | Correct catalog titles replace unrelated vase/bird/frame overrides; removed unverified dimensions; accurate selector labels; larger product photo and no duplicate mobile hotspots. | `decor-393.png`. Styled scene remains decorative with existing disclosure; product photography is authoritative. |
| Lighting | Dedicated mobile image picker falls back to genuine product photo, contained in a separate reserved image region; buying panel below the image. Larger thumbnails. | `lighting-393.png`, `lighting-430.png`. Vespera and Gilded complete silhouettes/base visible. Desktop wide-backdrop treatment retained. |
| Glassware | Coffee-mug selection uses genuine mug photo; cocktail title corrected; unsupported specs removed; empty Details hidden; generic Shop this piece copy; shorter mobile stage and no product minimum-height slack. | `glassware-393.png`, desktop screenshot. Mug/cocktail content correction also applies desktop. A matching approved wide mug scene/mask remains unavailable. |
| Dining | Larger selected real photo; stacked title/price/action; tighter secondary navigation. | `dining-393.png`. Arrangement and product controls retained because they perform different actions. |
| Mystery Box | Removed duplicate mobile From price, added navigation arrows to tier links, constrained image within its box so disclosure no longer overlaps it. | `mystery-final-393.png` confirms the image stays above the open disclosure. |
| Footer | Smaller single-line wordmark; consistent text payment badges. | `footer-375.png`. Existing payment availability note and localization preserved. |

## Verification gates

1. **Source:** all 12 June section files passed Liquid validation. Rechecked final Inside/Glassware/Mystery changes in `final-validation.txt`. Header retains its pre-existing 43-settings validator warning; this work adds no settings. Product overrides were removed rather than inventing facts. Merchant palette/config/settings_data was not edited.
2. **Rendered:** actual saved draft screenshots at 393×852 across the page, supplementary 375×667 and 430×932; desktop 1440×1000 screenshot and computed layout check. No horizontal page overflow at all four viewport sizes (`final-metrics.json`). Product interactions, equal hero tab height and keyboard skip checked. A long selection-matrix call timed out after reaching Glassware; do not claim an exhaustive all-state pass. No physical iPhone Safari session, full reduced-motion regression or complete editor visual matrix was completed.
3. **Saved draft:** all **15/15 files match exact remote readback** (`final-readback.json`). Reloaded saved preview and rechecked search, logo fallback, tabs, content corrections and footer. Only these files were uploaded; copied dependencies were for validation only.

This is an implemented mobile repair pass ready for merchant cross-check, **not complete certification of every historical audit criterion**. Remaining content/device checks above are explicitly pending.

`before.json` preserves the fresh 14-file baseline; header-group was pulled separately immediately before its targeted change. `repair.py` and `refine.py` are implementation records, not idempotent deployment scripts. Do not rerun blindly. Pull fresh remote files before further edits.
