import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url);
            if (req.headers.cookie) {
              proxyReq.setHeader('cookie', req.headers.cookie);
              console.log('Forwarded cookies:', req.headers.cookie);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Response from backend:', proxyRes.statusCode, req.url);
            if (proxyRes.headers['set-cookie']) {
              console.log('Setting cookies:', proxyRes.headers['set-cookie']);
            }
          });
        },
      }
    }
  }
});
