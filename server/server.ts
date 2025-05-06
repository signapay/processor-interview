import fs from 'node:fs/promises';
import { createServer } from 'node:http';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import express from 'express';
import sirv from 'sirv';
import type { ViteDevServer } from 'vite';
import { createServer as createViteServer } from 'vite';
import { reportApiRouter } from './report/reportApiRouter';
import { isProductionMode, mode } from './shared/env';
import { transactionApiRouter } from './transactions/transactionApiRouter';

const base = '/';

const templateHtml = isProductionMode ? await fs.readFile('./dist/client/index.html', 'utf-8') : undefined;

const app = express().disable('x-powered-by').set('views', './server/asset');

let vite: ViteDevServer;
if (isProductionMode) {
  const compression = (await import('compression')).default;
  app.use(compression());
  app.use(base, sirv('dist/client', { extensions: [] }));
  app.enable('view cache');
} else {
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
  app.disable('view cache');
}

app.use('/asset', sirv('asset', { dev: !isProductionMode, extensions: [] })).use((req, res, next) => {
  res.charset = 'utf-8';
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/transactions', transactionApiRouter);
app.use('/api/report', reportApiRouter);

// Serve HTML
app.use(async (req, res) => {
  const url = req.originalUrl.replace(base, '');
  try {
    let template: string;
    let render: any;
    if (isProductionMode) {
      template = templateHtml;
      // @ts-expect-error
      render = (await import('../dist/server/entry-server.js')).render;
    } else {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/client/entry-server.tsx')).render;
    }
    const rendered = await render(url);
    template = template.replace('<!--app-head-->', rendered.head ?? '').replace('<!--app-html-->', rendered.html ?? '');
    res.set({ 'Content-Type': 'text/html; charset=utf-8' });
    res.status(200).end(template);
  } catch (error) {
    console.error(error);
    vite?.ssrFixStacktrace(error);
    res.status(500).end(error);
  }
});

const port = Number(process.env.PORT) || 4500;

createServer(app).listen(port, '::', () => {
  console.info(
    chalk.green(`${chalk.yellow('Server')} started with mode ${chalk.yellow(mode)}`),
    chalk.underline.blue(`http://localhost:${port}`)
  );
});
