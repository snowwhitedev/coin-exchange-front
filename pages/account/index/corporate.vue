<template>
  <div>
    <h1>{{ $t('corporate_header') }}</h1>
    <div v-if="!formSucces" class="form-grid">
      <a-form :form="form" @submit="handleSubmit" class="form">
        <div class="name-row">
          <a-form-item class="form-item">
            <a-input
              placeholder="Ad"
              v-decorator="[
                'CompetentsName',
                { rules: [{ required: true, message: 'Zorunlu alan' }] },
              ]"
            />
          </a-form-item>
          <a-form-item class="form-item">
            <a-input
              placeholder="Soyad"
              v-decorator="[
                'CompetentsSurname',
                { rules: [{ required: true, message: 'Zorunlu alan' }] },
              ]"
            />
          </a-form-item>
        </div>
        <div class="name-row">
          <a-form-item class="form-item">
            <a-input
              placeholder="Şirket Adı"
              v-decorator="[
                'CompanyTitle',
                { rules: [{ required: true, message: 'Zorunlu alan' }] },
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="E-posta"
              v-decorator="[
                'Email',
                { rules: [{ required: true, message: 'Zorunlu alan' }] },
              ]"
              type="email"
            />
          </a-form-item>
        </div>
        <div class="name-row">
          <a-form-item class="form-item">
            <a-input
              placeholder="Telefon"
              v-decorator="[
                'Phone',
                { rules: [{ required: true, message: 'Zorunlu alan' }] },
              ]"
              type="number"
            />
          </a-form-item>
          <a-form-item class="form-item">
            <a-input
              placeholder="Posta Kodu"
              v-decorator="[
                'AreaCode',
                {
                  rules: [
                    { required: true, message: 'Please input your note!' },
                  ],
                },
              ]"
              type="number"
            />
          </a-form-item>
        </div>

        <a-button type="primary" html-type="submit" class="button">
          Submit
        </a-button>
      </a-form>

      <img v-if="!isMobile" src="~/assets/images/Image42.png" />
    </div>
    <div v-else class="form-success">
      <img src="~/assets/images/success.svg" alt="" />
      <span class="succes-text">Tebrikler İşlem Tamamlandı!</span>
      <span
        >Kimlik doğrulama talebiniz bize ulaştı. Sizi en kısa sürede
        bilgilendireceğiz.</span
      >
      <a-button>Anasayfaya Dön</a-button>
    </div>
  </div>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
export default {
  name: 'Corporate',
  async asyncData({
    app,
    redirect,
    $axios,
    $cookies,
    $config: { FINANCE_API_URL },
  }) {
    let authHeaders = { Authorization: 'Bearer ' + $cookies.get('Token') }
    const response = await $axios.get(FINANCE_API_URL + '/GetUserInfo', {
      headers: authHeaders,
    })
    if (response.data.Success) {
      const {
        UserInfo: { KYCVerified },
        UserInfo: { CorporateStatus },
      } = response.data

      if (!KYCVerified) {
        redirect(app.localeRoute('/account/dashboard'))
      } else if (
        CorporateStatus !== 'CorporateRevision' &&
        CorporateStatus !== 'NoCorporate'
      ) {
        redirect(app.localeRoute('/account/dashboard'))
      }
    } else {
      redirect(app.localeRoute('/account/dashboard'))
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      formSucces: false,
      isMobile,
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.postData(values)
        }
      })
    },
    async postData(data) {
      try {
        let authHeaders = {
          Authorization: 'Bearer ' + this.$cookies.get('Token'),
        }
        let payload = {
          ...data,
        }

        const response = await this.$axios.post(
          this.$config.FINANCE_API_URL + `/CreateCorporate`,
          payload,
          {
            headers: authHeaders,
          }
        )

        if (response.data.Success) {
          this.formSucces = true
          setTimeout(() => (this.formSucces = false), 3000)
          this.$router.push(this.localeRoute('/account/dashboard'))
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.form-grid {
  background-color: white;
  width: 85vw;
  height: 507px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 1000px) {
    justify-content: center;
    margin: 0px !important;
    height: 307px;
    .form {
      padding-left: 50px !important;
    }
  }
  .form {
    padding-top: 50px;
  }
}
.form-success {
  background-image: url('../../../assets/images/Image36.png');
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 600px;
  width: 85vw;
  height: 507px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    margin-bottom: 20px;
  }
}

.form-item {
  margin-right: 10px;
}
.name-row {
  display: flex;
}
</style>
