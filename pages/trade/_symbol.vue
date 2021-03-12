<template>
  <div class="exchange-wrapper">
    <div v-if="isMobile">
      <StatusBarMobile :statistics="fiatTicker" />
      <MobileTabs
        @cancelOpenOrder="cancelOrder"
        :isOpenOrdersLoading="isOpenOrdersLoading"
        :UserBalance="UserBalance"
        :transactions="fiatTransactions"
        :last-price="fiatTicker.last"
        :LastTransactionsData="lastTransactionsData"
        :openOrdersData="openOrdersList"
        :last24HoursData="ordersLast24Hour"
      />
    </div>

    <div v-if="!isMobile">
      <StatusBar :statistics="fiatTicker" />
      <div class="container content">
        <a-row type="flex" :gutter="15">
          <a-col :span="5">
            <SideTransactions
              :transactions="fiatTransactions"
              :last-price="fiatTicker.last"
            />
          </a-col>
          <a-col :span="14">
            <div class="trade-column h-100">
              <Chart />
              <Actions :UserBalance="UserBalance" @tradeUpdate="tradeUpdate" />
            </div>
          </a-col>
          <a-col :span="5">
            <div class="symbols-column h-100">
              <Favorites />
              <LastTransactions :LastTransactionsData="lastTransactionsData" />
            </div>
          </a-col>
        </a-row>

        <a-row style="margin: 30px auto">
          <a-col :span="24">
            <a-tabs :animated="false">
              <a-tab-pane
                v-for="ord in orderTypes"
                :key="ord.key"
                class="Roboto-Medium"
                :class="{
                  'tab-label-active': ord.key === activeOrderTypeKey,
                  'tab-label-inactive': ord.key !== activeOrderTypeKey,
                }"
              >
                <span
                  v-if="ord.key === 'Open Orders'"
                  class="order-type-title Roboto-Medium"
                  slot="tab"
                >
                  Açık İşlemler
                </span>
                <span
                  v-if="ord.key === 'last24HOrders'"
                  class="order-type-title Roboto-Medium"
                  slot="tab"
                >
                  Son 24 Saatteki İşlemler
                </span>
                <Transactions
                  v-show="ord.key === 'Open Orders'"
                  title="Açık İşlemler"
                  :orders="openOrdersList"
                  :show-cancel-button="true"
                  :is-loading="isOpenOrdersLoading"
                  @cancelOpenOrder="cancelOrder"
                />
                <Transactions
                  v-show="ord.key === 'last24HOrders'"
                  title="Son 24 Saatteki İşlemler"
                  :orders="ordersLast24Hour"
                />
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import StatusBar from '~/components/Exchange/StatusBar'
import Chart from '~/components/Exchange/Chart'
import LastTransactions from '~/components/Exchange/LastTransactions'
import Favorites from '~/components/Exchange/Favorites'
import Transactions from '~/components/Exchange/Transactions'
import Actions from '~/components/Exchange/Actions'
import SideTransactions from '~/components/Exchange/SideTransactions/index'
import StatusBarMobile from '~/components/Exchange/ExchangeMobile/StatusBarMobile'
import MobileTabs from '~/components/Exchange/ExchangeMobile/MobileTabs'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  middleware: ['auth'],
  components: {
    StatusBar,
    Chart,
    LastTransactions,
    Transactions,
    Actions,
    SideTransactions,
    Favorites,
    MobileTabs,
    // mobile components

    StatusBarMobile,
    // ExchangeMobile: () => import('~/components/Exchange/ExchangeMobile/index'),
  },
  data() {
    return {
      orderTypes: [{ key: 'Open Orders' }, { key: 'last24HOrders' }],
      activeOrderTypeKey: 'Open Orders',
      sideTransactions: {},
      ticker: {},
      fiatTicker: {},
      fiatTransactions: {},
      lastTransactionsData: [],
      connection: null,
      fiatWsCon: null,
      fiatAuthCon: null,
      FiatWalletListenKey: null,
      binanceListenKey: null,
      isMobile: null,
      openOrdersList: [],
      isOpenOrdersLoading: false,
      ordersLast24Hour: [],
      UserBalance: {},
      isFirstDealsResponse: true,
    }
  },
  mounted() {
    this.isMobile = window.innerWidth < 1000
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1000
    })
  },
  created() {
    if (process.client) {
      const { $cookies, $store } = this
      if (this.isLoggedIn) {
        this.getListenKey()
      }
      const { QuatoAsset } = this.getSymbolData
      if (QuatoAsset === 'TRY') {
        // create fiat websocket connection
        if (this.fiatWsCon) this.fiatWsCon.close()
        this.setupFiatWS()
      } else {
        // create binance connection
        if (this.connection) this.closeConnection()
        this.makeConnection()
      }
    }
  },
  methods: {
    setupFiatWS() {
      this.fiatWsCon = new WebSocket(this.$config.FIAT_WALLET_SOCKET_URL)

      const { Symbol } = this.getSymbolData

      this.fiatWsCon.onopen = () => {
        this.startFiatPing()

        this.fiatWsCon.send(
          JSON.stringify({
            method: 'state.subscribe',
            params: [Symbol],
            id: 101,
          })
        )
        this.fiatWsCon.send(
          JSON.stringify({
            method: 'depth.subscribe',
            params: [Symbol, 20, '0'],
            id: 102,
          })
        )
        this.fiatWsCon.send(
          JSON.stringify({
            method: 'deals.subscribe',
            params: [Symbol],
            id: 103,
          })
        )
      }
      // listen to stream
      this.fiatWsCon.onmessage = this.updateFiatStream
    },

    startFiatPing() {
      setInterval(() => {
        this.fiatWsCon.send(
          JSON.stringify({
            method: 'server.ping',
            params: [],
            id: 111,
          })
        )
      }, 60000)
    },

    async getListenKey() {
      const {
        $axios,
        $cookies,
        $config: { FINANCE_API_URL },
      } = this
      const authHeaders = { Authorization: 'Bearer ' + $cookies.get('Token') }
      const response = await $axios.get(FINANCE_API_URL + '/GetListenKey', {
        headers: authHeaders,
      })
      if (response.data.Success) {
        const { ListenKey, FiatWalletListenKey } = response.data
        this.FiatWalletListenKey = FiatWalletListenKey
        this.binanceListenKey = ListenKey

        const { QuatoAsset } = this.getSymbolData
        if (QuatoAsset === 'TRY') {
        } else {
          this.closeConnection()
          this.makeConnection()
        }
      }
    },

    updateFiatStream(stream) {
      if (this.isLoggedIn && this.FiatWalletListenKey !== null) {
        this.fiatWsCon.send(
          JSON.stringify({
            method: 'server.auth',
            params: [this.FiatWalletListenKey, 'web'],
            id: 150,
          })
        )
        this.FiatWalletListenKey = null
      }
      const { Symbol, BaseAsset, QuatoAsset } = this.getSymbolData
      let payload = JSON.parse(stream.data)
      if ('id' in payload && payload.id === 150) {
        this.fiatWsCon.send(
          JSON.stringify({
            method: 'order.subscribe',
            params: ['BTCTRY', 'ETHTRY', 'XRPTRY', 'USDTTRY'],
            id: 110,
          })
        )
        this.fiatWsCon.send(
          JSON.stringify({
            method: 'asset.subscribe',
            params: [BaseAsset, QuatoAsset],
            id: 120,
          })
        )
      }

      const { method, params } = JSON.parse(stream.data)
      if (method === 'state.update') {
        this.fiatTicker = params[1]
      } else if (method === 'depth.update') {
        this.updateFiatOrderBook(params)
      } else if (method === 'deals.update') {
        if (Array.isArray(params[1])) {
          if (!this.isFirstDealsResponse) {
            console.log('deals.update', params[1])
            let dealsUpdate = params[1]
            dealsUpdate.forEach((deal) => {
              this.lastTransactionsData.unshift({
                Time: deal.time,
                Qty: deal.amount,
                Price: deal.price,
                IsBuyerMaker: deal.type,
              })
              this.lastTransactionsData.pop()
            })
          }
        } else {
          let dealUpdate = {
            Time: params[1]['time'],
            Qty: params[1]['amount'],
            Price: params[1]['price'],
            IsBuyerMaker: params[1]['type'],
          }
          this.lastTransactionsData.unshift(dealUpdate)
          this.lastTransactionsData.pop()
        }
        this.isFirstDealsResponse = false
      } else if (method === 'order.update') {
        this.updateOpenOrder(params)
      } else if (method === 'asset.update') {
        const { BaseAsset, QuatoAsset } = this.getSymbolData
        const { $store } = this
        const balances = Object.entries(params[0])
        balances.forEach(([asset, details]) => {
          if (asset === BaseAsset) {
            $store.commit('symbol/updateBaseBalance', details.available)
            console.log('BaseBalanceUpdate', asset, details.available)
          }
          if (asset === QuatoAsset) {
            $store.commit('symbol/updateQuatoBalance', details.available)
            console.log('QuatoBalanceUpdate', asset, details.available)
          }
        })
      }
    },

    updateOpenOrder(params) {
      const code = params[0]
      const data = params[1]

      const index = this.openOrdersList.findIndex(
        (order) => order.OrderID == data.id
      )
      console.log('order id', data.id)

      let type
      if (data.type === 1) {
        type = 'LIMIT'
      }
      if (data.type === 2) {
        type = 'MARKET'
      }
      let side
      if (data.side === 1) {
        side = 'SELL'
      }
      if (data.side === 2) {
        side = 'BUY'
      }

      const order = {
        OrderID: data.id,
        Time: Math.trunc(data.ctime * 1000),
        Symbol: data.market,
        Type: type,
        Side: side,
        Price: data.price,
        BaseQuantity: data.amount,
        ExecutedBaseQuantity: data.deal_stock,
        ExecutedQuatoQuantity: data.deal_money,
        Status:
          data.deal_stock == 0
            ? 'NEW'
            : data.deal_stock == data.amount
            ? 'FILLED'
            : 'PARTIALLY_FILLED',
      }
      if (index !== -1) {
        //update
        if (code === 2) {
          this.$set(this.openOrdersList, index, order)
          //this.openOrdersList[index] = order
          //this.openOrdersList.push()
        }
        // finish
        if (code === 3) {
          this.$delete(this.openOrdersList, index)
          this.ordersLast24Hour.unshift(order)
        }
      } else {
        if (code == 1 || code == 2) {
          this.openOrdersList.unshift(order)
        } else if (code == 3) {
          this.ordersLast24Hour.unshift(order)
        }
      }
    },

    updateFiatOrderBook(params) {
      if (params[0]) {
        this.fiatTransactions = params[1]
      } else {
        if (Object.keys(params[1]).includes('asks')) {
          let asks = params[1]['asks']
          console.log('asks', asks)
          asks.forEach(([oldAsk, newAsk]) => {
            if (newAsk === '0') {
              this.fiatTransactions.asks = this.fiatTransactions.asks.filter(
                ([oldval, newval]) => oldval !== oldAsk
              )
            } else {
              const index = this.fiatTransactions.asks.findIndex(
                ([oldval, newval]) => oldval === oldAsk
              )
              if (index === -1) {
                this.fiatTransactions.asks.unshift([oldAsk, newAsk])

                // sorting asks by price
                this.fiatTransactions.asks = this.fiatTransactions.asks.sort(
                  ([price1, amount1], [price2, amount2]) => price2 - price1
                )
              } else {
                this.fiatTransactions.asks[index] = [oldAsk, newAsk]
              }
            }
          })
        }
        if (Object.keys(params[1]).includes('bids')) {
          let bids = params[1]['bids']

          bids.forEach(([oldBid, newBid]) => {
            if (newBid === '0') {
              this.fiatTransactions.bids = this.fiatTransactions.bids.filter(
                ([oldval, newval]) => oldval !== oldBid
              )
            } else {
              const index = this.fiatTransactions.bids.findIndex(
                ([oldval, newval]) => oldval === oldBid
              )
              if (index === -1) {
                this.fiatTransactions.bids.unshift([oldBid, newBid])
                // sorting bids by price
                console.log('sorting bids by price ')
                this.fiatTransactions.bids = this.fiatTransactions.bids.sort(
                  ([price1, amount1], [price2, amount2]) => price2 - price1
                )
              } else {
                this.fiatTransactions.bids[index] = [oldBid, newBid]
              }
            }
          })
        }
      }
    },

    makeConnection() {
      this.connection = new WebSocket(this.binanceWSURL)
      this.connection.onmessage = this.update
    },
    closeConnection() {
      this.connection.close()
    },
    update(response) {
      const data = JSON.parse(response.data)

      if ('lastUpdateId' in data) {
        this.fiatTransactions = {
          asks: data.asks,
          bids: data.bids,
        }
        this.fiatTransactions.asks = this.fiatTransactions.asks.sort(
          ([price1, amount1], [price2, amount2]) => price2 - price1
        )
        this.fiatTransactions.bids = this.fiatTransactions.bids.sort(
          ([price1, amount1], [price2, amount2]) => price2 - price1
        )
      }

      if (data.e === '24hrTicker') {
        let tickerData = {
          period: data.p,
          P: data.P,
          high: data.h,
          low: data.l,
          last: data.c,
          volume: data.q,
        }
        this.fiatTicker = tickerData
      }

      if (data.e === 'aggTrade') {
        const tradeData = {
          Time: data.T,
          Qty: data.q,
          Price: data.p,
          IsBuyerMaker: data.m,
        }
        this.lastTransactionsData.pop()
        this.lastTransactionsData.unshift(tradeData)
      }

      if (data.e === 'outboundAccountPosition') {
        const { BaseAsset, QuatoAsset } = this.getSymbolData
        if (QuatoAsset !== 'TRY') {
          const { $store } = this
          const balances = data.B
          balances.forEach((b) => {
            if (b.a === BaseAsset) {
              $store.commit('symbol/updateBaseBalance', b.f)
              console.log('BaseBalanceUpdate', b.f)
            }
            if (b.a === QuatoAsset) {
              $store.commit('symbol/updateQuatoBalance', b.f)
              console.log('QuatoBalanceUpdate', b.f)
            }
          })
        }
      }

      if (data.e === 'executionReport') {
        const order = {
          Time: data.T,
          OrderID: data.i,
          Symbol: data.s,
          Type: data.o,
          Side: data.S,
          Price: data.p,
          BaseQuantity: data.q,
          ExecutedBaseQuantity: data.l,
          ExecutedQuatoQuantity: data.z,
          Status: data.X,
        }

        const { status, index } = this.existsInOpenOrders(data.i)
        const { status2, index2 } = this.existsIn24HOrders(data.i)

        if (data.X === 'NEW') {
          if (!status) {
            this.openOrdersList.unshift(order)
          }
        }
        if (data.X === 'FILLED') {
          if (status) {
            this.$delete(this.openOrdersList, index)
          }
          if (!status2) {
            this.ordersLast24Hour.unshift(order)
          }
        }
        if (data.X === 'PARTIALLY_FILLED') {
          if (status) {
            this.$set(this.openOrdersList, index, order)
          } else {
            this.openOrdersList.unshift(order)
          }
        }
        if (
          data.X === 'CANCELED' ||
          data.X === 'PENDING_CANCEL' ||
          data.X === 'REJECTED' ||
          data.X === 'EXPIRED'
        ) {
          if (status) {
            this.openOrdersList.splice(index, 1)
            if (!status2) {
              this.ordersLast24Hour.unshift(order)
            }
          }
        }
      }
    },

    existsInOpenOrders(id) {
      const index = this.openOrdersList.findIndex((o) => o.OrderID === id)
      return index === -1
        ? { status: false, index: -1 }
        : { status: true, index }
    },

    existsIn24HOrders(id) {
      const index = this.ordersLast24Hour.findIndex((o) => o.OrderID === id)
      return index === -1
        ? { status: false, index: -1 }
        : { status: true, index }
    },

    async cancelOrder(order) {
      // api requesst to cancel order
      let {
        $axios,
        $config: { FINANCE_API_URL },
        $cookies,
      } = this
      let token = $cookies.get('Token')
      this.isOpenOrdersLoading = true
      try {
        const response = await $axios({
          method: 'delete',
          url: FINANCE_API_URL + '/CancelOrder',
          data: {
            Symbol: order.Symbol,
            OrderId: order.OrderID,
          },
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        this.isOpenOrdersLoading = false
        if (response.data.Success) {
          this.getOpenOrders()
        }
      } catch (e) {
        console.error('Failed !', e)
        this.isOpenOrdersLoading = false
      }
    },

    async getOpenOrders() {
      const {
        $axios,
        $cookies,
        $config: { FINANCE_API_URL },
      } = this
      let token = $cookies.get('Token')
      let authHeaders = { Authorization: 'Bearer ' + token }
      this.isOpenOrdersLoading = true
      const response = await $axios.get(FINANCE_API_URL + '/GetOpenOrders', {
        headers: authHeaders,
      })
      if (response.data.Success) {
        const { OpenOrdersList } = response.data
        this.openOrdersList = OpenOrdersList
      }
      this.isOpenOrdersLoading = false
    },

    tradeUpdate(payload) {
      // this.openOrdersList.unshift(payload)
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
    if (!params.symbol) {
      redirect(app.localeRoute('/trade/BTC_USDT'))
    }
    try {
      let symbolresponse
      if (store.state.auth.isLoggedIn) {
        const token = $cookies.get('Token')
        let authHeaders = { Authorization: 'Bearer ' + token }
        symbolresponse = await $axios.get(FINANCE_API_URL + '/GetSymbols', {
          headers: authHeaders,
        })
      } else {
        symbolresponse = await $axios.get(FINANCE_API_URL + '/GetSymbols')
      }
      store.commit('symbol/updateList', symbolresponse.data.SymbolList)
      store.dispatch('symbol/updateData', params.symbol.split('_'))
      if (!store.state.symbol.data) {
        throw new Error('Symbol not found.')
      }

      const { Symbol } = store.state.symbol.data
      // Get last Orders
      const lastTrades = await $axios.get(FINANCE_API_URL + '/GetLastTrades', {
        params: {
          Symbol: Symbol,
        },
      })
      const { Trades } = lastTrades.data
      const token = $cookies.get('Token')
      if (!!token) {
        let authHeaders = { Authorization: 'Bearer ' + token }
        // Get Open Orders
        const openOrdersResponse = await $axios.get(
          FINANCE_API_URL + '/GetOpenOrders',
          {
            headers: authHeaders,
          }
        )
        // Get 24 Hours Orders
        const _24HOrdersResponse = await $axios.get(
          FINANCE_API_URL + '/Get24HOrders',
          {
            headers: authHeaders,
          }
        )

        if (
          openOrdersResponse.data.Success &&
          _24HOrdersResponse.data.Success
        ) {
          const { OpenOrdersList } = openOrdersResponse.data
          const { OrderList } = _24HOrdersResponse.data
          const { Trades } = lastTrades.data

          return {
            openOrdersList: OpenOrdersList,
            ordersLast24Hour: OrderList,
            lastTransactionsData: Trades,
          }
        }
      } else {
        return {
          lastTransactionsData: Trades,
        }
      }
    } catch (e) {
      if ('response' in e) {
        console.error(e.response)
      } else {
        console.error(e)
      }
    }
  },
  computed: {
    ...mapGetters({
      getSymbolData: 'symbol/getSymbolData',
      isLoggedIn: 'auth/isLoggedIn',
    }),
    binanceWSURL() {
      const { Symbol } = this.getSymbolData
      if (this.binanceListenKey !== null) {
        return (
          this.$config.SOCKET_CONNECTION_URL +
          '/' +
          Symbol.toLowerCase() +
          '@aggTrade/' +
          Symbol.toLowerCase() +
          '@ticker/' +
          Symbol.toLowerCase() +
          '@depth20@1000ms/' +
          this.binanceListenKey
        )
      } else {
        return (
          this.$config.SOCKET_CONNECTION_URL +
          '/' +
          Symbol.toLowerCase() +
          '@aggTrade/' +
          Symbol.toLowerCase() +
          '@ticker/' +
          Symbol.toLowerCase() +
          '@depth20@1000ms'
        )
      }
    },
  },
  watch: {
    getSymbolData(newVal, oldVal) {
      if (this.fiatWsCon) this.fiatWsCon.close()
      if (this.connection) this.closeConnection()

      console.log('$route contents', this.$route)

      const { BaseAsset, QuatoAsset } = this.getSymbolData

      window.history.pushState(
        {},
        null,
        '/trade/' + BaseAsset.toString().concat('_', QuatoAsset.toString())
      )

      // reset all data
      this.lastTransactionsData = []
      this.fiatTransactions = {}

      const { $cookies, $store } = this
      if (this.isLoggedIn) {
        this.getListenKey()
      }

      if (QuatoAsset === 'TRY') {
        // create fiat websocket connection
        this.setupFiatWS()
      } else {
        // create binance connection
        this.makeConnection()
      }

      const { Symbol } = this.getSymbolData
      const {
        $axios,
        $config: { FINANCE_API_URL },
      } = this
      $axios
        .get(FINANCE_API_URL + '/GetLastTrades', {
          params: {
            Symbol,
          },
        })
        .then((response) => {
          const { Trades } = response.data
          this.lastTransactionsData = Trades
        })
        .catch((e) => {
          console.log(e)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.exchange-wrapper .content {
  margin-top: 20px;
}

.trade-column, .symbols-column {
  display: flex;
  flex-direction: column;
  min-height: 950px;
}

.order-type-title {
  font-weight: normal;
  font-size: 16px;
}
</style>
