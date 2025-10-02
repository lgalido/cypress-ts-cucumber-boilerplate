import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    baseUrl: "https://the-internet.herokuapp.com",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    retries: { runMode: 2, openMode: 0 },
    testIsolation: true,

    async setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      // Cucumber preprocessor
      await addCucumberPreprocessorPlugin(on, config);

      // Esbuild preprocessor with Cucumber plugin
      on(
        "file:preprocessor",
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      );

      // Mochawesome reporter - with proper error handling
      try {
        const mochawesomeModule = await import("cypress-mochawesome-reporter/plugin");
        const mochawesome = mochawesomeModule.default || mochawesomeModule;
        if (typeof mochawesome === 'function') {
          mochawesome(on);
        }
      } catch (error) {
        console.log("Mochawesome reporter could not be loaded, continuing without it");
      }

      // Logger task
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
      });

      return config;
    },
  },

  // Only set reporter if mochawesome is available
  ...(process.env.CI ? {} : {
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "reports",
      charts: true,
      overwrite: false,
      html: true,
      json: true,
    },
  }),

  env: {
    USER: process.env.CY_USER,
    PASS: process.env.CY_PASS,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_PREFIX: process.env.S3_PREFIX,
  },
});
