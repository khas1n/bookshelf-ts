import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from 'vite-plugin-babel-macros'
import path from 'path'

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
  plugins: [
    redirectServer,
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    macrosPlugin(),
  ],
})
