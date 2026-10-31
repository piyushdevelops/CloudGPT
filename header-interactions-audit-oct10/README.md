# Header interaction audit

Unpublished 187527266499 only. Restored missing scoop_announcements block with prior default message and editable typography/timing. Increased my-header schema max_blocks from12 to20 to accommodate controls; first group upload rejected at12, section saved separately and group retried successfully. Exact readback confirmed.
Announcement availability now follows actual scoop visibility rather than legacy is-hidden class, which can be set while the fixed header remains visible. JS syntax passes; exact readback.

Browser checks:
- Mobile393: search opens at top and scrollY736; planner query returns three suggestions and all-results link; close works.
- Announcement layer appears on compact island with prior message, pause works, search opens while announcement is displayed.
- Desktop1440: search opens/closes.
- Actual native product Add to Cart opens compact Added to your bag popup with quantity1 and subtotal1599. Test unit removed; Cart0 verified.
- Popup already enabled, no cart code changed. Existing compact cart suppresses duplicate scoop cart notice intentionally.
- Header Liquid passes with four pre-existing warnings.
- Physical iPhone Safari keyboard and exhaustive third-party cart integrations not tested.

Screenshots: search.png, cart.png, announcement.png. Nothing published.
