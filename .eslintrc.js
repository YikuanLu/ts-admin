module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    'jsx-control-statements/jsx-control-statements': true
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-control-statements/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'airbnb'
  ],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    React: false,
    ReactDOM: false
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'jsx-control-statements',
    'react-hooks'
    // 'prettier'
  ],
  rules: {
    'prettier/prettier': 0,
    'react/display-name': 0,
    'no-console': 1,
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true
      }
    ],
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        VariableDeclarator: 2,
        SwitchCase: 1
      }
    ],
    'no-nested-ternary': 0,
    'jsx-a11y/media-has-caption': 0,
    '@typescript-eslint/no-explicit-any': [2],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-triple-slash-reference': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        path: 'always',
        types: 'never',
        lib: 'never'
      }
    ],
    // React相关校验规则
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-control-statements/jsx-jcs-no-undef': 0,
    'no-restricted-syntax': 0,
    'no-undef': 0,
    'react/jsx-indent': [2, 2],
    'react/jsx-no-undef': [
      2,
      {
        allowGlobals: true
      }
    ],
    'jsx-control-statements/jsx-use-if-tag': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prefer-stateless-function': 0,
    'no-unused-vars': 0,
    'no-unused-expressions': 0,
    'implicit-arrow-linebreak': 0,
    'object-curly-newline': 0,
    'react/prop-types': 0,
    'comma-dangle': 0,
    'guard-for-in': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'no-var': 'error',
    'function-paren-newline': 0,
    'prefer-promise-reject-errors': 0,
    'no-plusplus': 0,
    'no-continue': 0,
    semi: ['error', 'never'],
    quotes: [2, 'single'],
    // @fixable 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
    eqeqeq: [
      'warn',
      'always',
      {
        null: 'ignore'
      }
    ]
  }
}
