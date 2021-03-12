<template>
  <div class="Roboto-Regular">
    <a-col offset="2">
      <div class="p2p-history-title">Tüm P2P İşlem Geçmişi</div>
    </a-col>

    <a-col class="Roboto-Bold" offset="2" style="margin-top: 20px">
      <a-table :columns="columns" :data-source="data" class="components-table-demo-nested">
        <span
          slot="Type"
          slot-scope="Type, record"
          :style="Type === 'BUY' ? 'color: #5CB56A' : 'color: #FD0D1B'"
        >{{ Type === 'BUY' ? 'Alıcı' : 'Satıcı' }}</span>
        <template v-slot:expandedRowRender="record, index, indent, expanded">
          <a-table :data-source="record.OTC_RequestList" :pagination="false">
            <a-table-column title="Alıcı / Satıcı" data-index="P2PRequestUsername" />
            <a-table-column title="Miktar" data-index="Amount" />
            <a-table-column title="Toplam" data-index="FiatPrice" />
            <a-table-column title="Tarih" data-index="UpdatedOn" />
            <a-table-column title="Durum" data-index="Status" />
            <a-table-column
              title
              data-index="operation"
              key="operation"
              :scopedSlots="{ customRender: 'operation' }"
            />
          </a-table>
        </template>
      </a-table>
    </a-col>
  </div>
</template>

<script>
const columns = [
  {
    title: 'Satıcı/Alıcı',
    dataIndex: 'Type',
    scopedSlots: { customRender: 'Type' },
  },
  { title: 'Miktar', dataIndex: 'AssetAmount', key: 'AssetAmount' },
  { title: 'Fiyat', dataIndex: 'Asset', key: 'Asset' },
  { title: 'Kullanılabilir', dataIndex: 'Available', key: 'Available' },
  { title: 'Durum', dataIndex: 'Status', key: 'Status' },
  {
    title: 'Talem Sayısı',
    dataIndex: 'OpenRequestNumber',
    key: 'OpenRequestNumber',
  },
  {
    title: 'İlan Numarası',
    dataIndex: 'OTC_OrderUniqueID',
    key: 'OTC_OrderUniqueID',
  },
]

export default {
  name: 'History',

  data: () => ({
    data: null,
    columns,
    innerData: null,
  }),

  async mounted() {
    await this.getP2POpenOrders()
  },

  methods: {
    async getP2POpenOrders() {
      const { $axios, $config, $cookies } = this
      let authHeader = { Authorization: 'Bearer ' + $cookies.get('Token') }
      const response = await $axios.get(
        $config.FINANCE_API_URL + '/GetP2PMyAllOrderAndRequestList',
        { headers: authHeader }
      )
      console.log(response)
      if (response.data.Success) {
        this.data = response.data.OpenOrderList
      }
    },

    async editP2POrder(orderUniqueId) {
      const { $axios, $config, $cookies } = this
      let authHeader = { Authorization: 'Bearer ' + $cookies.get('Token') }
      const response = await $axios.post(
        $config.FINANCE_API_URL + '/EditP2POrder',
        {
          Activate: true,
          OrderUniqueId: orderUniqueId,
        },
        { headers: authHeader }
      )
      if (response.data.Success) {
        console.log(response.data)
      }
    },
  },
}
</script>

<style scoped>
.p2p-history-title {
  text-align: left;
  font: normal normal normal 32px Roboto;
  letter-spacing: 0;
  color: #1c2640;
  opacity: 1;
  margin-top: 20px;
}
</style>
