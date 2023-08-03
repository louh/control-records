<template>
  <img
    src="../assets/stamp.png"
    class="stamp"
    :style="style"
    alt="Record copy stamp"
    draggable="false"
  />
</template>

<script>
export default {
  computed: {
    style: function () {
      const left = Math.random() * (72 - 3) + 3
      const inUpper = Math.random() < 0.5
      const top = inUpper
        ? Math.random() * (22 - 8) + 8
        : Math.random() * (84 - 72) + 72
      const rotate = Math.random() * 95 - 35

      return `
        left: ${left}%;
        top: ${top}%;
        transform: rotate(${rotate}deg);
      `
    }
  },
}
</script>

<style scoped>
  .stamp {
    position: absolute;
    width: 22%;
    opacity: 1;
    left: 25%;
    top: 9%;
    transform: rotate(-11deg);
    user-select: none;
    pointer-events: none;
  }
</style>
