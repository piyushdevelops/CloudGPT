# Photo Books mobile arrow crop repair — 26 October 2026

## Scope
- Unpublished theme: `187527266499`
- Changed only `sections/june-photo-books-landing.liquid`.
- Added `8px` mobile bottom padding to the horizontally scrolling occasion cards so the circular arrow's lime depth shadow remains inside the scroll container and is not clipped.
- Arrow position, size, artwork, card content and desktop layout are unchanged.

## Concurrency and remote verification
- Fresh remote pull completed before editing.
- Fresh pre-push pull matched the initial remote SHA-256 exactly.
- Uploaded only the changed section.
- Exact post-upload readback matched local SHA-256: `C957323BDFB67BB93E3F773C23C0900A3ED291339E0D96A4ACBBDF6617805227`.

## Checks
- Shopify Theme Check completed; the edited section produced no finding. Existing theme-wide findings remain in unrelated files.
- Live unpublished preview checked at `393 × 852`.
- Computed mobile carousel bottom padding: `8px`.
- Arrow size remains `34 × 34px`; measured clearance to carousel clipping boundary: `23px`.
- Nothing published.
