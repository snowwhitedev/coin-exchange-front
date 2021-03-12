export default {
  data() {
    /* eslint-disable */
    return {
      emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      passwordRegex: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/,
    }
  },
  methods: {
    EmailValidator(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please enter your E-mail'))
      } else if (!this.emailRegex.test(value.toString().toLowerCase())) {
        callback(new Error('Please Enter a Valid Email Address'))
      }
      callback()
    },
    PasswordValidator(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please Enter Your Password'))
      } else if (!this.passwordRegex.test(value.toString())) {
        callback(
          new Error(
            'Password must be at least 8 characters with 1 upper case letter, 1 lower case letter and 1 number.'
          )
        )
      } else {
        callback()
      }
    },
    PasswordValidatorEmail(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please Enter Your Password'))
      } else if (!this.passwordRegex.test(value.toString())) {
        callback(
          new Error(
            'Password must be at least 8 characters with 1 upper case letter, 1 lower case letter and 1 number.'
          )
        )
      } else {
        if (this.signUpEmail.confirmPassword !== '') {
          this.$refs.signUpEmailFormRef.validateField('confirmPassword')
        }
        callback()
      }
    },
    PasswordValidatorMobile(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please Enter Your Password'))
      } else if (!this.passwordRegex.test(value.toString())) {
        callback(
          new Error(
            'Password must be at least 8 characters with 1 upper case letter, 1 lower case letter and 1 number.'
          )
        )
      } else {
        if (this.signUpMobile.confirmPassword !== '') {
          this.$refs.signUpMobileFormRef.validateField('confirmPassword')
        }
        callback()
      }
    },
    confirmPasswordValidatorEmail(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please Re-Enter Your Password'))
      } else if (value !== this.signUpEmail.Password) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    },
    confirmPasswordValidatorMobile(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please Re-Enter Your Password'))
      } else if (value !== this.signUpMobile.Password) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    },
    ResetPasswordValidator(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please Enter Your Password'))
      } else if (!this.passwordRegex.test(value.toString())) {
        callback(
          new Error(
            'Password must be at least 8 characters with 1 upper case letter, 1 lower case letter and 1 number.'
          )
        )
      } else {
        if (this.resetPasswords.ConfirmPassword !== '') {
          this.$refs.resetPasswordsRef.validateField('ConfirmPassword')
        }
        callback()
      }
    },
    ConfirmResetPasswordValidator(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please Re-Enter Your Password'))
      } else if (value !== this.resetPasswords.NewPassword) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    },
    DocumentTypeValidator(rule, value, callback) {
      if (value === '' || value === null || !value) {
        callback(new Error('Document Type is required'))
      } else {
        callback()
      }
    },
  },
}
