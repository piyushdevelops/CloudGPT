> Verification correction, 23 October: filter submission works after hiding the overlapping Shopify preview toolbar; the experimental patch was reverted. Our Story is visually present as images, not blank; another chat added a readable text alternative, verified here. See priority-fixes-oct23/README.md for current results and limitations.
# The June Shop — holistic storefront audit

23 October 2026 · Draft theme 187527266499 · TJS Website Rework — 24 Sep 2026

## Assessment

The main browsing experience is functioning and the revised mobile category cards look coherent. The draft should not yet receive launch sign-off: personalised products can reach checkout without a name, and collection colour filtering does not apply. Several customer-information and launch-transition gaps also need resolution.

This was a read-only review of the current draft, with temporary cart interactions for verification. No theme or catalog edits, publishing, orders or payments were made. The test item was removed; the cart returned to zero. Existing checkout personal information was not copied into evidence.

## Fix first

### 1. P1 — Personalisation is not collected

Product: `/products/undated-yearly-planner-too-glam-to-give-a-damn-ultimate-sticker-book`.

Selecting **Add Your Name** changes the price from ₹1,599 to ₹1,699, but does not reveal a name field. Add to Cart succeeds. The confirmation and cart identify the Add Your Name variant without a name property, and checkout entry accepts it.

Impact: a paid personalised order can arrive without the information needed to fulfil it.

Fix: render and require the personalisation field for that variant, include it as a cart line property, and enforce the same behaviour for both main and sticky purchase controls. Verify the property survives cart edits and checkout.

Evidence: [personalisation-cart.png](personalisation-cart.png).

### 2. P1 — Collection filter Apply discards the selection

Reproduction on `/collections/coffee-mugs`: open Filters → Colour → Blue (5). The preview correctly updates to **5 products** and **Apply filters 5**. Apply closes the drawer, but the collection remains **28 products** and the URL retains only `filter.v.availability=1`, without the colour parameter. Reproduced on the confirmed draft, including after allowing the preview count to settle.

Impact: shoppers cannot reliably narrow results using the drawer.

Fix: trace the filter submission and subsequent URL/section replacement; preserve selected form values through the request. Retest colour, combined filters, price, Clear, back/forward, sorting and pagination. The exact root cause was not established during this audit.

Evidence: [before](filter-before.png), [after](filter-after-confirmed-draft.png). Fresh source reference: `source/sections/collection-new.liquid`.

### 3. P1 launch readiness — Countdown ends without a shopping action

`/pages/2027-planner-preorders` correctly targets **26 October 2026, 5 pm IST**. Current source hides the countdown at expiry and reveals only **“The preorder launch time has arrived.”** The completion block has no purchase link, and the page main content contains no destination link.

This is a launch-readiness gap, rather than a failure of the original countdown-only brief. Add a merchant-configurable live-state heading and preorder destination, coordinated with product availability. Verify the expired state before launch. The future expiry behaviour was inspected in source, not by changing the browser clock.

Evidence: [countdown-mobile.png](countdown-mobile.png); `source/assets/june-2027-countdown.js` and `source/templates/page.june-2027-countdown.json`.

## Resolve before release

| Priority | Finding | Recommended action |
|---|---|---|
| P2 | **Our story is blank.** `/pages/our-story` renders an empty main element between header and footer, despite a footer link to it. | Populate the page or remove the route from navigation until ready. [Screenshot](empty-story-mobile.png). |
| P2 | **Delivery promises conflict.** FAQs say dispatch within 4–7 business days; Shipping & Delivery says processing within 3–14 business days; checkout says delivery within 2–4 days. | Establish actual dispatch/transit promises, including preorder exceptions, and align all three surfaces. |
| P2 | **Support contacts differ.** FAQ has +91 8697111998; Contact Us has +91 7003079822. Contact/FAQ use sales@ while footer uses help@. | Confirm which channels are staffed and make their purpose consistent. Different addresses can be intentional, but should not leave customers guessing. |
| P2 | **Cart/checkout offer messaging is inconsistent.** Cart says “FLAT 50% Offer Applied”; the tested ₹1,699 / ₹3,499 item is not exactly 50% off. Checkout uses “clearance picks”, “Sale Ending In 2 Hours!” and delivery urgency. | Reconcile with the actual active promotion; avoid global copy implying an offer applied when it has not. Review the timed urgency against real sale rules. [Cart screenshot](cart-page-mobile.png). |
| P2 | **Sticky product quantity buttons expose translation errors.** Accessible names contain `I18n Error: Missing interpolation value "product"` on tested planner and lamp pages. | Supply the product interpolation or use valid concise quantity labels. Verify main and sticky controls with a screen reader. |
| P2 review | **Product price changes after initial rendering.** Vespera initially showed ₹6,999 twice and “Price Drop”, then settled to ₹3,099 / ₹6,999 and 56% Off. Dolce initially showed ₹2,999 twice. | Render the selected variant's correct sale price in the initial HTML. The lamp's settled price was correct; this is a loading-state issue, not evidence of an incorrect final charge. |
| P2 review | **International delivery selector versus policy.** Footer offers 14 countries while the shipping page describes shipping all over India. | Confirm enabled markets and delivery eligibility. International checkout was not tested; this is a configuration/content reconciliation item. |

