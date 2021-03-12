<template>
    <div style="position: relative;" class="status-bar-mobile" :class="`status-bar-mobile-${getTheme}`">
      <div class="container status-bar-mobile-container">
       <a-row :gutter="16" type="flex" align="middle" style="margin: 15px auto;">
         <a-col :span="8">
           <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center;">
            
            <a-dropdown v-model="symbolsDropDown" @click="symbolsDropDown = true">
              <div class="currency-title">
                {{ getSymbolData.BaseAsset }} /  <span class="currency-title">
                  {{ getSymbolData.QuatoAsset }}
                </span>
                <a-icon type="down" />
               </div>  
                <SymbolsMobile slot="overlay"   :style="{ width: overlayWidth, background: '#0C121E'}" />
            </a-dropdown>
            <div class="currency-last-price">
              {{
                formatPrice(statistics.last)
              }}
            </div>
           </div>
         </a-col>
         <a-col style="text-align: right;" :span="16">
            <a-row :gutter="8">
              <a-col :span="12">
                <div class="statistics-label Roboto-Regular" >24 Saatlik Değişim</div>
              </a-col>
              <a-col :span="12">
                <div class="statistics-value Roboto-Regular" :class="`statistics-value-${
                  get24HourChangeState ? 'success' : 'danger'
                }`">{{
                  formatPrice(statistics.period)
                }}</div>
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="12">
                <div class="statistics-label Roboto-Regular" >24S En Yüksek</div>
              </a-col>
              <a-col :span="12">
                <div class="statistics-value Roboto-Regular">{{
                  formatPrice(statistics.high)
                }}</div>
              </a-col>
            </a-row>  
            <a-row :gutter="8">
              <a-col :span="12">
                <div class="statistics-label Roboto-Regular" >24S En Düşük</div>
              </a-col>
              <a-col :span="12">
                <div class="statistics-value Roboto-Regular">{{
                  formatPrice(statistics.low)
                }}</div>
              </a-col>
            </a-row>
            <a-row :gutter="8">
              <a-col :span="12">
                <div class="statistics-label Roboto-Regular" >24S Hacim ({{ getSymbolData.BaseAsset }})</div>
              </a-col>
              <a-col :span="12">
                <div class="statistics-value Roboto-Regular">{{
                  statistics.volume &&
                `${format(statistics.volume)}`
                }}</div>
              </a-col>
            </a-row>
         </a-col>
       </a-row>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  import SunIcon from '~/assets/icons/sun-icon.svg?inline'
  import NightIcon from '~/assets/icons/night-icon.svg?inline'
  import SymbolsMobile from "~/components/Exchange/ExchangeMobile/SymbolsMobile"
  import formatter from "~/Mixins/formatter"

  
  export default {
    mixins: [formatter],
    components: {
      SunIcon,
      NightIcon,
      SymbolsMobile
    },
    props: {
      statistics: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        theme: false,
        symbolsDropDown: false,
        overlayWidth: '100px'
      }
    },
    computed: {
      get24HourChangeState() {
        return (this.statistics.length && this.statistics.P[0] !== '-') || ''
      },
      ...mapGetters({
        getSymbolData: 'symbol/getSymbolData',
        getTheme: 'common/getTheme',
      }),
    },
    watch: {
      theme(v) {
        if (v) {
          this.$store.commit('common/updateTheme', 'dark')
          this.$cookies.set('theme', 'dark')
        } else {
          this.$store.commit('common/updateTheme', 'light')
          this.$cookies.set('theme', 'light')
        }
      },
    },
    created() {
      this.theme = this.getTheme === 'dark' && true
      this.overlayWidth = window.innerWidth
      window.onresize = (e) => this.overlayWidth = e.target.innerWidth
    },
    methods: {
      format(v) {
        if (!v) return
        return new Intl.NumberFormat().format(v)
      },
    },
  }
  </script>
  
  <style lang="less">
  @import '~/assets/ant/variables.less';
  
  .status-bar-mobile {
    width: 100%;
    background: #000000;
    height: fit-content;
    padding: 12px 0;
  
    &-dark {
      .status-bar-theme-icon * {
        color: #fff;
      }
    }
  
    .status-bar-theme-icon * {
      fill: var(--text-color);
    }
  
    &-container {
      height: 100%;
  
      .status-col {
        display: flex;
        justify-content: space-between;
        flex-direction: column;

      }
  
      .statistics {
        font-size: 16px;
  
        &-small {
          font-size: 11px;
        }
  
        &-col {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          flex-direction: column;
          height: 100%;
        }
  
        &-value {
          font-weight: 500;
          height: 20px;
          font-size: 12px;
          color: white;
          /* color: var(--status-bar-statistics-value-color); */
  
          &-success {
            color: #5cb56a;
          }
  
          &-danger {
            color: var(--danger-color);
          }
        }
        &-label {
          color: var(--status-bar-statistics-label-color);
        }
      }
    }
  }

  .currency-title {
          color: #ffffff;
          font-size: 12px;
          padding-right: 5px;
 }
.currency-last-price {
  font-size: 18px;
  color: #56BD7C;
}
  </style>
  