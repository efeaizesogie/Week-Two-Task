/** ESLint config for NestJS apps. */
module.exports = {
  extends: ['./index.js'],
  rules: {
    // Nest heavily uses decorators + constructor injection; loosen a couple of rules.
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
  },
};
