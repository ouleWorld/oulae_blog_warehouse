module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['react', '@typescript-eslint', '@emotion'],
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 暂时先把这个规则关掉，因为我们想要在 webpack 配置文件中使用 require
    '@typescript-eslint/no-var-requires': 'off',
    "@emotion/jsx-import": "error",
    "@emotion/pkg-renaming": "error"
  },
};
/**
  @typescript-eslint/parser：用于解析 TypeScript 代码。
  plugin:react/recommended：用于启用 React 相关的 linting 规则。
  plugin:@typescript-eslint/recommended：用于启用 TypeScript 相关的 linting 规则。
  此外，还使用了以下规则：
  "react/prop-types": "off"：忽略 React 组件的 PropTypes 验证，可以使用 TypeScript 的类型检查来替代。
  "@typescript-eslint/explicit-function-return-type": "off"：关闭需要函数显示指定返回类型的要求，可以使用 TypeScript 的类型推断来替代。
  "@typescript-eslint/no-explicit-any": "off"：关闭使用 any 类型的错误提示。
  "@typescript-eslint/explicit-module-boundary-types": "off"：关闭需要导出函数和类的显示类型声明的要求，可以使用 TypeScript 的类型推断来替代。
 */
