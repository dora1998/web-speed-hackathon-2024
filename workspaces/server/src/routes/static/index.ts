import path from 'node:path';

import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { etag } from 'hono/etag';
import { createMiddleware } from 'hono/factory';

import { CLIENT_STATIC_PATH } from '../../constants/paths';

const app = new Hono();

const staticCacheMiddleware = createMiddleware(async (c, next) => {
  await next();
  c.res.headers.set('Cache-Control', 'public, max-age=0');
});

app.use('/assets/*', staticCacheMiddleware);
app.use('/:filename{[a-z\\.]+\\.js$}', staticCacheMiddleware);

app.use(
  '*',
  etag({ weak: true }),
  serveStatic({
    root: path.relative(process.cwd(), CLIENT_STATIC_PATH),
  }),
);

export { app as staticApp };
