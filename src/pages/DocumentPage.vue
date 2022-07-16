<template>
  <PageTemplate>
    <template #default>
      <div class="controls">
        <button @click="handleLoad" ref="loadButton">Load</button>
        <LoadMenu
          v-if="isLoadMenuOpen"
          v-closable="{
            exclude: ['loadButton'],
            handler: 'closeMenu'
          }"
          :items="docs"
          @change="loadSelected"
        />
        <button @click="handleEdit">Edit</button>
        <button @click="handleNew">New</button>
        <button @click="handlePrint">Print</button>
        <!-- button @click="handleExportPDF">Export PDF (beta)</button -->
        <button @click="handleToggleSeal">Toggle seal: {{ sealButtonLabel }}</button>
        <button @click="handleToggleStamp">Toggle copy stamp: {{ stampButtonLabel }}</button>
      </div>
      <PageContainer :recno="recno" :seal="seal" :stamp="stamp" :content="content"></PageContainer>
    </template>
  </PageTemplate>
  <ContentEditor
    :key="content"
    :isActive="isEditorActive"
    v-on:update:isEditorActive="isEditorActive = $event"
    :content="content"
    v-on:update:content="content = $event"
    :recno="recno"
    v-on:update:recno="recno = $event"
  ></ContentEditor>
</template>

<script>
import { jsPDF } from 'jspdf'
import slugify from 'slugify'
import { closable } from '../click-outside.directive.js'
import { localStorageAvailable } from '../localstorage.js'
import PageContainer from '../components/PageContainer.vue'
import ContentEditor from '../components/ContentEditor.vue'
import LoadMenu from '../components/LoadMenu.vue'
import PageTemplate from './PageTemplate.vue'
import docs from '../docs.json'
import M from 'minimatch'

const LETTER_WIDTH_72DPI = 612 // pixels

// Localstorage keys
const FBC_RECORD_SEAL = 'FBC_RECORD_SEAL'
const FBC_RECORD_STAMP = 'FBC_RECORD_STAMP'

function calculateHTMLScale (el) {
  const srcwidth = el.scrollWidth
  return LETTER_WIDTH_72DPI / srcwidth / window.devicePixelRatio / 1.45
}

export default {
  name: 'DocumentPage',
  components: {
    PageTemplate,
    PageContainer,
    ContentEditor,
    LoadMenu,
  },
  props: ['id', 'slug'],
  data() {
    return {
      docs: docs,
      recno: this.id || this.makeRecno(),
      seal: this.getInitialSealValue(),
      stamp: this.getInitialStampValue(),
      content: '',
      isEditorActive: false,
      isLoadMenuOpen: false,
    }
  },
  computed: {
    sealButtonLabel () {
      switch(this.seal) {
        case 'color':
          return 'Color'
        case 'bw':
          return 'B/W'
        case 'none':
        default:
          return 'Off'
      }
    },
    stampButtonLabel () {
      return this.stamp ? 'On' : 'Off'
    },
  },
  methods: {
    getInitialSealValue: function () {
      if (localStorageAvailable()) {
        // Value is null if it doesn't exist
        // in that case, return 'color'
        const val = localStorage.getItem(FBC_RECORD_SEAL)
        if (val !== null) return val
        else return 'color'
      } else {
        // No localstorage, return default value
        return 'color'
      }
    },
    getInitialStampValue: function () {
      if (localStorageAvailable()) {
        // This should be a boolean value but is stored as a string
        // Is false if value doesn't already exist, which is fine
        return (localStorage.getItem(FBC_RECORD_STAMP) === 'true')
      } else {
        // No localstorage, generate a random value
        return Math.random() < 0.5 
      }
    },
    handleLoad: function () {
      this.isLoadMenuOpen = !this.isLoadMenuOpen
    },
    handleEdit: function () {
      // TODO: opens an editor which reads from this.content, and sets this value
      this.isEditorActive = true
    },
    handleNew: function () {
      if (window.confirm('Are you sure you want to clear this document?')) {
        // Preserve seal type, only reset stamp
        this.stamp = false
        this.$router.push('/new')
        this.content = ''
        this.recno = this.makeRecno() // Assign a new recno
        if (localStorageAvailable()) {
          localStorage.setItem(FBC_RECORD_STAMP, this.stamp)
        }
      }
    },
    handlePrint: function () {
      window.print()
    },
    handleExportPDF: function () {
      const doc = new jsPDF()
      const el = document.getElementById('page')

      doc.html(el, {
        callback: function (doc) {
          doc.save()
        },
        html2canvas: {
          scale: calculateHTMLScale(el)
        },
        filename: `NAR${this.recno}.pdf`,
      })
    },
    handleToggleSeal: function () {
      switch (this.seal) {
        case 'color':
          this.seal = 'bw'
          break
        case 'bw':
          this.seal = 'none'
          break
        case 'none':
          this.seal = 'color'
          break
        default:
          this.seal = 'color'
          break
      }
      if (localStorageAvailable()) {
        localStorage.setItem(FBC_RECORD_SEAL, this.seal)
      }
    },
    handleToggleStamp: function () {
      this.stamp = !this.stamp
      if (localStorageAvailable()) {
        localStorage.setItem(FBC_RECORD_STAMP, this.stamp)
      }
    },
    loadSelected: function (opt) {
      this.isLoadMenuOpen = false
      this.$router.push(`/document/${opt.recno}/${this.makeSlug(opt)}`)
      window.fetch(`/docs/${opt.filename}`)
        .then((response) => response.text())
        .then((content) => {
          this.content = content
          this.recno = opt.recno
        })
    },
    closeMenu: function () {
      this.isLoadMenuOpen = false
    },
    // Should be a fallback of last resort
    makeRecno: function () {
      return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
    },
    makeSlug: function (doc) {
      return slugify(`${doc.code} ${doc.label}`, {
        lower: true,
        strict: true,
      })
    },
  },
  mounted() {
    let fileIndex

    // If this is the new route, do a clear page.
    if (this.$route.path === '/new') {
      this.content = ''
      return
    }

    // If an ID is provided, look it up. If not found, push 404 page
    if (this.id && typeof this.id === 'string') {
      fileIndex = docs.findIndex(d => d.recno === this.id)
      if (fileIndex === -1) {
        this.$router.push({
          name: 'NotFound',
          // preserve current path and remove the first char to avoid the target URL starting with `//`
          params: { pathMatch: this.$route.path.substring(1).split('/') },
          // preserve existing query and hash if any
          query: this.$route.query,
          hash: this.$route.hash,
        })
      }
    } else {
      // If no ID is provided (raw URL), show a random doc
      fileIndex = Math.floor(Math.random() * docs.length)
    }
    // If ID is provided and doc is found, display it + route to proper URL
    if (fileIndex && fileIndex !== -1) {
      const doc = docs[fileIndex]
      window.fetch(`/docs/${doc.filename}`)
        .then((response) => response.text())
        .then((content) => {
          this.content = content
          this.recno = doc.recno
        })
    }
  },
  directives: {
    closable
  }
}
</script>

<style scoped>
.controls {
  margin-bottom: 0.5em;
  font-size: 11px;
}

@media only print {
  .controls {
    display: none;
  }
}

@media only screen and (min-width: 768px) {
  .controls {
    font-size: 13px;
  }
}
</style>
