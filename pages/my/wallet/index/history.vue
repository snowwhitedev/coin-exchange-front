<template>
  <div class="history">
    <h1>{{ $t('history_text_wallet_history') }}</h1>

    <div class="table-grid">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" v-bind:tab="$t('history_text_deposit_withdraw')">
          <div class="with-drawal">
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" v-bind:tab="$t('text_main_wallet')">
                <div class="input-row">
                  <div class="inputs">
                    <div class="single-input">
                      <label for="akar"></label>
                      <a-select
                        v-bind:default-value="$t('text_deposit')"
                        style="width: 120px"
                        class="select"
                        id="akar"
                        @change="getReleventHistory"
                      >
                        <a-select-option value="depozito">{{
                          $t('text_deposit')
                        }}</a-select-option>
                        <a-select-option value="withdraw">{{
                          $t('text_withdraw')
                        }}</a-select-option>
                      </a-select>
                    </div>
                  </div>
                </div>
                <a-table
                  v-if="!isMobile"
                  :columns="columnsWithdrawal"
                  :row-key="getRowKeyForWithdrawalData"
                  :loading="loading"
                  :data-source="dataRelevant"
                  :pagination="paginationRelevant"
                  @expand="setdataReleventExpandKeys"
                  :expandIcon="expandIcon"
                  :expandIconColumnIndex="5"
                  :expandedRowKeys="dataRelevantExpandedKeys"
                  :expandIconAsCell="false"
                >
                  <span
                    style="display: flex"
                    slot="Asset"
                    slot-scope="Asset, record"
                  >
                    <img
                      height="20"
                      :src="
                        require(`~/assets/icons/${Asset.toLowerCase()}.svg`)
                      "
                      style="margin-bottom: 2px; margin-right: 2px"
                      alt
                    />
                    {{ Asset }}
                    <u style="margin-left: 5px">{{ record['AssetName'] }}</u>
                  </span>
                  <span
                    slot="Address"
                    slot-scope="Address"
                    class="break-column-data"
                    >{{ Address }}</span
                  >
                  <template
                    slot="expandedRowRender"
                    class="history-expanded-row"
                    slot-scope="record"
                  >
                    <p
                      style="text-align: right"
                      class="history-item-title w-100"
                    >
                      <span v-if="shownHistory === 'depozito'"
                        >TxId: {{ record.TxId }}</span
                      >
                      <span v-if="shownHistory === 'withdraw'"
                        >TxHash: {{ record.TxHash }}</span
                      >
                    </p>
                  </template>
                </a-table>
                <div v-if="isMobile">
                  <div
                    v-for="(item, idx) in dataRelevant"
                    :key="idx"
                    class="mobile-dataDisplay"
                  >
                    <div class="data-grid">
                      <span class="label">{{ $t('main_wallet_asset') }}</span>
                      <span class="data">
                        <img
                          height="20"
                          :src="
                            require(`~/assets/icons/${item.Asset.toLowerCase()}.svg`)
                          "
                          style="margin-bottom: 2px"
                          alt
                        />
                        {{ item.Asset }}
                        <u>{{ item['AssetName'] }}</u>
                      </span>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('history_text_status') }}</span>
                      <a-tag color="green">{{ item.Status }}</a-tag>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('main_wallet_amount') }}</span>
                      <span class="data">{{ item.Amount }}</span>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('main_wallet_address') }}</span>
                      <span class="data data_overflow" :title="item.Address">
                        {{ item.Address }}
                      </span>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('main_wallet_date') }}</span>
                      <span class="data">{{ item.CreatedOn }}</span>
                    </div>
                    <div class="data-grid">
                      <span class="label">TxID</span>
                      <span class="data" :title="item.TxId">
                        {{ item['TxId'] ? item['TxId'] : 'Not available' }}
                      </span>
                    </div>
                  </div>
                </div>
              </a-tab-pane>
              <a-tab-pane
                key="2"
                v-bind:tab="$t('history_text_fiat_wallet')"
                force-render
              >
                <div class="input-row">
                  <div class="inputs">
                    <div class="single-input">
                      <label for="akar"></label>
                      <a-select
                        v-bind:default-value="$t('text_deposit')"
                        style="width: 120px"
                        class="select"
                        id="akar"
                        @change="getReleventFiatHistory"
                      >
                        <a-select-option value="fiatdeposit">
                          {{ $t('history_text_deposit') }}
                        </a-select-option>
                        <a-select-option value="fiatwithdraw">
                          {{ $t('history_text_withdraw') }}
                        </a-select-option>
                      </a-select>
                    </div>
                  </div>
                </div>
                <a-table
                  v-if="!isMobile"
                  :columns="columnsFiatWithdrawal"
                  :row-key="(record, index) => index"
                  :data-source="dataFiatRelevant"
                  :loading="loading"
                  :pagination="paginationRelevant"
                  @expand="setFiatWithdrawalExpandedRowKeys"
                  :expandIconColumnIndex="5"
                  :expandedRowKeys="FiatWithdrawalExpandedRowKeys"
                  :expandIconAsCell="false"
                >
                  <!-- <a-popover title="Not">
                        <template slot="content">
                          {{ TxId.TxId }}
                          {{ AddressTag }}
                        </template>
                        <a-button type="primary">
                          Dahili
                        </a-button>
                  </a-popover>-->
                </a-table>
                <template v-if="isMobile">
                  <div
                    v-for="(item, idx) in dataFiatRelevant"
                    :key="idx"
                    class="mobile-dataDisplay"
                  >
                    <div class="data-grid">
                      <span class="label">{{ $t('main_wallet_asset') }}</span>
                      <span class="data">
                        <img
                          height="20"
                          :src="
                            require(`~/assets/icons/${item.Asset.toLowerCase()}.svg`)
                          "
                          style="margin-bottom: 2px"
                          alt
                        />
                        {{ item.Asset }}
                        <u>{{ item['AssetName'] }}</u>
                      </span>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('main_wallet_amount') }}</span>
                      <span class="data">{{ item.Amount }}</span>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('main_wallet_date') }}</span>
                      <span class="data">{{ item.DateTime }}</span>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('history_text_type') }}</span>
                      <span class="data" :title="item.Type">
                        {{ item.Type }}
                      </span>
                    </div>
                    <div class="data-grid">
                      <span class="label">{{ $t('history_text_not') }}</span>
                      <span class="data" :title="item.To">{{ item.To }}</span>
                    </div>
                  </div>
                </template>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Transfer" force-render>
          <div class="with-drawal">
            <div class="input-row">
              <div class="inputs">
                <div class="single-input">
                  <label for="akar">{{ $t('history_text_from') }}</label>
                  <a-select
                    v-bind:default-value="$t('history_text_from')"
                    style="width: 120px"
                    :value="
                      transferListSearch.fromValue === 'ALL'
                        ? $t('history_text_all')
                        : transferListSearch.fromValue
                    "
                    @change="handleChangeFrom"
                    class="select"
                    id="akar"
                  >
                    <a-select-option
                      v-for="val in fromToDropdownContent"
                      :value="val"
                      :key="val"
                      >{{ val }}</a-select-option
                    >
                  </a-select>
                </div>
                <img
                  @click="handleSwitch"
                  src="~/assets/images/switch.svg"
                  class="switch-icon"
                  height="32"
                />
                <div class="single-input">
                  <label for="Unit">{{ $t('history_text_to') }}</label>
                  <a-select
                    v-bind:default-value="$t('history_text_to')"
                    style="width: 120px"
                    class="select"
                    :value="
                      transferListSearch.toValue === 'ALL'
                        ? $t('history_text_all')
                        : transferListSearch.toValue
                    "
                    @change="handleChangeTo"
                    id="unit"
                  >
                    <a-select-option
                      v-for="val in fromToDropdownContent"
                      :value="val"
                      :key="val"
                      >{{ val }}</a-select-option
                    >
                  </a-select>
                </div>
                <div class="single-input">
                  <label for="status">{{ $t('main_wallet_asset') }}</label>
                  <a-select
                    v-bind:default-value="$t('history_text_to')"
                    style="width: 120px"
                    :value="transferListSearch.unitValue"
                    @change="handleChangeUnit"
                    class="select"
                    id="unit"
                  >
                    <a-select-option
                      v-for="val in unitDromDownContent"
                      :value="val"
                      :key="val"
                      >{{ val }}</a-select-option
                    >
                  </a-select>
                </div>
              </div>
              <div class="buttons">
                <button class="button reset" @click="searchTransfer(false)">
                  {{ $t('history_text_reset') }}
                </button>
                <button class="button search" @click="searchTransfer(true)">
                  {{ $t('history_text_search') }}
                </button>
              </div>
            </div>
            <a-table
              v-if="!isMobile"
              :columns="columnsTranfer"
              :row-key="(record, index) => index"
              :data-source="dataTransfer"
              :pagination="pagination"
              @change="handleTableChange"
            ></a-table>
            <template v-if="isMobile">
              <div
                v-for="(item, idx) in dataTransfer"
                :key="idx"
                class="mobile-dataDisplay"
              >
                <div class="data-grid">
                  <span class="label">{{ $t('main_wallet_asset') }}</span>
                  <span class="data">
                    <img
                      height="20"
                      :src="
                        require(`~/assets/icons/${item.Asset.toLowerCase()}.svg`)
                      "
                      style="margin-bottom: 2px"
                      alt
                    />
                    {{ item.Asset }}
                    <u>{{ item['AssetName'] }}</u>
                  </span>
                </div>
                <div class="data-grid">
                  <span class="label">{{ $t('main_wallet_date') }}</span>
                  <span class="data">{{ item.CreatedOn }}</span>
                </div>

                <div class="data-grid">
                  <span class="label">{{ $t('history_text_amount') }}</span>
                  <span class="data">{{ item.Amount }}</span>
                </div>
                <div class="data-grid">
                  <span class="label">{{ $t('history_text_from') }}</span>
                  <span class="data">{{ item.From }}</span>
                </div>
                <div class="data-grid">
                  <span class="label">{{ $t('history_text_to') }}</span>
                  <span class="data">{{ item.To }}</span>
                </div>
              </div>
            </template>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
