import { createApp } from 'vue'
import App from './App.vue'

// Import Vue Markdown Editor
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'

// Import CodeMirror
import Codemirror from 'codemirror'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/lib/codemirror.css'

// Setup Vue Markdown Editor
VMdEditor.lang.use('en-US', enUS)
VMdEditor.lang.add({
  'en-US': {
    italic: {
      toolbar: 'Underline',
      placeholder: 'Underline'
    },
  }
})
VMdEditor.Codemirror = Codemirror
VMdEditor.use(githubTheme)

const app = createApp(App)

app.use(VMdEditor)
app.mount('#app')
