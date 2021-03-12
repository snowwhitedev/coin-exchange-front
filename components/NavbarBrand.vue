<template>
  <a
    @click.prevent="$router.push(localeRoute('/trade/BTC_USDT'))"
    class="navbar-brand"
  >
    <img src="~/assets/images/logo.svg" alt="" />
  </a>
</template>

<style lang="scss" scoped>
.navbar-brand {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 125px;
}
</style>
