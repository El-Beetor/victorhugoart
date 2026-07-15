/**
 * Image optimization pipeline for vicgarcia.art
 *
 * Everyday use:
 *   npm run images
 *     Converts everything in image-originals/ (high-res scans, any format)
 *     into web-ready images in public/, mirroring the folder structure.
 *     - Photos/scans without transparency  -> .jpg  (quality 82, max edge 2400px)
 *     - Images with transparency (alpha)   -> .png  (resized + compressed)
 *     Already-converted images are skipped unless the original is newer.
 *     Finally, regenerates app/config/sketches.json from public/sketches so
 *     the sketchbook page picks up new sketches automatically.
 *
 * One-time / maintenance:
 *   npm run images:public
 *     Walks public/ itself and shrinks oversized images in place
 *     (converts non-transparent PNGs to JPG and deletes the PNG).
 *     Only needed if images bypass the originals folder.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const ORIGINALS_DIR = path.join(ROOT, 'image-originals');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SKETCHES_DIR = path.join(PUBLIC_DIR, 'sketches');
const MANIFEST_PATH = path.join(ROOT, 'app', 'config', 'sketches.json');

const MAX_EDGE = 2400; // px, longest side of any web image
const JPEG_QUALITY = 82;
const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.bmp']);
// Files in public/ the in-place mode must never touch
const PUBLIC_SKIP = new Set(['favicon.ico']);
const PUBLIC_SKIP_EXTS = new Set(['.svg', '.ico']);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function hasAlpha(file) {
  const meta = await sharp(file, { limitInputPixels: false }).metadata();
  if (!meta.hasAlpha) return false;
  // hasAlpha only says the channel exists; check whether it's actually used
  const stats = await sharp(file, { limitInputPixels: false }).stats();
  const alpha = stats.channels[stats.channels.length - 1];
  return alpha.min < 255;
}

async function optimizeTo(src, dest, { keepAlpha }) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const pipeline = sharp(src, { limitInputPixels: false })
    .rotate() // respect EXIF orientation
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true });

  if (keepAlpha) {
    await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(dest);
  } else {
    await pipeline
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
      .toFile(dest);
  }
}

/** Convert image-originals/** into public/**, skipping up-to-date outputs. */
async function processOriginals() {
  await fs.mkdir(ORIGINALS_DIR, { recursive: true });
  const files = (await walk(ORIGINALS_DIR)).filter((f) =>
    SOURCE_EXTS.has(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log(`No source images found in ${path.relative(ROOT, ORIGINALS_DIR)}/.`);
    console.log('Drop scans there (mirroring public/ subfolders, e.g. image-originals/sketches/).');
    return;
  }

  let converted = 0;
  let skipped = 0;
  for (const src of files) {
    const rel = path.relative(ORIGINALS_DIR, src);
    const keepAlpha = await hasAlpha(src);
    const outExt = keepAlpha ? '.png' : '.jpg';
    const dest = path.join(PUBLIC_DIR, rel.replace(/\.[^.]+$/, outExt));

    try {
      const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)]);
      if (destStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    } catch {
      /* dest doesn't exist yet */
    }

    const before = (await fs.stat(src)).size;
    await optimizeTo(src, dest, { keepAlpha });
    const after = (await fs.stat(dest)).size;
    console.log(`  ${rel} -> ${path.relative(PUBLIC_DIR, dest)}  (${fmtMB(before)} -> ${fmtMB(after)})`);
    converted++;
  }
  console.log(`Originals: ${converted} converted, ${skipped} already up to date.`);
}

/** One-time/maintenance: shrink oversized images already inside public/. */
async function processPublicInPlace() {
  const files = (await walk(PUBLIC_DIR)).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return (
      SOURCE_EXTS.has(ext) &&
      !PUBLIC_SKIP_EXTS.has(ext) &&
      !PUBLIC_SKIP.has(path.basename(f))
    );
  });

  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const rel = path.relative(PUBLIC_DIR, file);
    const before = (await fs.stat(file)).size;
    totalBefore += before;

    const meta = await sharp(file, { limitInputPixels: false }).metadata();
    const ext = path.extname(file).toLowerCase();
    const keepAlpha = ext === '.png' ? await hasAlpha(file) : false;
    const oversizedDims = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE;
    const isPngPhoto = ext === '.png' && !keepAlpha;
    const heavy = before > 400 * 1024;

    if (!oversizedDims && !isPngPhoto && !heavy) {
      totalAfter += before;
      continue; // already fine
    }

    const outExt = keepAlpha ? '.png' : '.jpg';
    const dest = file.replace(/\.[^.]+$/, outExt);
    const tmp = `${dest}.tmp-${process.pid}${outExt}`;
    await optimizeTo(file, tmp, { keepAlpha });

    const after = (await fs.stat(tmp)).size;
    if (dest === file && after >= before) {
      // Re-encode didn't help; keep the original
      await fs.unlink(tmp);
      totalAfter += before;
      continue;
    }
    await fs.rename(tmp, dest);
    if (dest !== file) await fs.unlink(file);
    totalAfter += after;
    console.log(`  ${rel} -> ${path.relative(PUBLIC_DIR, dest)}  (${fmtMB(before)} -> ${fmtMB(after)})`);
  }
  console.log(`public/: ${fmtMB(totalBefore)} -> ${fmtMB(totalAfter)}`);
}

/** Regenerate the sketchbook manifest from whatever is in public/sketches. */
async function writeSketchesManifest() {
  const files = (await walk(SKETCHES_DIR))
    .filter((f) => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()))
    .map((f) => '/' + path.relative(PUBLIC_DIR, f).split(path.sep).join('/'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(files, null, 2) + '\n');
  console.log(`Sketch manifest: ${files.length} sketches -> ${path.relative(ROOT, MANIFEST_PATH)}`);
}

const mode = process.argv.includes('--public') ? 'public' : 'originals';
if (mode === 'public') {
  await processPublicInPlace();
} else {
  await processOriginals();
}
await writeSketchesManifest();
