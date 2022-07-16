import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Note: vite3 compatibility fix
  // See:
  // https://dev.to/0xbf/vite-module-path-has-been-externalized-for-browser-compatibility-2bo6
  // https://github.com/vitejs/vite/discussions/4479#discussioncomment-1121552
  resolve: {
    alias: {
      path: 'path-browserify'
    }
  },
})
