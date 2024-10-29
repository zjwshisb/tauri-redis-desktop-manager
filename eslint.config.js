import pluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  ...tseslint.configs.recommended,
  {
    settings: {
      react: { version: '18.3' }
    },
    files: ["**/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
    },
  },
  {
    files: ["**/**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/indent': 'off',
      'no-template-curly-in-string': 'off',
      "@typescript-eslint/no-explicit-any":"off",
      "no-multiple-empty-lines": ['error', { "max": 1, "maxEOF": 0 }]
    },
  },
];