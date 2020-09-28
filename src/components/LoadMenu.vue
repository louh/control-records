<template>
  <div class="menu">
    <ul>
      <li
        v-for="item in sortedItems"
        :key="item.label + '|' + item.code"
        @click="handleSelect(item)"
        tabindex="0"
      >
        {{ item.label }} <span>({{ item.code }})</span>
      </li>
    </ul>
  </div>
</template>

<script>
function compare (a, b) {
  if (a.label < b.label) {
    return -1
  }
  if (a.label > b.label) {
    return 1
  }
  return 0
}

export default {
  props: {
    items: {
      default: () => [],
      type: Array
    },
  },
  computed: {
    sortedItems: function () {
      return this.items.slice().sort(compare)
    }
  },
  methods: {
    handleSelect: function (item) {
      this.$emit('change', item)
    }
  },
}
</script>

<style scoped>
.menu {
  position: absolute;
  z-index: 1;
  width: calc(100% - 20px);
  max-height: calc(100vh - 160px);
  background-color: #f2f3f7;
  border: 1px solid darkgray;
  border-radius: 3px;
  padding: 0.5em 0;
  margin-top: -0.5em;
  color: #333;
  font-family: 'OCR F OT', sans-serif;
  -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  overflow-x: hidden;
  overflow-y: auto;
}

.menu ul {
  padding: 0;
  margin: 0;
}

.menu li {
  list-style-type: none;
  padding: 0.35em 1em;
  cursor: pointer;
}

.menu li:focus,
.menu li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.menu span {
  opacity: 0.5;
}

@media only screen and (min-width: 500px) {
  .menu {
    max-width: 300px;
    max-height: min(calc(100vh - 160px), 600px);
  }
}
</style>