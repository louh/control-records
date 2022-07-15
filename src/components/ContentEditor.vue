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
      <div class="record-input">
        <label>Record number:</label>
        <div class="record-input-control">
          <span>NAR</span>
          <input v-model="editedRecno" maxlength="9" @input="handleRecnoChange" />
        </div>
        <button @click="handleGenerateRecno">Generate a new record number</button>
      </div>
      <div class="errors">
        <p v-for="error in errors" :key="error">Error: {{error}}</p>
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
      type: Boolean,
    },
    content: {
      default: '',
      type: String,
    },
    recno: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      editedContent: this.content,
      editedRecno: this.recno,
      errors: [],
    }
  },
  methods: {
    handleCancel: function () {
      this.$emit('update:isEditorActive', false)
      // Reset edited recno
      this.editedRecno = this.recno
      this.errors = []
    },
    handleConfirm: function () {
      this.errors = []
      if (this.editedRecno.length !== 9 || !this.editedRecno.match(/[0-9]{9}/)) {
        this.errors.push('Record number must be a nine-digit number')
      }

      if (this.errors.length === 0) {
        this.$emit('update:content', this.editedContent)
        this.$emit('update:recno', this.editedRecno)
        this.$emit('update:isEditorActive', false)
      }
    },
    handleRecnoChange: function () {
      this.errors = []
    },
    handleGenerateRecno: function () {
      this.editedRecno = this.generateRecno()
      this.errors = []
    },
    generateRecno: function () {
      return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
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
  max-width: 800px;
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
  margin-bottom: 1em;
}

.v-md-editor {
  box-shadow: none;
  border: 1px solid #ddd;
}

.record-input {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.record-input label {
  font-weight: bold;
}

.record-input-control {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 0.75em;
  margin-right: 0.75em;
  border: 1px solid darkgray;
  border-radius: 3px;
  padding: 0.25em 0.25em 0.25em 0.5em;
  color: #888;
  font-family: 'OCR F OT', sans-serif;
}

.record-input-control input {
  appearance: none;
  border: 0;
  width: 120px;
  height: 100%;
  margin-left: 0.2em;
  padding: 0.25em 0.5em 0.25em 0.1em;
  color: #333;
  font-family: 'OCR F OT', sans-serif;
  font-size: inherit;
}

.record-input button {
  flex-grow: 1;
  margin-bottom: 0;
}

.errors {
  margin-top: 1em;
}

.errors p {
  font-weight: bold;
  color: #e00000;
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
