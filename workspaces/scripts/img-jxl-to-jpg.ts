import path from 'node:path';

import { globby } from 'globby';

import { readJpegXL } from '../image-encrypt/tools/reader/readJpegXL';
import { writePng } from '../image-encrypt/tools/writer/writePng';

const IMAGE_DIR = path.join(__dirname, '../server/seeds/images');

const run = async () => {
  const targets = await globby([path.resolve(IMAGE_DIR, `*.jxl`)], { absolute: true, onlyFiles: true });

  for (const target of targets) {
    console.log(target);
    const image = await readJpegXL(target);
    await writePng({ filepath: target.replace(/\.jxl$/, '.png'), imageData: image });
  }
};

run();
