# Legacy cover removal — 27 October 2026

Installed to the production Studio and unpublished Shopify theme `187527266499`.

## Studio

- Removed the legacy 10-cover fallback collection and its JPEG files.
- Replaced all initial HTML placeholders with the new occasion catalog.
- Reduced the occasion picker to the eight current product collections.
- Migrated old routes: Couple → Anniversary, Pregnancy/Kids → Baby’s first year, Festivals → Birthday.
- Migrated saved legacy cover IDs to the first current cover for the selected collection.
- Railway deployment: `b91ccfbf-dc81-4138-9753-cefbff8409f9`.

## Shopify theme

- Replaced the four legacy landing-page cover images with new Shopify theme assets.
- Updated Kids and Festivals links to the Baby and Birthday products.
- Exact readback passed for the section and all four images.
- The theme remains unpublished.

## Verification

- 8/8 product catalog routes passed on production.
- Legacy-route migration passed for Couple, Kids, Pregnancy, Festivals, and unknown routes.
- Studio has eight occasion cards and only `assets/occasion-covers/` cover sources.
- Mobile 390/430 and desktop 1440 regression checks passed without overflow.
- Page reorder and layer forward/backward checks passed.
- Old Studio cover URL resolves to the app fallback HTML, not an image; new cover URL returns JPEG.
- Shopify Studio bridge loaded Travel with eight covers and no horizontal overflow.
- The unpublished photo-books page handle is not currently assigned, so its direct preview URL returns 404; Liquid validation and exact remote readback passed.

## Dormant Shopify assets

The old theme assets `june-photobook-cover-3.jpg`, `-12.jpg`, `-18.jpg`, and `-21.jpg` have no references in the current remote theme. A targeted `themeFilesDelete` call was blocked by the Shopify connector safety policy. They remain dormant in the unpublished theme asset library and must be deleted manually in Shopify Admin if physical cleanup is desired.
