# ANTIFIRM podcast site

Landing page built with Next.js (App Router), TypeScript and Tailwind CSS, exported as a static site.

## Develop

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # static site in out/ (reads the live RSS feed)
    npm run dev:sample # or build:sample — uses data/feed.sample.xml instead of the network

## Where things live

- Episodes come from the Riverside RSS feed (`feedUrl` in `data/site.ts`) at build time. The newest full episode is featured; until one exists, the trailer is.
- `data/episode-meta.json` – per-episode extras the feed lacks, keyed by guid: `category` and `youtubeId`
- `data/site.ts` – show name, feed URL, trailer link, subscribe and social links
- `public/images/` – logo and Lady Justice artwork
- `components/` – one file per section

## Deploy to GitHub Pages

Push to `main`, then in the repo's Settings → Pages set Source to "GitHub Actions".
`.github/workflows/deploy.yml` builds and publishes `out/` on every push and every 6 hours, so new
episodes appear on their own. If the feed can't be reached, the build fails and the live site stays as it was. It serves from `/<repo-name>`;
if you add a custom domain, set a repository variable `CUSTOM_DOMAIN` so the base path is dropped.
