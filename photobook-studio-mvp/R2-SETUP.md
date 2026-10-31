# Cloudflare R2 setup

Create a private R2 Standard bucket named `june-photo-book-orders`. Public development URLs and custom-domain public access must remain disabled.

Create an R2 API token scoped to **Object Read & Write** for this bucket only. Add these sealed variables to the Railway `june-photo-studio` service:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME=june-photo-book-orders`
- `STORAGE_SIGNING_SECRET` (at least 32 random bytes)

The browser receives only 15-minute PUT URLs. It never receives the R2 secret. Configure bucket CORS for the production studio origin and `PUT`, `HEAD` only. Do not use `*` after testing.

The storage status endpoint is `/api/storage/status`. It lists missing variable names but never returns secret values.

Current implementation provides design creation, signed original-photo uploads and recoverable cloud draft JSON. The immutable final-version lock, server-side proof PDF, 300-PPI print renderer, Google Drive archive and Shopify webhook association remain launch gates.
