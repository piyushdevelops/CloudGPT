# One shared Other Chapters stage — 30 September 2026

User requested that all three chapters run sequentially in one physical pinned space, preserving the existing visuals and gaps.

The Shopify editor explicitly disabled pinning (`data-editor=true`), which displayed three stacked panels. Removed that exception. Added Shopify block-selection handling to seek the corresponding wedding, rewritable or baby beat in the shared timeline. No copy, assets, typography, palette, timing, schema or homepage configuration changed. Reduced-motion/disabled-motion fallback remains static.

Saved only sections/june-other-chapters.liquid to unpublished theme 187527266499. Fresh pre-save reconciliation matched the initial snapshot. Remote readback exactly matches the new section; templates/index.json checksum unchanged. MAIN untouched; nothing published. current-theme section synced.

Validation: Shopify Liquid validator passed all checks; extracted JavaScript passed node --check. Storefront DOM checks confirmed the sticky stage. Browser screenshot capture returned blank images and the Shopify editor remained loading after refresh, so post-save editor block-selection and visual review remain unverified.

before.json contains rollback source. theme/sections/june-other-chapters.liquid is the installed source. edit.py is a historical one-time helper; do not rerun on updated source.
