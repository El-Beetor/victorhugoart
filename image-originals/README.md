# Image originals — drop your scans here

Put high-resolution scans/photos (1200dpi TIFF/PNG/JPEG — anything) into
subfolders matching where they should appear on the site:

```
image-originals/
  sketches/            -> public/sketches/            (sketchbook page, automatic)
  FinishedPaintings/   -> public/FinishedPaintings/
  WorkInProgress/      -> public/WorkInProgress/
  images/              -> public/images/
```

Then run:

```
npm run images
```

Each image is converted to a web-ready copy in `public/` (max 2400px,
compressed JPEG; PNG kept only if the image has transparency). Originals are
never modified, never committed to git (this folder is gitignored), and
already-converted images are skipped, so re-running is always safe.

Anything added to `image-originals/sketches/` appears on the sketchbook page
automatically — no code changes needed (the manifest
`app/config/sketches.json` is regenerated on every run).
