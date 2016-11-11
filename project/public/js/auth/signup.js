var vue = new Vue({
  el: '#signup',
  data: {
    loginId: '',
    phone: '',
    password: '',
    email: '',
    errorMsg: '',
    successMsg: '',
    passwordHint: false,
    passwordHintText: 'Show'
  },
  methods: {
    showPassword: function() {
      this.passwordHint = !this.passwordHint
      if (this.passwordHint) {
        this.passwordHintText = 'Hide'
      } else {
        this.passwordHintText = 'Show'
      }
    },
    submit: function() {
      $.post('/auth/signup', {
        loginId: this.loginId,
        phone: this.phone,
        password: this.password,
        email: this.email
      }, function (result) {
        if (result.err) {
          vue.errorMsg = result.err
        } else {
          location.href = '/'
        }
      })
    }
  }
})

$('#signup').validate({
  errorClass: "state-error",
  highlight: function(element, errorClass, validClass) {
    $(element.form).find("label[for=" + element.id + "]")
      .addClass(errorClass).removeClass(validClass)
  },
  submitHandler: function (form) {
    vue.submit()
  }
})
