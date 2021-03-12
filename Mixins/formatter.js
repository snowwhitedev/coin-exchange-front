import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {
            SymbolPriceDecimalLenght: null,
            SymbolQuantityDecimalLenght: null,
            SymbolTotalDecimalLenght: null,
        }
    },
    computed: {
        ...mapGetters({
            getSymbolData: 'symbol/getSymbolData',
        })
    },
    mounted() {
        let { SymbolPriceDecimalLenght, SymbolQuantityDecimalLenght, SymbolTotalDecimalLenght } = this.getSymbolData
        this.SymbolPriceDecimalLenght = SymbolPriceDecimalLenght
        this.SymbolQuantityDecimalLenght = SymbolQuantityDecimalLenght
        this.SymbolTotalDecimalLenght = SymbolTotalDecimalLenght
    },
    methods: {
        formatPrice(val) {
            return new Intl.NumberFormat('en', { minimumFractionDigits: this.getSymbolData.SymbolPriceDecimalLenght }).format(val)
        },
        formatAmount(val) {
            return new Intl.NumberFormat('en', { minimumFractionDigits: this.getSymbolData.SymbolQuantityDecimalLenght }).format(val)
        },
        formatTotal(val) {
            return new Intl.NumberFormat('en', { minimumFractionDigits: this.getSymbolData.SymbolTotalDecimalLenght }).format(val)
        },
    },
    filters: {
        formatDate(val) {
            moment(val).format('hh:mm:ss')
        }
    }
}