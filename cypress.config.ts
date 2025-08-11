import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import addCucumberPreprocessorPlugin from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    retries: { runMode: 2, openMode: 0 },
    testIsolation: true,
    async setupNodeEvents(on, config) {
      // Cucumber preprocessor
      await addCucumberPreprocessorPlugin(on, config);
      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      // Mochawesome reporter
      require("cypress-mochawesome-reporter/plugin")(on);

      // Simple task logger
      on("task", {
        log(message) { console.log(message); return null; }
      });
      return config;
    },
  },
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "reports",
    charts: true,
    overwrite: false,
    html: true,
    json: true
  },
  env: {
    USER: process.env.CY_USER,
    PASS: process.env.CY_PASS,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_PREFIX: process.env.S3_PREFIX
  }
});
