<template>
  <div class="email-enable-page">
    <a-card class="email-enable-card border-none">
      <h2 align="center" class="email-enable-heading Roboto-Medium">
        {{ $t('text_enable_email_auth') }}
      </h2>
      <a-form-model
        ref="enableEmailFormRef"
        :model="enableEmail"
        :rules="enableEmailRules"
        layout="vertical"
      >
        <a-form-model-item has-feedback prop="EmailAddress">
          <template slot="label">
            <span class="email-label Roboto-Medium">{{
              $t('text_email')
            }}</span>
          </template>
          <a-input
            v-model="enableEmail.EmailAddress"
            class="Roboto-Regular"
            type="email"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
      <a-button
        :disabled="!isValidEmail"
        @click="enableEmailVerif"
        class="Roboto-Medium"
        size="large"
        type="primary"
        :loading="enableEmailLoading"
        block
        >{{ $t('text_approve') }}</a-button
      >
    </a-card>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
export default {
  name: 'EnableEmailAuthenticatorPage',
  middleware: ['auth'],
  components: {
    VueTelInput,
  },
  data() {
    /* eslint-disable */
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const EmailValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your E-mail'))
      } else if (!emailRegex.test(value.toString().toLowerCase())) {
        callback(new Error('Please Enter a Valid Email Address'))
      }
      callback()
    }
    return {
      emailRgx: emailRegex,
      enableEmail: {
        EmailAddress: '',
      },
      enableEmailRules: {
        EmailAddress: [
          {
            validator: EmailValidator,
            trigger: 'change',
          },
        ],
      },
      enableEmailLoading: false,
    }
  },
  methods: {
    async enableEmailVerif() {
      const {
        $axios,
        $cookies,
        $store,
        $config: { FINANCE_API_URL },
      } = this
      const authHeaders = { Authorization: 'Bearer ' + $cookies.get('Token') }
      this.enableEmailLoading = true
      const response = await $axios.post(
        FINANCE_API_URL + '/EnableEmail',
        this.enableEmail,
        {
          headers: authHeaders,
        }
      )
      this.enableEmailLoading = false
      if (response.data.Success) {
        const { SecurityVerificationToken } = response.data
        $store.commit('auth/setVerficationData', {
          SecurityVerificationToken,
          status: true,
          redirectURI: '/account',
        })
        this.$router.push(this.localeRoute('/security-verification'))
      }
    },
  },
  computed: {
    isValidEmail() {
      return this.emailRgx.test(
        this.enableEmail.EmailAddress.toString().toLowerCase()
      )
    },
  },
}
</script>

<style lang="less" scoped>
.email-enable-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.email-enable-card {
  width: 384px;
  box-shadow: 0px 0px 10px #0000001a;
  border-radius: 3px;
}
.email-enable-heading {
  color: #212833;
  margin-bottom: 10px;
}
.email-input {
  margin: 20px auto 10px auto;
}
</style>
