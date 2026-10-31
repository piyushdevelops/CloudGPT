# Cart confirmation in search-sized island

Installed on unpublished theme 187527266499. Five files fresh-reconciled immediately before write; 5/5 exact readback. Nothing published. Existing search and announcements retained.

New header block: Scoop cart confirmation. Enable, editable message, dismissal label and 2–8 second hold (default 3). All width/height, colour, font and outline values inherit Scoop search, so desktop and mobile stay cohesive. Lilac/accent check, single-line message, dismiss button. Long merchant messages truncate visually. Full message remains accessible.

Uses existing variant:add success event and confirmed cart count increases; no cart request wrapper or cart mutation added. Duplicate notifications extend the existing notice. Quantity increases also confirm additions. Errors/removals with no increased count do not trigger count-based notices. Active search queues the notice until it closes. Source scoop hiding suspends announcements; source restoration restarts logo hold. Offscreen/missing scoop uses the same-sized fixed pill at the top. Product-page and native drawer interactions still need browser/device review.

JS syntax and local behaviour tests pass (desktop/mobile size equality, deduplication, dismissal, search queue, disable). New snippet/assets/group pass repository validation; shared header baseline findings remain. Bundled validator unavailable due missing package. HTTP preview is the correct unpublished theme with no Liquid errors. No real items were added to the user's cart for testing; real add-to-cart visual verification remains pending.
