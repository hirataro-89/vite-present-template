import { defineConfig } from 'vite';
import sassGlobImports from 'vite-plugin-sass-glob-import';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    sassGlobImports()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/scss/foundation/variables" as *;`
      }
    }
  },
  build: {
    outDir: 'dist'
  }
});
