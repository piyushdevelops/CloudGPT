# Scoop scroll island — 8 October 2026

Installed on unpublished theme 187527266499. Nothing published.

Homepage scoop morphs into a compact floating pill after 70px of scrolling and returns to the original shape near the top. Existing logo, colours and typography remain in use. Search and cart confirmations retain their existing sizes. Announcements resume after the scroll transition settles.

Header > Scoop scroll island contains mobile/desktop enable controls, motion, threshold, duration, dimensions, offset, radius and compact logo sizes. Reduced motion snaps to the appropriate shape. Existing search and announcements assets were not changed.

Four explicitly changed files were uploaded after a fresh remote baseline comparison. All four match exact remote readback; see final-readback.json. Shared header and header-group changes were scoped to the new block, render, preset and block limit.

Verification: JavaScript syntax passed. New snippet, asset and configuration validated; shared header retains existing validation findings documented in validation.txt. Browser checks passed for mobile compact 148x38, desktop compact 185x40, return to original mobile scoop 228x40, and opening/closing search from compact state. No browser console errors observed. Screenshots: mobile-pill.png and desktop-pill.png. Physical Safari, touch and exhaustive theme-editor checks remain unverified.
