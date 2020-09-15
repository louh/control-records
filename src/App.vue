<template>
  <main class="container">
    <h1>Federal Bureau of Control / Records <sup class="beta">beta</sup></h1>
    <div class="controls">
      <button @click="handleEdit">Edit</button>
      <button @click="handleReset">Reset</button>
      <button @click="handlePrint">Print</button>
      <!-- button @click="handleExportPDF">Export PDF (beta)</button -->
      <button @click="handleToggleSeal">Toggle seal: {{ seal }}</button>
    </div>
    <Page :recno="recno" :seal="seal" :content="content"></Page>
    <footer>
      A fan project inspired by
      <a href="https://www.remedygames.com/games/control/" target="_blank" rel="noreferer noopener">Control</a>, a game by Remedy Entertainment.
      Built by <a href="https://louhuang.com/" target="_blank" rel="noreferer noopener">Lou Huang</a>.
      <a href="https://github.com/louh/control-records/" target="_blank" rel="noreferer noopener">Source code</a>
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

const LETTER_WIDTH_72DPI = 612 // pixels

function calculateHTMLScale (el) {
  const srcwidth = el.scrollWidth
  return LETTER_WIDTH_72DPI / srcwidth / window.devicePixelRatio / 1.45
}

export default {
  name: 'App',
  components: {
    Page,
    Editor
  },
  data() {
    return {
      recno: Math.floor(Math.random() * 1000000000),
      seal: 'Color',
      content: '',
      isEditorActive: false
    }
  },
  methods: {
    handleEdit: function () {
      // TODO: opens an editor which reads from this.content, and sets this value
      this.isEditorActive = true
    },
    handleReset: function () {
      if (window.confirm('Are you sure you want to reset this document?')) {
        this.recno = Math.floor(Math.random() * 1000000000)
        this.seal = 'Color'
        window.fetch('/docs/ai83-ke.md')
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
    }
  },
  mounted() {
    window.fetch('/docs/ai63-ke.md')
      .then((response) => response.text())
      .then((content) => {
        this.content = content
      })
  }
}
</script>

<style>
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

footer {
  margin-top: 1em;
  text-align: right;
  color: #333;
}

footer a,
footer a:visited {
  color: #333;
}

footer a:hover,
footer a:active {
  color: #666;
}

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

.beta {
  text-transform: uppercase;
  font-weight: normal;
  letter-spacing: 0.05em;
  color: #868686;
  text-decoration: none;
  font-size: 0.5em;
}

.controls {
  margin-bottom: 0.5em;
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
