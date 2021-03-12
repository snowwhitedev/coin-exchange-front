<template>
  <a-card class="value-card">
    <h2 class="value-card-title">
      {{ formatPrice(value) }}
    </h2>
  </a-card>
</template>

<script>
    import formatter from "~/Mixins/formatter"

export default {
  mixins: [formatter],
  props: {
    value: {
      type: String,
      default: 0,
    },
  },
}
</script>

<style lang="scss">
.value-card {
  display: flex;
  justify-content: center;
  align-items: center;

  .ant-card-body {
    padding: 1rem;
  }

  &-title {
    color: var(--value-card-color);
    margin: 0;
    height: 31.5px;
  }
}
</style>
