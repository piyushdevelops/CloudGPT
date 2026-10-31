# Google Drive Credential Setup

The production application needs its own restricted credential. The Google Drive connection used by Codex does not automatically give the Railway application access.

Never paste a private key, refresh token or downloaded credential into chat, GitHub, theme code or a browser-side JavaScript file.

## Preferred: Google Workspace Shared Drive

Use this route when the June Shop account has a Google Workspace plan that supports Shared Drives.

1. In Google Drive, create a Shared Drive for production files.
2. Move or recreate **June Photo Book Orders** inside that Shared Drive.
3. In Google Cloud Console, create a project named `june-photo-studio`.
4. Enable the Google Drive API for that project.
5. Open IAM & Admin > Service Accounts and create `june-photo-studio-uploader`.
6. Create a JSON key for that service account and download it once.
7. Copy the service account's `client_email` from the JSON.
8. Add that email as **Content manager** on the Shared Drive. Do not give it access to the rest of the user's Drive.
9. Base64-encode the complete JSON file locally.
10. In Railway > `june-photo-studio` service > Variables, add:
    - `GOOGLE_SERVICE_ACCOUNT_JSON_B64` = the base64 value
    - `GOOGLE_DRIVE_ROOT_FOLDER_ID` = the production folder ID
11. Seal the credential variable in Railway and deploy the staged variable change.
12. Delete the downloaded JSON from Downloads after a verified upload test. Retain an emergency copy only in an approved password manager or secret vault.

Service accounts cannot own files and do not have personal Drive storage quota. Their uploads must go into a Shared Drive, where the organisation owns the files.

## Personal Gmail: OAuth

Use this route if the destination is an ordinary personal My Drive and Shared Drives are unavailable.

1. Create the Google Cloud project and enable the Google Drive API.
2. Configure the OAuth consent screen for the June Shop account.
3. Create a Web application OAuth client with the production application's exact callback URL.
4. Authorise only the June Shop Google account.
5. Complete the one-time server-side OAuth flow and obtain a refresh token.
6. Store these as sealed Railway variables:
    - `GOOGLE_OAUTH_CLIENT_ID`
    - `GOOGLE_OAUTH_CLIENT_SECRET`
    - `GOOGLE_OAUTH_REFRESH_TOKEN`
    - `GOOGLE_DRIVE_ROOT_FOLDER_ID=1Q0kkeX_nWZg8bMIfJxxxBpDS7eynLURZ`
7. Deploy and run a create, readback and delete test inside the root folder.

The refresh token grants ongoing Drive access. Treat it as a password and never put it in source control or send it in chat.

## Required verification

Before live orders are enabled, the server must prove that it can:

- Create a test customer and order folder.
- Upload an image with a resumable upload.
- Read back the uploaded checksum and size.
- Upload both proof and print PDFs.
- Recover the files using only the design ID stored with a Shopify test order.
- Prevent public or anonymous access.
- Delete the complete test job and confirm deletion.

