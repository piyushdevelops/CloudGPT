# 2027 dated planner live audit — 31 October 2026

## Immediate finding

The live 2027 collection says “Dispatch by 10 November 2026”, but all 25 active 2027 dated planner PDPs still display “Dispatches from 31 Oct 2026”. Their product forms also submit `properties[Expected dispatch] = 31 Oct 2026`. This is a live customer promise mismatch.

Two orders tagged `Pre-order-2027` exist: `#304741` (Without Name) and `#304742` (Add Name). Both were paid and unfulfilled when checked. Both captured `Expected dispatch = 31 Oct 2026` as line item data. The personalised order captured a nonempty `Name` correctly. No customer contact or order records were changed.

The live PDP Delivery & returns tab embeds the general store shipping policy, which says “Dispatches in 24 Hours”. That standard policy claim conflicts with this preorder.

The live cart theme files still render GoKwik without a country condition (`sections/cart-drawer.liquid`, `sections/main-cart.liquid`, and the optional `sections/tjs-side-cart.liquid`).

## Draft correction

Draft theme `187625799875` already contained the 10 November date changes from 29 October. This audit saved four additional, scoped changes to `sections/june-mobile-product.liquid` on that draft:

1. The 10 November section date now applies only to products tagged `June-Preorder-2027`, so other preorders retain their own metafield date.
2. Standard orders no longer submit an `Expected dispatch` line item property.
3. For 2027 preorders, the delivery tab now says dispatch starts 10 November, delivery time follows dispatch, and links to the standard shipping policy. The generic 24-hour text is not embedded in that preorder tab.
4. The desktop preorder button now remains green. Shared product CSS had overridden the section's green with purple; a scoped preorder rule restores green without changing ordinary add-to-bag buttons.

The connected Shopify API confirmed the draft was `UNPUBLISHED`, the target file matched the fetched version immediately before each upload, and exact readback matched afterward (final MD5 `f94d6f6bc5c5ed96b956658144770da1`). Shopify CLI Theme Check returned no diagnostics. The Shopify skill's separate validator could not start because its bundled `@shopify/theme-check-common` dependency is missing.

The [draft 2027 PDP](https://thejuneshop.com/products/create-your-magic-2027-dated-planner?preview_theme_id=187625799875) returned HTTP 200 and rendered the updated date, preorder delivery note and standard policy link, without the 24-hour text. A 390px browser test confirmed no horizontal overflow, Without Name selected by default, Add Name required after selection, saved name displayed in the choice, and Without Name disabled the name field again. The same interactions passed on MAIN, with its old date. Computed browser styles confirmed both the primary and sticky preorder buttons are green on mobile; the primary desktop button is also green.

## Checkout routing on draft

Four shared checkout files were separately updated on draft `187625799875`: `sections/cart-drawer.liquid`, `sections/main-cart.liquid`, `sections/tjs-side-cart.liquid`, and `snippets/buy-buttons.liquid`. GoKwik now renders only when `localization.country.iso_code == 'IN'` and the existing GoKwik enable settings allow it. Other selected countries see a native cart checkout button or Shopify's native dynamic product checkout button.

The four files matched both MAIN and draft immediately before the scoped draft upload. Exact readback matched all four afterward. Theme Check found no new diagnostics compared with the local full-theme baseline (the baseline already has unrelated errors and warnings). At 390px, isolated India and US browser carts each added a planner successfully. India rendered GoKwik in drawer and cart; US rendered native checkout in both. After accepting the existing cart agreement, the US cart button navigated to a Shopify `/checkouts/cn/.../en-us` checkout URL. No order or payment was submitted. Payment methods at checkout were not verified. Automatic country selection for visitors based on location also remains unverified; the test used the store's country selector.

## Existing order communication draft

Applicable to `#304741` and `#304742` individually. Do not send automatically:

> Subject: Update on your 2027 planner pre-order
>
> Thank you for your 2027 planner pre-order. An incorrect 31 October dispatch date appeared with your order. Dispatches will start from 10 November 2026. We will share tracking when your planner ships. Your selected planner and personalisation choice are recorded. Please reply if this change causes a problem for you.

## Remaining action

MAIN theme `187527266499` still has the old date, 24-hour policy text on the preorder PDP, and unconditioned GoKwik cart rendering. A previous connected Shopify mutation attempting to edit MAIN was rejected by automatic approval review because live theme file writes are blocked. The merchant needs to reconcile the draft corrections into the live theme through Shopify admin or publish a reviewed draft. Existing orders retain their original line item property; their customers need the date correction communicated.
