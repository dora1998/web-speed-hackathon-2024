import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { globby } from 'globby';
import { Image } from 'image-js';
import sharp from 'sharp';

import authors from '../server/seeds/author.json';
import books from '../server/seeds/book.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DIR = path.join(__dirname, '../server/seeds/images');

const convert = async (imageId: string, suffix: string, size: { height: number; width: number }) => {
  const origFileGlob = [path.resolve(IMAGE_DIR, `${imageId}`), path.resolve(IMAGE_DIR, `${imageId}.*`)];
  const [origFilePath] = await globby(origFileGlob, { absolute: true, onlyFiles: true });
  if (origFilePath == null) {
    throw new Error('Not found.');
  }

  const origBinary = await fs.readFile(origFilePath);
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

  const scale = Math.max((size.width ?? 0) / image.width, (size.height ?? 0) / image.height) || 1;
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
    .avif({ effort: 9 })
    .toBuffer();

  fs.writeFile(path.join(IMAGE_DIR, `${imageId}${suffix}.avif`), res);
};

console.log('----- Author -----');

await Promise.all(
  Array.from(new Set(authors.map((a) => a.imageId))).map(async (imageId) => {
    console.log(`Converting ${imageId}...`);
    await convert(imageId, '', {
      height: 32 * 3,
      width: 32 * 3,
    });
    await convert(imageId, '_large', {
      height: 128 * 3,
      width: 128 * 3,
    });
    console.log(`Converted ${imageId}!`);
  }),
);

console.log('----- Book -----');

await Promise.all(
  Array.from(new Set(books.map((b) => b.imageId))).map(async (imageId) => {
    console.log(`Converting ${imageId}...`);
    await convert(imageId, '_book', {
      height: 64 * 3,
      width: 64 * 3,
    });
    await convert(imageId, '_book_96w', {
      height: 96 * 3,
      width: 96 * 3,
    });
    await convert(imageId, '_book_192w', {
      height: 128 * 3,
      width: 192 * 3,
    });
    await convert(imageId, '_book_256h', {
      height: 256 * 3,
      width: 192 * 3,
    });
    console.log(`Converted ${imageId}!`);
  }),
);
