<template>
  <div
    id="page"
    class="paper"
    :class="{ 'paper-a4': paperSize === 'a4' }"
  >
    <div class="contents">
      <header>
        <HeaderBox :recno="recno" />
        <img
          v-if="seal === 'color'"
          src="../assets/fbc-seal-color.png"
          alt=""
          draggable="false"
        >
        <img
          v-if="seal === 'bw'"
          src="../assets/fbc-seal-bw.svg"
          alt=""
          draggable="false"
        >
      </header>
      <div class="body">
        <PageBodyContent :content="content" />
      </div>
      <footer>
        <div>
          {{ classification }}
        </div>
        <div>
          Federal Bureau of Control, New York City, New York
        </div>
        <div>
          (1) Document Archive RECNO: NAR{{ recno }}
        </div>
      </footer>
    </div>
    <CopyStamp v-if="stamp" />
  </div>
</template>

<script>
import HeaderBox from './HeaderBox.vue'
import PageBodyContent from './PageBodyContent.vue'
import CopyStamp from './CopyStamp.vue'

export default {
  components: {
    HeaderBox,
    PageBodyContent,
    CopyStamp,
  },
  props: {
    recno: {
      type: String,
      required: true
    },
    seal: {
      type: String,
      default: 'color',
    },
    stamp: {
      type: Boolean,
      default: false,
    },
    paperSize: {
      type: String,
      default: 'letter',
    },
    content: {
      type: String,
      default: '',
    },
    classification: {
      type: String,
      default: ''
    }
  },
}
</script>

<style scoped>
  .paper {
    width: 100%;
    padding-bottom: calc(11 / 8.5 * 100%);
    background-color: white;
    -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .paper-a4 {
    padding-bottom: calc(297 / 210 * 100%);
  }

  @media only print {
    .paper {
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }
  }

  .contents {
    /* 
      How margins are calculated:

      The original margins used pica measurements on 8.5x11 (US Letter) paper.
      We divide the original measurements by 6p to get the size in inches, then
      multiply by 72dpi (the default conversion of inches to pixels for screens),
      to get the pixel width. A 8.5" page will display at 612 pixels wide at 72dpi,
      but we also want a responsive layout, so we need to convert the pixels to a
      percentage value. So we divide the pixel width by 612px and multiply by 100%
      to get the percentage value.

      Vertical percentages are based on the element's _horizontal_ measurement so
      we also use the width, not the height, of the element, to calculate vertical
      quantities like the top and bottom margins.
    */
    --side-margin: calc(5 / 6 * 72 / 612 * 100%);
    --top-bottom-margin: calc(3 / 6 * 72 / 612 * 100%);
    --ocr-font-size: min(12px, calc(7 / 612 * 100 * 1vw));
    --body-font-size: min(20px, calc(11.5 / 612 * 100 * 1vw));

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: var(--top-bottom-margin) var(--side-margin);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    font-size: var(--body-font-size);
    text-align: left;
  }

  .body {
    flex-grow: 1;
    overflow: hidden;

    /* Small buffer on left side to allow skewed black highlighter effect
    from getting visually cropped */
    padding-left: 5px;
    margin-left: -5px;
  }

  header {
    margin-bottom: 20%;
    margin-top: 5%;
    font-family: 'OCR F OT', monospace;
    font-size: var(--ocr-font-size);
  }

  header img {
    position: absolute;
    top: calc(var(--top-bottom-margin) - 1em);
    right: var(--side-margin);
    width: calc(9.75 / 6 * 72 / 612 * 100%);
    height: auto;
    user-select: none;
    pointer-events: none;
  }

  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5%;
    font-family: 'OCR F OT', monospace;
    font-size: var(--ocr-font-size);
  }
</style>
