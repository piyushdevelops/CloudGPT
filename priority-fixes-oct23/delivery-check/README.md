# Delivery promises — 23 October 2026

Approved wording: Dispatches in 24 Hours, Delivery 2–4 days.

Scanned 506 remote Liquid/JSON theme files. Corrected three files on unpublished 187527266499 only: blocks/_delivery_return.liquid default; sections/pdp-3.liquid replaces calculated date with editable dispatch/delivery text (existing disabled section remains disabled); templates/product.preorderdated2026.json removes obsolete 15–18 January promise. Fresh comparison immediately before upload; 3/3 exact remote readback. Existing typography preserved.

FAQ and Shipping & Delivery Page bodies normalized to approved wording; exact readback for both. Shared Shopify shipping policy separately still contained 3–14 business days and 14 working days. Removed those conflicting timing sentences and Sunday/holiday exception, added approved promise. Other policy clauses preserved. API lacked write_legal_policies scope; updated existing policy through Shopify admin Save, with fresh pre-save API comparison and exact readback apart from trailing newline. These existing Page/policy records are store-wide. No theme published and MAIN untouched.

Verified FAQ, Shipping & Delivery page and /policies/shipping-policy at 393x852 and 1440x900: approved promise present, no horizontal overflow. Four screenshots record shipping and policy layouts. Original general policy typography remains small; this task changed timing copy only. Disabled PDP component verified in source, not enabled or visually rendered.

Outstanding: GoKwik app Open app still returns Service Unavailable. Checkout test remained at Securing your Checkout with blank iframe, so current checkout banner cannot be verified or changed. Prior check showed 2–4 days with typo and no dispatch statement. No iframe workaround, no payment/order. One 4 Part Snack Dish test item removed afterward. Physical Safari testing not performed.

Shopify theme validator could not run: bundled @shopify/theme-check-common dependency missing. Liquid change removes date calculation and uses existing escaped text rendering; schema JSON parsed successfully.
