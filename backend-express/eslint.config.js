module.exports = [
  {
    ignores: ["node_modules/**", "logs/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-underscore-dangle": ["error", { allow: ["_id"] }],
    },
  },
];
