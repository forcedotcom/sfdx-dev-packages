# `eslint-config-salesforce-typescript`

Salesforce eslint configuration for all typescript projects.

## Usage

First install this package.

```bash
yarn add eslint-config-salesforce-typescript
```

Then extend this configuration in your own eslint file.

Here is an example using a `.eslintrc.js` file.

```javascript
module.exports = {
  extends: ['eslint-config-salesforce-typescript'],
};
```

Because eslint requires all eslint packages locally, you must also install the following packages.

```bash
yarn add eslint eslint-plugin-import eslint-plugin-prettier eslint-plugin-jsdoc @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

For Salesforce owned repositories, also extend [eslint-config-salesforce-license](../eslint-config-salesforce-license);

**Note:** You can use [@salesforce/dev-scripts]() to set this up along with all other configuration files related to a Salesforce typescript project.
