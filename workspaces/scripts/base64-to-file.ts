import { IMAGE_SRC } from '../app/src/pages/TopPage/internal/ImageSrc';

const fs = require('node:fs');

function base64ToImage(base64String: string, outputPath: string) {
  // Base64文字列からデータ部分を取り出す
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

  // Base64データをバイナリに変換
  const dataBuffer = Buffer.from(base64Data, 'base64');

  // ファイルに書き出す
  fs.writeFileSync(outputPath, dataBuffer);
}

// 使用例
const outputPath = './output.png';
base64ToImage(IMAGE_SRC, outputPath);
