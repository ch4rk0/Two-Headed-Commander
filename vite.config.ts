import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

function getBuildDate(): string {
  try {
    return execSync('git log -1 --format=%cd --date=format:"%B %Y"').toString().trim();
  } catch {
    return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }
}

const buildDate = getBuildDate();

export default defineConfig({
  plugins: [
    react(),
    {
      // Inject window.__BUILD_DATE__ before cookie-consent.js so the banner
      // can display it without waiting for the React bundle to load.
      name: 'inject-build-date',
      transformIndexHtml(html: string) {
        return html.replace(
          '<script src="/cookie-consent.js"></script>',
          `<script>window.__BUILD_DATE__="${buildDate}";</script>\n    <script src="/cookie-consent.js"></script>`,
        );
      },
    },
  ],
  base: '/',
  build: { outDir: 'dist' },
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
