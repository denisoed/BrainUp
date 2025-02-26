import { defineConfig } from 'cypress'
import { defineConfig as defineViteConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    },
    video: false,
    screenshotOnRunFailure: false,
    trashAssetsBeforeRuns: true
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: defineViteConfig({
        plugins: [vue()],
      }),
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
})
