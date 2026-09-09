import { defineConfig } from 'vite';

// Static SPA build. Output goes to dist/ and is served by Cloudflare Workers
// via the [assets] binding in wrangler.jsonc (no server code required).
export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Keep the big prevalence map/data in its own chunk so the other
        // five sections don't pay for it on first load.
        manualChunks: undefined
      }
    }
  }
});
