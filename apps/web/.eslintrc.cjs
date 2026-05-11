module.exports = {
  extends: ['@rfpilot/config-eslint/next.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
