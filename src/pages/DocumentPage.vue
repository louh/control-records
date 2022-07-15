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
        <button @click="handleReset">Reset</button>
        <button @click="handlePrint">Print</button>
        <!-- button @click="handleExportPDF">Export PDF (beta)</button -->
        <button @click="handleToggleSeal">Toggle seal: {{ sealButtonLabel }}</button>
        <button @click="handleToggleStamp">Toggle copy stamp: {{ stampButtonLabel }}</button>
      </div>
      <PageContainer :recno="id || recno" :seal="seal" :stamp="stamp" :content="content"></PageContainer>
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
import PageContainer from '../components/PageContainer.vue'
import ContentEditor from '../components/ContentEditor.vue'
import LoadMenu from '../components/LoadMenu.vue'
import PageTemplate from './PageTemplate.vue'
import docs from '../docs.json'

const LETTER_WIDTH_72DPI = 612 // pixels

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
      recno: this.makeRecno(),
      seal: 'color',
      stamp: Math.random() < 0.5,
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
    }
  },
  methods: {
    handleLoad: function () {
      this.isLoadMenuOpen = !this.isLoadMenuOpen
    },
    handleEdit: function () {
      // TODO: opens an editor which reads from this.content, and sets this value
      this.isEditorActive = true
    },
    handleReset: function () {
      if (window.confirm('Are you sure you want to reset this document?')) {
        this.recno = this.makeRecno()
        this.stamp = false
        this.seal = 'color'
        this.$router.push('/document/157318435/ai83-ke-typewritten-page-procedures')
        window.fetch('/docs/ai83-ke-procedures.md')
          .then((response) => response.text())
          .then((content) => {
            this.content = content
          })
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
    },
    handleToggleStamp: function () {
      this.stamp = !this.stamp
    },
    loadSelected: function (opt) {
      this.isLoadMenuOpen = false
      this.$router.push(`/document/${opt.recno}/${this.makeSlug(opt)}`)
      window.fetch(`/docs/${opt.filename}`)
        .then((response) => response.text())
        .then((content) => {
          this.content = content
          // Reset NAR on loading new content
          this.recno = this.makeRecno()
        })
    },
    closeMenu: function () {
      this.isLoadMenuOpen = false
    },
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
      fileIndex = Math.floor(Math.random() * docs.length)
    }
    if (fileIndex && fileIndex !== -1) {
      window.fetch(`/docs/${docs[fileIndex].filename}`)
        .then((response) => response.text())
        .then((content) => {
          this.content = content
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
