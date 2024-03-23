/// <reference types="@types/serviceworker" />

import PQueue from 'p-queue';

import { transformJpegXLToBmp } from './transformJpegXLToBmp';

// ServiceWorker が負荷で落ちないように並列リクエスト数を制限する
const queue = new PQueue({
  concurrency: 5,
});

self.addEventListener('install', (ev: ExtendableEvent) => {
  ev.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (ev: ExtendableEvent) => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (ev: FetchEvent) => {
  const url = new URL(ev.request.url);

  // apiとimagesは負荷が高いのでキューに追加して処理する
  if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/api/')) {
    console.log('queued: ', url.pathname);
    ev.respondWith(
      queue.add(() => onFetch(ev.request), {
        throwOnTimeout: true,
      }),
    );
    return;
  }

  ev.respondWith(onFetch(ev.request));
});

async function onFetch(request: Request): Promise<Response> {
  const res = await fetch(request);

  if (res.headers.get('Content-Type') === 'image/jxl') {
    return transformJpegXLToBmp(res);
  } else {
    return res;
  }
}
