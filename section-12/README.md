# Section12 — The footer

28 September2026: installed and checked on UNPUBLISHED187527266499; awaiting review. User is sole editor. Nothing published. All12 planned sections now implemented; only Section1 is locked.

Reference: references/generated-history/exec-3a4d4edd-0302-413f-9682-842827a11c61.png. Three link columns, brand statement, large wordmark and mobile accordions. Shared locked Poppins replaces old reference serif styling. Peach current accent / lime schema default. Centered1680 stage.

Global footer group integration replaces the two old displayed footer blocks by disabling them, retaining their full settings/source. Added june_footer to sections/footer-group.json. This applies to pages using that group throughout the unpublished theme, not just the homepage. No homepage/index/layout or previous custom section changes. Backups in before/remote.json; final remote in verified-remote.json.

Links: six editable links per column, optional Shopify menu override. Planners, wedding/memory planners, home, lighting, dining and Mystery Box. Verified13 internal destinations via HTTP200/title (link-checks.json); existing Instagram, Shiprocket and WhatsApp destinations retained. Existing support email and company copyright retained. Privacy/Terms derive from Shopify policies; no legal copy altered.

Newsletter retained as compact Email updates disclosure with native Shopify customer form, email validation, newsletter tag, success/error handling and unsubscribe note. Form wiring inspected; no subscription submitted, delivery/consent automation not end-to-end tested. Conditional native localization form retains country/language access. Payment icons derive from enabled Shopify payment types (preview currently shows PayPal); unlike historical hard-coded icons, no unsupported payment method claims.

Native details/summary menus start open without JavaScript. Enhanced desktop always expanded; mobile collapses, supports keyboard. Newsletter remains native disclosure. Back-to-top supports reduced-motion, returns focus to visible page heading (skips theme's hidden SEO h1), and preserves original tabindex after blur. No autoplay. Reduced-motion branch inspected, not OS-emulated.

Typography controls: four text roles with family, weight, desktop/mobile size, tracking/lineheight; separate wordmark typography block with the same controls. Both in preset/configured instance and fallback fonts supported. Merchant colors/copy/links/motion editable. Source scoped to footer.

Validation revision4 source+group passed. Desktop/mobile visually inspected; mobile Explore opens by click and closes by Enter. Back-to-top verified scrollY0 and H1 Make room focus. Widths320/390/750/1051/1440/2560: no horizontal overflow; group open state responsive; max1680 retained. Verified shared footer on lamps-lighting collection: one new footer, old SEO footer absent, no overflow. Screenshots desktop.png/mobile.png; responsive.json. Existing footer blocks/settings verified preserved except disabled=true.

Files: june-footer.liquid / current-theme/sections/june-footer.liquid; build.py generator; section-config.json; footer-group-ready.json / current-theme/sections/footer-group.json. Source MD5 dfa012afcd6706fbaf9b5cfe70ea9fca; footer-group MD5 56ea817885183590ff47ff1747edb307.
