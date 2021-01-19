module.exports = {
  extends: ['eslint-config-salesforce-typescript', 'eslint-config-salesforce-license'],
  rules: {
    // Define convenient alias types
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-types': 'off'
  },
};
