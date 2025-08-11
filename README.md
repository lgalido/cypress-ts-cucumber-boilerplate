# Cypress + TypeScript + Cucumber Boilerplate (GitHub + S3 Fixtures + Secrets)

**What you get**
- Cypress v13 with TypeScript
- Cucumber (Gherkin) via `@badeball/cypress-cucumber-preprocessor`
- Mochawesome HTML reports
- Auto-sync **fixtures from S3** before runs
- GitHub Actions CI with artifacts
- Example **login** feature, steps, and a Page Object

## Quickstart (local)
```bash
npm ci
# Optional: export env for BASE_URL and credentials
export BASE_URL=http://localhost:3000
export CY_USER=standard@example.com
export CY_PASS=secret

# If you want to sync fixtures from S3 locally, set these first:
export AWS_REGION=ap-southeast-1
export S3_BUCKET=my-fixtures-bucket
export S3_PREFIX=ete/        # path prefix where fixtures live

npm run cy:open   # or: npm run cy:run
```

## GitHub Secrets to set
- `BASE_URL`
- `CY_USER`
- `CY_PASS`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (e.g. ap-southeast-1)
- `S3_BUCKET` (e.g. my-fixtures-bucket)
- `S3_PREFIX` (e.g. ete/ or uat2/)

> Tip: If you prefer **OIDC** (no static AWS keys), replace the S3 step with `aws-actions/configure-aws-credentials` and remove the AK/SK secrets.

## Project structure
```
cypress/
  e2e/
    login.feature
    step_definitions/
      login.steps.ts
  fixtures/            # gets populated from S3
  pages/
    LoginPage.ts
  support/
    commands.ts
    e2e.ts
.github/workflows/
  cypress.yml
scripts/
  sync-fixtures.js
cypress.config.ts
tsconfig.json
```

## Reports
Mochawesome reports in `reports/`. Videos & screenshots in `cypress/videos` and `cypress/screenshots`.

## Notes
- Use `[data-cy=...]` selectors in your app under test for stability.
- Use `cy.intercept` + `cy.wait('@alias')` instead of `cy.wait(3000)`.
- Prefer API login + `cy.session` and reuse between specs.
```
