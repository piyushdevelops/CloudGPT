# Photo Books home image — 28 October 2026

## Scope

Replaced the CSS-built Photo Books artwork in `sections/june-memory-feature.liquid` with a realistic, image-led photo album scene. The adjacent Our Days branch, copy, links, typography controls and section structure were preserved.

The section continues to use the existing `photo_book_photo` image-picker setting. Its label is now **Photo books section image**. When the merchant does not choose an override, the section falls back to `assets/june-photo-books-home-realistic-v3.webp`.

## Theme target

- Theme: `187527266499`
- Role after write: `UNPUBLISHED`
- Published: **No**
- Remote files changed:
  - `sections/june-memory-feature.liquid`
  - `assets/june-photo-books-home-realistic-v3.webp`

## Reconciliation and readback

- Pre-write section checksum: `0718ca768ca6567ba4d624a2442e24fc`
- Post-write section checksum: `fe9b169c3c0f0f63b82fba8a92f9740e`
- Post-write asset checksum: `437c38e78dda749142807b1c0cd53579`
- Exact remote section body read back and compared equal to the intended body.
- Remote theme processing: successful; `processing=false`, `processingFailed=false`.
- Exact readback copy: `remote-readback/sections/june-memory-feature.liquid`

## Validation

- Shopify Theme Check: changed section clean.
- Desktop preview: HTTP 200 at 1440×1000; image loaded at 1536×1024 and rendered with `object-fit: cover`.
- Mobile preview: HTTP 200 at 393×852; image loaded at 1536×1024 and rendered as a 3:2 image without overflow.
- Screenshots:
  - `browser/desktop-photo-books-section.png`
  - `browser/mobile-photo-books-section.png`
- Machine-readable results: `browser-checks.json`

## Notes

The original generated PNG remains in `output/imagegen/realistic-photo-albums-image-led-v3.png`. The theme asset is an optimized WebP. No shared layout, settings, locale, header, footer or index files were changed.

