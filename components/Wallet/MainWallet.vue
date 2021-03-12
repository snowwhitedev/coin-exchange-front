<template>
  <div class="price">
    <h1>{{ $t('main_wallet_label') }}</h1>

    <div class="total">
      <div class="left-total">
        <p>{{ $t('main_wallet_approximate_balance') }}</p>

        <div class="left-total-bottom">
          <p class="amount">
            <span v-if="isSecret">{{ secret }}</span>
            <span v-else>{{ totalSpotBalanceInBtc.toFixed(8) }}</span>
          </p>
          <div class="d-flex">
            <p class="type">BTC</p>
            <p class="equals">
              =₺
              <span v-if="isSecret">{{ secret }}</span>
              <span v-else>{{ totalSpotBalanceInTL.toFixed(8) }}</span>
            </p>
          </div>

          <a-button @click="changeSecret" class="hide-show-btn">
            <img
              src="~/assets/images/eye.svg"
              width="15"
              style="margin-right: 5px"
            />
            {{ $t('main_wallet_show_balance') }}
          </a-button>
        </div>
      </div>
      <div class="right-total">
        <div class="right-total__link">
          <a href="/my/wallet/history">{{ $t('main_wallet_history') }}</a>
        </div>
        <nuxt-link :to="localePath('/my/wallet/main-wallet/deposit/BTC')">
          <button
            class="deposit-button bg-blue"
            v-on:click="SET_CURRENT_TAB('MainWalletDeposit')"
          >
            {{ $t('main_text_withdraw') }}
          </button>
        </nuxt-link>
        <button
          class="deposit-button"
          v-on:click="SET_CURRENT_TAB('MainWalletWithdraw')"
        >
          {{ $t('main_text_withdraw') }}
        </button>
        <!--  Transfer Button
        <button class="deposit-button" @click="showModal">
          {{ $t('main_wallet_transfer') }}
          <img src="../../assets/images/transfer.svg" alt />
        </button> -->
        <a-modal
          v-model="visible"
          title="Transfer Et"
          @ok="handleOk"
          :footer="null"
        >
          <TransferPopUp />
        </a-modal>
      </div>
    </div>

    <div class="table-grid">
      <div class="search">
        <a-input
          class="search-input"
          v-ant-ref="(c) => (searchInput = c ? c.stateValue : null)"
          @change="onInputChange"
          @pressEnter="searchCoin"
          placeholder="Ara"
        />
        <!--<a-<a-button @click="onChange">
          <img
            class="right-total__link"
            src="~/assets/images/eye.svg"
            width="15"
            style="margin-right: 5px"
          />
          <span v-if="this.hideZeroBalance"> Düşük Bakiyeleri Gizle</span>
          <span v-else> Düşük Bakiyeleri Göster</span>
        </a-button>
        <a-checkbox class="checkbox"
        @change="(e) => onChange(e)">Düşük Bakiyeleri Gizle</a-checkbox>-->
        <a-button
          @click="searchCoin"
          style="padding: 0 10px"
          type="primary"
          class="search-ara"
          >{{ $t('main_wallet_search') }}</a-button
        >
        <a class="search-reset-coin" @click="resetCoin">{{
          $t('main_wallet_reset')
        }}</a>
      </div>

      <a-table
        :columns="isMobile ? mobileColumns : columns"
        :row-key="(record, index) => index"
        :pagination="pagination"
        :data-source="data"
        :loading="loading"
        @change="handleTableChange"
        class="table"
      >
        <template slot="asset" slot-scope="asset, Name">
          <div class="name-slot">
            <img
              width="20"
              height="20"
              :src="require(`~/assets/icons/${Name.asset.toLowerCase()}.svg`)"
              :alt="Name.asset.toLowerCase()"
            />
            <span>{{ asset }}</span>
            <a>{{ Name.Name }}</a>
          </div>
        </template>
        <template slot="locked" slot-scope="locked">
          <span v-if="isSecret">{{ secret }}</span>
          <span v-else>{{ locked.toFixed(8) }}</span>
        </template>
        <template slot="free" slot-scope="free">
          <span v-if="isSecret">{{ secret }}</span>
          <span v-else>{{ free.toFixed(8) }}</span>
        </template>
        <template slot="TotalUSD" slot-scope="TotalUSD">
          <span v-if="isSecret">{{ secret }}</span>
          <span v-else>{{ TotalUSD.toFixed(8) }}</span>
        </template>
        <template slot="BtcQty" slot-scope="BtcQty">
          <span v-if="isSecret">{{ secret }}</span>
          <span v-else>{{ BtcQty.toFixed(8) }}</span>
        </template>
        <template
          slot="actions"
          class="action-buttons"
          slot-scope="asset, Name"
        >
          <!-- <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="() => onDelete(record.key)"
          >-->
          <!-- <a :class="[{ deactivated : isDepositSuspended }]">Yatır</a> -->

          <nuxt-link
            :to="localePath('/my/wallet/main-wallet/deposit/' + Name.asset)"
            >{{ $t('main_wallet_deposit') }}</nuxt-link
          >
          <nuxt-link
            :to="localePath('/my/wallet/main-wallet/withdraw/' + Name.asset)"
            >{{ $t('main_wallet_withdraw') }}</nuxt-link
          >
          <!-- <nuxt-link to="/trade">Trade</nuxt-link> -->
          <nuxt-link
            v-if="Name.asset === 'BTC' || Name.asset === 'USDT'"
            :to="localePath('/trade/BTC_USDT')"
            >{{ $t('main_wallet_trade') }}</nuxt-link
          >
          <nuxt-link v-else :to="localePath('/trade/' + Name.asset + '_BTC')">
            {{ $t('main_wallet_trade') }}
          </nuxt-link>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { isMobile } from 'mobile-device-detect'

