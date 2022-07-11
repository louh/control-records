<template>
  <main class="container">
    <HeaderBlock />
    <slot></slot>
    <FooterBlock />
  </main>
</template>

<script>
import HeaderBlock from '../components/HeaderBlock.vue'
import FooterBlock from '../components/FooterBlock.vue'

export default {
  name: 'PageTemplate',
  components: {
    HeaderBlock,
    FooterBlock
  },
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
  main {
    width: 100%;
    max-width: 100%;
  }
}
</style>

