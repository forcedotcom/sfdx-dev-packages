# Common scripts and hooks for Salesforce typescript projects

## What is this?

A collection of commonly needed scripts and hooks used by Salesforce typescript projects. This helps to enforce consistency across and reduces the amount of time it takes to setup new projects. This also reduces the amount of needed configuration required for each project by using common configuration from [@salesforce/dev-config](https://www.npmjs.com/package/@salesforce/dev-config) by default.

When dev-packages is added as a dev dependency, it will automatically run on post-install to enforce the package.json has the right scripts, hooks, and dependencies. Use the `.sfdx-dev.json` to configure what is generated and controlled.

The common scripts that are added to each project include:

- clean: cleans lib/, coverage/, and a host of other files that shouldn't be included in the repository; include `all` to also clean node_modules
  e.g. `yarn clean` or `yarn clean-all`
- compile: compiles src/ to /lib using tsc
  e.g. `yarn compile`
- lint: lints src/ using tslint
  e.g. `yarn lint`
- test: runs tests using nyc and mocha
  e.g. `yarn test`
- build: runs the clean, compile, lint, and test targets
  e.g. `yarn build`
- docs: generates docs/ using typedoc
  e.g. `yarn docs`

The common hooks that are added to each project include:

- commit-msg: verifies the commit message conforms to [angular guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines) using [commitlint](https://github.com/marionebl/commitlint).
- pre-commit: runs prettier on staged files and `yarn docs`.
- pre-push: runs `yarn build`.

## Configuration

To configure what this generates and controls, create a `.sfdx-dev.json`. Look at the [schema](https://github.com/forcedotcom/sfdx-dev-packages/blob/master/packages/dev-scripts/sfdx-dev.schema.json) to see what options are available.
