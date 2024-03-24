const SUPPORTED_MIME_TYPE_LIST = ['image/bmp', 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jxl'];

/**
 * 実際のヘッダを見てMIMEタイプをチェックする。
 * @see https://qiita.com/Toshino3/items/4fec70fae9e85f693563
 */
// function getMimeType(arrayBuffer: ArrayBuffer) {
//   const arr = new Uint8Array(arrayBuffer.slice(0, 150));

//   let header = '';
//   for (let i = 0; i < arr.length; i++) {
//     header += arr[i]!.toString(16);
//   }

//   switch (true) {
//     case header.startsWith('424d'):
//       return 'image/bmp';
//     case header.startsWith('ffd8ff'):
//       return 'image/jpeg';
//     case header.startsWith('89504e47'):
//       return 'image/png';
//     case header.startsWith('52494646'):
//       return 'image/webp';
//     case header.startsWith('TODO'):
//       return 'image/avif';
//     case header.startsWith('TODO'):
//       return 'image/jxl';
//     default:
//       return 'unknown';
//   }
// }

// TODO: 厳密に仕様保つなら、サーバー側でmagika使う
export function isSupportedImage(image: File): boolean {
  if (SUPPORTED_MIME_TYPE_LIST.includes(image.type)) {
    return true;
  }

  return false;
}
