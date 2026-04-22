import { defineConfig } from 'vite';
import { resolve } from 'path';
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  server: {
    open: true
  },
  plugins: [
    sassGlobImports()
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
});
