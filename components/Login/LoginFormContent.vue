<template>
  <a-card
    :bordered="false"
    class="border-none"
    :tabList="tabList"
    :active-tab-key="activeKey"
    @tabChange="(key) => (activeKey = key)"
  >
    <span
      slot="titleSlot"
      slot-scope="item"
      class="Roboto-Medium"
      :class="{
        'tab-label-active': item.key === activeKey,
        'tab-label-inactive': item.key !== activeKey,
      }"
    >
      {{ item.key }}
    </span>
    <div v-if="activeKey === 'Email'">
      <a-form-model
        ref="emailLoginFormRef"
        :model="user"
        :rules="emailLoginRules"
        layout="vertical"
      >
        <a-form-model-item
          has-feedback
          prop="Username"
          v-on:submit.prevent="emitUsernameLogin"
        >
          <template slot="label">
            <span class="input-label Roboto-Regular">{{
              $t('text_email')
            }}</span>
          </template>
          <a-input
            v-model="user.Username"
            class="Roboto-Regular"
            type="email"
            size="large"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback prop="Password">
          <template slot="label">
            <span class="input-label Roboto-Regular">{{
              $t('text_password')
            }}</span>
          </template>
          <a-input-password
            v-model="user.Password"
            class="Roboto-Regular"
            size="large"
          ></a-input-password>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            :loading="isLoginLoading"
            @click="emitUsernameLogin"
            class="primary-button border-none Roboto-Medium"
            type="primary"
            size="large"
            block
            >{{ $t('login_text') }}</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
    <div v-if="activeKey === 'Mobile'">
      <a-form-model
        ref="mobileLoginFormRef"
        :model="userMobile"
        :rules="mobileLoginRules"
        layout="vertical"
      >
        <a-form-model-item
          prop="PhoneNumber"
          v-on:submit.prevent="emitMobileLogin"
        >
          <template slot="label">
            <span class="input-label">{{ $t('text_mobile') }}</span>
          </template>
          <vue-tel-input
            :class="{ invalidPhoneNo: !isValidPhoneNo }"
            v-model="userMobile.PhoneNumber"
            @validate="validateMobileNumber"
            inputClasses="ant-input ant-input-lg"
            :dynamicPlaceholder="true"
          ></vue-tel-input>
          <span v-if="!isValidPhoneNo" :style="{ color: 'red' }">
            {{ $t('login_text_invalid_phone') }}
          </span>
        </a-form-model-item>
        <a-form-model-item has-feedback prop="Password">
          <template slot="label">
            <span class="input-label">{{ $t('text_password') }}</span>
          </template>
          <a-input-password
            v-model="userMobile.Password"
            size="large"
          ></a-input-password>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            :loading="isLoginLoading"
            @click="emitMobileLogin"
            class="primary-button border-none Roboto-Medium"
            type="primary"
            size="large"
            block
            >{{ $t('login_text') }}</a-button
          >
        </a-form-model-item>
      </a-form-model>
    </div>
  </a-card>
</template>
<script>
import { VueTelInput } from 'vue-tel-input'
import authMixin from '~/Mixins/authMixin'

export default {
  // loads validator and auth utils
  mixins: [authMixin],
  props: {
    isLoginLoading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueTelInput,
  },
  data() {
    return {
      tabList: [
        { key: 'Email', scopedSlots: { tab: 'titleSlot' } },
        { key: 'Mobile', scopedSlots: { tab: 'titleSlot' } },
      ],
      activeKey: 'Email',
      // model data
      user: {
        Username: '',
        Password: '',
        DeviceId: 'demo_device',
      },
      userMobile: {
        PhoneNumber: '',
        Password: '',
        DeviceId: 'demo_device',
      },
      isValidPhoneNo: true,
      PhoneNoDetails: {},
      emailLoginRules: {
        Username: [
          {
            validator: this.EmailValidator,
            trigger: 'change',
          },
        ],
      },
      mobileLoginRules: {},
    }
  },
  mounted() {
    if (process.client) {
      document.addEventListener('keydown', (event) => {
        const activeKey = this.activeKey
        if (event.keyCode === 13) {
          switch (activeKey) {
            case 'Email':
              this.emitUsernameLogin()
              break
            case 'Mobile':
              this.emitMobileLogin()
              break
          }
        }
      })
    }
  },
  methods: {
    emitUsernameLogin() {
      this.$refs.emailLoginFormRef.validate((valid) => {
        if (valid) {
          this.$emit('loginBtnClick', this.user)
        }
      })
    },
    emitMobileLogin() {
      const { PhoneNumber } = this.userMobile
      let _PhoneNumber
      if (PhoneNumber.startsWith('+')) {
        _PhoneNumber = PhoneNumber.slice(1).split(' ').join('')
      } else {
        _PhoneNumber =
          this.PhoneNoDetails.country.dialCode +
          PhoneNumber.slice(1).split(' ').join('')
      }

      this.$refs.mobileLoginFormRef.validate((valid) => {
        if (valid && this.isValidPhoneNo) {
          this.$emit('mobileLoginClick', {
            ...this.userMobile,
            PhoneNumber: _PhoneNumber,
          })
        }
      })
    },
    validateMobileNumber(payload) {
      this.PhoneNoDetails = payload
      this.isValidPhoneNo = payload.isValid
    },
  },
  watch: {
    'userMobile.PhoneNumber': function () {
      if (this.userMobile.PhoneNumber === '') {
        this.isValidPhoneNo = true
      }
    },
  },
}
</script>

<style lang="less" scoped>
.invalidPhoneNo {
  &.vue-tel-input {
    border: 1px solid red !important;
  }
}
</style>
