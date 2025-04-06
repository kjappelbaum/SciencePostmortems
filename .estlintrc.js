module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Turn these rules into warnings instead of errors
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "warn",
    "react-hooks/exhaustive-deps": "warn",
  },
};
