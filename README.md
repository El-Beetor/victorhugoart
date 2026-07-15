# vicgarcia.art

Personal art portfolio site — oil paintings, sketchbook, behind-the-scenes
process pages, and a print shop. Built with Next.js 15 (App Router),
Tailwind CSS 4, and Framer Motion; deployed on Vercel.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

For the shop to work locally, copy `.env.example` to `.env.local` and fill in
your Stripe test keys. Everything else runs without env vars.

## Adding new artwork / images

**Never put big scans directly into `public/`.** Drop them into
`image-originals/` instead and run the optimizer:

1. Put high-resolution scans or photos (1200dpi TIFF/PNG/JPEG — any format)
   into the subfolder matching where they belong on the site:

   | Drop into                          | Appears in                     | Used by                    |
   |------------------------------------|--------------------------------|----------------------------|
   | `image-originals/sketches/`        | `public/sketches/`             | Sketchbook page (automatic)|
   | `image-originals/FinishedPaintings/` | `public/FinishedPaintings/` | Home hero, portfolio       |
   | `image-originals/WorkInProgress/<piece>/` | `public/WorkInProgress/<piece>/` | Behind-the-scenes pages |
   | `image-originals/images/`          | `public/images/`               | Misc (profile photo, etc.) |

2. Run:

   ```bash
   npm run images
   ```

Each image is converted to a web-ready copy in `public/` (max 2400px longest
edge, compressed JPEG at quality 82; PNG is kept only for images with
transparency). Re-running is always safe — already-converted images are
skipped, and your originals are never modified or committed (the folder is
gitignored).

**Sketches are fully automatic:** anything dropped in
`image-originals/sketches/` shows up on the sketchbook page with no code
changes — the manifest `app/config/sketches.json` is regenerated on every run.

**Finished paintings need one code addition:** add the painting (path, title,
medium) to the arrays in `app/page.tsx` (home hero rotation) and
`app/portfolio/page.tsx` (portfolio grid).

Maintenance: if an image ever ends up in `public/` directly, shrink it in
place with `npm run images:public`.

## Scripts

| Command                | What it does                                          |
|------------------------|-------------------------------------------------------|
| `npm run dev`          | Dev server at localhost:3000                          |
| `npm run build`        | Production build                                      |
| `npm run lint`         | ESLint                                                |
| `npm run images`       | Convert `image-originals/` → optimized `public/` + regenerate sketch manifest |
| `npm run images:public`| Shrink oversized images already in `public/` in place |

## How the site is organized

```
app/
  page.tsx                  Home — paint-reveal hero canvas + nav buttons
  portfolio/                Portfolio grid of finished paintings
  sketchbook/               Auto-generated from app/config/sketches.json
  about/                    About page
  shop/                     Print shop (Stripe; needs .env.local keys)
  behind-the-scenes/<piece> One page per painting: WIP carousel, color/value
                            breakdowns, story
  components/               Footer, DebugPanel (dev-only theme tweaker),
                            InstagramEmbed
  context/ColorContext.tsx  Site-wide palette, sampled from the hero painting
  config/theme.json         Saved theme (font choice etc., via debug panel)
  api/                      Stripe checkout/products/webhook, save-theme (dev)
scripts/
  optimize-images.mjs       The image pipeline (see above)
image-originals/            Your high-res scans (gitignored, never committed)
public/                     Web-optimized assets only — keep it light
```

## Theme / colors

The site's colors are sampled live from whichever painting the home hero
shows. In development, a debug panel (bottom-right palette button) lets you
try preset palettes and fonts; "save" writes to `app/config/theme.json`.
The panel is hidden in production builds.

## Deploying

Pushing `main` to GitHub triggers a Vercel deploy. Stripe keys are configured
in the Vercel project settings, not in the repo.

---

*Keep this README updated when workflows change (new scripts, new page types,
changed image process) so future-you doesn't have to rediscover them.*
