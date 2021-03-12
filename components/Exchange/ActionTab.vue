<template>
  <div class="h-100">
    <a-alert
      v-if="err.show"
      :description="err.msg"
      type="error"
      style="margin: 10px auto"
      closable
      @close="(e) => (err.show = false)"
    >
    </a-alert>
    <a-card class="action-card h-100">
      <div class="action-col">
        <div class="action-col__head">
          <h3 class="action-col__head-title Roboto-Bold">
            {{ getSymbolData.BaseAsset }} Al
          </h3>
          <div>
            <img src="~/assets/icons/wallet.svg" alt="wallet" />
            <span class="action-col__head-value Roboto-Regular">
              {{
                getSymbolData.QuatoAssetBalance
              }}
              {{ getSymbolData.QuatoAsset }}</span
            >
          </div>
        </div>
        <div class="action-col__body">
          <div
            v-if="ShowStop"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
            id="buyStopLimit"
          >
            <label class="Roboto-Regular">Stop:</label>
              <a-input-number
                class="no-focus-shadow Roboto-Regular"
                :class="{ 'invalid-input': buyForm.Stop <= 0 }"
                v-model.Number="buyForm.Stop"
              />
          </div>
          <div
            v-if="ShowLimit"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
          >
            <label class="Roboto-Regular">Limit:</label>
            <a-input-number
              class="no-focus-shadow Roboto-Regular"
              v-model.Number="buyForm.Limit"
            />
          </div>
          <div
            v-if="ShowPrice"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
            id="buyPrice"
          >
            <label class="Roboto-Regular">{{ $t('exchange_price') }}:</label>
              <a-input-number
                :disabled="Type === 'MARKET'"
                :placeholder="Type === 'MARKET' ? 'Piyasa' : ''"
                class="no-focus-shadow Roboto-Regular"
                :class="{ 'invalid-input': buyForm.Price <= 0 }"
                v-model.Number="buyForm.Price"
              />
          </div>
          <div
            class="action-col__body-item"
            :data-title="getSymbolData.BaseAsset"
            id="buyAmount"
          >
            <label class="Roboto-Regular">{{ $t('exchange_amount') }}:</label>
              <a-input-number
                class="no-focus-shadow Roboto-Regular"
                :class="{ 'invalid-input': isInvalidBuyAmount }"
                v-model.Number="buyForm.Quantity"
              />
          </div>
          <div
            v-if="isTotalShow"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
          >
            <label>{{ $t('exchange_total') }}:</label>
            <a-input class="no-focus-shadow" v-model.Number="buyForm.Total" />
          </div>
          <div class="action-col__body-item">
            <label class="Roboto-Regular"></label>
            <div class="percentage Roboto-Regular">
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(25, 'BUY') }"
                @click="calculatePercent(25, 'BUY')"
                >25%</span
              >
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(50, 'BUY') }"
                @click="calculatePercent(50, 'BUY')"
                >50%</span
              >
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(75, 'BUY') }"
                @click="calculatePercent(75, 'BUY')"
                >75%</span
              >
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(100, 'BUY') }"
                @click="calculatePercent(100, 'BUY')"
                >100%</span
              >
            </div>
          </div>
        </div>
        <div class="login-warning" v-if="!isLoggedIn">
          <div>
            <nuxt-link :to="localePath('/login')"> {{ $t('exchange_text_login') }} </nuxt-link>
            {{ $t('exchange_text_or') }}
            <nuxt-link :to="localePath('/signup')">
              {{ $t('exchange_text_signup') }}
            </nuxt-link>
            {{ $t('exchange_text_create') }}
          </div>
        </div>
        <div v-if="isLoggedIn">
          <a-button
            @click="trade('BUY')"
            type="success"
            class="w-100 action_buttons Roboto-Medium"
          >
            {{ getSymbolData.BaseAsset }} Al
          </a-button>
        </div>
      </div>
      <div class="action-col">
        <div class="action-col__head">
          <h3 class="action-col__head-title Roboto-Bold">
            {{ getSymbolData.BaseAsset }} Sat
          </h3>
          <div>
            <img src="~/assets/icons/wallet.svg" alt="" />
            <span class="action-col__head-value Roboto-Regular">
              {{
                getSymbolData.BaseAssetBalance
              }}
              {{ getSymbolData.BaseAsset }}</span
            >
          </div>
        </div>
        <div class="action-col__body">
          <div
            v-if="ShowStop"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
            id="sellStopLimit"
          >
            <label class="Roboto-Regular">Stop:</label>
              <a-input-number
                class="no-focus-shadow Roboto-Regular"
                :class="{ 'invalid-input': sellForm.Stop <= 0 }"
                v-model="sellForm.Stop"
              />
          </div>
          <div
            v-if="ShowLimit"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
          >
            <label class="Roboto-Regular">Limit:</label>
            <a-input-number
              class="no-focus-shadow Roboto-Regular"
              v-model="sellForm.Limit"
            />
          </div>
          <div
            v-if="ShowPrice"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
            id="sellPrice"
          >
            <label class="Roboto-Regular">{{ $t('exchange_price') }}:</label>
              <a-input-number
                :disabled="Type === 'MARKET'"
                :placeholder="Type === 'MARKET' ? 'Piyasa' : ''"
                class="no-focus-shadow Roboto-Regular"
                :class="{ 'invalid-input': sellForm.Price <= 0 }"
                v-model="sellForm.Price"
              />
          </div>
          <div
            class="action-col__body-item"
            :data-title="getSymbolData.BaseAsset"
            id="sellAmount"
          >
            <label class="Roboto-Regular">{{ $t('exchange_amount') }}:</label>
            <!--
            <a-tooltip
              :visible="isInvalidSellAmount"
              trigger="focus"
              :get-popup-container="() => getContainer('#sellAmount')"
            >
              <span slot="title">
                {{ invalidSellAmountMessage }}
              </span>
              -->
              <a-input-number
                class="no-focus-shadow Roboto-Regular"
                :class="{ 'invalid-input': isInvalidSellAmount }"
                v-model="sellForm.Quantity"
              />
            </a-tooltip>
          </div>
          <div
            v-if="isTotalShow"
            class="action-col__body-item"
            :data-title="getSymbolData.QuatoAsset"
          >
            <label class="Roboto-Regular">{{ $t('exchange_total') }}:</label>
            <a-input
              class="no-focus-shadow Roboto-Regular"
              v-model.Number="sellForm.Total"
            />
          </div>
          <div class="action-col__body-item">
            <label class="Roboto-Regular"></label>
            <div class="percentage Roboto-Regular">
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(25, 'SELL') }"
                @click="calculatePercent(25, 'SELL')"
                >25%</span
              >
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(50, 'SELL') }"
                @click="calculatePercent(50, 'SELL')"
                >50%</span
              >
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(75, 'SELL') }"
                @click="calculatePercent(75, 'SELL')"
                >75%</span
              >
              <span
                class="percentage__item"
                :class="{ percentage__item_active: getActiveItem(100, 'SELL') }"
                @click="calculatePercent(100, 'SELL')"
                >100%</span
              >
            </div>
          </div>
        </div>
        <div class="login-warning" v-if="!isLoggedIn">
          <div>
            <nuxt-link :to="localePath('/login')">
              {{ $t('exchange_text_login') }}
            </nuxt-link>
            {{ $t('exchange_text_or') }}
            <nuxt-link :to="localePath('/signup')">
              {{ $t('exchange_text_signup') }}
            </nuxt-link>
            {{ $t('exchange_text_create') }}
          </div>
        </div>
        <div v-if="isLoggedIn">
          <a-button
            @click="trade('SELL')"
            type="danger"
            class="action_buttons Roboto-Medium w-100"
          >
            {{ getSymbolData.BaseAsset }} Sat
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    UserBalance: {
      require: true,
      type: Object,
    },
    isTotalShow: {
      type: Boolean,
      default: true,
    },
    ShowPrice: {
      type: Boolean,
      default: true,
    },
    ShowStop: {
      type: Boolean,
      default: false,
    },
    ShowLimit: {
      type: Boolean,
      default: false,
    },
    Type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      buyForm: {
        Stop: '',
        Price: '',
        Quantity: '',
        Total: '',
      },
      sellForm: {
        Stop: '',
        Price: '',
        Quantity: '',
        Total: '',
      },
      err: {
        show: false,
        msg: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      getSymbolData: 'symbol/getSymbolData',
      getActionPrice: 'transactions/getActionPrice',
      getActionBuyTotal: 'transactions/getActionBuyTotal',
      getActionSellQuantity: 'transactions/getActionSellQuantity',
    }),
    isLoggedIn() {
      return !!this.$cookies.get('Token')
    },
    isInvalidBuyAmount() {
      const { QuatoAssetBalance, LastPrice } = this.getSymbolData
      if (QuatoAssetBalance === 0) {
        return true
      }
      return Number(this.buyForm.Quantity) > QuatoAssetBalance / LastPrice
    },
    invalidBuyAmountMessage() {
      const { QuatoAssetBalance, LastPrice } = this.getSymbolData
      if (
        this.buyForm.Quantity > QuatoAssetBalance / LastPrice &&
        QuatoAssetBalance !== 0
      ) {
        return `Max amount ${QuatoAssetBalance / LastPrice}`
      }
    },
    isInvalidSellAmount() {
      const { BaseAssetBalance } = this.getSymbolData
      if (BaseAssetBalance === 0) {
        return true
      }
      return Number(this.sellForm.Quantity) > BaseAssetBalance
    },
    invalidSellAmountMessage() {
      const { BaseAssetBalance } = this.getSymbolData
      if (BaseAssetBalance < this.sellForm.Quantity && BaseAssetBalance !== 0) {
        return `Max amount ${BaseAssetBalance}`
      }
    },
    isValidBuyForm() {
      if (this.Type === 'LIMIT') {
        if (this.buyForm.Price <= 0 || this.isInvalidBuyAmount) {
          return true
        } else {
          return false
        }
      }
      if (this.Type === 'MARKET') {
        this.buyForm.isInvalidBuyAmount ? true : false
      }
      if (this.Type === 'STOP-LIMIT') {
        if (
          this.buyForm.Price <= 0 ||
          this.buyForm.Stop <= 0 ||
          this.isInvalidBuyAmount
        ) {
          return true
        } else {
          return false
        }
      }
    },
    isValidSellForm() {
      if (this.Type === 'LIMIT') {
        if (this.sellForm.Price <= 0 || this.isInvalidSellAmount) {
          return true
        } else {
          return false
        }
      }
      if (this.Type === 'MARKET') {
        this.sellForm.isInvalidSellAmount ? true : false
      }
      if (this.Type === 'STOP-LIMIT') {
        if (
          this.sellForm.Price <= 0 ||
          this.sellForm.Stop <= 0 ||
          this.isInvalidSellAmount
        ) {
          return true
        } else {
          return false
        }
      }
    },
  },
  mounted() {
    const { LastPrice } = this.getSymbolData
    this.buyForm.Price = this.sellForm.Price = LastPrice
  },
  methods: {
    getContainer(id) {
      return document.querySelector(id)
    },
    async trade(side) {
      try {
        const { Symbol, LastPrice } = this.getSymbolData
        let payload
        if (side === 'BUY') {
          payload = {
            ...this.buyForm,
            Type: this.Type,
            Side: side,
            Symbol: Symbol,
          }
        }
        if (side === 'SELL') {
          payload = {
            ...this.sellForm,
            Type: this.Type,
            Side: side,
            Symbol: Symbol,
          }
        }

        const {
          $axios,
          $cookies,
          $config: { FINANCE_API_URL },
        } = this
        const authHeaders = { Authorization: 'Bearer ' + $cookies.get('Token') }
        const {
          data: { Success, Message, Order },
        } = await $axios.post(FINANCE_API_URL + '/Trade', payload, {
          headers: authHeaders,
        })
        if (Success) {
          this.$notification.open({
            message: 'Success',
            description: 'Successfull !',
          })

          if (side === 'BUY') {
            this.buyForm.Quantity = this.buyForm.Total = ''
          }
          if (side === 'SELL') {
            this.sellForm.Quantity = this.sellForm.Total = ''
          }

          if (Order.Status !== 'FILLED') {
            this.$emit('tradeUpdate', Order)
          }
        } else {
          this.$notification.open({
            message: 'Failed !',
            description: Message,
          })
        }
      } catch (e) {
        if ('response' in e) {
          const { Message } = e.response.data
          this.$notification.open({
            message: 'Failed !',
            description: Message,
          })
        }
      }
    },
    calculatePercent(percent, type) {
      const {
        QuatoAssetBalance,
        BaseAssetBalance,
        SymbolStepSize,
      } = this.getSymbolData
      if (type === 'BUY') {
        this.buyForm.Total = (percent / 100) * QuatoAssetBalance
        this.buyForm.Quantity = this.buyForm.Total / this.buyForm.Price
      }
      if (type === 'SELL') {
        if (percent === 100) {
          const outputDecimal =
            Math.trunc(BaseAssetBalance * Math.pow(10, SymbolStepSize)) /
            Math.pow(10, SymbolStepSize)
          this.sellForm.Quantity = outputDecimal
        } else {
          this.sellForm.Quantity = (percent / 100) * BaseAssetBalance
        }
        this.sellForm.Total = this.sellForm.Quantity * this.sellForm.Price
      }
    },
    getActiveItem(percent, type) {
      if (type === 'BUY') {
        const { QuatoAssetBalance } = this.getSymbolData
        if (QuatoAssetBalance) {
          return this.buyForm.Total === (percent / 100) * QuatoAssetBalance
        } else {
          return false
        }
      }
      if (type === 'SELL') {
        const { BaseAssetBalance } = this.getSymbolData
        if (BaseAssetBalance) {
          return this.sellForm.Total === (percent / 100) * BaseAssetBalance
        } else {
          return false
        }
      }
    },
  },
  watch: {
    'buyForm.Price': {
      handler(Price) {
        this.buyForm.Total = Price * this.buyForm.Quantity
      },
    },
    'buyForm.Quantity': {
      handler(Quantity) {
        const { SymbolStepSize } = this.getSymbolData
        this.buyForm.Quantity = parseFloat(Quantity).toFixed(SymbolStepSize)
        if (this.buyForm.Quantity !== Quantity) {
          this.buyForm.Total = this.buyForm.Price * Quantity
        }
      },
    },
    'buyForm.Total': {
      handler(Total) {
        if (this.buyForm.Price) {
          const { SymbolStepSize } = this.getSymbolData
          this.buyForm.Quantity = (Total / this.buyForm.Price).toFixed(
            SymbolStepSize
          )
        }
      },
    },
    'sellForm.Price': {
      handler(Price) {
        this.sellForm.Total = Price * this.sellForm.Quantity
      },
    },
    'sellForm.Quantity': {
      handler(Quantity) {
        const { SymbolStepSize } = this.getSymbolData
        this.sellForm.Quantity = parseFloat(Quantity).toFixed(SymbolStepSize)
        if (this.sellForm.Quantity !== Quantity) {
          this.sellForm.Total = this.sellForm.Price * Quantity
        }
      },
    },
    'sellForm.Total': {
      handler(Total) {
        if (this.sellForm.Price) {
          const { SymbolStepSize } = this.getSymbolData
          this.sellForm.Quantity = (Total / this.sellForm.Price).toFixed(
            SymbolStepSize
          )
        }
      },
    },
    getActionPrice(v) {
      this.buyForm.Price = v
      this.sellForm.Price = v

      this.buyForm.Quantity = ""
      this.buyForm.Total = ""
      
      this.sellForm.Quantity = ""
      this.sellForm.Total = ""

    },
    getActionBuyTotal(v) {
      this.buyForm.Total = v
    },
    getActionSellQuantity(v) {
      this.sellForm.Quantity = v
    },
    getSymbolData() {
      Object.keys(this.buyForm).forEach((key) => {
        if (key !== 'Price') {
          this.buyForm[key] = 0
        }
      })
      Object.keys(this.sellForm).forEach((key) => {
        if (key !== 'Price') {
          this.sellForm[key] = 0
        }
      })
    },
  },
}
</script>

