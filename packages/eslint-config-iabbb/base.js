module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // `js` and `jsx` are common extensions
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        svg: 'always',
      },
    ],

    // Not supporting nested package.json yet
    // https://github.com/benmosher/eslint-plugin-import/issues/458
    'import/no-extraneous-dependencies': 'off',

    // Requires modules be named when exporting
    'import/no-named-as-default': 'off',

    // Doesn't allow custom Webpack inlining
    'import/no-webpack-loader-syntax': 'off',

    // When there is only a single export from a module, prefer using default export over named export.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'off',

    // Enforce windows/unix line-endings
    'linebreak-style': 'off',

    // Don't allow lines longer than 100 characters
    'max-len': 'off',

    // Disallow arrow functions where they could be confused with comparisons
    'no-confusing-arrow': 'off',

    'no-console': 'off',

    // Because https://medium.com/javascript-scene/nested-ternaries-are-great-361bddd0f340
    'no-nested-ternary': 'off',

    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    // rule: https://eslint.org/docs/rules/no-param-reassign.html
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'accumulator', // for reduce accumulators
          'e', // for e.returnvalue
          'ctx', // for Koa routing
          'req', // for Express requests
          'request', // for Express requests
          'res', // for Express responses
          'response', // for Express responses
          '$scope', // for Angular 1 scopes
          'draft', // for Immer use
        ],
      },
    ],

    // Don't allow the use of i++ in loops instead use i+1
    'no-plusplus': 'off',

    'no-underscore-dangle': 'off',

    'prefer-destructuring': 'off',

    // We use promise.reject as a failure rather than error, so turn it off
    'prefer-promise-reject-errors': 'off',

    /* eslint-config-prettier */
    'prettier/prettier': ['error'],

    /* eslint-plugin-jsx-a11y */

    // Warn bc checking is inconsistent
    'jsx-a11y/label-has-for': [
      'warn',
      {
        required: {
          every: ['id'],
        },
      },
    ],

    // Deprecated in jsx-a11y, but referenced in eslint-config-airbnb
    'jsx-a11y/href-no-hash': 'off',

    /* eslint-plugin-react-hooks */

    'react-hooks/rules-of-hooks': 'error',

    'react-hooks/exhaustive-deps': 'error',

    /* eslint-plugin-react */

    // current implementation of this rule is too greedy
    'react/destructuring-assignment': ['warn', 'always'],

    // Don't allow any, array and object PropTypes
    'react/forbid-prop-types': 'off',

    // Turned off bc error in implemenation continually causes blank lines to be added.
    // https://github.com/yannickcr/eslint-plugin-react/issues/1835
    'react/jsx-one-expression-per-line': 'off',

    // conflicts with prettier
    'react/jsx-wrap-multilines': ['error', { prop: 'ignore' }],

    // 'max-len': ["error", 150],
    // Don't allow js modules to include jsx code
    'react/jsx-filename-extension': 'off',

    // rich text content is required in some components
    'react/no-danger': 'off',

    // No Typos doesn't support custom prop types packages.
    // Disabled until this becomes reality: https://github.com/yannickcr/eslint-plugin-react/issues/1389
    'react/no-typos': 'off',

    // Turned off until stateless components are faster then classes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',

    // Requires an extension when importing a module
    'react/require-extension': 'off',

    // Enforces where childContextTypes, contextTypes, contextType, defaultProps, displayName, and propTypes are declared
    'react/static-property-placement': 'off',

    // Enforces the state initialization style to be either in a constructor or with a class property
    'react/state-in-constructor': 'off',

    // Allows props spreading
    'react/jsx-props-no-spreading': 'off',

    // Enforces standard form for React fragments.
    'react/jsx-fragments': ['error', 'element'],
  },
};
