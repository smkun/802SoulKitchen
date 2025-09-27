module.exports = {
  extends: ['./tools/eslint-config'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.astro/',
    'public/',
    '*.config.js',
    '*.config.mjs',
  ],
};