<template>
  <div class="container-404">
    <div class="contianer-404-content text-center">
      <h1 class="Roboto-Regular">
        <a-icon type="warning" />
        Sorry, The page you're looking for is not found
      </h1>
      <a-button
        class="Roboto-Regular"
        type="primary"
        size="large"
        @click="$router.push(localeRoute('/trade/BTC_USDT'))"
      >
        Return to home page
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
}
</script>

<style scoped>
.container-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
}
</style>
