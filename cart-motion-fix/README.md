# Cart opening correction — 9 October 2026

Installed on unpublished 187527266499 only. Scoped CartDrawer class methods in assets/global.min.js; other drawer classes, native mutations, search and GoKwik unchanged. Latest asset fetched, exact target matched, fresh remote recheck immediately before upload. First immediate readback was stale; subsequent readback exactly matched 157539 characters.

Inherited DrawerComponent reverses a mutable transform array on every open/close. Repeated open calls (including product updates while already open) can reverse the opening direction and leave the open modal translated offscreen. CartDrawer now uses deterministic enter/exit keyframes and guards duplicate/overlapping calls. Reduced motion uses zero duration. Close requests during the short opening transition are ignored until it finishes.

Validation: node syntax check passed. check.mjs passed five cycles including simultaneous duplicate opens/closes, correct counts and final keyframe directions. Browser verified full drawer open, close and reopen, settled transform zero, 3 units / ₹5997 preserved. Screenshot verified.png. No cart item mutations or checkout in this pass. Exact trigger sequence in user's original report was not reproduced; code defect and fix verified. No publication.
