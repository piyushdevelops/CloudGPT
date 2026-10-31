# Search relevance repair — 23 October 2026

Installed on unpublished theme 187527266499 only. Four explicit files uploaded with fresh remote comparison immediately before each write and exact readback afterward. No publishing, search configuration, product data, cart or checkout changes.

## Cause and evidence

The unrelated products originate in Shopify's response, not the Scoop rendering code. A direct predictive API request for `zzqaunfindable` returns plates, a teddy bear, wipes and other products in `resources.results.products`; full search returned 70 results. `xqzv987654321` returns an empty array. There is no native recommendation flag in that response. This is consistent with Shopify's semantic query expansion. Explicit field-scoped keyword queries across supported product fields return zero for the first nonsense query. Plain AND syntax alone did not suppress the expansion in testing, so that approach was not used.

References: https://help.shopify.com/en/manual/online-store/storefront-search/search-behavior and https://shopify.dev/docs/api/ajax/reference/predictive-search . Raw comparison evidence is recorded in probe.json.

## Repair

- Added shared june-search-matches.js. It verifies keyword existence using Shopify's server search across title, description, type, tags, vendor, variant title, SKU and barcode. Results/ranking are not filtered by product title.
- Native partial-word and common one-edit/transposition typo matches are corroborated across returned product metadata. This keeps `planne` and `planer` working without treating arbitrary semantic expansions as confirmed matches.
- If there is no supporting match, Scoop displays No matching products found and labels its native broader products You might also like. Its fallback link says View suggestions. The shape, animation, colours, sizes, controls and result-card styling remain unchanged.
- Full search uses the same check. Unsupported broad results are capped to four clearly labelled recommendations; irrelevant result facets, sorting and pagination are hidden in this state. Browser title no longer claims these are matching results. Normal results retain native sorting and filtering.
- Existing sequence and abort protections remain, with checks repeated after verification. Failed verification is an error, not a false no-match result. A bounded in-memory cache avoids repeating keyword checks.

## Verification

- Unit tests: field-query escaping, intentional SKU query, title/description/tag corroboration, partial words, one-character typo, transposition, nonsense rejection, abort and failed verification. See tests.mjs and test-results.txt.
- Live API: zzqaunfindable and xqzv987654321 classify as no match; planner, undated planner, mug, planer and planne remain supported.
- Browser desktop: full-search nonsense result state and Scoop recommendation labels verified visually.
- Mobile browser emulation, 393×852: Scoop nonsense and true-empty states, planner typo results, rapid nonsense→mug change, cleared input and Escape restoring focus to Open search. No horizontal overflow.
- Full results page: planer retains planner results, and price-ascending sorting completes with the normal result state.
- Four stateless theme-code validations passed; the existing main-search section has seven non-error complexity/settings warnings. JavaScript syntax checks passed. This is not a clean full-theme validation claim.
- All four changed files passed final exact remote readback. See final-readback.json.

## Limits

This repairs the misleading no-match presentation; it does not replace or reorder Shopify's search engine. Supported queries retain native ranked results, so it is not a guarantee that every result in a large result set is equally relevant. Purely semantic matches without keyword or typo support remain available as labelled recommendations. Physical iPhone/Safari verification was not performed; mobile checks above used browser emulation. JavaScript-disabled browsing retains the native Shopify search result behaviour.

Evidence screenshot: scoop-mobile.png. Before/candidate folders are historical snapshots; always fetch fresh remote before further edits because other design chats are active.