<style lang="less">
@import '~/assets/ant/variables.less';
@boxpadding: 24px;

.action-card {
  background: var(--action-card-bg);

  &,
  input {
    font-size: 11px;
  }

  .action-col__head-title {
    font-size: 18px;
  }

  .action-col__head-value {
    font-size: 14px;
  }

  .action-col__body-item label,
  .action-col__body-item input {
    font-size: 15px;
  }

  .action_buttons {
    font-size: 17px;
  }

  .ant-card-body {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: calc(@boxpadding * 2);

    padding: @boxpadding;

    &::before,
    &::after {
      // remove ant-design's unnecessary block
      display: none;
    }
  }

  .action-col {
    position: relative;

    &:first-child::before {
      position: absolute;
      right: -@boxpadding;
      height: 100%;
      width: 1px;
      background: var(--action-card-mid-border-color);
      display: block;
      content: '';
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      &-title {
        margin: 0;
        color: var(--action-card-heading-color);
      }

      &-value {
        color: #b5b9bc;
      }

      div:last-child {
        img {
          margin-right: 5px;
        }
      }
    }

    &__body {
      margin-bottom: 40px;

      &-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        position: relative;

        &[data-title]::before {
          content: attr(data-title);
          display: flex;
          align-items: center;
          position: absolute;
          right: 10px;
          padding-left: 5px;
          height: calc(100% - 2px);
          // background: #1f242a;
          z-index: 10;
          color: #cfcfcf;
        }

        label {
          width: 100px;
        }

        .ant-input-number {
          width: 100%;
          border: none !important;
          background: transparent !important;
          height: auto;
        }

        .invalid-input {
          border: 1px solid red !important;
        }

        .ant-input-number-handler-wrap {
          display: none;
        }

        input {
          width: 100%;
          color: var(--action-card-input-color);
          background: transparent;
          border: 1px solid var(--action-card-input-border-color) !important;
          position: relative;
        }
      }
    }

    .percentage {
      display: flex;
      width: 100%;
      gap: 10px;

      &__item {
        cursor: pointer;
        font-size: 15px;
        height: 26px;
        width: 25%;
        border: 1px solid var(--percentage-item-border-color);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
      }
      &__item_active {
        background: @primary-color;
        color: #12161d;
        border: none;
      }
    }

    .login-warning {
      border: 1px solid var(--login-warning-border-color);
      background-color: var(--login-warning-bg);
      border-radius: 4px;
      text-align: center;
      padding: 10px;
      white-space: nowrap;
      font-weight: 600;
      color: var(--login-warning-text-color);

      a {
        color: var(--login-warning-link-color);
      }
    }
  }
}
</style>
