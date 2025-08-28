import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    browser: {
      enabled: true, 
      provider: 'playwright',
      instances: [
        { browser: 'chromium' },
      ],
    },
    coverage: {
      exclude: ["build/**", ".react-router/**", "*.config.*"]
    }
  },
})
