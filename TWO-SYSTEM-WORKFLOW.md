Latest workflow update — 7 October 2026: User is designing the same theme in THREE simultaneous chats (Designer A/B/C). This supersedes the 28 September single-editor assumption. Do not overwrite other chats’ work or save stale whole files. Keep changes scoped to the current request and separate prototype files. Before every remote write, fetch the latest target file, merge only the intended change, and recheck remote content immediately before uploading; if it changed again, reconcile rather than overwrite. Upload only explicit changed files to unpublished 187527266499; exact readback afterward. Shared files (index/settings/layout/locales/shared CSS) need extra overlap checks. Chat-specific ownership is not established: do not infer it from old two-system ownership tables. If concurrent edits affect the same lines or section and cannot be safely merged, resolve ownership before writing. No automatic publishing. This does not authorize messaging other chats.
# Current workflow — single editor

28 September 2026: user explicitly stated they are the only person now working on the website and instructed us to skip the teammate protocol and proceed with Section8. Teammate ownership/pause windows and handbacks below are superseded historical records. No teammate confirmation is needed for requested work. Continue fresh remote backups, narrow merges, targeted writes, verification, locked-section preservation and unpublished-theme-only changes.

---

# June Shop — two-system workflow

Confirmed by the user in this task on 28 September 2026. This version uses explicit machine roles to avoid ambiguity when copied between computers.

## Ownership

| Area | Owner |
| --- | --- |
| Sections 5–8: Inside Discovery; Other Chapters; Home Décor; Lighting | Teammate computer |
| Sections 1–4 and 9 onward | Primary computer — this project/task |
| Shared Shopify files and homepage integration | Primary computer only by default |

Section 1 remains locked. Sections 2 and 3 await implementation approval. Ownership does not authorize new implementation work, publication or changes to locked sections. Target theme is 187527266499, UNPUBLISHED. MAIN 142259323075 is not a write target.

## Section boundaries

- Teammate work stays in section-05 through section-08 with uniquely named section files and owned assets/snippets. Primary work respects these boundaries.
- Inspect remote inventory before naming a new file; verify absence rather than assuming a filename is unused.
- Keep CSS and JavaScript scoped to each section. Preserve approved references, typography controls and merchant settings.
- Upload only an explicit list of owned changed files. Never upload a whole snapshot, current-theme, backup or validation dependency directory.

## Shared-file integration

templates/index.json, locales/*.json, config/*, layout/*, header/footer groups and shared assets/snippets have one writer: the primary computer.

The teammate supplies narrow integration patches/instructions, including homepage insertion, Typography block configuration and locale additions. The primary computer merges these into freshly fetched remote files, preserving unrelated settings, blocks, sections and order. Never blindly upload an older replacement snapshot.

Any ownership transfer requires explicit user instruction and an agreed window without saves from the other computer or Theme Editor. Read, merge, recheck, write, verify, then hand ownership back.

## Before and after uploads

1. Confirm the store, theme identity and UNPUBLISHED role.
2. Fetch owned remote files; save content/checksums separately as backups. Verify absence for new files.
3. Compare with the last known version and reconcile unexpected drift.
4. Validate intended changes. Recheck remote checksums immediately before writing; reconcile if changed.
5. Upload only owned files, then read back and verify. Investigate differences; never blindly retry or roll back over newer edits.
6. Record files, checksums, validation and pending integration. Fetch shared files again at integration time.

Checksums do not provide an atomic lock. Separate folders or Git branches do not prevent Shopify collisions. Exclusive file ownership and a single shared-file writer are the primary safeguards.

## Coordination status

This policy is adopted on the primary computer. No automatic synchronization or cross-machine lock exists. Send this file to the teammate so both copies use the same explicit roles. The earlier handover ZIP predates this confirmation and has not been regenerated.

## Section 5 save window — 28 September 2026
User assigned Section5 build to primary and explicitly confirmed teammate paused. Primary built and integrated sections/june-inside-discovery.liquid after Section4, preserving existing sources/settings. Window completed; original teammate ownership5–8 resumes. Before resuming, teammate must pull the fresh section or use current-theme/sections/june-inside-discovery.liquid; never save an older copy over it. Shared index remains primary-owned. See section-05/README.md/checks.json.

## Section 6 save window — 28 September 2026
User assigned Section6 to primary and explicitly confirmed teammate paused. Primary built/integrated sections/june-other-chapters.liquid after5. Window completed; original teammate ownership5–8 resumes. Pull current Section6 source before editing; shared index remains primary-owned. See section-06/README.md and checks.json.

## Section 7 save window — 28 September 2026
User assigned Section7 to primary and explicitly confirmed teammate paused. Primary built/integrated sections/june-shop-the-corner.liquid after6. Window completed; original teammate ownership5–8 resumes. Pull current Section7 source before editing; shared index remains primary-owned. See section-07/README.md. Generated scene in Shopify Files and local section-07/shop-the-corner.png.
