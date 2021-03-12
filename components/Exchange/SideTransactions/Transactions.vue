<template>
  <div class="transactions h-100">
    <a-card :style="styles" class="h-100">
      <div class="exchange-table">
        <div v-if="showTableHeaders" class="exchange-table__head">
          <div class="exchange-table__head-item Roboto-Regular">
            {{ $t('exchange_price') }} ({{ getSymbolData.QuatoAsset }})
          </div>
          <div class="exchange-table__head-item Roboto-Regular">
            {{ $t('exchange_amount') }} ({{ getSymbolData.BaseAsset }})
          </div>
          <div class="exchange-table__head-item Roboto-Regular">
            {{ $t('exchange_total') }} ({{ getSymbolData.QuatoAsset }})
          </div>
        </div>
        <div class="table-overlay" id="dataTable" ref="dataTable">
          <table class="no-even-bg">
            <tbody class="Roboto-Medium">
              <tr
                v-for="(item, index) in list"
                :key="index"
                class="cursor-pointer"
                @click="updateActionItems(item)"
              >
                <td :class="valueColClass">
                  {{ formatPrice(item[0]) }}
                </td>
                <td style="text-align: right">
                  {{ formatAmount(item[1]) }}
                </td>
                <td style="text-align: right">
                  {{ formatTotal(Number(item[0]) * Number(item[1])) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import formatter from '~/Mixins/formatter'
export default {
  mixins: [formatter],
  props: {
    type: {
      type: String,
      default: 'asks',
    },
    list: {
      default: () => [],
      type: Array,
    },
    valueColClass: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 9,
    },
    styles: {
      type: Object,
      required: false,
    },
    showTableHeaders: {
      required: false,
      default: true,
    },
    scrollPos: {
      type: String,
      default: 'top',
    },
  },
  methods: {
    updateActionItems(v) {
      this.$store.commit('transactions/updateActionPrice', v[0])
      if (this.type === 'asks') {
        this.$store.commit('transactions/updateActionBuyTotal', v[1])
      }
      if (this.type === 'bids') {
        this.$store.commit('transactions/updateActionSellQuantity', v[1])
      }
    },
  },
  computed: {
    ...mapGetters({
      getSymbolData: 'symbol/getSymbolData',
    }),
    listLimit() {
      const { list } = this
      if (list.length === 0) return
      return new Array(this.limit).fill(0).map((v, i) => {
        return list[i]
      })
    },
  },
  watch: {
    list: {
      handler() {
        if (this.scrollPos === 'bottom') {
          const container = this.$el.querySelector('#dataTable')
          container.scrollTop = container.scrollHeight
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (process.client && this.scrollPos === 'bottom') {
      const container = this.$el.querySelector('#dataTable')
      container.scrollTop = container.scrollHeight
    }
  },
}
</script>

<style lang="scss">
.transactions {
  .exchange-table__head-item {
    color: #b1b2b2;
  }

  .table-overlay {
    overflow-y: scroll !important;

    table tbody tr td:first-child {
      cursor: pointer;
    }
  }

  .ant-card {
    display: flex;
    flex-direction: column;

    &-body {
      height: 100%;
      padding: 16px;
    }
  }
}
</style>
