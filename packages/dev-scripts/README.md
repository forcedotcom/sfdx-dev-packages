# Common scripts and hooks for Salesforce typescript projects

## What is this?

A collection of commonly needed scripts and hooks used by Salesforce typescript projects. This helps to enforce consistency across and reduces the amount of time it takes to setup new projects. This also reduces the amount of needed configuration required for each project by using common configuration from @salesforce/dev-config by default.

The common scripts that are added to each project include:

- clean: cleans lib/, coverage/, and a host of other files that shouldn't be included in the repository; include all to also clean node_modules
  e.g. `yarn clean` or `yarn clean all`
