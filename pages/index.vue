<template>
  <div>home</div>
</template>

<script>
export default {
  middleware({ app, redirect }) {
    redirect(app.localeRoute('/trade/BTC_USDT'))
  },
}
</script>
