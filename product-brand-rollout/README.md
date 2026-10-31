# Product brand rollout — 9 October 2026

Installed on unpublished theme 187527266499. Nothing published. Four files uploaded after fresh remote conflict checks; final exact readback 4/4.

## Changes
- Product-only brand layer, gated by the enabled-by-default **Theme settings → June product brand** toggle.
- Editable product heading, section heading and subheading family, weight, desktop/mobile sizes, tracking and leading.
- Prices, actions, supporting copy, labels and captions reuse **June typography / June typography utilities**. Colours reuse the saved master palette; settings_data was not changed.
- Poppins headings, Archivo Black prices, quieter compare prices, smaller currency treatment, capsule primary actions with arrow, selected options, keyboard focus and page-stack quantity presentation.
- Layout, content, images, variant controls, product assignments and scripts preserved. Header, search, cart and homepage excluded by MainContent/product-page scope.

## Files
- assets/june-product-brand.css
- snippets/june-product-brand.liquid
- config/settings_schema.json (appended one group)
- layout/theme.liquid (conditional snippet and MainContent attribute)

## Verification completed
- Latest remote inventory: 14 product templates; sections/custom Liquid and sticky buying controls inspected.
- All 14 rendered at desktop and mobile emulated width 393px: no document horizontal overflow or Liquid error text. See browser-checks.json and screenshots.
- Active representatives: default Snail Correction Tape, Undated Too Creative, Limited Dolce Far Niente, Wedding You & Me, Black Friday kitchen mat, Champagne Heart, Mystery Box V4.
- Other views tested using an existing product with the template view parameter: bogo, dated2026, feelgoodbox, mysterybox, mystery_box, only_config, preorderdated2026. These have no active assigned products in the inventory; this is rendering coverage, not an end-to-end preorder/bundle purchase test.
- Heading and price computed fonts/sizes confirmed at both breakpoints. Customisation selection reveals the name field and changes price; Classic restored. Product quantity increment/decrement verified.
- Added one Classic Too Creative variant at ₹1,599. Cart changed from 4 items / ₹7,996 to 5 / ₹9,595. Removed only test line and refreshed: original 4 / ₹7,996 restored.
- Snippet passes Shopify theme-check in theme-path mode (partial fixture reports missing locales directory diagnostics, but snippet result SUCCESS). Shopify accepted schema and files. No new JavaScript.

## Remaining verification / known observations
- GoKwik did not open from the existing Checkout button in the preview, including after reload. Matching checkout-total verification is NOT complete. No checkout handler or cart code was modified by this rollout.
- Cart removal persisted but the visible drawer stayed stale until refresh during this run. Record for separate cart investigation.
- Existing sticky quantity accessibility labels show a missing product interpolation translation error. No locale changes made.
- Full sold-out/no-sale, sticky Add to Cart, popup lifecycle, keyboard traversal and real bundle/preorder buying regression are not fully signed off.
- Physical iPhone/Safari, merchant editor interaction and payment completion not tested. Browser emulation is not physical-device verification.
- Screenshots cover initial template views, not exhaustive full-page visual approval.

## Rollback
Disable June product brand to restore existing template styling. This does not remove merchant settings or alter product data.

Undated Planner layout redesign remains a separate next task.
