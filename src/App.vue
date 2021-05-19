<template>
  <main class="container">
    <h1>Federal Bureau of Control / Records Archive System</h1>
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
      <button @click="handleToggleSeal">Toggle seal: {{ seal }}</button>
      <button @click="handleToggleStamp">Toggle copy stamp: {{ stamp ? 'On' : 'Off' }}</button>
    </div>
    <Page :recno="recno" :seal="seal" :stamp="stamp" :content="content"></Page>
    <footer>
      A fan project inspired by
      <a href="https://www.remedygames.com/games/control/" target="_blank" rel="noreferer noopener">Control</a>, a game by Remedy Entertainment.
      <span>Built by <a href="https://louhuang.com/" target="_blank" rel="noreferer noopener">Lou Huang</a>.</span>
      &nbsp;
      <span><a href="https://github.com/louh/control-records/" target="_blank" rel="noreferer noopener">Source code</a></span>
    </footer>
    <Editor
      :key="content"
      :isActive="isEditorActive"
      v-on:update:isEditorActive="isEditorActive = $event"
      :content="content"
      v-on:update:content="content = $event"
    ></Editor>
  </main>
</template>

<script>
import { jsPDF } from 'jspdf'
import Page from './components/Page'
import Editor from './components/Editor'
import LoadMenu from './components/LoadMenu'
import docs from './docs.json'

const LETTER_WIDTH_72DPI = 612 // pixels

function calculateHTMLScale (el) {
  const srcwidth = el.scrollWidth
  return LETTER_WIDTH_72DPI / srcwidth / window.devicePixelRatio / 1.45
}

export default {
  name: 'App',
  components: {
    Page,
    Editor,
    LoadMenu,
  },
  data() {
    return {
      docs: docs,
      recno: Math.floor(Math.random() * 1000000000),
      seal: 'Color',
      stamp: Math.random() < 0.5,
      content: '',
      isEditorActive: false,
      isLoadMenuOpen: false,
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
        this.recno = Math.floor(Math.random() * 1000000000)
        this.stamp = false
        this.seal = 'Color'
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
        case 'Color':
          this.seal = 'B/W'
          break
        case 'B/W':
          this.seal = 'Off'
          break
        case 'Off':
          this.seal = 'Color'
          break
        default:
          this.seal = 'Color'
          break
      }
    },
    handleToggleStamp: function () {
      this.stamp = !this.stamp
    },
    loadSelected: function (opt) {
      this.isLoadMenuOpen = false
      window.fetch(`/docs/${opt.filename}`)
        .then((response) => response.text())
        .then((content) => {
          this.content = content
        })
    },
    closeMenu: function () {
      this.isLoadMenuOpen = false
    }
  },
  mounted() {
    const fileIndex = Math.floor(Math.random() * docs.length)
    window.fetch(`/docs/${docs[fileIndex].filename}`)
      .then((response) => response.text())
      .then((content) => {
        this.content = content
      })
  }
}
</script>

<style>
@font-face {
  font-family: 'OCR F OT';
  src: url('/fonts/ocrfot/OCRFOT.woff2') format('woff2'),
       url('/fonts/ocrfot/OCRFOT.woff') format('woff'),
       url('/fonts/ocrfot/OCRFOT.ttf') format('truetype');
}

@font-face {
  font-family: 'Helvetica Neue';
  font-weight: normal;
  src: local('Helvetica Neue'),
       url('/fonts/helvetica-neue/HelveticaNeue.woff2') format('woff2'),
       url('/fonts/helvetica-neue/HelveticaNeue.woff') format('woff'),
       url('/fonts/helvetica-neue/HelveticaNeue.ttf') format('truetype');
}

@font-face {
  font-family: 'Helvetica Neue';
  font-weight: bold;
  src: local('Helvetica Neue Bold'),
       url('/fonts/helvetica-neue/HelveticaNeue-Bold.woff2') format('woff2'),
       url('/fonts/helvetica-neue/HelveticaNeue-Bold.woff') format('woff'),
       url('/fonts/helvetica-neue/HelveticaNeue-Bold.ttf') format('truetype');
}

html {
  box-sizing: border-box;
  overflow-x: hidden;
}

html *,
html *::after,
html *::before {
  box-sizing: inherit;
}

body {
  background-color: #f2f3f7;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 20px;
  margin-bottom: 60px;
}

@media only screen and (min-width: 768px) {
  body {
    font-size: 16px;
  }
}

main {
  width: 95vw;
  max-width: 1000px;
  margin: 0 auto;
}

button {
  appearance: none;
  border: 1px solid darkgray;
  border-radius: 3px;
  padding: 0.5em 1em;
  margin-right: 1em;
  margin-bottom: 1em;
  background-color: transparent;
  cursor: pointer;
  color: #333;
  font-family: 'OCR F OT', sans-serif;
  font-size: inherit;
}

button:last-child {
  margin-right: 0;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* usually auto-hides page footer/header on print */
@page {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
}

@media only print {
  .controls {
    display: none;
  }
  main > h1 {
    display: none;
  }
  main {
    width: 100%;
    max-width: 100%;
  }
  footer {
    display: none;
  }
}
</style>

<style scoped>
footer {
  margin-top: 1.5em;
  margin-left: 1em;
  text-align: right;
  color: #777;
}

footer a,
footer a:visited {
  color: #444;
}

footer a:hover,
footer a:active {
  color: #777;
}

footer span {
  white-space: nowrap;
}

.controls {
  margin-bottom: 0.5em;
  font-size: 11px;
}

@media only screen and (min-width: 768px) {
  .controls {
    font-size: 13px;
  }
}
</style>
