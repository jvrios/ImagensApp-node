module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    node: true,
    browser: true,
    es2020: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  rules: {
    // Suas regras de ESLint aqui
  },
  overrides: [
    {
      files: ['**/*.js'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false // Desativa a necessidade de um arquivo de configuração do Babel
      }
    }
  ]
};
