# June PhotoBook Studio

Local, isolated prototype for the June Photo Albums collection and same-domain album studio journey.

## Full Studio

- Occasion-led discovery across ten supplied categories.
- Ten representative cover styles from the supplied 25-design Small/Large library.
- Editable album title and optional subtitle with occasion-specific suggestions.
- Size and page-count configuration using the approved Regular and 11×11 pricing ladder.
- Immersive square-page editor with a fixed canvas workspace, page filmstrip and contextual tools.
- Direct move, resize and rotation; crop, filters, image adjustments, shadows, alignment, locking and layer order.
- Editable text and illustration layers with typography, colour, opacity and arrangement controls.
- Undo/redo history, local and cloud autosave, print-quality checks and responsive mobile bottom sheets/desktop panels.
- Seven ready-made inside-page layouts, including portrait, mosaic, story and gallery arrangements.
- Private cross-device recovery links (30 days) and separate read-only family preview links (7 days) with feedback; family feedback does not approve the final print proof.
- Flexible four-page print signatures with live pricing from 20 to 60 pages.
- Optional service-powered background removal using the original cloud asset and a cached transparent derivative.
- Size-correct 8×8 and 11×11 preview PDFs with non-destructive edits applied to export. Mobile previews are resolution-limited for device memory; the print proof is prepared separately.

## Mobile verification

The complete occasion → cover → title → size/pages → editor journey is checked at 360×800, 390×844 and 430×932, plus desktop at 1440×1000. The checks cover active-step visibility, selected title and configuration retention, browser errors and horizontal page overflow.

## Production behavior

- The builder is deployed at `https://june-photo-studio-production.up.railway.app`.
- Work is continuously stored in the browser and restored after a close or reload, including a verified 10-photo draft.
- The final review shows the selected configuration and price, exports the designed album as a PDF and hands the matching variant and draft reference to Shopify cart.
- The production browser check passed with no page errors or horizontal overflow.

## Background removal configuration

Set `REMOVE_BG_API_KEY` in Railway. `REMOVE_BG_API_URL` defaults to the remove.bg-compatible endpoint and is isolated behind the server route so the provider can be replaced without changing the editor. Removed-background assets are saved under the design's private R2 prefix.

## Important limitations

- The cover text is visually overlaid on flattened preview artwork. Production requires clean cover masters without baked-in “Photo Book” text.
- DPI thresholds and visible safe-area guides remain provisional until printer trim, bleed, wrap, binding and colour-profile specifications are supplied.
- Cloud drafts and originals are stored when R2 is configured. Recovery links are bearer links; anyone holding one can edit that album until expiry. An account-based project library remains future work.
- Automatic background removal remains unavailable until its deployment key is configured.
- Print quality and safe-area warnings use a 300 PPI source target, a 200 PPI alert threshold, and an estimated 8–11 mm text margin. Final bleed, trim, spine and colour profile need printer confirmation before production.

## Run

For local development, from this directory:

```powershell
npx serve . -l 4173
```

Open `http://localhost:4173`.

The production build is hosted on Railway. Shopify launch resources remain unpublished until the release action is approved.
