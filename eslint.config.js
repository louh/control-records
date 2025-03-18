import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.js', '**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {}
  }
]
