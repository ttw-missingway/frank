# Prismic preview setup

This project is already configured for Prismic **draft preview** and **live preview** in code. To use it, configure preview in your Prismic repository.

## What’s already in place

- **Preview API** – `GET /api/preview` redirects from Prismic into your app with the preview cookie set.
- **Exit preview API** – `GET /api/exit-preview` clears the preview cookie (used by the Prismic toolbar “Exit preview”).
- **Route group** – All page routes live under `[[preview=preview]]`, so they work at both `/page-uid` and `/preview/page-uid` during preview.
- **Client** – `createClient()` uses `enableAutoPreviews({ client, cookies })` so draft content is fetched when the preview cookie is present.
- **Toolbar** – `<PrismicPreview>` in the root layout shows the Prismic toolbar and refreshes when you save in the editor.

## Configure preview in Prismic

1. Open your repo: [prismic.io/dashboard](https://prismic.io/dashboard) → select the **frank** repository.
2. Go to **Settings** → **Previews**.
3. In **Manage your previews**, click **Create a preview** and use:

   | Field | Value |
   |--------|--------|
   | Site name | Development (or any label) |
   | Domain for your application | `http://localhost:5173` (or your app URL) |
   | Preview route | `/api/preview` |

4. Save.

For production, add another preview with your production domain (e.g. `https://your-site.com`) and the same **Preview route**: `/api/preview`.

## How to preview

1. Run the app: `npm run dev`.
2. In Prismic, open a document and click **Preview** (or use the “…” menu → preview).
3. You’ll be sent to your app with the draft version; the Prismic toolbar appears.
4. Use **Exit preview** in the toolbar to clear the preview cookie and see published content again (it hits `/api/exit-preview`).

## Live preview (slice simulator)

For **live** slice preview in the Prismic page builder:

1. In Prismic, open a page → “…” → **Live preview settings**.
2. Set the URL to: `http://localhost:5173/slice-simulator` (or your deployed URL + `/slice-simulator`).
3. Save.

The project already has the `/slice-simulator` route and `slicemachine.config.json` with `localSliceSimulatorURL` set.

## Troubleshooting

- **Preview always shows published content** – Ensure the preview cookie is set (you should land on a URL like `/preview/...` and see the Prismic toolbar). If not, check that **Preview route** in Prismic is exactly `/api/preview` and the domain matches (e.g. no trailing slash).
- **Exit preview doesn’t work** – The toolbar should link to `/api/exit-preview`. If you’re not using the toolbar, open `/api/exit-preview` in the browser to clear the cookie.
- **Cookie issues** – Some browsers (e.g. strict Firefox settings) block the `io.prismic.preview` cookie; try another browser or relax cookie protection for localhost.
