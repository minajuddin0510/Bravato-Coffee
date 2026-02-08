import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        products: resolve(__dirname, 'products.html'),
        brewGuide: resolve(__dirname, 'brew-guide.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});
