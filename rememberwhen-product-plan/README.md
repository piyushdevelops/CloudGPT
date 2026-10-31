# June prompted memory-book product plan

Date: 25 October 2026  
Status: Discovery and product plan only. No Shopify, theme, deployment, or live-store changes were made.

## Product decision

Build this as a separate June product line, not as another entry point into the existing one-session photo-album editor.

The useful reference idea is a guided memory service: the customer receives recurring prompts, replies with stories and photos, sees those memories accumulate into a book, reviews a proof, and orders the finished print. The June version should express that journey in June's voice and visual system rather than copy the reference site's wording, questions, graphics, layouts, or implementation.

Working proposition:

> **Little moments, kept for later.** June sends thoughtful prompts on WhatsApp, turns the replies into a beautiful living storybook, and prints it when the customer is ready.

Working names to test:

1. June Memory Stories
2. The Little Things Book
3. A Year, Remembered
4. June Time Capsule
5. Our Days, by June

Recommended launch name: **The Little Things Book by June**. It feels broader and more ownable than a generic baby memory book while supporting a baby-first launch.

## Initial audience and scope

Launch with one narrow use case: pregnancy through the baby's first year. It has a clear prompt calendar, strong gifting intent, and a natural finish date. The platform can later support childhood years, anniversaries, parents/grandparents, travel, friendship, and memorial books.

The first release should support:

- one child and one primary WhatsApp number per project;
- scheduled prompts with pause, resume, skip, and reminder controls;
- text and up to four photos per memory;
- spontaneous memories unrelated to a prompt;
- back-dated entries and missed-prompt recovery in the web account;
- a chronological timeline;
- automatic page composition with a small set of controlled design themes;
- include/exclude, edit text, crop/replace photos, reorder memories, and preview;
- a low-resolution watermarked proof and a print-ready PDF generated only after final confirmation;
- Shopify checkout for the plan, upgrades, extra pages, duplicate copies, and shipping;
- a permanent project/order ID shared by Shopify, storage, PDFs, and the staff dashboard;
- autosave after every edit and recoverable drafts across phone/browser sessions.

Treat video and printed QR playback as phase two. Permanent video hosting creates a long-lived storage and service promise. It should ship only after retention, deletion, outage, replacement-link, and business-continuity policies are funded and documented.

## Customer journey

1. **Discover** — A dedicated landing page explains the emotional benefit, shows a real book, a sample WhatsApp exchange, an example timeline, page quality, pricing, privacy, and gifting.
2. **Choose** — Customer selects 3, 6, or 12 months and checks out in Shopify.
3. **Onboard** — Create the project, verify email and phone, collect the child's details and expected/birth date, choose prompt frequency and preferred time, and record WhatsApp consent.
4. **Capture** — Send relevant prompts. Replies become draft memories and immediately appear in the customer's timeline.
5. **Curate** — Customer can add old or spontaneous memories, fix dates, edit text, crop photos, and omit private entries from print.
6. **Build** — The service automatically lays entries into a chosen book style. The customer should make editorial choices, not manually design every page.
7. **Review** — Run missing-image, resolution, overflow, blank-page, spelling-confirmation, safe-area, page-count, and price checks. Present the final proof and explicit print approval.
8. **Order** — Calculate extra pages, size upgrade, duplicate copies, taxes, and shipping. Add the final configured item to Shopify cart with its immutable project/version ID.
9. **Produce** — Freeze a version, generate low-resolution and high-resolution PDFs, store checksums, expose a staff preflight screen, and send the approved print package to the printer.
10. **Deliver and retain** — Show order status and delivery tracking. Let the customer download the digital copy. Apply the disclosed archive/deletion policy and provide data export and deletion controls.

## Plans and pricing hypothesis

Do not copy the reference plan names. Start with transparent package pricing and validate margins before launch.

| Plan | Capture period | Included print | Working launch price |
|---|---:|---|---:|
| A Little Chapter | 3 months | Regular 8×8, 20 pages | ₹2,999 |
| Half a Year of You | 6 months | Regular 8×8, 32 pages | ₹4,299 |
| Your First Year | 12 months | Regular 8×8, 52 pages | ₹6,499 |

Provisional add-ons:

- extra Regular pages: ₹45 per page;
- 11×11 upgrade: price after printer quote and shipping-weight test;
- duplicate copy: production cost + packaging + shipping + target gross margin;
- gifting: the buyer pays now and the recipient activates later;
- extra participant/second parent: include if WhatsApp and support costs remain acceptable.

These are positioning hypotheses, not approved selling prices. Before setting them in Shopify, calculate paper, binding, wastage/reprint allowance, packaging, gateway fee, GST, shipping subsidy, WhatsApp message cost, storage, PDF rendering, support time, and target contribution margin.

## Landing-page structure

1. Hero: **The memories you mean to write down—beautifully kept.** CTA: **Start your story**.
2. Three-step demonstration: receive a prompt, reply naturally, watch the book grow.
3. Real phone-to-book transformation with an interactive before/after.
4. “Made for busy days” benefit strip: no blank journal guilt, no design work, edit anytime.
5. Prompt examples grouped by pregnancy, milestones, personality, family, and ordinary days.
6. Live book preview with a few sample page styles.
7. Physical-quality section with paper, binding, size, finish, packaging, and delivery facts verified against the chosen printer.
8. Plans and an honest price calculator.
9. Gift flow.
10. Privacy and ownership: who can view content, where it is stored, retention, export, deletion, and staff access.
11. Testimonials from a controlled pilot; no placeholder social proof at launch.
12. FAQ covering missed prompts, old memories, two parents, image quality, changes, cancellation, delivery, reprints, and deletion.
13. Repeated sticky CTA on mobile.

