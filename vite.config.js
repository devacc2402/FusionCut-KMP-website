import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'

/**
 * Keeps the 124 MB of local installer mirrors out of the build output.
 *
 * `public/downloads/` holds the real .msi and .apk so `npm run publish:downloads`
 * has something to upload, and Vite copies `public/` verbatim into `dist/` — which
 * would ship a 124 MB payload to every static host, most of which will choke on it.
 *
 * The site does not need them there: `DOWNLOADS.*.file` in src/data.js points at
 * GitHub Release assets. So drop the folder after the copy instead.
 */
function excludeLocalInstallers() {
  let resolvedConfig = null
  return {
    name: 'exclude-local-installers',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
    },
    /** Fires after public/ has been copied into outDir, before the build ends. */
    closeBundle() {
      if (!resolvedConfig) return
      const dir = path.join(resolvedConfig.build.outDir, 'downloads')
      if (!existsSync(dir)) return
      rmSync(dir, { recursive: true, force: true })
      this.info?.(
        'Dropped public/downloads from the build — installers are served from GitHub Releases',
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), excludeLocalInstallers()],
})