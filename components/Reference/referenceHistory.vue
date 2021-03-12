<template>
  <div class="referenceHistory">
    <div class="reference-grid container">
      <div class="header">
        <h1>{{ $t('reference_text_reference_history') }}</h1>
        <span></span>
      </div>
      <a-table
        :columns="columns"
        :data-source="referenceDetail"
        @change="handleTableChange"
      ></a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: 'E-Posta',
    dataIndex: 'User',

    width: '33%',
  },
  {
    title: 'Referans Geliri',
    dataIndex: 'Value',
    width: '33%',
  },
  {
    title: 'Tarih',
    dataIndex: 'DateTime',
    width: '33%',
  },
]
import { isMobile } from 'mobile-device-detect'
export default {
  name: 'ReferenceHistory',
  data() {
    return {
      columns,
      referenceDetail: [],
      isMobile,
    }
  },
  mounted() {
    this.getReferencePageDetail()
    console.log(this.isMobile)
  },
  methods: {
    async getReferencePageDetail() {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL +
            `/GetReferencePageDetail?Offset=0&RowSize=10`,
          {
            headers: authHeaders,
          }
        )

        if (response.data) {
          this.referenceDetail = response.data.AwardList

          console.log(this.referenceDetail)
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleTableChange() {},
  },
}
</script>

<style lang="scss" scoped>
.referenceHistory {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 30px 0;
  .reference-grid {
    max-width: 1050px;
    .header {
      margin-bottom: 24px;
      h1 {
        margin: 0;
      }
    }
  }
}
</style>