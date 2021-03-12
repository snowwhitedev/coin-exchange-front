<template>
  <div class="Roboto-Regular">
    <Modal
      v-if="isVisible"
      :in-asset="inAsset"
      :out-asset="outAsset"
      :final-amount="finalAmountSwap"
      :in-amount="inAmountSwap"
      :visible="isVisible"
      @closeModal="closeModal"
      @refresh="startSwap"
    />

    <div v-if="!isMobile">
      <div v-if="!isMobile" class="background-image"></div>
      <div v-if="!isMobile" class="centered">{{ $t('swap_quick') }}</div>
    </div>

    <a-col align="center">
      <a-card
        :loading="loading"
        title="Hızlı Takas İşlemi"
        :class="!isMobile ? 'main-card' : 'main-card-mobile'"
      >
        <a-card-grid
          :class="!isMobile ? 'first-row' : 'first-row-mobile'"
          :hoverable="false"
        >
          <a-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
            style="margin-bottom: 20px; z-index: 5"
          >
            <div @click="writeInput" style="cursor: pointer; z-index: 5">
              {{ $t('swap_available_balance') }}
              <span style="color: #1ba4e8; z-index: 5">
                {{
                  inAsset
                    ? parseFloat(availableBalance).toFixed(8)
                      ? availableBalance
                      : '0.0'
                    : ''
                }}
                {{ inAsset ? inAsset : 'Not available' }}
              </span>
            </div>
          </a-col>

          <a-row>
            <a-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
              <a-form class="Roboto-Regular">
                <a-form-item
                  :validate-status="isError ? 'error' : null"
                  :help="message"
                >
                  <a-select
                    id="first"
                    show-search
                    placeholder="Select"
                    @change="handleInAssetChange"
                    option-filter-prop="children"
                    :filter-option="filterOption"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    default-value="BTC"
                    style="width: 100%"
                    :value="inAsset"
                  >
                    <a-select-option
                      v-for="item in ASSETS"
                      v-bind:key="item['Name']"
                      v-bind:value="item['Symbol']"
                    >
                      <img
                        height="20"
                        :src="
                          require(`~/assets/icons/${item[
                            'Symbol'
                          ].toLowerCase()}.svg`)
                        "
                        style="margin-bottom: 2px"
                        alt
                      />
                      {{ item['Symbol'] }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-col>

            <a-col offset="2" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <a-form class="Roboto-Regular">
                <a-form-item
                  :validate-status="isErrorInput ? 'error' : null"
                  :help="isErrorInputMessage"
                  :has-feedback="isErrorInput"
                >
                  <a-input-number
                    v-model="inAmount"
                    placeholder="Miktar"
                    style="width: 100%"
                    @keyup="checkInput"
                  />
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
          <a-col align="center">
            <div class="rules-image" @click="changeAssets"></div>
          </a-col>

          <a-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
            style="margin-top: 75px"
          >
            <a-select
              show-search
              placeholder="Select"
              style="width: 100%"
              @change="handleOutAssetChange"
              default-value="ETH"
              :value="outAsset"
            >
              <template v-for="item in ASSETS">
                <a-select-option
                  :key="item['Symbol']"
                  v-bind:value="item['Symbol']"
                >
                  <img
                    height="20"
                    :src="
                      require(`~/assets/icons/${item[
                        'Symbol'
                      ].toLowerCase()}.svg`)
                    "
                    style="margin-bottom: 2px"
                    alt
                  />
                  {{ item['Symbol'] }}
                </a-select-option>
              </template>
            </a-select>
          </a-col>

          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-button
              :loading="isSwapLoading"
              class="swap-start-button primary-button border-none Roboto-Medium"
              type="primary"
              v-on:click="startSwap"
              >{{ $t('swap_start_process') }}</a-button
            >
          </a-col>
        </a-card-grid>

        <a-card-grid
          :class="!isMobile ? 'second-row' : 'second-row-mobile'"
          :hoverable="false"
        >
          <a-row style="margin-top: 60px" type="flex">
            <a-col v-if="!isMobile" class="rules-image-column" :flex="2">
              <img
                height="50"
                :src="require(`~/assets/images/swap/rules.png`)"
                style="position: relative; top: 0"
                alt
              />
            </a-col>
            <a-col :flex="!isMobile ? 3 : 5" style="width: 50%">
              <div class="second-row-title">{{ $t('swap_rules') }}</div>

              <div class="second-row-text">{{ $t('swap_rule') }}</div>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
    </a-col>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Modal from '~/components/Swap/Modal'

export default {
  middleware: ['auth'],

  components: { Modal },

  data: () => ({
    loading: false,

    inAsset: 'BTC',
    outAsset: 'ETH',
    inAmount: null,

    isVisible: false,
    inAmountSwap: null,
    finalAmountSwap: null,

    availableBalance: null,

    isError: false,
    message: null,

    isErrorInput: false,
    isErrorInputMessage: null,

    isMobile: null,
    notificationMessage: null,
    isSwapLoading: false,
  }),

  computed: {
    ...mapGetters({
      ASSETS: 'swap/ASSETS',
      USER_SPOT_BALANCE: 'swap/USER_SPOT_BALANCE',
    }),
  },

  mounted() {
    this.isMobile = window.innerWidth < 1000

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1000
    })

    const assets = this.$route.params.inout.split('-')
    this.inAsset = assets[0]
    this.outAsset = assets[1]
    this.findTheAvailableBalance()
  },

  methods: {
    ...mapMutations({
      SET_ASSETS: 'swap/SET_ASSETS',
    }),

    checkInput() {
      if (this.isErrorInput) {
        this.isErrorInput = false
        this.isErrorInputMessage = null
      }
    },

    writeInput() {
      this.inAmount = this.availableBalance
    },

    async closeModal() {
      this.isVisible = false
      console.log(`started`)

      try {
        const {
          $axios,
          $config: { FINANCE_API_URL },
          $cookies,
          $store,
        } = this

        let authHeaders = { Authorization: 'Bearer ' + $cookies.get('Token') }

        const responseUserBalance = await $axios.get(
          FINANCE_API_URL + '/GetUserBalance',
          { headers: authHeaders }
        )

        if (responseUserBalance.data) {
          $store.commit(
            'swap/SET_USER_SPOT_BALANCE',
            responseUserBalance.data['UserSpotBalance']
          )

          if (
            responseUserBalance.data['UserSpotBalance'] &&
            responseUserBalance.data['UserSpotBalance'].length > 0
          ) {
            responseUserBalance.data['UserSpotBalance'].forEach((coin) => {
              if (coin.asset === this.inAsset) {
                console.log('done')
                this.availableBalance = coin.free
              }
            })
          } else {
            this.availableBalance = 0.0
          }
        }
      } catch (e) {
        console.log(`Error occurred, when retrieving /GetUserBalance, ${e}`)
      }

      console.log(`finished`)
    },

    changeAssets() {
      this.isErrorInput = false
      const tempAsset = this.inAsset
      this.inAsset = this.outAsset
      this.outAsset = tempAsset
      this.findTheAvailableBalance()
    },

    handleInAssetChange(val) {
      // Delete error message
      console.log('saaa')
      if (this.isError) {
        this.isError = false
        this.message = null
      }

      if (this.outAsset === val) {
        if (this.outAsset === 'BTC') {
          this.inAsset = 'BTC'
          this.outAsset = 'USDT'
        } else {
          this.inAsset = val
          this.outAsset = 'BTC'
        }
      }
      this.inAsset = val
      this.findTheAvailableBalance()
      this.changeBrowserRoute()
    },

    findTheAvailableBalance() {
      if (this.USER_SPOT_BALANCE && this.USER_SPOT_BALANCE.length > 0) {
        this.USER_SPOT_BALANCE.forEach((coin) => {
          if (coin.asset === this.inAsset) {
            this.availableBalance = coin.free
          }
        })
      } else {
        this.availableBalance = 0.0
      }
    },

    handleOutAssetChange(val) {
      if (this.inAsset === val) {
        if (this.inAsset === 'BTC') {
          this.inAsset = 'USDT'
          this.outAsset = 'BTC'
        } else {
          this.inAsset = 'BTC'
          this.outAsset = val
        }
        this.findTheAvailableBalance()
        this.changeBrowserRoute()
        return
      }
      this.outAsset = val
      this.changeBrowserRoute()
    },

    changeBrowserRoute() {
      const path = this.$route.path
      const pathSplit = path.split('/')
      if (pathSplit[pathSplit.length - 1] !== '') {
        pathSplit[pathSplit.length - 1] = `${this.inAsset}-${this.outAsset}`
      } else {
        pathSplit[pathSplit.length - 2] = `${this.inAsset}-${this.outAsset}`
      }

      const newPath = pathSplit.join('/')
      history.pushState({}, null, newPath)
    },

    handleBlur() {
      console.log('blur')
    },

    handleFocus() {
      console.log('focus')
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[1].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },

    async startSwap() {
      if (this.inAsset !== this.outAsset && this.inAmount) {
        const { $axios, $config, $cookies } = this

        let authHeaders = { Authorization: 'Bearer ' + $cookies.get('Token') }
        this.isSwapLoading = true
        try {
          const response = await $axios.post(
            $config.FINANCE_API_URL + '/GetSwapFinalQuantity',
            {
              inAsset: this.inAsset,
              OutAsset: this.outAsset,
              InputAmount: this.inAmount,
              OutputAmount: '',
            },
            { headers: authHeaders }
          )

          if (response.data) {
            console.log(response.data)
            let bool = response.data['Success']

            if (response.data['ErrorCode'] === 1) {
              this.isErrorInputMessage = response.data['Message']
              this.isErrorInput = true
            } else if (this.message && this.message !== '') {
              this.message = response.data['Message']
              this.isError = true
            } else {
              if (bool) {
                this.inAmountSwap = response.data['InAmount']
                this.finalAmountSwap = response.data['FinalAmount']
                this.isVisible = true
              } else {
                this.isVisible = false
              }
            }
          }
          this.isSwapLoading = false
        } catch (e) {
          console.log(`Error occurred, when posting swap endpoint as ${e}`)
          this.isVisible = false
          this.isSwapLoading = false
        }
      } else {
        console.log(`Invalid inAsset, outAsset or inAmount!`)
      }
    },
  },

  async asyncData({
    app,
    $axios,
    store,
    redirect,
    $config: { FINANCE_API_URL },
    params,
    $cookies,
  }) {
    try {
      if (!params.inout) {
        redirect(app.localeRoute('/swap/BTC-ETH'))
      }

      const authHeaders = { Authorization: 'Bearer ' + $cookies.get('Token') }
      const response = await $axios.get(FINANCE_API_URL + '/GetAssetList', {
        headers: authHeaders,
      })

      if (response.data) {
        const { Assets } = response.data
        const inOut = params.inout.split('-')
        let inAsset = inOut[0]
        let outAsset = inOut[1]
        let inFound = -1
        let outFound = -1
        for (const item of Assets) {
          if (item.Symbol === inAsset) {
            inFound = 1
          }
          if (item.Symbol === outAsset) {
            outFound = 1
          }
          if (inFound === 1 && outFound === 1) {
            break
          }
        }
        inAsset = inFound > -1 ? inAsset : 'BTC'
        outAsset = outFound > -1 ? outAsset : 'ETH'
        if (inFound === -1 || outFound === -1) {
          redirect(app.localeRoute(`/swap/${inAsset}-${outAsset}`))
        }
      }

      const responseUserBalance = await $axios.get(
        FINANCE_API_URL + '/GetUserBalance',
        { headers: authHeaders }
      )

      if (responseUserBalance.data) {
        store.commit(
          'swap/SET_USER_SPOT_BALANCE',
          responseUserBalance.data['UserSpotBalance']
        )
      }

      if (response.data) {
        const assets = response.data['Assets']
        store.commit('swap/SET_ASSETS', assets)
      }
    } catch (e) {
      console.log(`Error occurred, when retrieving /GetAssetList, ${e}`)
    }
  },
}
</script>

