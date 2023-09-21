<template>
  <div class="container">
    <h4 v-if="error.statusCode === 404"><b>Ошибка 404. Нет такой страницы</b></h4>
    <h4 v-else><b>An error occurred</b></h4>
    <a href="/" class="nuxt-link-active">На главную</a>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // you can set a custom layout for the error page
}
</script>
