<template>
  <div class="activity-view-page">
    <a-row style="margin-bottom: 50px">
      <a-col :span="24">
        <a-breadcrumb class="activity-breadcumb Roboto-Regular">
          <a-breadcrumb-item>{{ $t('text_security') }}</a-breadcrumb-item>
          <a-breadcrumb-item>{{
            $t('text_account_activities')
          }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <a-row class="security-row">
      <a-col :span="24">
        <h1 class="Roboto-Medium">
          {{ $t('text_past_account_activity_record') }}
        </h1>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <a-card
          class="bs-tab-card border-none"
          :bordered="false"
          :tabList="tabList"
          :active-tab-key="activeKey"
          @tabChange="(key) => (activeKey = key)"
        >
          <span
            slot="titleSlot"
            slot-scope="item"
            class="Roboto-Regular"
            :class="{
              'tab-label-active': item.key === activeKey,
              'tab-label-inactive': item.key !== activeKey,
            }"
          >
            <span v-if="item.key === 'Login Activity'">
              {{ $t('text_login_activities') }}
            </span>
            <span v-if="item.key === 'Security Activity'">{{
              $t('text_security_activity')
            }}</span>
          </span>

          <div class="select-box">
            <fieldset v-if="activeKey === 'Login Activity'">
              <legend class="Roboto-Regular">{{ $t('text_hour') }}</legend>
              <a-select v-model="LoginActivityFilter" style="width: 150px">
                <a-select-option value="day">
                  {{ $t('text_one_day') }}</a-select-option
                >
                <a-select-option value="week">
                  {{ $t('text_one_week') }}</a-select-option
                >
                <a-select-option value="month">
                  {{ $t('text_one_month') }}</a-select-option
                >
              </a-select>
            </fieldset>
            <fieldset v-if="activeKey === 'Security Activity'">
              <legend class="Roboto-Regular">{{ $t('text_hour') }}</legend>
              <a-select v-model="SecurityActivityFilter" style="width: 150px">
                <a-select-option value="day">
                  {{ $t('text_one_day') }}</a-select-option
                >
                <a-select-option value="week">
                  {{ $t('text_one_week') }}</a-select-option
                >
                <a-select-option value="month">
                  {{ $t('text_one_month') }}</a-select-option
                >
              </a-select>
            </fieldset>
          </div>

          <div v-if="activeKey === 'Login Activity'">
            <a-table
              id="login-activity-table"
              class="Roboto-Medium"
              :rowClassName="() => ['Roboto-Regular', 'activity-table-row']"
              :loading="isLoadingLoginActivity"
              :columns="LoginActivityColumns"
              :data-source="LoginActivityData"
              :pagination="LoginActivityPagination"
              @change="LoginActivityTableChange"
            >
            </a-table>
          </div>
          <div v-if="activeKey === 'Security Activity'">
            <a-table
              id="security-activity-table"
              class="Roboto-Medium"
              :rowClassName="() => ['Roboto-Regular', 'activity-table-row']"
              :loading="isLoadingSecurityActivity"
              :columns="SecurityActivityColumns"
              :data-source="SecurityActivityData"
              :pagination="SecurityActivityPagination"
              @change="SecurityActivityTableChange"
            >
            </a-table>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      tabList: [
        { key: 'Login Activity', scopedSlots: { tab: 'titleSlot' } },
        { key: 'Security Activity', scopedSlots: { tab: 'titleSlot' } },
      ],
      activeKey: 'Login Activity',

      LoginActivityColumns: [
        {
          title: 'Tarih',
          key: 'Tarih',
          dataIndex: 'CreatedOn',
        },
        {
          title: 'Kaynak',
          key: 'Kaynak',
          dataIndex: 'Browser',
        },
        {
          title: 'IP Adresi',
          key: 'IP Adresi',
          dataIndex: 'IP_Address',
        },
      ],
      LoginActivityData: [],
      LoginActivityFilters: {
        From: '',
        To: '',
      },
      LoginActivityPagination: {
        current: 1,
        total: 0,
        position: 'bottom',
        pageSize: 10,
      },
      isLoadingLoginActivity: false,
      LoginActivityFilter: 'day',

      SecurityActivityColumns: [
        {
          title: 'Description',
          key: 'Description',
          dataIndex: 'Description',
        },
        {
          title: 'Kaynak',
          key: 'Kaynak',
          dataIndex: 'Browser',
        },
        {
          title: 'IP Adresi',
          key: 'IP Adresi',
          dataIndex: 'IP_Address',
        },
        {
          title: 'Tarih',
          key: 'Tarih',
          dataIndex: 'CreatedOn',
        },
      ],
      SecurityActivityData: [],
      SecurityActivityFilters: {
        From: '',
        To: '',
      },
      SecurityActivityPagination: {
        current: 1,
        total: 0,
        position: 'bottom',
        pageSize: 10,
      },
      SecurityActivityFilter: 'day',
      isLoadingSecurityActivity: false,
    }
  },
  methods: {
    async getLoginActivities() {
      const { $axios, $config, $cookies } = this
      let authHeader = { Authorization: 'Bearer ' + $cookies.get('Token') }
      this.isLoadingLoginActivity = true
      const response = await $axios.get(
        $config.FINANCE_API_URL + '/GetAccountLoginActivities',
        {
          params: {
            Offset:
              this.LoginActivityPagination.current * 10 -
              this.LoginActivityPagination.pageSize,
            PageSize: this.LoginActivityPagination.pageSize,
            ...this.LoginActivityFilters,
          },
          headers: authHeader,
        }
      )
      if (response.data.Success) {
        const { AccountHistory, Max } = response.data
        this.LoginActivityData = AccountHistory
        this.LoginActivityPagination.total = Max
        this.isLoadingLoginActivity = false
      }
    },
    async getSecurityActivities() {
      const { $axios, $config, $cookies } = this
      let authHeader = { Authorization: 'Bearer ' + $cookies.get('Token') }
      this.isLoadingSecurityActivity = true
      const response = await $axios.get(
        $config.FINANCE_API_URL + '/GetAccountSecurityActivities',
        {
          params: {
            Offset:
              this.SecurityActivityPagination.current * 10 -
              this.SecurityActivityPagination.pageSize,
            PageSize: this.SecurityActivityPagination.pageSize,
            ...this.SecurityActivityFilters,
          },
          headers: authHeader,
        }
      )
      if (response.data.Success) {
        const { AccountHistory, Max } = response.data
        this.SecurityActivityData = AccountHistory
        this.SecurityActivityPagination.total = Max
        this.isLoadingSecurityActivity = false
      }
    },
    LoginActivityTableChange(pagination) {
      this.LoginActivityPagination = pagination
      this.getLoginActivities()
    },
    SecurityActivityTableChange(pagination) {
      this.SecurityActivityPagination = pagination
      this.getSecurityActivities()
    },
  },
  watch: {
    LoginActivityFilter: {
      handler: function (val) {
        this.LoginActivityFilters.From = moment(new Date())
          .subtract(1, val)
          .format('YYYY-MM-DD')
        this.LoginActivityFilters.To = moment(new Date()).format('YYYY-MM-DD')
        this.getLoginActivities()
      },
      immediate: true,
    },
    SecurityActivityFilter: {
      handler: function (val) {
        this.SecurityActivityFilters.From = moment(new Date())
          .subtract(1, val)
          .format('YYYY-MM-DD')
        this.SecurityActivityFilters.To = moment(new Date()).format(
          'YYYY-MM-DD'
        )
        this.getSecurityActivities()
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
#login-activity-table,
#security-activity-table {
  margin: 20px auto;
}
.activity-table-row {
  color: #8d8e91;
}
.select-box {
  display: flex;
}
.select-box fieldset {
  margin-right: 8px;
}
.select-box legend {
  font-size: 14px;
  color: #414141;
  margin-bottom: 0;
}
</style>
