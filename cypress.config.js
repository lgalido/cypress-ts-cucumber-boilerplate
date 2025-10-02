const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://the-internet.herokuapp.com",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    retries: { runMode: 2, openMode: 0 },
    testIsolation: true,

    async setupNodeEvents(on, config) {
      // Cucumber preprocessor
      await addCucumberPreprocessorPlugin(on, config);

      // Esbuild preprocessor with Cucumber plugin
      on(
        "file:preprocessor",
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      );

      // Mochawesome reporter
      try {
        const mochawesome = require("cypress-mochawesome-reporter/plugin");
        mochawesome(on);
      } catch (error) {
        console.log("Mochawesome reporter not available:", error.message);
      }

      // Logger task
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
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
    json: true,
  },

  env: {
    USER: process.env.CY_USER,
    PASS: process.env.CY_PASS,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_PREFIX: process.env.S3_PREFIX,
  },
});
