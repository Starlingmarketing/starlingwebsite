import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PRERENDER_ROUTES, getRouteMeta } from '../src/seo/routeMeta.js';

if (process.env.VERCEL) {
  console.log('Skipping prerender on Vercel (no Chromium available).');
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const fileExists = async (targetPath) => {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const resolveRequestPath = async (requestPath) => {
  const cleanPath = requestPath.split('?')[0];
  const normalizedPath = cleanPath === '/' ? '/index.html' : cleanPath;
  const candidate = path.join(distDir, normalizedPath);

  if (path.extname(candidate)) {
    return (await fileExists(candidate)) ? candidate : null;
  }

  const nestedIndex = path.join(distDir, normalizedPath, 'index.html');
  if (await fileExists(nestedIndex)) return nestedIndex;

  const htmlFile = `${candidate}.html`;
  if (await fileExists(htmlFile)) return htmlFile;

  return path.join(distDir, 'index.html');
};

const startStaticServer = () =>
  new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const targetPath = await resolveRequestPath(req.url || '/');

        if (!targetPath) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
          return;
        }

        const body = await readFile(targetPath);
        const ext = path.extname(targetPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(body);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(String(error));
      }
    });

    server.on('error', reject);
    server.listen(4173, '127.0.0.1', () => resolve(server));
  });

const launchBrowser = async () => {
  try {
    return await chromium.launch({ headless: true });
  } catch (defaultError) {
    try {
      return await chromium.launch({ channel: 'chrome', headless: true });
    } catch (chromeError) {
      throw new Error(
        `Failed to launch Chromium for prerendering.\nDefault launch error: ${defaultError}\nChrome channel error: ${chromeError}`,
      );
    }
  }
};

const ensureDoctype = (html) =>
  html.toLowerCase().startsWith('<!doctype html>') ? html : `<!DOCTYPE html>${html}`;

const browser = await launchBrowser();
const server = await startStaticServer();

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  await context.setExtraHTTPHeaders({
    'X-Starling-Prerender': 'true',
  });

  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const route of PRERENDER_ROUTES) {
    const meta = getRouteMeta(route.pathname);
    await page.goto(`http://127.0.0.1:4173${route.pathname}`, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector(route.readySelector, { timeout: 30000 });
    await page.waitForFunction(
      (expectedTitle) => document.title === expectedTitle,
      meta.title,
      { timeout: 30000 },
    );
    await page.waitForFunction(
      (expectedDescription) =>
        document.querySelector('meta[name="description"]')?.content
        === expectedDescription,
      meta.description,
      { timeout: 30000 },
    );
    await page.waitForTimeout(250);
    await page.locator('#root').evaluate((node) => {
      node.setAttribute('data-prerendered', 'true');
    });

    const html = ensureDoctype(await page.content());
    const outputPath = path.join(distDir, route.outputPath);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, 'utf8');
  }

  await context.close();
} finally {
  server.close();
  await browser.close();
}
