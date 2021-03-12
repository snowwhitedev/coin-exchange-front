<template>
  <div class="popup">
    <a-icon v-if="loading" type="sync" spin />
    <a-form v-else :form="form" @submit="handleSubmit">
      <div class="fromToRow">
        <a-form-item label="Gönderici">
          <a-select
            v-decorator="[
              'From',
              {
                rules: [{ required: true, message: 'Zorunlu alan' }],
                initialValue: fromValue,
              },
            ]"
            class="fromToSelects"
            @change="handleFromChange"
            :disabled="true"
          >
            <a-select-option
              v-for="item in fromToDropdownContent"
              :value="item"
              :key="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <img src="~/assets/images/switch.svg" class="switch-icon" height="32" />
        <a-form-item label="Alıcı">
          <a-select
            v-decorator="[
              'To',
              {
                rules: [{ required: true, message: 'Zorunlu alan' }],
                initialValue: toValue,
              },
            ]"
            class="fromToSelects"
            @change="handleToChange"
            :disabled="true"
          >
            <a-select-option
              v-for="item in fromToDropdownContent"
              :value="item"
              :key="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <a-form-item>
        <a-input-number
          :placeholder="'Tutar ' + 'Max:' + showingData.totalAmount"
          :max="showingData.totalAmount"
          style="width: 300px"
          v-decorator="[
            'Amount',
            { rules: [{ required: true, message: 'Zorunlu alan' }] },
          ]"
        />
      </a-form-item>

      <div class="avaiable">
        <span>Kullanılabilir Miktar</span>
        <span class="total">{{ showingData.totalAmount.toFixed(8) }}BTC</span>
      </div>

      <a-button type="primary" style="width: 300px" html-type="submit">
        Submit
      </a-button>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'TransferPopUp',

  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      fromToDropdownContent: [],
      unitDromDownContent: [],
      fromValue: 'Güvence Bedeli',
      toValue: 'P2P Cüzdan',

      showingData: {
        totalAmount: 0,
        assets: [],
      },
      loading: true,
      UserBalance: {},
    }
  },
  mounted() {
    console.log('mounted trust price pop up')
    this.getDropdownContent()
    this.getMainWallet()
  },
  methods: {
    handleFromChange() {},
    handleToChange() {},
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postData(values)
        }
      })
    },
    async postData(data) {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }
        let payload = {
          ...data,
        }

        const response = await this.$axios.post(
          this.$config.FINANCE_API_URL + `/Transfer`,
          payload,
          {
            headers: authHeaders,
          }
        )

        if (response.data) {
          console.log(response.data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getDropdownContent() {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL + `/GetFilters`,
          {
            headers: authHeaders,
          }
        )

        if (response.data) {
          // TODO: response.data['Message']
          this.loading = false

          this.fromToDropdownContent = response.data.TransferList.map(
            ({ Name }) => Name
          )
          this.fromToDropdownContent = this.fromToDropdownContent.filter(
            (word) => word !== 'Güvence Bedeli'
          )
          this.unitDromDownContent = response.data.AssetList.map(
            ({ Name }) => Name
          )

          console.log('dropdown')
          console.log(this.unitDromDownContent)
          console.log(this.fromToDropdownContent)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getMainWallet() {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL + '/GetUserBalance',
          {
            headers: authHeaders,
          }
        )
        if (response.data) {
          this.loading = false
          const { TotalP2PBalanceInBtc } = response.data
          this.showingData.totalAmount = TotalP2PBalanceInBtc
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.fromToRow {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 300px;
}
.fromToSelects {
  width: 120px;
}
.avaiable {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .total {
    color: #1ba4e8;
  }
}
</style>
