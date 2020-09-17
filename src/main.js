import Vue from 'vue'
import './click-outside.directive.js'
import App from './App.vue'

// Import Vue Markdown Editor
import VueMarkdownEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'

// Configure Vue
Vue.config.productionTip = false

// Setup Vue Markdown Editor
VueMarkdownEditor.lang.use('en-US', enUS)
VueMarkdownEditor.lang.add({
  'en-US': {
    italic: {
      toolbar: 'Underline',
      placeholder: 'Underline'
    },
  }
})
VueMarkdownEditor.use(vuepressTheme)
Vue.use(VueMarkdownEditor)

// Initialize Vue
new Vue({
  render: h => h(App),
}).$mount('#app')
