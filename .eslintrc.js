module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'plugin:jest/recommended', 'plugin:node/recommended'],
  plugins: ['jest', 'node'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Jest-specific rules
    'jest/expect-expect': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest/no-hooks': 'off',

    // API Testing best practices
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',

    // Node.js specific
    'node/no-unpublished-require': 'off',
    'node/no-missing-import': 'off', // Handled by module aliases
    'node/no-missing-require': 'off',
    'node/no-unsupported-features/es-syntax': 'off', // Allow modern ES features

    // Code quality
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'max-len': ['warn', { code: 100, ignoreUrls: true }]
  },
  settings: {
    jest: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['**/__test__/**/*.js', '**/*.test.js', '**/*.spec.js'],
      rules: {
        'jest/no-hooks': 'off',
        'jest/require-top-level-describe': 'error',
        'jest/no-test-return-statement': 'error'
      }
    },
    {
      files: ['scripts/**/*.js'],
      rules: {
        'no-console': 'off',
        'node/shebang': 'off'
      }
    },
    {
      files: ['config/**/*.js'],
      rules: {
        'node/no-unpublished-require': 'off'
      }
    }
  ]
}