## Content and visual polish

- Dining hotspot says **“Stater plates”** instead of “Starter plates”.
- Planner badge says **“Cusom Design Specific Gifting Box”**.
- Checkout says **“Orders are Deliivered…”**.
- Homepage meta description includes **“Explore the our wide range…”** and a long keyword list. Replace with a concise, readable summary.
- Collections use **Rs.**, while homepage and main product prices use **₹**. Standardise formatting across main price, sticky price, cards and cart.
- No-results search suggests **Rakhi Gifts** first in late October. Refresh seasonal suggestions for the current campaign.
- Product gallery controls include unnamed buttons and repeated image descriptions. Improve previous/next names and descriptive alt text without repeating the same product name on every view.
- Standard product, cart, policy and account surfaces still differ visually from the redesigned homepage. The cart's old offer/emoji styling is the most noticeable transition. Preserve functional clarity while bringing these templates into the same typography and action system.

## What passed

| Area | Observed result |
|---|---|
| Draft identity | Admin read confirmed UNPUBLISHED theme 187527266499; preview bar displayed Draft. |
| Desktop navigation | Drawer opens, special planner links appear first, nested Home → Décor Objects & Accents expands with normal-size indicators. |
| Mobile header | Compact black island visible after scrolling; search pill expands and accepts a query. Intentional overlap was not treated as a defect. |
| Mobile categories | New category cards fit at 375 px; no horizontal page overflow in checks at 375, 393 and 430 px. [375 px screenshot](category-375.png). |
| Hero | Limited Edition and Life Journals tabs switch content. Baby Record Books is clearly marked unavailable/coming soon. |
| Homepage interactions | Comparison opens; Escape closes it and returns focus to its trigger. Weekly planner pages, lighting selection, glassware selection and dining bowl selection update content and links. |
| Search | Predictive “mug” results appear; submission routes to Coffee Mugs. Nonsense query shows a useful no-results state and suggested searches. |
| Collection sorting | Price low-to-high updates URL and product order. |
| Collection pagination | Coffee Mugs Load more increases rendered product cards from 24 to 28. |
| Product options | Tested planner variant selection updates price. Personalisation collection remains the blocker above. |
| Cart confirmation | Add-to-cart popup appears with variant, price and subtotal. |
| Cart arithmetic | Quantity 1 → 2 recalculates ₹1,699 → ₹3,398; test removal returns header count to zero. |
| Checkout entry | GoKwik opens with matching ₹1,699 item total and ₹1,800 savings. Prepaid/COD choices are visible. No payment submitted. |
| Countdown | Correct date/timezone, ticking countdown, sneak-peek status responds; no observed mobile overflow. |
| Account | Account link reaches sign-in with email and Shop options. No account created or login submitted. |
| Images/layout | No broken loaded images on sampled homepage/product pages; no horizontal overflow in sampled mobile templates. Homepage DOM contained 108 images, 15 non-lazy; this is an inventory, not a performance score. |

## Coverage and limits

Desktop baseline: 1440 px. Primary mobile baseline: 393 × 852; additional homepage/category checks at 375 × 812 and 430 × 932. These are Chrome viewport checks, not physical Safari tests.

Visited key collections: New & Bestsellers, Home, Lamps & Lighting, Kitchen & Dining, Undated Planners, Limited Edition, Everyday Glassware and Coffee Mugs. All rendered collection content; no 404 encountered in this sample. Collection route records are in [collection-routes.json](collection-routes.json).

Product sample: Too Glam Undated, Dolce Far Niente Limited Edition, Vespera lamp and Mystery Box. Full purchase interaction was tested on the Too Glam planner only. Mystery Box content rendered, but its slide-to-unlock purchase interaction was not exhaustively tested. Product records: [product-routes.json](product-routes.json). Early price values in that record are initial-render observations, not settled-price assertions.

Support pages checked: Contact Us, FAQs, Shipping & Delivery, Returns & Refunds, Our Story, Privacy and Terms. Text/layout observations are in [support-routes.json](support-routes.json). This was not a legal review of policies.

Not completed: every catalog SKU/menu destination, physical iPhone Safari and keyboard, full keyboard/screen-reader/contrast compliance, all animation timeline states, newsletter delivery, account authentication, international checkout, real payment/order/refund, analytics event delivery, SEO crawl/index coverage, Lighthouse/Core Web Vitals, load testing or security testing. No performance score or full accessibility certification is claimed.

One earlier filter attempt lost the draft preview context and showed the live theme. It was restored explicitly and the filter bug was reproduced in the draft. `filter-after.png` is that ambiguous earlier screenshot and must not be used as proof of a draft-layout defect; use `filter-after-confirmed-draft.png` instead.

## Recommended repair order

1. Personalisation validation and cart properties.
2. Collection filtering end-to-end.
3. Countdown live-state preorder destination before 26 October, 5 pm IST.
4. Blank story page and consistent delivery/support/offer information.
5. Quantity accessibility labels, initial price rendering and template polish.
6. Targeted regression of the repaired flows, then physical Safari and an authorised test payment before release.

Any subsequent implementation must fetch fresh remote files and merge only scoped changes because three design chats share this draft. This audit's saved source is evidence, not an upload baseline.
