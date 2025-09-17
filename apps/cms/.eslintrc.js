module.exports = {
  extends: ['../../packages/config/eslint.js'],
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
};

