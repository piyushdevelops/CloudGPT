# 2027 preorder entry journey — 31 October 2026

## Scope

Saved to Shopify draft theme `187625799875` only. Live theme `187527266499` remained unchanged. This draft already contains the previously saved 2027 product page, collection, and checkout-routing changes; do not publish it wholesale without reviewing the theme diff against MAIN and other chats' work.

## Changes

- Homepage 2027 hero tab now says pre-orders are open, gives the 10 November 2026 dispatch date, and links to `/collections/2027-dated-planners`. The old newsletter mode remains merchant-switchable.
- Enabled the separate homepage 2027 section in pre-order mode. It shows an open-order message and a collection CTA instead of a launch signup form.
- Updated the announcement and side-menu featured card to remove “Coming soon” and the 26 October launch time; both link to the open collection.
- Converted `/pages/2027-planner-preorders` from an expired countdown to an open pre-order landing state with a dispatch message, three live collection product cards, and the collection CTA. Countdown mode remains merchant-switchable.
- Added merchant-editable settings for the new copy, links, and mode switches. Existing section-scoped typography settings remain.

## Verification

- Re-read all six changed draft files after saving. Liquid files matched byte-for-byte; Shopify-regenerated JSON files matched semantically, including the second homepage-template pass after schema registration.
- Theme Check found no new Liquid parse errors in changed sections. Local snapshot lacks several referenced assets and sections, so the full-theme run remains noisy and does not establish a clean full-theme pass.
- Browser preview unavailable: local browser use is disabled in Work settings, Shopify CLI is unauthenticated, and the public preview request returned HTTP 429. Mobile/desktop rendered visual checks remain open.
- Checked MAIN theme file checksums after the draft writes; no scoped MAIN files changed.

## Readback MD5

| File | MD5 |
|---|---|
| `sections/header-group.json` | `231518cc83a2b993987ed46b80012dfe` |
| `sections/june-2027-countdown.liquid` | `e6ade48fdc1b71fa61ce51a16b27f37c` |
| `sections/june-make-room.liquid` | `52e530396b9b999ad1a6347d01ac28f8` |
| `sections/june-next-chapter.liquid` | `f9bede6ad12994436ba998729380b43c` |
| `templates/index.json` | `d9fdb4ac0f41d28e36f365292b572fba` |
| `templates/page.june-2027-countdown.json` | `4519f3ad414b813e46e9b67e765e0cf8` |

## Remaining journey gates

- A 31 October release comparison found 637 files in both MAIN and draft. Exactly 15 differ: the 13 preorder journey files and two earlier photo-studio files. See `release-manifest.json` for paths and checksums. Publishing this draft would include those photo-studio changes.
- Preview home on mobile/desktop, 2027 tab, announcement, side menu, pre-order landing page, collection, product, cart and checkout in a browser.
- The live page SEO description still mentions the 26 October launch and should be updated when the new landing page is released.
- Existing paid orders require a human-approved dispatch-date correction message. No customer messages were sent.
- The Shopify connector's automatic approval review blocks writes to the MAIN theme. Apply the scoped files through an authorized publication workflow after visual review and latest-file reconciliation.
