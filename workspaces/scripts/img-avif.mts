import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { globby } from 'globby';
import { Image } from 'image-js';
import sharp from 'sharp';

import authors from '../server/seeds/author.json';

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

await Promise.all(
  authors.map(async (author) => {
    console.log(`Converting ${author.imageId}...`);
    await convert(author.imageId, '', {
      height: 32 * 3,
      width: 32 * 3,
    });
    await convert(author.imageId, '_large', {
      height: 128 * 3,
      width: 128 * 3,
    });
    console.log(`Converted ${author.imageId}!`);
  }),
);
