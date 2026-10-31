# June Shop — teammate handover, 28 September 2026

Update after the original ZIP: user confirmed the ownership split in TWO-SYSTEM-WORKFLOW.md. Teammate owns Sections 5–8; primary computer owns Sections 1–4 and 9 onward and shared-file integration. Share that workflow file with the teammate. The existing ZIP and its manifest describe the earlier package, not these subsequent documentation changes.

Read this file first, then AGENTS.md, START-HERE-LOCAL.md and its linked records. This ZIP includes the latest local revisions and review screenshots, not an export of the full Codex conversation.

## Current state
- Section 1: locked. Do not edit.
- Section 2: revised after screenshot review; larger covers, clearer selected badge and enlarged interior preview. Implementation awaits approval.
- Section 3: revised after screenshot review; uncropped source image, larger cover options, compact capsule action, gift cards and corrected accordion indicator. Implementation awaits approval.
- Section 4 onward: not implemented in this continuation. Get a specific assignment before starting.
- Working Shopify theme: 187527266499, unpublished. MAIN 142259323075 is not a deployment target. Nothing was published.

## Authoritative local files
The ZIP's current-theme/ directory assembles the latest five relevant files from the individual section snapshots. It is a PARTIAL theme, not a complete deployment folder:
- sections/june-make-room.liquid from section-01/theme/sections/
- sections/june-your-year.liquid from section-02/theme/sections/
- sections/june-with-extras.liquid from section-03/theme/sections/
- templates/index.json and locales/en.default.json from section-03/theme/

Other section/theme folders include older dependency copies used for validation. Do not overwrite newer files with them. Backups are historical. Latest screenshots: section-02/review-revised-desktop.png and review-revised-mobile.png; section-03/revised-desktop.png and revised-mobile.png. Read each section README for testing and limitations.

## Setup on another computer
Extract the ZIP, open its june-shop-redesign folder as a local Codex project, and start a new task. Files and handover notes transfer; the active chat, credentials and connected Shopify session do not. Adapt old server paths and D:/ paths to the extraction folder. Install needed tools/plugins on the destination normally rather than copying credentials. The tools/package-lock.json is included if its local tooling is needed; node_modules is excluded.

Starter prompt:
> Continue this June Shop project. Read TEAM-HANDOVER.md, AGENTS.md and START-HERE-LOCAL.md plus linked decisions, typography rules and approved references. Verify HANDOVER-MANIFEST.json. Section 1 is locked; Sections 2 and 3 await review. Summarize context before editing. Work locally on the assigned section only. Do not upload to Shopify or publish.

## Team coordination
Use separate branches if a private Git repository is set up. Assign different sections and review shared template/locale changes together. Keep one person responsible for Shopify writes. Before any future write, fetch current remote contents, compare and back up; upload only changed files. This archive does not grant permission to publish or overwrite another person's edits.

## Verification
HANDOVER-MANIFEST.json records the files in this new ZIP (relative paths, byte sizes and SHA-256). It excludes itself. TRANSFER-MANIFEST.json is the earlier incoming transfer record and will differ for files revised since that transfer; do not use it to validate this updated ZIP. All 256 original transfer entries were verified at initial recovery.

Catalog note: Remember Why You Started has only three confirmed gifts; the other three selected Limited Edition planners have five. Await an updated offer before making a five-gift claim for that fourth planner. The original scene photo partly frames the canvas bag; the revised CSS adds no crop.
