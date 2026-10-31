# The June Shop redesign brief

## Objective and baseline

Rework the website while carrying forward the user's previous design decisions and useful existing implementations. The user explicitly chose the Shopify live theme as the baseline on 2026-09-24.

Verified theme: **TJS August 2026 (Primary Theme)**, `gid://shopify/OnlineStoreTheme/142259323075`, MAIN. Reported update time at inventory: 2026-09-24 11:27:33 UTC. Base metadata identifies Ecomus 2.0.2.1.

The website and the mobile app are separate implementations. App Manager work is a source of design context; deployment of that dashboard does not establish that a website section is installed or that app draft content is published.

## Requirements recovered from user messages

### Category experience

- Sticky category tabs remain visible while the content below changes by department.
- Each category behaves like a mini homepage: its own colour theme, three rotating hero banners, subcategories and relevant products.
- Strong, large icons and readable typography; predominantly black and white brand foundation with category colours.
- New Arrivals, Best Sellers and Gifting were explicitly requested in the separate category-section task.
- Each of those three areas has an independent three-image carousel: auto-rotation, manual swipe, and no accidental movement of neighbouring carousels.
- Preserve 16:10 banner proportions but keep banners compact. The user repeatedly rejected oversized banners and excessive space.
- Category colour and products change together on the same click. Per-category settings must remain independent.
- Detailed Shopify Theme Editor controls and separate desktop/mobile settings.

These requirements come from two related designs, not proof that both should be stacked on the same homepage. Recommended synthesis: one department experience that can configure the relevant rows without redundant navigation.

### Planner storytelling

- Images manually managed through Shopify Theme Editor.
- Horizontal planner switching, tap-to-focus, and scroll-driven internal-page reveals were requested in “Shopify planner section design.”
- Later work in “The June Shop Redesign” discusses a different editorial Planner Story section. The user requested removal of the irrelevant About us treatment and asked for the final package.
- Treat the animated showcase and editorial story as alternative historical implementations until visually reconciled; do not combine all animations by default.

### Champagne campaign

- User explicitly selected the headline **“A toast, shaped differently.”**
- Three colour variants and a reference-led campaign composition were requested.
- Earlier assistant work proposed large transparent product imagery, floating callouts and a variant strip. The user requested a build, then reported visual problems and requested another pass.
- Do not treat an assistant's assertion of visual success as user acceptance. Original reference images were not retrieved in this pass.

### Reviews

- User rejected the looping ribbon shape and requested a smooth wavy ticker.
- Text must fill the strip without gaps or overlaps; motion speed should be adjustable and slower.
- User repeatedly requested complete corrected files, not isolated patches.

## Verified current website structure

Homepage order from `templates/index.json`:

1. `Home-banner-swiper`: “Curated Pieces for Everyday Life”; four category cards.
2. `collection-nav-2`: Shop by Category; Home Decor, Dinnerware, Serveware, Lighting, Lunch & More.
3. `collection-mini-swipe`: planners and journals; six subcategory links and six product slides.
4. `carousel-focus`: “Fast Moving”, fed by New Arrivals.
5. `card-deck`: “Grab Your Lunch!”, fed by Lunch Bags & Boxes.

Header uses `my-header`, menu handle `tjs-redesign-navigation`, floating/compact behaviour and scroll-up sticky mode. Two generated block sections precede it.

Default collection template enables `collection-new` and disables the original heading and main collection sections. Default product template enables breadcrumb, `main-product` and one custom Liquid section; `pdp-3`, product tabs, related products and recently viewed sections are disabled there. This does not establish behaviour of every alternate product template.

Footer includes a custom SEO footer followed by the regular footer. System group enables the native cart drawer and disables the mobile toolbar. Layout renders GoKwik.

## Design direction to develop

Retain the expressive product imagery and black/white foundation. Establish shared typography, spacing, button and product-card rules. Use colour for departments and selected campaign sections. Keep mobile discovery compact, with visible actions and clear selected states.

This direction is a synthesis for the redesign, not a newly approved visual specification. Current settings include Albert Sans, Playfair Display and Poppins; exact rendered font use still needs browser inspection.

## Recommended build sequence

1. Complete desktop/mobile visual baseline and reconcile any relevant unpublished sandbox work.
2. Verify prices and cart integration, then fix confirmed copy/destination issues in the working copy.
3. Create an unpublished working theme from the then-current live baseline, with a complete backup and recorded source ID.
4. Establish shared styling and build the department homepage experience with real collection mappings and image assignments.
5. Select the appropriate planner/campaign/review modules; avoid stacking competing versions.
6. Apply the shared system to collection and product pages, retaining template-specific buying logic.
7. Verify search, category state, banners, variant selection, cart drawer, discounts, checkout handoff and mobile layouts before release.

## Coverage and remaining gaps

The initial pass covers recent relevant turns from five tasks, plus the PDP discussion read earlier in this task. It does not represent every historical chat. Pagination cursors are saved for continuation. “TheJuneShopApp + App Manager” is large; only recent material was reviewed, including preview status and UI correction context. Old images and downloadable sandbox artifacts were not recovered.

The prior PDP audit concerned a preview called “Speed Optimisation QA — 09 Sep 2026”; its reported bugs must be rechecked against the current published theme. The old Planner Story implementation was reported on “Krish Sandbox TJS August 2026 (Primary Theme),” not proven to be on the current live homepage.

Browser screenshots, interaction testing, theme-wide dependency tracing, discount eligibility, exact app content mappings, and unpublished-theme comparison remain outstanding. No final layout has been produced in this discovery pass.
