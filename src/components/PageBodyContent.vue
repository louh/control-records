<template>
  <div class="content" v-html="parsedMarkdown"></div>
</template>

<script>
import { marked } from 'marked'
import { markedSmartypants } from 'marked-smartypants'
import DOMPurify from 'dompurify'

export default {
  props: {
    content: {
      default: '',
      type: String
    }
  },
  computed: {
    parsedMarkdown: function () {
      marked.use(markedSmartypants())
      marked.setOptions({
        breaks: true
      })

      // DOMPurify prevents people from typing in custom HTML etc
      // Also prevent some Markdown things that don't belong on the record,
      // like links and images (maybe we support images later some other way)
      const html = DOMPurify.sanitize(marked(this.content), {
        ALLOWED_TAGS: [
          'b', 'i', 'em', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5',
          'h6', 'br', 'p', 'del', 'ul', 'li', 'blockquote'
        ]
      })

      // Some logs can have a redacted thing followed by a possessive
      // apostrophe. The "smart quote" created by marked is facing the wrong
      // direction. This looks for a smart quote facing the wrong direction
      // immediately following an HTML tag and "flips" it the other way.
      const fixedHtml = html.replace(/>‘/g, '>’')

      return fixedHtml
    }
  }
}
</script>

<!-- not scoped because the elements we want to style are dynamically generated -->
<style>
.content {
  /* Allows tiny gap between redacted boxes */
  line-height: 1.25;
}

.content del {
  position: relative;
  background-color: black;
  color: transparent;
  /* Non-standard preservation of background colors for redaction,
    should work in most newer browsers, but not in IE */
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  user-select: none;
  /* Match black highlighter experience with game */
  transform: skew(-5deg);
  display: inline-block;
  border-radius: 0.125em;
  /* Need a gap between lines */
  line-height: 1.2em;
}

.content h1 {
  font-size: 1.75em;
}

.content h2, h3, h4, h5, h6 {
  font-size: 1em;
  font-weight: normal;
  margin-top: 2em;
  text-transform: uppercase;
  text-decoration: underline;
}

.content i, .content em {
  font-style: normal;
  text-decoration: underline;
}
</style>
