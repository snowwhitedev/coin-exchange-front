<template>
  <div>
    <a-breadcrumb>
      <a-breadcrumb-item>
        <a @click="$router.push(localeRoute('/account/security'))">{{
          $t('header_text_security')
        }}</a></a-breadcrumb-item
      >
      <a-breadcrumb-item>{{ $t('text_device_management') }}</a-breadcrumb-item>
    </a-breadcrumb>

    <div class="header">
      <h1>{{ $t('text_device_management') }}</h1>
      <p>{{ $t('device_management_text_info') }}</p>
    </div>
    <a-table
      v-if="!isMobile"
      :columns="columns"
      :row-key="(record, index) => index"
      :data-source="deviceManagementData"
      @expand="setDeviceManagementRows"
      :expandIconColumnIndex="4"
      :expandedRowKeys="deviceManagementRowKeys"
      :expandIconAsCell="false"
    >
      <template slot="IP_ItemList" slot-scope="record">
        {{ record[0]['IP'] }}
      </template>
      <template slot="IP_ItemListDate" slot-scope="record">
        {{ record[0]['CreatedOn'] }}
      </template>

      <template slot="actions" slot-scope="record">
        <a @click="deleteDevice(record.DeviceId)"> Sil </a>
      </template>

      <div slot="expandedRowRender" slot-scope="record">
        <table>
          <tbody class="ant-table-tbody">
            <tr
              class="ant-table-row"
              v-for="(item, index) in record.IP_ItemList"
              :key="index"
            >
              <td style="width: 20%"></td>
              <td style="width: 20%">
                {{ item.CreatedOn }}
              </td>
              <td style="width: 20%">
                {{ item.IP }}
              </td>
              <td style="width: 20%"></td>
              <td style="width: 20%"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </a-table>
    <div v-if="isMobile">
      <div
        class="table-item"
        v-for="(item, index) in deviceManagementData"
        :key="index"
      >
        <div class="table-header">
          <h2>{{ item.Browser }}</h2>

          <a-popover trigger="click">
            <div class="popover-content" slot="content">
              <a @click="showModal(index)">{{
                $t('device_management_text_more')
              }}</a>

              <a-modal
                :footer="null"
                :visible="modalVisible"
                @cancel="handleCancel"
                v-bind:title="$t('device_management_text_more')"
              >
                <div>
                  <h1>{{ item.Browser }}</h1>
                  <template v-for="ip in item.IP_ItemList">
                    <div>
                      <div class="table-content">
                        <div class="table-info">
                          <span>{{ $t('device_management_text_date') }}</span>
                          <p>{{ ip.CreatedOn }}</p>
                        </div>
                        <div class="table-info">
                          <span>{{
                            $t('device_management_text_ipadress')
                          }}</span>
                          <p>{{ ip.IP }}</p>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </a-modal>
              <a @click="deleteDevice(item)">{{
                $t('device_management_text_delete')
              }}</a>
            </div>
            <span>...</span>
          </a-popover>
        </div>
        <div class="table-content">
          <div class="table-info">
            <span>{{ $t('device_management_text_date') }}</span>
            <p>{{ item.IP_ItemList[0].CreatedOn }}</p>
          </div>
          <div class="table-info">
            <span>{{ $t('device_management_text_ipadress') }}</span>
            <p>{{ item.IP_ItemList[0].IP }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: 'Cihaz',
    dataIndex: 'Browser',
    width: '20%',
    key: 'browser',
  },
  {
    title: 'Tarih',
    dataIndex: 'IP_ItemList',
    Key: 'IP_ItemListDate',

    width: '20%',
    scopedSlots: { customRender: 'IP_ItemListDate' },
  },
  {
    title: 'IP Adresi',
    dataIndex: 'IP_ItemList',
    Key: 'IP_ItemList',
    scopedSlots: { customRender: 'IP_ItemList' },
    width: '20%',
  },
  {
    title: 'Eylem',
    Key: 'actions',

    scopedSlots: {
      customRender: 'actions',
    },
    width: '20%',
  },
  {
    title: '',
    dataIndex: 'xpand',
    Key: 'xpand',
    scopedSlots: {
      customRender: 'xpand',
    },
    width: '20%',
  },
  {
    title: '',
    dataIndex: '',
    width: '5%',
  },
]
const subcolumns = [
  {
    title: '',
    dataIndex: '',
    width: '20%',
    key: 'browser',
  },
  {
    title: '',
    dataIndex: 'CreatedOn',
    key: 'CreatedOn',
    width: '20%',
  },
  {
    title: '',
    dataIndex: 'IP',
    key: 'IP',
    width: '20%',
  },
  {
    title: '',
    dataIndex: '',
    key: 'actions',
    width: '20%',
  },
  {
    title: '',
    dataIndex: '',
    width: '5%',
  },
]
import { isMobile } from 'mobile-device-detect'
export default {
  name: 'Management',
  data() {
    return {
      columns,
      subcolumns,
      deviceManagementData: [],
      deviceManagementRowKeys: [],
      isMobile,
      visible: [],
      modalVisible: false,
      deneme: false,
    }
  },
  mounted() {
    this.getDeviceManagementData()
  },
  methods: {
    showModal(index) {
      this.modalVisible = true
    },
    handleCancel(e) {
      this.modalVisible = false
    },
    setDeviceManagementRows(expanded, record) {
      if (expanded) {
        this.deviceManagementRowKeys = [record.DeviceId]
      } else {
        this.deviceManagementRowKeys = []
      }
    },
    async getDeviceManagementData() {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }

        const response = await this.$axios.get(
          this.$config.FINANCE_API_URL + `/GetUserBrowserList`,
          {
            headers: authHeaders,
          }
        )
        if (response.data) {
          let modalSize = []

          this.deviceManagementData = response.data.UserBrowser
          console.log('[res]', this.deviceManagementData)
          this.visible.length = response.data.UserBrowser.length
          modalSize = response.data.UserBrowser

          modalSize.forEach((element, index) => {
            // this.modalVisible[index] = false
            this.modalVisible = false
          })
          console.log(this.modalVisible)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async deleteDevice(id) {
      try {
        let payload = {
          DeviceId: id,
        }

        const response = await this.$axios({
          method: 'delete',
          url: this.$config.FINANCE_API_URL + '/DeleteBrowser',
          data: payload,
          headers: {
            Authorization: 'Bearer ' + this.$cookies.get('Token'),
            'Content-Type': 'application/json',
          },
        })

        if (response.data.Success) {
          this.getDeviceManagementData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    getSubItems(arr) {
      if (arr.length === 1) {
        return []
      }
      return arr.slice(1)
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
  },
}
</script>

<style lang="scss" scoped>
.header {
  margin-top: 60px;
  p {
    font-size: 14px;
    letter-spacing: 0px;
    color: #7a8393;
  }
}
.table-item {
  height: 125px;
  widows: 100%;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;

  .table-header {
    display: flex;
    justify-content: space-between;
    span {
      font-size: 25px;
      margin-bottom: 6px;
    }
  }
}
.table-content {
  display: flex;
  flex-direction: column;
  .table-info {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span {
      font-size: 10px/13px;
      letter-spacing: 0px;
      color: #838b9a;
    }
  }
}
.popover-content {
  display: flex;
  flex-direction: column;
  a {
    height: 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px/19px;
    letter-spacing: 0px;
    color: #2c2c2c;
  }
}

.device-sub-table thead {
  display: none;
}
</style>
