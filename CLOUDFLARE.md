# Cloudflare Pages deployment

The site is built into `dist/`; source files, tests, package metadata, and the
Netlify fallback configuration are not published.

## Recommended: Git integration

Create a Pages project from `daniasyrofi/loading` with:

- Production branch: `main`
- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

Every push to `main` can then produce a production deployment. Pull requests
can use preview deployments. Keep the Netlify site and DNS unchanged until the
`pages.dev` preview has been checked.

## Alternative: direct upload

Authenticate once, then deploy the prepared bundle:

```sh
npx wrangler login
npm run deploy:cloudflare
```

Cloudflare treats Git integration and Direct Upload as different project setup
choices. Choose the workflow before creating the Pages project.

## Local verification

```sh
npm run preview:cloudflare
```

This rebuilds `dist/` and serves it through the Cloudflare Pages emulator.

## Domain cutover checklist

1. Check the generated `pages.dev` URL on desktop and mobile.
2. Add the production custom domain in **Workers & Pages → Custom domains**.
3. Follow Cloudflare's DNS record prompt for that domain.
4. Verify HTTPS, the homepage, specimen links, fonts, and a missing URL.
5. Leave Netlify available briefly as a rollback target; remove it only after
   traffic and error rates are stable.

## Abuse controls after the custom domain is active

Use a zone-level WAF rate-limiting rule for obvious abusive clients. Start in
log/challenge mode rather than blocking legitimate visitors. Static assets are
already browser-cacheable through `_headers`, and live home previews are capped
to the viewport plus a small prefetch buffer, so a single visit does not start
every animation at once.
