# Rolling year — 1 October 2026

Installed on unpublished theme 187527266499. Nothing published.

Replaces the rejected sequential blinking in hero tab 2027 with four staggered vertical digit reels, settling into 2027, followed by one accent highlight. Defaults: 300ms opening delay, 1800ms roll, 180ms stagger, one revolution, 700ms highlight, one play. Merchant controls under June · Make Room → 2027 rolling year: enable, duration, stagger, revolutions, highlight duration, colour, highlight style/strength, speed, initial delay, plays and looping. Existing reduced-motion, offscreen pause, pause/resume/replay and tab cancellation retained.

Fresh section and index snapshots taken before edits. Existing saved effect had been disabled; enabled the requested replacement and set full fill, normal speed and one play. Other merchant settings preserved. Shopify removed seven retired blink settings on index save; this is the only normalization difference. Final section readback matches; current-theme synced to returned source.

Validation: Liquid/schema passed via workspace copy of bundled validator (plugin copy could not resolve dependencies). JS syntax passed. check.cjs checks target digits, stagger, roll-before-highlight order, repeat and disabled state. Browser: actual reel DOM created and animation transform observed; pause/resume/replay checked. Desktop 1440x1000 stage 630px; mobile 393x852 stage 670.375px, dated client/scroll heights 670px, year client/scroll width 333px. No mobile overflow. Desktop digits made container-responsive to avoid overflow. Physical iPhone Safari and OS reduced motion not exercised. Screenshot mobile.png shows settled state, not motion. Desktop screenshot is partially scrolled and is not the presentation evidence.

Only sections/june-make-room.liquid and templates/index.json changed remotely. Local build.cjs is a snapshot helper, not safe to rerun against newer merchant edits; final container-query refinement is in theme source.