<style lang="less">
.ant-card-head-title {
  color: #1ba4e8;
}

.background-image {
  height: 256px;
  width: 100%;
  background: linear-gradient(
      to bottom,
      rgb(18, 57, 102),
      rgba(28, 36, 62, 0.73)
    ),
    url('../../assets/images/swap/background.png');
}

.rules-image-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rules-image {
  cursor: pointer;
  position: relative;
  top: 40px;
  width: 18px;
  height: 25px;
  background-image: url('../../assets/images/swap/arrows.png');
}

.main-card {
  text-align: start;
  z-index: 5;
  width: 70%;
  margin-top: 10%;
  margin-bottom: 10%;
  box-shadow: 0 0 30px #00000021;
  border-radius: 3px;
  opacity: 1;
}

.main-card-mobile {
  text-align: start;
  z-index: 5;
  width: 100%;
  margin-top: 10%;
  margin-bottom: 10%;
  box-shadow: 0 0 30px #00000021;
  border-radius: 3px;
  opacity: 1;
}

.first-row {
  width: 50%;
  height: 356px;
  text-align: left;
}

.first-row-mobile {
  width: 100%;
  height: 356px;
  text-align: left;
}

.swap-start-button {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  background: #90dafe 0 0 no-repeat padding-box;
  opacity: 1;
}

.second-row {
  width: 50%;
  height: 356px;
  text-align: center;
}

.second-row-mobile {
  margin-top: 20px;
  width: 100%;
  height: 356px;
  text-align: center;
}

.second-row-title {
  opacity: 1;
  color: #2c2c2c;
  text-align: left;
  font-weight: bold;
  letter-spacing: 0;
}

.second-row-text {
  margin-top: 21px;
  text-align: left;
  font: normal normal normal 12px/20px Roboto;
  color: #2c2c2c;
  opacity: 1;
}

.centered {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-family: Roboto-Regular;
  font-size: 24px;
}

@media only screen and (max-width: 1100px) {
}
</style>

<style scoped>
.swap-start-button:hover {
  background: #90dafe 0 0 no-repeat padding-box !important;
  color: white !important;
}
</style>
