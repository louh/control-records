<template>
  <div class="box">
    <div class="image">
      <img
        src="../assets/control.svg"
        alt=""
        draggable="false"
      >
    </div>
    <div class="text">
      <span>FBC DOCUMENTREC</span>
      <span>#NAR{{ recno }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recno: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.box {
  --header-box-border: min(2px, 0.20vw) solid black;

  display: flex;
  flex-direction: row;
  width: calc(11 / 6 * 72 / 612 * 100%);
  border: var(--header-box-border);
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  background-color: black;
  border-right: var(--header-box-border);
  /* Non-standard preservation of background colors for redaction,
  should work in most newer browsers, but not in IE */
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
}

.image img {
  /* fix sizing in edge */
  width: 100%;
}

.text {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.text > span {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
}

.text > span:first-child {
  border-bottom: var(--header-box-border);
}
</style>
