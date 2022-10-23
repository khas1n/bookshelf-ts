import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from 'vite-plugin-babel-macros'
import path from 'path'
import nodePolyfills from 'rollup-plugin-node-polyfills'

const redirectServer = {
  name: 'redirect-server',
  configureServer(server) {
    return () => {
      server.middlewares.use('/', (req, res, next) => {
        if (req.originalUrl === '/') {
          res.writeHead(302, { Location: '/discover' })
          res.end()
        }
        next()
      })
    }
  },
}
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    // rollupOptions: {
    //   external: [
    //     'react',
    //     'react-dom/client',
    //     'react-dom',
    //     'timers',
    //     'prop-types',
    //     'use-sync-external-store/shim/index.js',
    //     'is-node-process',
    //     'js-levenshtein',
    //     '@mswjs/interceptors/lib/interceptors/XMLHttpRequest',
    //   ],
    // },
    // commonjsOptions: {
    //   include: /node_modules/,
    // },
  },
  plugins: [
    redirectServer,
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    nodePolyfills(),
    macrosPlugin(),
  ],
})
