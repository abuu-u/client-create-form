import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  define: {
    __VUE_PROD_DEVTOOLS__: true,
  },
})
