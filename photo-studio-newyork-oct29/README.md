# New York cover personalisation, 29 October 2026

The local PhotoBook Studio files already contained the requested New York cover mapping, but the Railway production service still served an older build. This update deployed the current `app.js`, `cover-personalization.js`, `index.html`, and `styles.css` to the existing Railway production service. The stage used current production copies for every other file and asset. No Shopify theme files were changed or published.

The New York Travel Book now shows a **NEW YORK** title placeholder (10 characters), **CITY NOTES** subtitle placeholder (25 characters), and **YOUR NAME** field (14 characters). Suggestions fit those limits. The form requires one 4:5 portrait cover photo and accepts ratios within 20% of the target.

Before deployment, all four target files were fetched again and confirmed unchanged from the earlier production snapshot. Deployment ID: `59fe9ad8-20ea-4dfd-8930-93b57999d667` (SUCCESS). Exact production readback after deployment matched all 10 staged core files; see `final-readback.json`. All 77 assets matched the predeployment production versions.

`node verify-production.cjs` passed at 390px and 1440px on the production Railway URL. It checked field placeholders, character limits, blank initial values, one photo slot, ratio guidance, suggestions, horizontal overflow, and browser errors. The local journey test also checked that a square image is rejected, a 4:5 image is accepted, and the form resets when changing covers. Screenshots: `new-york-live-390.png` and `new-york-live-1440.png`.

The Shopify PhotoBook Studio page embeds this Railway production URL. An automated end-to-end check inside the Shopify iframe did not complete, so the embedded journey remains a manual browser check; the production studio itself passed the checks above.
