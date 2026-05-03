import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const siteConfigPath = resolve(__dirname, 'site.config.json');

const loadSiteConfig = () =>
  JSON.parse(readFileSync(siteConfigPath, 'utf-8'));

// site.config.json の値で index.html 内の {{key}} を置換するプラグイン
const siteConfigPlugin = () => ({
  name: 'site-config-html',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      const config = loadSiteConfig();
      return html.replace(
        /\{\{\s*(\w+)\s*\}\}/g,
        (_, key) => config[key] ?? ''
      );
    },
  },
  // dev: site.config.json を変更したらフルリロード
  configureServer(server) {
    server.watcher.add(siteConfigPath);
    server.watcher.on('change', (file) => {
      if (file === siteConfigPath) {
        server.ws.send({ type: 'full-reload' });
      }
    });
  },
});

export default defineConfig({
  root: resolve(__dirname, 'src'),
  server: {
    open: true,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  plugins: [
    siteConfigPlugin(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 80 },
      svg: {
        plugins: [{ name: 'removeViewBox', active: false }],
      },
    }),
  ],
});