const columnsWithdrawal = [
  {
    title: 'Birim',
    dataIndex: 'Asset',
    key: 'Asset',
    width: '10%',
    scopedSlots: {
      customRender: 'Asset',
    },
  },
  {
    title: 'Durum',
    dataIndex: 'Status',
    key: 'Status',
    width: '15%',
    scopedSlots: {
      customRender: 'Status',
    },
  },
  {
    title: 'Miktar',
    dataIndex: 'Amount',
    key: 'Amount',
    width: '10%',
    scopedSlots: {
      customRender: 'Amount',
    },
  },
  {
    title: 'Address',
    dataIndex: 'Address',
    key: 'Address',
    width: '35%',
    align: 'left',
    scopedSlots: {
      customRender: 'Address',
    },
  },
  {
    title: 'Tarih',
    dataIndex: 'CreatedOn',
    key: 'CreatedOn',

    width: '20%',
    scopedSlots: {
      customRender: 'CreatedOn',
    },
  },
  {
    title: '',
    dataIndex: '',
    key: '',
    class: '',

    scopedSlots: {
      customRender: '',
    },
  },
]
const columnsFiatWithdrawal = [
  {
    title: 'Tarih',
    dataIndex: 'DateTime',
    key: 'DateTime',

    width: '15%',
    scopedSlots: {
      customRender: 'DateTime',
    },
  },
  {
    title: 'Birim',
    dataIndex: 'Asset',
    key: 'Asset',
    width: '18%',

    scopedSlots: {
      customRender: 'Asset',
    },
  },
  {
    title: 'Miktar',
    dataIndex: 'Amount',
    key: 'Amount',
    width: '18%',

    scopedSlots: {
      customRender: 'Amount',
    },
  },
  {
    title: 'Hesap Numarası',
    dataIndex: 'To',
    key: 'To',
    width: '10%',

    scopedSlots: {
      customRender: 'To',
    },
  },
  {
    title: 'Durum',
    dataIndex: 'Status',
    key: 'Status',
    width: '10%',

    scopedSlots: {
      customRender: 'Status',
    },
  },
]
const columnsTranfer = [
  {
    title: 'Nereden',
    dataIndex: 'From',
    key: 'From',

    scopedSlots: {
      customRender: 'From',
    },
  },
  {
    title: 'Nereye',
    dataIndex: 'To',
    key: 'To',

    scopedSlots: {
      customRender: 'To',
    },
  },
  {
    title: 'Miktar',
    dataIndex: 'Amount',
    key: 'Amount',

    scopedSlots: {
      customRender: 'Amount',
    },
  },
  {
    title: 'Birim',
    dataIndex: 'Asset',
    key: 'Asset',

    scopedSlots: {
      customRender: 'Asset',
    },
  },
  {
    title: 'Tarih',
    dataIndex: 'CreatedOn',
    key: 'CreatedOn',
    class: 'date',
    scopedSlots: {
      customRender: 'CreatedOn',
    },
  },
]
export default {
  name: 'Price',
  data() {
    return {
      dataRelevant: [],
      dataFiatRelevant: [],
      dataTransfer: [],
      originalData: [],
      pagination: {
        pageSize: 15,
        total: 200,
        current: 1,
      },
      paginationRelevant: {
        pageSize: 10,
        total: 0,
        current: 1,
      },
      deneme: {},

      fromToDropdownContent: [],
      unitDromDownContent: [],
      transferListSearch: {
        fromValue: 'ALL',
        toValue: 'ALL',
        unitValue: '',
      },

      alert: false,
      searchInput: null,
      loading: false,
      totalSpotBalanceInBtc: 0,
      columnsTranfer,
      columnsWithdrawal,
      isMobile: false,
      activeKey: ['1'],
      columnsFiatWithdrawal,

      shownHistory: 'depozito',

      WithdrawalExpandedRowKeys: [],
      FiatWithdrawalExpandedRowKeys: [],

      dataRelevantExpandedKeys: [],
    }
  },
  mounted() {
    this.isMobile = window.innerWidth < 1000

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1000
    })

    this.getDepositHistory()
    this.getDropdownContent()
    this.getTransferHistory()
    this.getFiatDepositHistory()
    this.getReleventHistory('depozito')
  },

  methods: {
    getRowKeyForWithdrawalData(record) {
      if (this.shownHistory === 'depozito') {
        return record.TxId
      } else {
        return record.TxHash
      }
    },
    setWithdrawalExpandedRowKeys(expanded, record) {
      if (expanded) {
        this.WithdrawalExpandedRowKeys = [record.withdrawGUID]
      } else {
        this.WithdrawalExpandedRowKeys = []
      }
    },
    setFiatWithdrawalExpandedRowKeys(expanded, record) {
      if (expanded) {
        this.FiatWithdrawalExpandedRowKeys = [record.Identifier]
      } else {
        this.FiatWithdrawalExpandedRowKeys = []
      }
    },
    setdataReleventExpandKeys(expanded, record) {
      if (expanded) {
        if (this.shownHistory === 'depozito') {
          this.dataRelevantExpandedKeys = [record.TxId]
        } else {
          this.dataRelevantExpandedKeys = [record.TxHash]
        }
      } else {
        this.dataRelevantExpandedKeys = []
      }
    },

    handleTableChange(pagination) {
      this.getTransferHistory(
        'ALL',
        'ALL',
        pagination.current - 1,
        pagination.pageSize
      )
      console.log('ben çalıştım')
      this.pagination = pagination
      console.log(this.pagination)
    },
    expandIcon(props) {
      const text = (
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="6"
            viewBox="0 0 11 6"
          >
            <g
              id="Group_5807"
              data-name="Group 5807"
              transform="translate(-1839 -531)"
            >
              <path
                id="Polygon_17"
                data-name="Polygon 17"
                d="M5.5,0,11,6H0Z"
                transform="translate(1850 537) rotate(180)"
                fill="#858e9d"
              />
            </g>
          </svg>
        </span>
      )

      return (
        <a
          class="expand-row-icon"
          onClick={(e) => props.onExpand(props.record, e)}
          style={{ color: 'blue', cursor: 'pointer' }}
        >
          {text}
        </a>
      )
    },
    searchTransfer(isSearch) {
      if (isSearch) {
        console.log('ben çalıştım')
        console.log(this.transferListSearch)
        this.getTransferHistory(
          this.transferListSearch.unitValue,
          this.transferListSearch.fromValue,
          this.transferListSearch.toValue,
          this.pagination.current - 1,
          this.pagination.pageSize
        )
      } else {
        this.transferListSearch = {
          fromValue: 'ALL',
          toValue: 'ALL',
          unitValue: '',
        }
        this.getTransferHistory()
      }
    },

    searchCoin() {
      let filteredData = this.data.filter((element) =>
        element.asset.toLowerCase().includes(this.searchInput.toLowerCase())
      )
      this.data = this.searchInput === '' ? this.originalData : filteredData
    },
    handleChangeFrom(e) {
      this.transferListSearch.fromValue = e
      this.getTransferHistory(
        this.transferListSearch.unitValue,
        this.transferListSearch.fromValue,
        this.transferListSearch.toValue
      )
    },

    handleChangeTo(e) {
      this.transferListSearch.toValue = e
      this.getTransferHistory(
        this.transferListSearch.unitValue,
        this.transferListSearch.fromValue,
        this.transferListSearch.toValue
      )
    },
    handleChangeUnit(e) {
      this.transferListSearch.unitValue = e
      this.getTransferHistory(
        this.transferListSearch.unitValue,
        this.transferListSearch.fromValue,
        this.transferListSearch.toValue
      )
    },
    handleSwitch() {
      ;[this.transferListSearch.fromValue, this.transferListSearch.toValue] = [
        this.transferListSearch.toValue,
        this.transferListSearch.fromValue,
      ]
    },
    getReleventHistory(e) {
      console.log(e)
      this.shownHistory = e
      switch (e) {
        case 'depozito':
          this.getDepositHistory()
          break
        case 'withdraw':
          this.getWithdrawHistory(
            this.paginationRelevant.current - 1,
            this.paginationRelevant.pageSize
          )
          break

        default:
          break
      }
    },
    getReleventFiatHistory(e) {
      console.log(e)
      switch (e) {
        case 'fiatwithdraw':
          this.getFiatWithdrawHistory()

          break
        case 'fiatdeposit':
          this.getFiatDepositHistory(
            this.paginationRelevant.current - 1,
            this.paginationRelevant.pageSize
          )
          break
        default:
          break
      }
    },
    async getDepositHistory() {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL + '/GetDepositHistory',
          {
            headers: authHeaders,
          }
        )
        console.log(response)
        if (response.data) {
          // TODO: response.data['Message']
          this.loading = false
          this.dataRelevant = response.data.DepositHistory
          console.log('[data relevant]', response.data.DepositHistory)
          // this.originalData = response.data.UserSpotBalance
          // this.totalSpotBalanceInBtc = response.data.TotalSpotBalanceInBtc
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getWithdrawHistory(offset = 0, RowSize = 10) {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL +
            `/GetWithdrawHistory?Offset=${offset}&RowSize=${RowSize}`,
          {
            headers: authHeaders,
          }
        )
        console.log(response)
        if (response.data) {
          this.paginationRelevant.total = response.data.Max
          this.paginationRelevant.current = offset + 1
          console.log(response.data)
          this.dataRelevant = response.data.WithdrawRecordList
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getFiatWithdrawHistory() {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL + `/GetFiatWalletWithdrawHistory`,
          {
            headers: authHeaders,
          }
        )
        console.log(response)
        if (response.data) {
          console.log(response.data)
          this.dataFiatRelevant = response.data.FiatWalletWithdraw
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getFiatDepositHistory(offset = 0, RowSize = 10) {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL +
            `/GetUserFiatWalletDepositPage?Offset=${offset}&RowSize=${RowSize}`,
          {
            headers: authHeaders,
          }
        )
        console.log(response)
        if (response.data) {
          console.log('b')
          this.paginationRelevant.total = response.data.Max
          this.paginationRelevant.current = offset + 1
          console.log(response.data)
          this.dataFiatRelevant = response.data.FiatDepositList
        }
      } catch (e) {
        console.log(e)
      }
    },
    async getTransferHistory(
      asset = '',
      from = 'ALL',
      to = 'ALL',
      offset = 0,
      RowSize = 15
    ) {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL +
            `/GetTransferHistory?Asset=${asset}&From=${from}&To=${to}&Offset=${offset}&RowSize=${RowSize}`,
          {
            headers: authHeaders,
          }
        )

        if (response.data) {
          // TODO: response.data['Message']
          this.dataTransfer = response.data.TransferHistory
          this.pagination.total = response.data.Max
          this.pagination.current = offset + 1

          console.log('ben çalıştıms')
          console.log('[data transfer]', this.dataTransfer)
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
          this.unitDromDownContent = response.data.AssetList.map(
            ({ Name }) => Name
          )

          console.log('dropdown')
          console.log(this.unitDromDownContent)
          // this.originalData = response.data.UserSpotBalance
          // this.totalSpotBalanceInBtc = response.data.TotalSpotBalanceInBtc
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/main.scss';
.select {
  @media (max-width: 1000px) {
    width: 250px !important;
  }
}
.history {
  padding: 25px 0 0 24px;
}
.breadcrumb {
  font-size: 12px;
  padding-bottom: 58px;
}

.mobile-dataDisplay {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 0;
  font-size: 14px;
  .data {
    max-width: 75%;
    &_overflow {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .ant-tag {
    margin-right: 0;
  }
  .data-grid {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 3px;

    .label {
      font-family: Roboto-Bold;
    }
  }
}

.table-grid {
  max-width: 80vw;
  height: 1150px;

  background: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  padding: 20px;
  @media (max-width: 1000px) {
    height: 100%;
    width: 100%;
    max-width: none;
  }
}

.switch-icon {
  align-self: flex-end;
  cursor: pointer;
  margin: 0 10px;
  @media (max-width: 1000px) {
    align-self: center;
    margin-top: 15px;
  }
}
.type-row {
  display: flex;
  flex-direction: row;
  justify-content: se-between;
  align-items: center;
  margin-bottom: 26px;

  .export {
    color: #292b31;
    text-decoration: none;
    cursor: pointer;
    justify-self: flex-end;
    &:hover {
      text-decoration: underline;
    }
  }
}

.input-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 26px;
  @media (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
  }
  .inputs {
    display: flex;
    @media (max-width: 1000px) {
      flex-direction: column;
      justify-content: center;
    }
    .single-input {
      display: flex;
      flex-direction: column;
      margin-right: 15px;
      @media (max-width: 1000px) {
        align-self: center;
        margin-top: 15px;
      }
    }
  }
  .buttons {
    align-self: flex-end;
    @media (max-width: 1000px) {
      align-self: center;
      margin-top: 30px;
    }
    .button {
      background: #ffffff 0% 0% no-repeat padding-box;
      width: 88px;
      height: 32px;
      &.reset {
        border: 1px solid #eaecef;
        border-radius: 3px;
      }
      &.search {
        border: 1px solid #1ba4e8;
        color: #1ba4e8;
        border-radius: 3px;
      }
    }
  }
}
.with-drawal {
  display: flex;
  flex-direction: column;
}
.date {
  span {
    font-weight: 500;
  }
}
.history-expanded-row {
  font-weight: 500;
  margin-right: 214px;
  text-align: right;
  margin-bottom: 0;
}
.history-item-title {
  display: inline-block;
  text-align: left;
  width: 90px;
}

.break-column-data {
  word-break: break-all;
}
</style>
