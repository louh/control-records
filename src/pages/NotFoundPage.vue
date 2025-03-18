<template>
  <PageTemplate>
    <template #default>
      <div class="not-found-content">
        <p>
          <strong>Warning: The requested page was not found in the FBC records system.</strong>
        </p>
        <p>
          System Error Code: 404
        </p>
        <p>
          <router-link to="/">
            Return home.
          </router-link>
        </p>
      </div>
    </template>
  </PageTemplate>
</template>

<script>
import PageTemplate from './PageTemplate.vue'

export default {
  name: 'NotFoundPage',
  components: {
    PageTemplate
  },
}
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  /* Height calculation based on <body> margin */
  height: calc(100vh - 80px);
}
</style>

<style scoped>
.not-found-content {
  flex-grow: 1;
}
</style>
