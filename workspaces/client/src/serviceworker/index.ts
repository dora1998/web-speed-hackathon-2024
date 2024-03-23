/// <reference types="@types/serviceworker" />

import PQueue from 'p-queue';

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
      queue.add(() => fetch(ev.request), {
        throwOnTimeout: true,
      }),
    );
    return;
  }

  ev.respondWith(fetch(ev.request));
});
