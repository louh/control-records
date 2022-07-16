import { createApp } from 'vue/dist/vue.esm-bundler.js'
import { createRouter, createWebHistory } from 'vue-router'
import DocumentPage from './pages/DocumentPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

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

// Setup routing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: DocumentPage },
    { path: '/new', component: DocumentPage },
    { path: '/document/:id', component: DocumentPage, props: true },
    { path: '/document/:id/:slug', component: DocumentPage, props: true },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
  ]
})

const app = createApp({})

app.use(router)
app.use(VMdEditor)
app.mount('#app')
