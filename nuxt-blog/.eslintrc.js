module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 0,
    'space-before-function-paren': 0,
    'no-console': 0,
    'no-lonely-if': 0,
    'no-constant-condition': 0
  }
}