The public page should be a compelling product facade. After purchase, the customer enters a separate authenticated memory workspace. Reuse June's approved Poppins typography, strong capsule CTA language, and merchant-controlled accents, but give this product an occasion-relevant visual world rather than using purple as a default theme.

## System outline

- **Shopify:** landing/product pages, plan checkout, discount/gift codes, taxes, order records, add-ons, fulfilment status.
- **Product application:** onboarding, authentication, timeline, editing, preview, final approval, staff operations.
- **WhatsApp Business Platform:** consented template prompts, inbound message webhooks, delivery status, opt-out and pause commands.
- **Database:** customers, projects, children/profiles, consent events, prompt schedule, memories, media references, book versions, approvals, and fulfilment events.
- **Object storage:** original uploads, normalized derivatives, thumbnails, proofs, print PDFs, and manifests. Use private buckets and signed, expiring links.
- **Job queue:** prompt scheduling, media processing, virus/type checks, image-quality analysis, page composition, PDF rendering, notifications, and retry handling.
- **Renderer:** deterministic versioned templates that generate screen preview, low-resolution customer proof, and printer-profiled high-resolution PDF from the same project snapshot.
- **Staff console:** search by project/order/customer ID; view consent and project health; inspect selected theme/pages; run preflight; record customer approval; download authorized printer bundle; log reprints and deletion requests.

Do not use GitHub for customer photos. Repositories are unsuitable for private family media, deletion guarantees, access control, and large files. The earlier R2 direction is appropriate for object storage, with the database holding metadata and access rules. Google Drive can remain a staff-facing archive/export destination only after the customer approves the final print version; it should not be the primary application database.

## Privacy and operational requirements

- explicit WhatsApp opt-in and a visible pause/stop mechanism;
- least-privilege staff access and an access log;
- originals never embedded in public URLs;
- encryption in transit and at rest;
- documented retention periods for active drafts, completed print files, and video;
- customer download/export and deletion workflow;
- content ownership and print licence terms written in plain language;
- consent and safeguarding rules for photos of children;
- backups with tested restore, object versioning, and deletion propagation;
- immutable approval record containing PDF checksum, page count, price, timestamp, and customer identity;
- printer packages shared through expiring access, with a confirmed printer-side deletion process.

Legal/privacy wording needs Indian counsel review before accepting real customer uploads. The product must state the actual vendors and practices rather than repeat the reference site's claims.

## Delivery phases

### Phase 0 — commercial and printer proof

- choose printer and validate Regular 8×8 and 11×11 specifications;
- print sample books from the renderer;
- establish unit economics, tolerances, safe area/bleed, colour profile, packaging, reprint policy, and SLA;
- interview 8–12 parents and test product name, prompt cadence, price, and proof flow.

### Phase 1 — concierge pilot

- landing page, Shopify plan product, onboarding, consent, prompt scheduler, reply ingestion, timeline, photo/text editing, auto-layout, preview, approval, PDFs, and staff console;
- run 15–25 invited customers with manual staff oversight;
- support photos and text only, one project/child and one primary number;
- measure activation, prompt response, memories per week, completion, support minutes, page overage, print approval time, and contribution margin.

### Phase 2 — dependable self-service

- missed prompts, back-dating, second contributor, gifting/activation, pause/resume, automated quality warnings, extra pages/copies, order tracking, exports, deletion, and recovery tooling;
- introduce more occasion-appropriate book styles and 11×11 after print QA.

### Phase 3 — video and expansion

- private video upload, durable QR landing pages, lifecycle/retention choices and replacement-link process;
- add later childhood, anniversaries, family histories and travel only after the baby workflow is stable.

## Launch gates

Do not accept public orders until all are true:

- end-to-end WhatsApp consent, prompt, reply, retry, pause and opt-out tests pass;
- a customer can close the browser at every step and recover the latest saved state;
- 10, 50 and 150-photo projects render without data loss;
- proof and print PDFs come from the same frozen version and their checksums are stored;
- printer confirms bleed, safe area, fonts, image DPI and colour output on physical samples;
- pricing covers actual operations and reprint risk;
- customer and staff permissions are tested;
- export/deletion and backup restoration are tested;
- terms, privacy, cancellation, replacement, retention, shipping and support policies are published;
- staff has a written order-processing and incident workflow.

## Immediate next artifact

The next useful deliverable is a mobile-first landing-page prototype plus the post-purchase onboarding and WhatsApp-to-timeline flow. It should use fictional sample content and no customer data. Build the staff workflow and data model alongside it; postponing operations until after the storefront would conceal the hardest part of this product.

## Reference observations

Remember When currently sells 3-, 6-, and 12-month journeys; uses a phone number for WhatsApp prompts; includes 20-, 30-, and 50-page 8×8 books; allows additional pages; and gives customers a web experience for editing and preview. Its FAQ also describes daily or weekly prompts, missed-prompt recovery, include/exclude controls, a maximum 150-page book, a digital copy at print order, and QR-linked video. These observations define the category baseline, not content to copy.
