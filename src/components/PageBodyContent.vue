<template>
  <div class="content" v-html="parsedMarkdown"></div>
</template>

<script>
import marked from 'marked'
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
      marked.setOptions({
        breaks: true,
        headerIds: false,
        smartypants: true,
      })

      // DOMPurify prevents people from typing in custom HTML etc
      // Also prevent some Markdown things that don't belong on the record,
      // like links and images (maybe we support images later some other way)
      return DOMPurify.sanitize(marked(this.content), {
        ALLOWED_TAGS: [
          'b', 'i', 'em', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5',
          'h6', 'br', 'p', 'del', 'ul', 'li', 'blockquote'
        ]
      })
    }
  },
}
</script>

<!-- not scoped because the elements we want to style are dynamically generated -->
<style>
.content del {
  position: relative;
  background-color: black;
  color: transparent;
  /* Non-standard preservation of background colors for redaction,
    should work in most newer browsers, but not in IE */
  --webkit-print-color-adjust: exact;
  color-adjust: exact;
  user-select: none;
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
