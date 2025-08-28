module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended", // if using TypeScript
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended", // 👈 Prettier goes last!
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
      "prettier/prettier": "error", // show formatting issues as ESLint errors
    },
  };
  