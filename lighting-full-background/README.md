# Lighting full-background correction — 1 October 2026

Installed on unpublished theme 187527266499. Nothing published; MAIN unchanged.

Fresh source: before.json. Verified saved source: verified/. Local current-theme synced.

## Changes
- Removed conflicting historical layout overrides and the 65%-width image fallback. All selected scene images now fill the entire section behind its heading and product dock.
- Preserved merchant palette, typography controls, selected products, current scene images and desktop maximum width.
- The merchant's lamp3.png contains a drawn empty panel. Added per-lamp desktop bottom-crop control; set Vespera to 30% to exclude that panel. Mobile uses full image height with the actual dock covering the lower artwork panel.
- Product thumbnails now default to genuine product featured images instead of scene artwork; custom thumbnail pickers remain available.
- Compact dock, visible selected underline, name/price/action hierarchy and expandable technical details. Existing specification text preserved.

## Verification ledger
1. Source: Shopify Liquid validator passed. Scene, product and selection state mappings retained. CSS scoped; responsive font controls, reduced-motion rules and focus outlines retained.
2. Rendered: 1440x1000 and 393x852 browser viewports checked. All three selections kept image/name/price/destination aligned; section height stable at 626px desktop and 700px phone. Phone had no horizontal overflow. Arrow-key selection and Details disclosure tested. Screenshot evidence attached in this folder.
3. Saved draft: both files read back byte-for-byte equal after upload. Fresh storefront reload confirmed full background and mobile framing. Fresh theme editor confirmed a 1680px-wide image matching the 1680px section, saved crop control at 30%, retained typography block and disabled Save button (no unsaved changes). Broader audit gates and physical iPhone Safari testing remain separate.

## Limitations
- Landscape artwork crops at phone ratios; a dedicated portrait image can be selected with the existing mobile scene picker.
- The first scene is the only supplied wide backdrop; the other lamps use existing catalog scenes as full backgrounds.
- Subsequent 430/375 viewport attempts did not apply reliably and are not reported as passed. Captured screenshots may include the sticky site header from storefront scrolling.
- Broader homepage audit retains its pending checks recorded in browsing-audit/README.md.
