<template>
  <div style="background-color: #fafafa">
    <a-breadcrumb
      v-if="!isMobile"
      class="breadcrumb"
      style="margin-top: 20px; margin-left: 20px"
    >
      <nuxt-link :to="localePath('/my/wallet/main-wallet')">
        <a-breadcrumb-item @click="SET_CURRENT_TAB('MainWallet')">
          Ana Cüzdan</a-breadcrumb-item
        >
      </nuxt-link>
      <a-breadcrumb-item>Yatırma</a-breadcrumb-item>
    </a-breadcrumb>

    <a-row style="margin-bottom: 20px">
      <a-col :offset="1" :span="23" style="text-align: start">
        <div class="Roboto-Regular" style="font-size: 32px; color: #1c2640">
          {{ $t('deposit_title') }}
        </div>
      </a-col>
    </a-row>

    <a-row :class="!isMobile ? 'main-row' : 'main-row-mobile'">
      <Asset @change="changeAsset" :transactionType="'deposit'" />
      <Network
        :style="responsiveStyleBelowNineHundredPixels"
        :networkTitle="$t('deposit_network')"
        :networkType="'deposit'"
      />
    </a-row>
    <a-row style="margin-top: 20px; margin-bottom: 20px">
      <MainWalletHistory
        v-if="!isMobile"
        historyType="DEPOSIT"
        :historyData="DEPOSIT_HISTORY"
        :title="$t('deposit_history')"
      />
      <MainWalletHistoryMobile
        v-if="isMobile"
        historyType="DEPOSIT"
        :historyData="DEPOSIT_HISTORY"
        :title="$t('deposit_history')"
      />
    </a-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Deposit',

  data: () => ({
    windowWidth: null,
    isMobile: null,
  }),

  asyncData({ app, params, redirect }) {
    if (!params.asset) {
      redirect(app.localeRoute('/my/wallet/main-wallet/deposit/BTC'))
    }
  },
  computed: {
    ...mapGetters({
      USER_BALANCE: 'mainwallet/USER_BALANCE',
      DEPOSIT_HISTORY: 'mainwallet/DEPOSIT_HISTORY',
    }),

    responsiveStyleBelowNineHundredPixels() {
      if (this.windowWidth < 990) {
        return 'margin-top: 50px'
      } else {
        return ''
      }
    },
  },

  mounted() {
    this.isMobile = window.innerWidth < 1000

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1000
      this.windowWidth = window.innerWidth
    })
  },

  methods: {
    ...mapMutations({
      SET_ASSETS: 'swap/SET_ASSETS',
      SET_CURRENT_TAB: 'wallet/SET_CURRENT_TAB',
    }),
    changeAsset(val) {
      const path = this.$route.path
      const pathSplit = path.split('/')
      if (pathSplit[pathSplit.length - 1] !== '') {
        pathSplit[pathSplit.length - 1] = val.toLowerCase()
      } else {
        pathSplit[pathSplit.length - 2] = val.toLowerCase()
      }

      const newPath = pathSplit.join('/')
      history.pushState({}, null, newPath)
    },
  },
}
</script>

<style scoped>
.main-row {
  background: #ffffff 0 0 no-repeat padding-box;
  box-shadow: 0 0 6px #0000000a;
  opacity: 1;
  padding-top: 50px;
  padding-bottom: 50px;
  margin-left: 40px;
  margin-right: 80px;
}

.main-row-mobile {
  background: #ffffff 0 0 no-repeat padding-box;
  box-shadow: 0 0 6px #0000000a;
  opacity: 1;
  padding-top: 50px;
  padding-bottom: 50px;
}

.breadcrumb {
  font-size: 12px;
  padding-bottom: 20px;
}
</style>
