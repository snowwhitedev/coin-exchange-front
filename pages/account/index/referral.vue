<template>
  <div class="reference">
    <div class="header">
      <div>
        <h1>Arkadaşlarınızı Davet Edin. Birlikte - Kazanın</h1>
        <span>
          Arkadaşlarınız her alım satım yaptığında %25 referans geliri kazanın.
        </span>
      </div>
    </div>

    <infos class="infos" />

    <reference class="references" />
  </div>
</template>

<script>
export default {
  name: 'Reference',
  components: {
    infos: () => import('@/components/Reference/infos'),
    reference: () => import('@/components/Reference/referenceHistory'),
  },
}
</script>

<style lang="scss" scoped>
.reference {
  background-color: #f5f6f7;
}

.header {
  h1 {
    color: white !important;
  }
  width: 100%;
  color: white;
  height: 328px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: white;
  background: linear-gradient(
      to bottom,
      rgb(18, 57, 102),
      rgba(28, 36, 62, 0.73)
    ),
    url('../../../assets/images/Mask Group 15.svg');
  @media (max-width: 1000px) {
    margin-bottom: 200px;
    padding: 23px;
  }
}
.infos {
  margin-bottom: 10px;
  background-color: white;
}
.references {
  @media (max-width: 1000px) {
    margin-top: 230px;
  }
}
</style>
