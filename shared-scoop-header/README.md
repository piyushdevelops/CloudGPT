# Shared scoop header — 8 October 2026

User clarified that the approved homepage header must be shared across the storefront. Supersedes product-header-fix. Installed on unpublished 187527266499; nothing published.

Expanded header-scoped homepage CSS and scoop markup to all pages rendering this header. Enabled existing scroll-island script everywhere the header exists. Removed legacy product-specific render, schema block and configured block. Existing scoop/search/cart/announcement settings remain shared. Homepage content spacing rules remain homepage-only; other pages reserve header height above MainContent.

Uploaded only my-header.liquid, header-group.json and june-scoop-scroll.js after immediate remote baseline comparison. Readback: Liquid and JS exact; JSON semantically equivalent after Shopify formatting normalization. No product content changed.

Browser verified product desktop 1440px and mobile 393px, mobile compact island 148x38 at scrollY681, working search open/close from compact state, collection shared header and content below its 50px mobile header. Product desktop screenshot saved. Physical Safari and exhaustive template/editor checks not performed. Checkout and separately hosted account pages are outside theme-header scope.

JS syntax passes. Theme validation retains pre-existing header complexity/settings/unused-variable findings and partial-checkout missing dependencies; group JSON passes. Bundled skill validator unavailable due missing package; repository validator used.
