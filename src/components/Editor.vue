<template>
  <div class="editor" :class="{ visible: isActive }">
    <div class="dialog">
      <h2>Content editor</h2>
      <p>Use <a href="https://www.markdownguide.org/basic-syntax" target="_blank" rel="noopener noreferer">Markdown syntax</a> to write text. Note: use "italic" for underline, and "strikethrough" for redacted text.</p>
      <div class="body">
        <v-md-editor
          v-model="editedContent"
          mode="edit"
          left-toolbar="h bold italic strikethrough"
          right-toolbar="undo redo clear"
          height="500px"
        />
      </div>
      <div class="controls">
        <button @click="handleCancel">Cancel</button>
        <button @click="handleConfirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isActive: {
      default: false,
      type: Boolean
    },
    content: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      editedContent: this.content
    }
  },
  methods: {
    handleCancel: function () {
      this.$emit('update:isEditorActive', false)
    },
    handleConfirm: function () {
      this.$emit('update:content', this.editedContent)
      this.$emit('update:isEditorActive', false)
    },
  }
}
</script>

<style scoped>
.editor {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  display: none;
  z-index: 2;
}

.editor.visible {
  display: flex;
}

.dialog {
  background-color: white;
  -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  width: 100%;
  margin: 20px;
  max-width: 600px;
  max-height: 800px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1em 2em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog p {
  margin-top: 0;
  line-height: 1.4;
}

.controls {
  margin-top: 2em;
  text-align: center;
}

.body {
  flex-grow: 1;
}

.v-md-editor {
  box-shadow: none;
  border: 1px solid #ddd;
}
</style>

<style>
.v-md-editor__tooltip {
  font-family: Helvetica;
  font-size: 13px;
  padding: 0.75em 1em;
  background-color: rgba(0,0,0,.75);
}

/* Override v-md-editor's word-break override */
.v-md-editor .codemirror-wrapper .CodeMirror pre {
  word-break: normal !important;
}

.v-md-editor .codemirror-wrapper .cm-header,
.v-md-editor .codemirror-wrapper .cm-link,
.v-md-editor .codemirror-wrapper .cm-url {
  color: #222 !important;
}

/* Style text to mimic render.
Note that <del> does not have wrapping tags to style */
.cm-em {
  font-style: normal !important;
  text-decoration: underline;
}

.cm-header-2,
.cm-header-3,
.cm-header-4,
.cm-header-5,
.cm-header-6 {
  text-decoration: underline;
}
</style>
