# Occasion-specific PhotoBook checkout, 29 October 2026

## Diagnosis

The Shopify studio page initially passed the 22 variant IDs of the generic `june-photo-book` product. Links from occasion cards supplied a product handle, and the Shopify wrapper fetched the occasion's variants, but a shopper entering the studio without a product parameter could choose an occasion inside the iframe while retaining generic checkout IDs.

All eight occasion products are now active and their public `/products/{handle}.js` endpoints return 22 variants with CORS enabled. The studio can resolve the chosen occasion's actual product variant directly at Add to Bag.

## Changes

- `photobook-studio-mvp/app.js`: resolve the selected occasion's product by handle, size, and page count before saving order assets. If its variant is unavailable or the product cannot be fetched, show a retryable error. No generic fallback is used for Shopify checkout.
- `photobook-studio-mvp/index.html`: bump the `app.js` cache version.
- Deployed to Railway production as `5d8e4597-c88f-485e-a177-bf5fabd5d4d0` (SUCCESS).
- Archived the Shopify product `The June Photo Book` (`gid://shopify/Product/14951682146499`) after verification. Historical orders remain intact. The eight occasion products remain active.

The deployment stage was assembled from the current hosted versions of all 90 served files. Fresh remote recheck was 90/90 exact immediately before upload. Production readback was 90/90 exact after deployment. No Shopify theme files were changed or published.

## Verification

- Browser lookup passed all eight occasions against the production studio, each resolving its own Regular/20 variant.
- Shopify embedded studio passed both the default Anniversary and switched Travel paths after generic product archival.
- Fresh cart sessions added the Anniversary and Travel variants to Shopify successfully; no order was placed.
- `node --check` passed for the changed app script.

## Follow-up

The Shopify studio page section still has the archived generic product and its old variant map in theme settings. The app ignores those variant IDs at checkout. Remove the obsolete setting and simplify the section in a separate, freshly reconciled theme edit; the current page continues to work through its configured variant-map fallback.
