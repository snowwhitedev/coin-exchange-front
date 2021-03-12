<template>
  <div class="container">
    <div class="filter">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="Almak İstiyorum">
          <a-form layout="inline" :form="buylistForm" @submit="buyhandleSubmit">
            <a-form-item label="Para Birimi">
              <a-select
                style="width: 120px"
                :loading="selectLoading"
                v-decorator="['Currency', { rules: [{ required: true, message: 'Zorunlu alan!' }] }]"
              >
                <a-select-option
                  v-for="currency in fiatDropdown"
                  :value="currency.Name"
                  :key="currency.Name"
                >{{currency.Name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Birim">
              <a-select
                style="width: 120px"
                v-decorator="['Asset', { rules: [{ required: false}] }]"
              >
                <a-select-option
                  v-for="asset in assetDropdown"
                  :value="asset.Name"
                  :key="asset.Name"
                >{{asset.Name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" html-type="submit">Ara</a-button>
            <a @click="buyresetFilter">Reset</a>
          </a-form>

          <div class="table">
            <div class="table-header">
              <span>İlan Verenler</span>
              <span>Fiyat</span>
              <span>Limit/Kullanılabilir</span>
              <span>Ödeme</span>
            </div>
            <div class="table-content">
              <div class="table-item-extra" v-for="(item, index) in buyList">
                <div class="table-item">
                  <div class="name-group">
                    <span class="name">{{item.OTC_Username}}</span>
                    <div class="name-info">
                      <!-- <span class="orders">
                      524 emirler
                    </span>
                    <span class="infos">
                      100.00% tamamlanma
                      </span>-->
                    </div>
                  </div>

                  <div class="price-group">{{item.FiatPrice}} {{item.FiatCurrency}}</div>

                  <div class="limit-group">
                    <div class="limit-info">
                      <div class="limit-first">
                        <span class="limit-label">Kullanılabilir</span>
                        <p>{{item.Available}} USDT</p>
                      </div>
                      <div class="limit-first">
                        <span class="limit-label">Limit</span>
                        <p>${{item.Min}} - ${{item.Max}}</p>
                      </div>
                    </div>
                    <img src="~/assets/images/walletP2P.svg" alt />
                    <span>Banka Transferi</span>
                  </div>

                  <div>
                    <a-button class="button">USDT AL</a-button>
                  </div>
                </div>
                <div class="table-item-form">
                  <a-form layout="inline" :form="form" @submit="handleSubmit">
                    <a-form-item label="Almak İstiyorum">
                      <a-input
                        v-decorator="[
          'FiatAmount',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]"
                        placeholder="Miktar"
                        @change="handleFiatAmountChange(item.FiatPrice)"
                      ></a-input>
                    </a-form-item>
                    <a-form-item>
                      <a-input
                        v-decorator="[
          'Amount',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]"
                        placeholder="Adet"
                        @change="handleAmountChange(item.FiatPrice)"
                      ></a-input>
                    </a-form-item>

                    <a-button type="primary" html-type="submit">Satın al</a-button>
                    <a-button type="danger">İptal Et</a-button>
                  </a-form>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Satmak İstiyorum" force-render>
          <a-form layout="inline" :form="selllistForm" @submit="sellhandleSubmit">
            <a-form-item label="Para Birimi">
              <a-select
                style="width: 120px"
                :loading="selectLoading"
                v-decorator="['Currency', { rules: [{ required: true, message: 'Zorunlu alan!' }] }]"
              >
                <a-select-option
                  v-for="currency in fiatDropdown"
                  :value="currency.Name"
                  :key="currency.Name"
                >{{currency.Name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Birim">
              <a-select
                style="width: 120px"
                v-decorator="['Asset', { rules: [{ required: false}] }]"
              >
                <a-select-option
                  v-for="asset in assetDropdown"
                  :value="asset.Name"
                  :key="asset.Name"
                >{{asset.Name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" html-type="submit">Ara</a-button>
            <a @click="sellresetFilter">Reset</a>
          </a-form>

          <div class="table">
            <div class="table-header">
              <span>İlan Verenler</span>
              <span>Fiyat</span>
              <span>Limit/Kullanılabilir</span>
              <span>Ödeme</span>
            </div>
            <div class="table-content">
              <div class="table-item" v-for="item in sellList">
                <div class="name-group">
                  <span class="name">{{item.OTC_Username}}</span>
                  <div class="name-info"></div>
                </div>

                <div class="price-group">{{item.FiatPrice}} {{item.FiatCurrency}}</div>

                <div class="limit-group">
                  <div class="limit-info">
                    <div class="limit-first">
                      <span class="limit-label">Kullanılabilir</span>
                      <p>{{item.Available}} USDT</p>
                    </div>
                    <div class="limit-first">
                      <span class="limit-label">Limit</span>
                      <p>${{item.Min}} - ${{item.Max}}</p>
                    </div>
                  </div>
                  <img src="~/assets/images/walletP2P.svg" alt />
                  <span>Banka Transferi</span>
                </div>

                <div>
                  <a-button class="button">USDT SAT</a-button>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Market',
  data() {
    return {
      buylistForm: this.$form.createForm(this, { name: 'buyListSearch' }),
      selllistForm: this.$form.createForm(this, { name: 'sellListSearch' }),
      filter: {
        Asset: null,
        Currency: null,
      },
      buyList: [],
      sellList: [],
      assetDropdown: [],
      fiatDropdown: [],
      selectLoading: true,
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
    }
  },
  mounted() {
    this.getData()
    this.getDropdown()
  },

  methods: {
    handleAmountChange(e, unitPrice) {
      console.log(unitPrice)
      this.form.setFieldsValue({
        FiatAmount:
          parseInt(this.form.getFieldValue('Amount'), 10) *
          this.buyList.FiatPrice,
      })
    },
    handleFiatAmountChange(e) {
      console.log(e)
      this.form.setFieldsValue({
        Amount: this.form.getFieldValue('FiatAmount'),
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.Buy(values)
        }
      })
    },
    async Buy(data) {
      const { $axios, $config, $cookies } = this
      let authHeader = { Authorization: 'Bearer ' + $cookies.get('Token') }

      let payload = {
        BRANCH: null,
        SWIFT: null,
        Amount: null,
        FiatAmount: null,
        BANK: null,
        OrderId: null,
        IBAN: null,
        OTC_UserBankUniqueID: null,
        ...data,
      }

      const response = await $axios.post(
        $config.FINANCE_API_URL + '/CreateP2PRequest',
        payload,
        {
          headers: authHeader,
        }
      )
      if (response.data) {
        console.log(response.data)
      }
    },

    buyresetFilter() {
      this.buylistForm.setFieldsValue({
        Asset: null,
        Currency: null,
      })
      this.getData()
    },
    sellresetFilter() {
      this.selllistForm.setFieldsValue({
        Asset: null,
        Currency: null,
      })
      this.getData()
    },
    buyhandleSubmit(e) {
      e.preventDefault()
      this.buylistForm.validateFields((err, values) => {
        if (!err) {
          this.getData(values)
        }
      })
    },
    sellhandleSubmit(e) {
      e.preventDefault()
      this.selllistForm.validateFields((err, values) => {
        if (!err) {
          this.getData(values)
        }
      })
    },
    async getData(filter = this.filter) {
      const { $axios, $config, $cookies } = this
      let authHeader = { Authorization: 'Bearer ' + $cookies.get('Token') }
      const response = await $axios.get(
        $config.FINANCE_API_URL + '/GetP2POpenOrders',
        {
          params: {
            ...filter,
          },
          headers: authHeader,
        }
      )
      if (response.data) {
        const { BuyList, SellList } = response.data
        this.buyList = BuyList
        this.sellList = SellList
        console.log(this.buyList)
        console.log(this.sellList)
      }
    },
    async getDropdown() {
      const { $axios, $config, $cookies } = this
      let authHeader = { Authorization: 'Bearer ' + $cookies.get('Token') }
      const response = await $axios.get(
        $config.FINANCE_API_URL + '/GetP2PDataList',
        {
          headers: authHeader,
        }
      )
      if (response.data) {
        const { AssetList, FiatList } = response.data

        this.assetDropdown = AssetList
        this.fiatDropdown = FiatList
        console.log(this.assetDropdown)
        console.log(this.fiatDropdown)
        this.selectLoading = false
      }
    },
  },
}
</script>


<style lang="scss" scoped>
.filter {
  background-color: white;
}
.table {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  .table-header {
    padding: 0 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .table-item {
    height: 117px;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 0px 3px #00000029;
    border-bottom: 1px solid #00000029;

    .name-group {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      color: black;
      width: 200px;
      .name-info {
        display: flex;
        color: #8a8e91;
        font-size: 12px;
        justify-content: space-between;
        width: 100%;
      }
    }
    .price-group {
      padding-left: 50px;
      color: black;
      font-size: 20px;
    }

    .limit-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 420px;
      color: black;
      font-size: 14px;
      .limit-info {
        display: flex;
        flex-direction: column;
        margin-left: 50px;
      }
      .limit-label {
        color: #8a8e91;
        font-size: 12px;
      }
      .limit-first {
        display: flex;

        width: 250px;
        span {
          margin-right: 30px;
        }
      }
    }
  }
  .table-item-form {
    height: 60px;
    background-color: white;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
  }
}
.button {
  background-color: #52c274;
  color: white;
}
</style>
