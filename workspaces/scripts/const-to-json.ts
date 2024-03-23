import { readFileSync } from 'node:fs';

const filename = process.argv[2];
if (filename == null) {
  console.error('Filename is required');
  process.exit(1);
}

const original = readFileSync(filename);

// 最初と最後の2行を取り除く
const text = `
${original.toString().split('\n').slice(2, -2).join('\n')}
`;

const output = JSON.stringify({ text });
console.log(output);
