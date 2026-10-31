# Restore approved Scoop search — 8 October 2026

User requested that the custom search remain unchanged after seeing the legacy search dropdown. Installed on unpublished 187527266499 only; nothing published.

Found current header-group configuration missing the scoop_search block, although custom search assets and render remained intact. Restored only june_scoop_search from the last approved shared-header configuration, retaining all six current blocks and current merchant settings. Added explicit custom-search delegation to the mobile and desktop native search-button handlers, preventing legacy search takeover when custom search is available. No search design, cart files, icon assets or search assets changed in this fix.

Two changed remote files: sections/header-group.json and sections/my-header.liquid. Fresh compare immediately before each write; final Liquid exact readback and JSON semantic readback passed. Shared concurrent content preserved.

Verified custom search on mobile-sized 487 viewport and desktop 1440: custom overlay visible, legacy panel inactive, real planner suggestions and See all results link loaded; Escape tested. Screenshot mobile.png. Physical Safari not tested. Bundled skill validator missing dependency; repository validator used, with partial-checkout dependency limitations.
