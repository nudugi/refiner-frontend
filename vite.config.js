import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sunyaArchive from './scripts/vite-plugin-archive.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sunyaArchive()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    watch: {
      // 생성물이 바뀔 때마다 새로고침되지 않도록
      ignored: ['**/public/_gen/**'],
    },
  },
});
