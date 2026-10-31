# June Shop redesign

Source and project records for The June Shop storefront redesign, custom Shopify sections, and PhotoBook Studio. This repository contains partial theme snapshots and dated implementation work; it is not a complete theme deployment package.

Start with [START-HERE-LOCAL.md](START-HERE-LOCAL.md), [AGENTS.md](AGENTS.md), and the README in the feature directory you are changing. Historical snapshots may differ from the current store.

- `current-theme/`: selected theme source files, not a full theme export.
- `section-01/` through `section-12/` and dated feature folders: implementation source, change records, and verification metadata.
- `photobook-studio-mvp/`: standalone PhotoBook Studio; run `npm ci` followed by `npm start` from this directory with Node.js 20 or newer. Use `.env.example` as a reference and supply credentials through the environment when using cloud storage.
- `our-days-landing/`: local landing-page prototype; run `npm start` from this directory with Node.js 20 or newer.
- `tools/`: theme and browser validation scripts; install their dependencies with `npm ci` in that directory.

## Repository contents

The root `.gitignore` excludes credentials, browser sessions, dependencies, build output, screenshots, exports, large reference files, and unrelated nested application repositories. Runtime images under `assets/` and `public/` remain eligible for version control. The PhotoBook Studio environment template contains empty credential fields.

Captured storefront HTML and specific vendor theme snapshots containing embedded keys are excluded. Retrieve necessary private configuration through the store or hosting provider; never add it to Git. Some historical documentation links refer to local-only evidence omitted from this source repository.

Pushing this repository does not deploy or publish the Shopify theme. Review and reconcile current remote files before any Shopify change.

## Historical discovery notes

# The June Shop website redesign

Start with [PROJECT-BRIEF.md](PROJECT-BRIEF.md), then [AUDIT.md](AUDIT.md) and [DECISIONS.md](DECISIONS.md).

Established 2026-09-24. The user selected the Shopify live theme as the source of truth. This folder holds the initial discovery record, not a completed redesign.

- Live theme: TJS August 2026 (Primary Theme), ID 142259323075.
- Base theme metadata: Ecomus 2.0.2.1.
- `evidence/theme-inventory.json`: full 543-file metadata inventory, pagination exhausted.
- `baseline/`: 21 selected source files fetched from the live theme for inspection. This is a partial source snapshot, not a complete backup or deployable theme.
- `evidence/history-*.json`: retrieved conversation excerpts with task IDs, turn IDs, truncation flags and pagination cursors. Older turns and original image attachments are not fully covered.

The initial discovery pass was read-only. The subsequent visual audit created an unpublished duplicate: **TJS Website Rework — 24 Sep 2026**, ID **187527266499**. All 543 file checksums matched live after duplication. See [VISUAL-AUDIT.md](VISUAL-AUDIT.md) and [WORKING-THEME.json](WORKING-THEME.json).

No live theme edits, publication, cart mutations or store-content changes were made. Re-fetch relevant files before implementation; other work may continue on the store. `sandbox-reference/` contains eight selected files from the earlier Krish sandbox, and `evidence/browser/` contains desktop/mobile screenshots and interaction results.
