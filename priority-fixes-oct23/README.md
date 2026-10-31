# Ordered fixes — 23 October 2026

## Final update (supersedes provisional status below)

- Personalisation: final mobile whitespace rejection and valid add passed. Mobile Check name persisted after checkout entry and return to cart. GoKwik summary shows Add Your Name variant but does not display the property, so downstream order-property retention cannot be certified without an order (no order/payment made). All test items removed; cart zero verified. Separate visible sticky interaction remains unverified; both controls submit through the shared validated form.
- Filters: original file restored, no retained patch. Original apply and clear both passed after hiding the overlapping Shopify preview toolbar.
- Countdown: user confirmed /collections/2027-dated-planners. Set existing launch_link in templates/page.june-2027-countdown.json; exact readback. Collection currently has no purchasable products. No claim of expiry-time UI testing.
- Our Story: concurrent chat added snippets/june-story-text.liquid and rendered it in main-page. User explicitly chose keep and verify. Desktop disclosure opens and full story is accessible as text; mobile screenshot saved. This chat did not upload its alternative main-page prototype.
- Delivery: user confirmed Dispatches in 24 Hours, Delivery 2–4 days across platform. Updated shared FAQ and Shipping & Delivery Shopify Page bodies and draft blocks/_delivery_return.liquid default. Exact readback confirmed. These shared Page updates are store-wide under the user’s latest instruction; no theme publication. Scoped scan of 69 theme files found no other conflicting delivery-time text among those scanned (return/refund periods preserved).
- Checkout: GoKwik already says delivery 2–4 days with a typo. App Open app link returns Service Unavailable. Dispatch addition and typo correction in app checkout are not completed; no workaround injected into the third-party iframe.
- Final remote readback: personalisation template, countdown template, delivery block all exact. verified/ contains those snapshots. Shopify bundled theme validator still unavailable (missing dependency).


Only unpublished theme 187527266499 modified. No payment or publication.

## 1. Personalisation — installed, verification partly outstanding

Fresh remote confirmed Add Your Name was absent from the variant detector. Scoped replacement inside the existing personalisation custom-liquid block in templates/product.a_undated_planner.json adds detection, synchronises the selected variant, validates trimmed nonempty names up to 24 characters before shared form submission, and removes properties[Name Customisation] on Classic. Styling and merchant controls preserved. Both main and sticky use the same form. Exact remote readback confirmed after both revisions; final-personalisation.json is the final verified version.

Verified: direct personalised variant reveals field, Classic switching clears property, main blank rejection on desktop/mobile, valid desktop add with name property, quantity 1→2 retains name. Checkout entry opened without payment; name stayed in underlying cart but checkout overlay summary retention was not independently verified. Separate sticky button interaction remains unverified because bar was below viewport during testing. Test cart restored to zero.

JavaScript syntax passed. Shopify skill theme validation was unavailable because its bundled @shopify/theme-check-common dependency is missing. Do not describe verification as exhaustive.

## 2. Filters — audit correction, no retained change

Update 23 October: follow-up completed; see filter-check/README.md. Scoped price validation/live preview and drawer keyboard fixes installed in sections/collection-new.liquid with exact readback. Mobile/desktop checks include combined filters, clear, sorting, pagination, Back, category preservation and planner-specific personalisation filters.

Shopify preview toolbar covered the mobile Apply filters button. After hiding toolbar, original code successfully applied Blue (5 results) and Clear all restored 28. An experimental event-routing patch was uploaded, then fully reverted with fresh comparison and exact readback. Original file restored. Earlier audit's claim of broken filter submission is not supported. No production filter fix retained.

## 3. Countdown — waiting for destination confirmation

Update 23 October: user confirmed destination and link already configured. Fresh remote and mobile/desktop checks complete; see countdown-check/README.md. Expiry logic passes before/at/after boundary in isolated Node VM. Collection still displays 0 products. No remote edits or publication in this verification turn.

Existing section already supports launch_link and renders a CTA after expiry. templates/page.june-2027-countdown.json has empty settings. Existing /collections/2027-dated-planners loads but currently renders no purchasable products. Asked merchant to confirm intended destination before configuring. No countdown change made.

## 4. Our Story — corrected diagnosis; no change yet

Existing page body contains four loaded images. Visual inspection shows About Us and What's in a Name content; empty alt attributes make the accessibility/text snapshot look blank. Actual issues: image-only story, tiny mobile text and no accessible story text. Do not invent facts or describe page as visually empty. Preserve existing source story when implementing accessible version after fix 3.

## 5. Delivery — facts requested; no change yet

FAQ says dispatch 4–7 business days, shipping policy processing 3–14 business days, checkout says delivery 2–4 days. Asked merchant for actual standard/personalised/preorder dispatch and transit times. Page records and checkout settings are shared with live store; do not silently update these under draft-theme-only authorization.
