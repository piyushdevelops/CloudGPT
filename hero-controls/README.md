# Hero images, stable tab height and 2027 effects — 1 October 2026

Installed on unpublished theme 187527266499; nothing published. Three changed files were read back and matched, then current-theme synced.

## Merchant controls

Expand June · Make Room in the theme editor.

- Journal image & link — Wedding / Rewritable / Baby: Journal image picker, image description and image fit. Choose an override or retain the collection-image fallback. These blocks select the Life Journals tab automatically. Existing labels, collection targets and baby unavailable notice remain.
- 2027 digit effects: enabled, use theme accent or custom colour; full number / outline only / shadow only / number with glow; outline thickness, glow size and intensity; counts for each digit; blink time, speed, fade softness, initial delay, inter-digit pause; number of sequence plays, continuous loop and repeat pause.
- Defaults: first 2 blinks twice, 0 three times, second 2 four times, 7 five times. One sequence per tab entry, 700ms per blink, 600ms initial delay, 400ms between digits, theme accent and full-number style. Continuous repeat is optional.
- Visitor pause/resume/replay control. Reduced motion gives static digits. Animation pauses offscreen and when the document is hidden, cancels on tab exit/disconnect and cleans up listeners.

## Height implementation

Undated stays in layout as the natural-height reference. When inactive it is invisible, inert and aria-hidden; alternate panels occupy the same stage. No measured pixel height or resize race. Desktop gutters retained. Alternate panels can scroll internally if a merchant's unusually large copy/font overflows, with normal page scroll chaining; no clipping or overscroll trap.

## Verification

- Liquid/schema and JS syntax validation passed. Shopify enforced additional block-name/range limits during upload; those were corrected before successful installation.
- Exact three-file remote readback; unpublished role checked. Other section code and merchant settings retained.
- Desktop 1440x1000: all four stages 630px, no panel vertical overflow. Mobile 393x852: all four stages 670.375px and the same navigation document position, no horizontal overflow; dated form fits without internal scrolling. Desktop viewport-top readings vary because the browser scrolls tabs into view; stage height remains constant.
- Actual effect seen on 7; pause/resume UI checked. Algorithm checks verified ordered counts 2/3/4/5, changed counts, finite repeat, minimum 400ms pulse period and cancellation. See sequence-checks.json and check-sequence.cjs.
- Image controls visible in editor. Outline and glow settings previewed, then returned to Full number without saving test values. Editor Save disabled at finish. Stored effect remains original defaults. No existing images replaced because the request was for controls.
- Physical iPhone Safari and reduced-motion OS setting were not exercised. Reduced-motion handling is implemented in both CSS and JS.

Evidence: before.json, after.json, remote-checks.json, validation.json, sequence-checks.json, browser-checks.json, mobile-dated.png, editor-controls.png. desktop-dated.png was captured partway down the page; editor-controls.png is the complete desktop composition evidence.

update.cjs is a snapshot-based migration script. Do not rerun on newer remote edits without a fresh reconciliation.
