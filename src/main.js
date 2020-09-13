import Vue from 'vue'
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'
import App from './App.vue'

Vue.config.productionTip = false
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

new Vue({
  render: h => h(App),
}).$mount('#app')
