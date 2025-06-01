import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'lib/pdf.js-submodule/build/generic/build/pdf.mjs',
          dest: 'pdf.js',
        },
        {
          src: 'lib/pdf.js-submodule/build/generic/build/pdf.worker.mjs',
          dest: 'pdf.js',
        },
        {
          src: 'lib/pdf.js-submodule/build/generic/web/cmaps/*',
          dest: 'pdf.js/cmaps',
        },
      ],
    }),
  ],
  // (Optional) You might want to add a resolve alias for easier imports, e.g.:
  // resolve: { alias: { '@pdfjs': '/pdf.js' } },
}) 