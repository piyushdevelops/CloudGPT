# PDP sticker-book title treatment — 29 October 2026

Installed on active theme `187527266499` in `sections/june-mobile-product.liquid`.

- Planner products whose title ends in ` + ...Sticker Book` retain the planner name as the main Poppins heading. The sticker-book suffix appears on a separate handwritten editorial line with the section accent colour.
- Other product titles render as before. The full product title remains the accessible heading label.
- The existing pending two-line media aspect-ratio fix in the same file was merged and saved with the user's approval. No other file was saved.

The local Liquid file and `preview-mobile.png` show the title implementation and visual prototype. The Shopify editor contained newer unrelated changes, so the saved remote file was merged from its latest editor buffer rather than replaced with this prototype file.

Validation: Shopify Theme Check returned zero offenses for the local prototype. The remote Shopify code editor's newly saved version matched the merged buffer exactly. The live Too Glam PDP rendered the separate sticker-book line at mobile width; another `+ Sticker Book` product split correctly, while a planner without that suffix kept its original title.

## Name customisation follow-up

The `Add Your Name` option on the Too Glam planner did not match the PDP script's `Add Name` detector, so its inline name editor stayed hidden. Updated the detector to recognise both labels, and the variant sync now closes and disables the editor when the shopper returns to Classic. Saved only `sections/june-mobile-product.liquid` to the active theme. The saved Shopify revision matched the merged source exactly; Shopify Theme Check returned zero offenses. Live interaction checks confirmed the editor opens, a typed name replaces the option label after Save, and Classic hides and disables the field.