const columns = [
  {
    title: 'Birim',
    dataIndex: 'asset',
    key: 'asset',

    width: '20%',
    scopedSlots: {
      customRender: 'asset',
    },
  },
  {
    title: 'Kullanılabilir',
    dataIndex: 'free',
    key: 'free',
    width: '15%',

    scopedSlots: {
      customRender: 'free',
    },
  },
  {
    title: 'İşlemde',
    dataIndex: 'locked',
    key: 'locked',
    width: '15%',

    scopedSlots: {
      customRender: 'locked',
    },
  },
  {
    title: 'Toplam',
    dataIndex: 'TotalUSD',
    key: 'TotalUSD',
    width: '15%',

    scopedSlots: {
      customRender: 'TotalUSD',
    },
  },
  {
    title: 'BTC Karşılığı',
    dataIndex: 'BtcQty',
    key: 'BtcQty',
    width: '15%',

    scopedSlots: {
      customRender: 'BtcQty',
    },
  },
  {
    title: '',
    dataIndex: 'actions',
    key: 'actions',
    class: 'action-header',
    className: 'action-buttons',
    scopedSlots: { customRender: 'actions' },
  },
]
const mobileColumns = [
  {
    title: 'Birim',
    dataIndex: 'asset',
    key: 'asset',

    width: '20%',
    scopedSlots: {
      customRender: 'asset',
    },
  },

  {
    title: 'Toplam',
    dataIndex: 'TotalUSD',
    key: 'TotalUSD',
    width: '15%',

    scopedSlots: {
      customRender: 'TotalUSD',
    },
  },
]
export default {
  name: 'Price',
  components: {
    TransferPopUp: () => import('@/components/Wallet/TransferPopUp'),
  },
  data() {
    return {
      data: [],
      originalData: [],
      pagination: {
        pageSize: 17,
      },
      searchInput: null,
      loading: false,
      totalSpotBalanceInBtc: 0,
      totalSpotBalanceInTL: 0,
      columns,
      mobileColumns,
      isMobile,
      visible: false,
      isSecret: false,
      secret: '*******',
      hideZeroBalance: false,
    }
  },
  mounted() {
    this.asyncData()
  },
  methods: {
    changeSecret() {
      this.isSecret = !this.isSecret
    },
    ...mapMutations({
      SET_CURRENT_TAB: 'wallet/SET_CURRENT_TAB',
    }),
    showModal() {
      this.visible = true
    },
    handleOk() {
      this.visible = false
    },

    handleTableChange(pagination, filters, sorter) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loading = false
    },
    onInputChange(e) {
      console.log(e)
      this.data = this.originalData
    },
    onChange() {
      //let isChecked = e.target.checked
      if (this.hideZeroBalance) {
        let filteredData = this.data.filter((element) => element.free !== 0)
        this.data = filteredData
        this.hideZeroBalance = false
      } else {
        this.data = this.originalData
        this.hideZeroBalance = true
      }
    },
    searchCoin() {
      let filteredData = this.data.filter((element) =>
        element.asset.toLowerCase().includes(this.searchInput.toLowerCase())
      )
      this.data = this.searchInput === '' ? this.originalData : filteredData
    },
    resetCoin() {
      this.data = this.originalData
    },

    async asyncData() {
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
          // TODO: response.data['Message']
          this.loading = false
          this.data = response.data.UserSpotBalance
          this.originalData = response.data.UserSpotBalance
          this.totalSpotBalanceInBtc = response.data.TotalSpotBalanceInBtc
          this.totalSpotBalanceInTL = response.data.TotalSpotBalanceInTRY
        }
      } catch (e) {
        console.log(e)
        // if ('response' in e) {
        //   const { status } = e.response
        //   if (status == 400) {
        //     return true
        //   }
        // } else {
        //   redirect('/404')
        // }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/main.scss';

.price {
  padding: 25px 0 0 24px;
  @media screen and (max-width: 767px) {
    padding: 10px;
  }
}
.breadcrumb {
  font-size: 12px;
  padding-bottom: 58px;
}
.table {
  width: 80vw;

  align-self: center;
}

.deactivated {
  pointer-events: none;
  color: #bbc0c7;
}

.total {
  padding-top: 24px;
  padding-bottom: 24px;
  min-width: 80vw;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 3px #0000000f;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 21px;
  .left-total {
    position: relative;
    padding: 0 22px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      font-size: 14px;
      letter-spacing: 0px;
      color: #788191;
      margin: 0;
    }
    @media screen and (max-width: 767px) {
      width: 100%;
      .hide-show-btn {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  @media (max-width: 1000px) {
    max-width: 350px;
    justify-content: space-around;
    align-items: flex-start;
    flex-direction: column;
  }
  .left-total-bottom {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    @media (max-width: 1000px) {
      flex-direction: column;
      align-items: flex-start;
    }
    button {
      background: #ffffff 0% 0% no-repeat padding-box;
      border: 1px solid #eaecef;
      border-radius: 3px;
      width: 122px;
      height: 20px;
      font-size: 12px;
      color: #212833;
      margin-bottom: 6px;
    }
    .amount {
      font-size: 32px;
      letter-spacing: -0.61px;
      color: #1e2026;
    }
    .type {
      font-size: 14px;
      letter-spacing: -0.27px;
      color: #0d0d0d;
      padding-bottom: 6px;
    }
    .equals {
      padding-bottom: 6px;
      padding-right: 16px;
    }
  }

  .right-total {
    display: flex;
    align-items: center;
    padding-right: 23px;
    flex-wrap: wrap;
    &__link {
      flex-basis: 100%;
      text-align: right;
      margin-bottom: 15px;
      padding-right: 15px;
      @media (min-width: 1000px) {
        flex-basis: auto;
        order: 4;
        margin-bottom: 0;
      }
    }
    .deposit-button {
      background-color: white;
      width: 96px;
      height: 32px;
      border: 1px solid #eaecef;
      border-radius: 3px;
      opacity: 1;
      font-size: 14px;
      color: #1e2026;
      margin-right: 14px;
      img {
        display: inline-block;
      }
      @media (max-width: 1000px) {
        margin-right: 5px;
      }
    }
    @media (max-width: 1000px) {
      padding-right: 0;
      padding-left: 23px;
    }
    .bg-blue {
      background: #90dafe 0% 0% no-repeat padding-box;
    }
    a {
      text-decoration: underline;
    }
  }
}

.table-grid {
  min-width: 85vw;
  height: 1150px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media (max-width: 1000px) {
    max-width: 350px;
    height: 100%;
  }
  .search {
    padding: 20px 0;
  }
}
.search {
  width: 320px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 35px;
  .search-input {
    width: 180px;
    border: none;
    border-bottom: 1px solid #e6e8ea;
  }
  @media (max-width: 1000px) {
    width: 100%;
    margin-left: 0;
    .checkbox {
      width: 150px;
    }
    .search-ara,
    .search-reset-coin {
      display: none;
    }
  }
}

.name-slot {
  width: 100%;
  display: flex;
  align-items: center;
  img {
    margin-right: 15px;
  }
  span {
    padding-right: 5px;
  }
  a {
    text-decoration: underline;
    font-size: 14px;
    color: #788191;
  }
}
</style>
