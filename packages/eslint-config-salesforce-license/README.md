# `eslint-config-salesforce-licenses`

Salesforce eslint configuration for adding license headers to all source files.

## Usage

First install this package.

```bash
yarn add eslint-config-salesforce-license
```

Then extend this configuration in your own eslint file.

Here is an example using a `.eslintrc.js` file.

```javascript
module.exports = {
  extends: ['eslint-config-salesforce-license'],
};
```

Because eslint requires all eslint packages locally, you must also install the following packages.

```bash
yarn add eslint eslint-plugin-header
```

**Note:** You can use [@salesforce/dev-scripts](../dev-scripts) to set this up along with all other configuration files related to a Salesforce typescript project.
