# Homepage audit implementation — 28 September 2026

User authorised: “Implement all including locked 1.” All 12 sections were revised on **unpublished theme 187527266499**. MAIN and publication state were not changed. This is an implementation awaiting visual approval, not launch sign-off.

[Open preview](https://thejuneshop.com/?preview_theme_id=187527266499)

The findings below map to `audit-page/AUDIT-2026-09-28.md`, numbered section.item. **Implemented** means the theme change is installed. **Partial** identifies an improvement with an explicit remaining dependency. **Pending** is not claimed complete.

## Page-wide

| Item | Result |
|---|---|
| G1 | Implemented: shorter selection stages, earlier purchase details, manual mobile chapter navigation. At 390px, Section 2 is 877px (was 1242), Section 6 is 660px (was 1801), Section 10 is 999px (was 1182). Added useful facts mean some other sections remain similar in height or grow. |
| G2 | Implemented: factual comparison, original-photo inspection, clearer capacity/quantity, specific page descriptions and value-tier choices give sections distinct information. |
| G3 | Implemented: configured heading tracking adjusted selectively to −0.02em, retaining Poppins, merchant controls and natural glyph widths. |
| G4 | Implemented/tested: section offsets and chapter-end offset; “Skip the story” focuses its target and leaves the next section about 120px below the viewport top at 390px. |
| G5 | Implemented: stable “Search the shop” placeholder; disabled the residual typing overlay as well as its setting. |
| G6 | Partial: responsive, interaction, source validation and four global-footer template checks completed. Real screen-reader/reduced-motion device testing, measured loading performance, email delivery and payment verification remain launch checks. |

## Section 1 — Hero

| Item | Result |
|---|---|
| 1.1 | Implemented: conditional scaleX fallback replaced by opacity; old horizontal CSS scale rules removed. |
| 1.2 | Implemented: fresh active-catalog search found no baby books. Hero now displays “Currently unavailable” without a shopping destination; Section 6 retains no shopping button. |
| 1.3 | Implemented: mobile shopping actions precede artwork; default heading/art stages reduced. |
| 1.4 | Implemented: more compact hero exposes category tabs sooner; desktop centred gutters retained. |
| 1.5 | Implemented: continuous animation can restart on re-entry; finite plays remain one-time. Cancellation generation prevents an old repeat loop from restarting alongside a new one. Reconnection restores the editor handler. Runtime continuous/reduced-motion combinations still warrant device QA. |
| 1.6 | Implemented: compact hero signup uses the same truthful email-list consent as Section 4. |

## Section 2 — Undated

| Item | Result |
|---|---|
| 2.1 | Implemented: comparison includes verified dimensions, sides, paper, binding and feature/sticker differences. |
| 2.2 | Implemented: smaller covers/interior stage; 772px desktop and 877px mobile in the initial revised measurements. |
| 2.3 | Implemented: selected name, price and shopping action precede the mobile interior preview. |
| 2.4 | Implemented/tested: original-image viewer with zoom, fit and Escape close. |
| 2.5 | Implemented: removed redundant selected-status/counter presentation while preserving name and cover choices. |
| 2.6 | Implemented: explicit no-script links to all featured planners. Source checked; browser JavaScript-disable testing remains separate. |

## Section 3 — Limited Edition

| Item | Result |
|---|---|
| 3.1 | Implemented safe alternative: removed misleading keychain photography; accurate alphabet-keychain text and shipping-name explanation remain. A genuine alphabet-keychain photo is still needed for the photo upgrade. |
| 3.2 | Implemented: purchase group precedes the reveal on mobile. Open default state is about 1383px; buying does not require reaching its bottom. |
| 3.3 | Implemented/tested: expandable complete inclusion list plus gift-count/swipe cue. |
| 3.4 | Implemented: inclusion summary is available before unpacking and the closed scene is smaller. |
| 3.5 | Implemented: visible cover names alongside each thumbnail. |
| 3.6 | Implemented catalog reconciliation: counts remain 5/5/5/3; three-gift design uses honest text where a correct isolated photo is unavailable. Warehouse fulfilment sign-off is not inferred from catalog copy. |

## Section 4 — 2027 signup

| Item | Result |
|---|---|
| 4.1 | Pending: authorised test address, campaign/segment owner and actual delivery verification. No signup was submitted. |
| 4.2 | Implemented: general June Shop updates plus 2027 launch information, consistent with the actual email-list subscription. |
| 4.3 | Implemented: removed repetitive paper-note/launch wording. |
| 4.4 | Implemented: tightened date card/ticket spacing; 640px mobile versus 683px previously. |
| 4.5 | Pending: no approved launch window or new product feature supplied; none invented. |
| 4.6 | Partial: required email input, native validation, labelled errors and status markup inspected. Actual already-subscribed/server/success responses need an authorised submission. |

## Section 5 — Inside Discovery

| Item | Result |
|---|---|
| 5.1 | Implemented: direct link to the depicted planner and correctly named Limited Edition collection route. |
| 5.2 | Pending asset: clean, unannotated original interior photographs. Existing genuine catalog imagery retained. |
| 5.3 | Implemented: each tab explains a specific verified use of its page. |
| 5.4 | Partial: zoom/fit and pan implemented, full-source URL requested; a 2400px URL cannot create detail absent from the original 1080px source. Higher-resolution original still needed. |
| 5.5 | Implemented/tested: pan instruction appears only when the enlarged image overflows. |
| 5.6 | Pending asset: genuine page-flip/writing footage. Existing merchant video support and image fallback retained. |

## Section 6 — Other Chapters

| Item | Result |
|---|---|
| 6.1 | Implemented: manual switcher on phones/short viewports; shorter desktop scroll travel. |
| 6.2 | Implemented/tested: visible 44px skip control and corrected CSS specificity. |
| 6.3 | Implemented: “Pause effects” freezes effects while chapter navigation remains possible. |
| 6.4 | Implemented: explicit representative-layout caption for mismatched rewritable cover photography. |
| 6.5 | Implemented: 44px effect control; irrelevant motion row hidden in manual mobile mode. |
| 6.6 | Implemented: verified wedding planning and rewritable accessories/usage details; tested baby unavailable state with no shop action. |

## Section 7 — Home décor

| Item | Result |
|---|---|
| 7.1 | Implemented: larger original thumbnail and full original-photo viewer. |
| 7.2 | Implemented: styled-image qualification moved directly next to the scene. |
| 7.3 | Implemented: Vase/Birds/Frame companion labels. |
| 7.4 | Implemented: selected-product filled action; broader collection becomes secondary. |
| 7.5 | Implemented: verified material/dimension information. |
| 7.6 | Implemented: removed redundant mobile count and tightened navigation/footer gaps; 781px versus 807px previously. |

## Section 8 — Lighting

| Item | Result |
|---|---|
| 8.1 | Implemented: deliberate bordered photo stage with contain fit, preserving the full lamp. |
| 8.2 | Partial: larger, clearer thumbnails with revised positioning; dedicated silhouette crops remain an optional asset improvement. |
| 8.3 | Implemented: verified dimensions and 2-pin power information for each lamp. |
| 8.4 | Implemented text alternative: documented three light colours and cable switching; no simulated colour-mode imagery. |
| 8.5 | Implemented: smaller mobile stage and reduced dock spacing; about 829px versus 839px, despite added specifications. |
| 8.6 | Implemented: inactive choices retain full opacity and readable labels; selected state remains distinct. |

## Section 9 — Glassware

| Item | Result |
|---|---|
| 9.1 | Implemented: Tumbler / Mug + lid / Flute pair selector sublabels. |
| 9.2 | Partial: stage/crop footprint tightened while preserving genuine photos. A dedicated close detail remains preferable to enlarging low-resolution imagery. |
| 9.3 | Implemented: smaller mobile image and footer spacing; about 916px versus 959px. |
| 9.4 | Pending facts: catalog did not substantiate dishwasher/hot-drink care claims; none invented. |
| 9.5 | Implemented/tested: single-glass, mug-accessory and two-flute quantities remain beside selected price; added verified material/dimensions. |
| 9.6 | Pending asset: authentic pour/rim/handle detail imagery or video. |

## Section 10 — Tableware

| Item | Result |
|---|---|
| 10.1 | Implemented: persistent sold-separately note plus selected single-piece detail. |
| 10.2 | Implemented/tested: selected original product-photo viewer and illustrative-scene qualification. |
| 10.3 | Implemented: corrected smaller-stack coordinates and reduced spacing; 999px mobile versus 1182px. Footer links wrap with space instead of colliding. |
| 10.4 | Implemented: selected cutout receives a restrained accent outline/glow alongside selector state. |
| 10.5 | Implemented: merchant initial-item control replaces hardcoded second-item selection. |
| 10.6 | Implemented: “Stack together” / “See each piece”, smaller stage and secondary arrangement controls. |

## Section 11 — Mystery Box

| Item | Result |
|---|---|
| 11.1 | Implemented: verified live tier prices and values: Rs.1499 → Rs.3000+, Rs.1999 → Rs.5000+. Numeric variant titles supply value; nonnumeric future titles fall back to their label. |
| 11.2 | Implemented: “How the surprise works” accurately describes the disclosure. |
| 11.3 | Implemented: both maintained variant options visible and individually linked. |
| 11.4 | Implemented: copy separates category explanation, value and purchase choice. |
| 11.5 | Implemented: variable contents/non-customisation note stays visible outside disclosure. |
| 11.6 | Implemented/tested: in-flow mobile disclosure accommodates longer copy. |

## Section 12 — Footer

| Item | Result |
|---|---|
| 12.1 | Pending operations: theme still uses Shopify's enabled-payment list. Separate checkout integration does not establish actual active methods; unsupported logos were not added. |
| 12.2 | Implemented/tested: one new footer on product, collection, cart and privacy templates; desktop overflow checks and mobile policy/footer disclosure checks passed. Changing shipping country and checkout were not exercised. |
| 12.3 | Implemented: clearer news/arrivals benefit, truthful consent and nearby privacy link. |
| 12.4 | Implemented: visible “Deliver to” label and accessible “Apply” action. Country options remain supplied by Shopify localization. Fulfilment coverage still needs merchant launch confirmation. |
| 12.5 | Existing verified contact routes retained: email and WhatsApp. Store policy search returned no support-hours record; no response-time promise added. |
| 12.6 | Implemented: larger utility text, adjusted spacing and corrected character encoding; wordmark stays natural width. |

## Verification and evidence

- Fresh catalog records: `products.json`; fresh theme snapshots: `before.json`, `additional-before.json`, `after.json`.
- 18 changed files: Liquid content verified exactly, JSON compared structurally because Shopify rewrites formatting. See `remote-checks.json`.
- Shopify Liquid/schema validation passed. `validation-3.txt` covers the full local source set, later small changes passed revisions 4–6. Copied baseline `config/settings_schema.json` is a local validation dependency only; it was not uploaded.
- Extracted JavaScript passed Node syntax checks. Representative browser tests: hero tabs/unavailable baby, comparison and Escape, gift summary and three-gift state, interior fit/zoom/pan hint, baby chapter/skip link, lamp choice, glassware quantity, table original viewer, Mystery disclosure/tier links, footer newsletter disclosure.
- 390px and 320px document overflow checks passed; sampled loaded homepage images had no broken sources. This is not an exhaustive accessibility or performance certification.
- Final screenshots include `mobile-chapters-final.png`, `mobile-lighting-final.png`, `mobile-table-final.png`. Earlier audit screenshots remain the before-state evidence.

## Remaining inputs

Original clean/high-resolution planner spreads, genuine keychain/use-demo imagery and optional videos; approved care facts and 2027 launch detail; a team-controlled email for delivery testing plus campaign owner; actual checkout/payment and delivery-country confirmation. Those dependencies are deliberately not represented as completed work.

`theme/` contains validation dependencies and some unchanged snapshot files. **Do not upload the whole directory.** Only the 18 paths in `remote-checks.json` were written. `current-theme/` is refreshed from the verified remote copies. User visual approval is still pending.
