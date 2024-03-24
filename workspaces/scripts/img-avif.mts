import fsOld from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cliProgress from 'cli-progress';
import { globby } from 'globby';
import { Image } from 'image-js';
import sharp from 'sharp';

import authors from '../server/seeds/author.json';
import books from '../server/seeds/book.json';
import episodes from '../server/seeds/episode.json';
import episodePages from '../server/seeds/episodePage.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DIR = path.join(__dirname, '../server/seeds/images');

const convert = async (imageId: string, size: number | null) => {
  const origFileGlob = [path.resolve(IMAGE_DIR, `${imageId}`), path.resolve(IMAGE_DIR, `${imageId}.*`)];
  const [origFilePath] = await globby(origFileGlob, { absolute: true, onlyFiles: true });
  if (origFilePath == null) {
    throw new Error('Not found.');
  }

  const origBinary = await fs.readFile(origFilePath);
  const suffix = size != null ? `_${size}` : '';

  const outputPath = path.join(IMAGE_DIR, `${imageId}${suffix}.avif`);

  if (fsOld.existsSync(outputPath)) {
    return;
  }

  if (size == null) {
    const res = await sharp(origBinary).avif({ effort: 4 }).toBuffer();
    fs.writeFile(outputPath, res);
    return;
  }

  const image = new Image(
    await sharp(origBinary)
      .ensureAlpha()
      .raw()
      .toBuffer({
        resolveWithObject: true,
      })
      .then(({ data, info }) => {
        return {
          colorSpace: 'srgb',
          data: new Uint8ClampedArray(data),
          height: info.height,
          width: info.width,
        };
      }),
  );

  const scale = Math.max((size * 3 ?? 0) / image.width, (size * 3 ?? 0) / image.height) || 1;
  const manipulated = image.resize({
    height: Math.ceil(image.height * scale),
    preserveAspectRatio: true,
    width: Math.ceil(image.width * scale),
  });

  const res = await sharp(manipulated.data, {
    raw: {
      channels: 4,
      height: manipulated.height,
      width: manipulated.width,
    },
  })
    .avif({ effort: 4 })
    .toBuffer();

  fs.writeFile(path.join(IMAGE_DIR, `${imageId}${suffix}.avif`), res);
};

const convertAll = async (items: string[], sizes: (number | null)[]) => {
  // create a new progress bar instance and use shades_classic theme
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  // start the progress bar with a total value of 200 and start value of 0
  bar.start(items.length, 0);

  // update the current value in your application..
  await Promise.all(
    items.map(async (imageId) => {
      await Promise.all(sizes.map((size) => convert(imageId, size)));
      bar.increment();
    }),
  );

  // stop the progress bar
  bar.stop();
};

console.log('----- Author -----');

await convertAll(Array.from(new Set(authors.map((a) => a.imageId))), [32, 128]);

console.log('----- Book -----');

await convertAll(Array.from(new Set(books.map((a) => a.imageId))), [64, 96, 192, 256]);

console.log('----- Episode -----');

await convertAll(Array.from(new Set(episodes.map((a) => a.imageId))), [96]);

console.log('----- Episode Page -----');

await convertAll(Array.from(new Set(episodePages.map((a) => a.imageId))), [null]);
