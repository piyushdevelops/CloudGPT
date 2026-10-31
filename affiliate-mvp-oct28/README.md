# TJS Affiliate entry points — 28 October 2026

Added two links to `https://earn.thejuneshop.com` on unpublished Shopify theme `187527266499`:

- `sections/my-header.liquid`: accent affiliate CTA immediately below the side-drawer shop navigation, labelled **TJS Affiliate** with **Join & earn** supporting copy.
- `sections/june-footer.liquid`: quiet **TJS Affiliate** link in the footer legal row.

## Safety and verification

- Pulled both target files from the remote theme before editing.
- Re-fetched immediately before upload and rebuilt the same two-file patch from that fresh state.
- Uploaded only the two files above.
- Shopify returned no user errors.
- Exact SHA-256 readback passed for both files; see `final-readback.json`.
- Preview checked at 390 × 844 and 1440 × 1000.
- Drawer link is visible, directly follows the navigation, and has a 70–73px rendered height.
- Footer link is visible at both sizes.
- No horizontal overflow or browser page errors.
- Destination returned HTTP 200 with title `Create. Share. Earn. | The June Shop`.

Nothing was published. MAIN was not modified.
