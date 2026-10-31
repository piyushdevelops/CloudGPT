# Side menu rework — 9 October 2026

Installed on unpublished theme 187527266499. Nothing published.

Changed only sections/my-header.liquid and sections/header-group.json. Fresh remote source was fetched and rechecked before each write; exact readback confirmed after each upload. Group change adds only the side_menu_typography block and its order entry. Other header work is preserved.

Drawer: 460px desktop cap / 94vw phone; rounded edge; larger search field and wrapped popular chips; accented direct category links; spacious category rows; tinted expanded category groups; indented nested navigation; fixed 16px chevrons at every level; full-width account action; visible focus states; reduced-motion support. Existing menus, search routing, palette controls and other header features retained.

Side menu typography block: font, weight, desktop/mobile navigation sizes, letter spacing and line spacing. Also included in header presets; fallback styles remain when absent.

Fixed close/reopen timeout race and added Tab focus containment. Browser checked Home, nested Decor, Kitchen & Dining / Tea & Coffee, Gifting, Escape/reopen, focus loop, 393px and 375px horizontal fit. Physical Safari and full editor regression remain untested.

Liquid validator compared against the fresh baseline: no new findings. Four inherited findings remain: existing 43-setting section exceeds validator recommendation of 40, existing Liquid complexity 223, and two unused logo variables. Shopify accepted both files without errors.

final.liquid is the installed source snapshot. group-before.json and group-after.json record group integration. Existing local current-theme copies were not overwritten because multiple chats share this workspace. Future edits must fetch remote again.
