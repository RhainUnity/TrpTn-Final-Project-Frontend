// .eslintrc.js - ESLint configuration file
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
  },
};
