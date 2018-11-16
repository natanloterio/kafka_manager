module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "indent": ["error", 4, { "MemberExpression": 1 }],
    "keyword-spacing": ["error", { "overrides": {
        "if": { "after": false },
        "for": { "after": false },
        "while": { "after": false }
    } }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
