# iPhone screenshot follow-up — 6 October 2026

Installed on unpublished theme 187527266499 only. Five files uploaded, five exact remote readbacks. No settings, palette, artwork or product mappings changed. MAIN untouched.

## Change ledger

| Section/file | Screenshot problem and change | Source verification | Saved preview verification |
|---|---|---|---|
| june-other-chapters.liquid | Photo 10: baby faded away before the pinned stage exited. Mobile now holds the final scene, caps stage height at 600px and retains viewport height during height-only browser chrome changes. Width/orientation changes recalculate. All scenes remain in one pinned stage. | Liquid passes; desktop final fade retained; reduced-motion branch retained | Final baby visible while Décor enters at 430px. Keyboard skip focuses Décor H2 at 80px. Reverse scroll checked near exit. Full phase-by-phase/device testing remains pending. |
| june-with-extras.liquid | Photos 7–8: badge overflow, closed extras leaked because later padding overrode zero height. Badge now 66px with corrected inner spacing; closed mobile stage display:none; closed extras inert; reveal uses quiet outline. | Liquid passes; settings and per-cover mapping unchanged | All four covers selected at 393px; badge scroll height equals client height; closed stages zero height at all three mobile sizes; first/last cover extras opened and closed. |
| june-layer-the-table.liquid | Photos 2–4: tall arrangement, mixed capsule/rectangle controls, detached buying information. Mobile stage 195px; two consistent rectangular controls; original photo beside title/price and CTA below. | Liquid passes; mobile CSS only | All three selections and both arrangements exercised; grid card verified after correcting an inline cascade conflict. Desktop composition inspected. |
| june-shop-the-corner.liquid | Photos 5–6: buying information stretched across multiple screens. Real photo beside name/price, full-width purchase action below, collection link aligned left. | Liquid passes; desktop CSS and mapping preserved | All three choices exercised; 393px screenshot shows continuous product card. |
| june-a-little-curious.liquid | Photo 1: arrow rendered as coloured emoji; cramped value rows. Replaced with inline SVG, made value text wrap independently of price. | Liquid passes; variant destinations untouched | 375px screenshot verifies SVG arrows and clean two-line value labels. |

## Evidence

- final-readback.json: 5/5 exact remote text matches, role UNPUBLISHED.
- validation.txt: all five changed sections pass.
- metrics.json: no horizontal overflow at 375×667, 393×852, 430×932, 1440×1000. Measurements reflect current selections, not a controlled before/after total-page comparison.
- limited-393.png: badge and selected purchase block.
- extras-open-393.png: fourth cover's correct three extras; disclosure remains usable.
- dining-expanded-393.png and dining-final-393.png: mobile arrangement and compact purchase card.
- decor-393.png: compact mobile product grouping.
- mystery-375.png: SVG arrows and value rows.
- story-final-430.png: final baby scene and following Décor visible together. story-exit-393.png predates the final 600px cap.
- desktop-1440.png: retained desktop Dining composition.

## Remaining limits

These are browser viewport checks, not physical iPhone Safari tests. The user's ten iPhone screenshots are the before evidence. Theme-editor reload, full reduced-motion runtime checks, complete story phase traversal and exhaustive all-section visual comparisons are not signed off in this follow-up. Inside Discovery artwork was not replaced: a better genuine original is still needed to improve detail. Browser scrollbar and Shopify draft toolbar appear in captures and are not theme elements. Header/headings can appear partially outside the viewport when a control lower down is brought into view; those screenshots are not evidence of clipped section content.

The earlier mobile-repair-oct06 record remains applicable to sections not changed here. Do not describe the entire homepage audit as fully completed based on these focused repairs.
