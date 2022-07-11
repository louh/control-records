<template>
  <footer>
    A fan project inspired by
    <a href="https://www.remedygames.com/games/control/" target="_blank" rel="noreferer noopener">Control</a>, a game by Remedy Entertainment.
    <span>Built by <a href="https://louhuang.com/" target="_blank" rel="noreferer noopener">Lou Huang</a>.</span>
    <span>&nbsp;<a href="https://github.com/louh/control-records/" target="_blank" rel="noreferer noopener">Source code</a></span>
  </footer>
</template>

<style scoped>
footer {
  margin-top: 1.5em;
  margin-left: 1em;
  text-align: right;
  color: #777;
}

footer a,
footer a:visited {
  color: #444;
}

footer a:hover,
footer a:active {
  color: #777;
}

footer span {
  white-space: nowrap;
}

@media only print {
  footer {
    display: none;
  }
}
</style>
