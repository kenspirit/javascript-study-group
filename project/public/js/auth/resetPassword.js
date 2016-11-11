var vue = new Vue({
  el: '#resetPassword',
  data: {
    email: '',
    password: '',
    errorMsg: '',
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
      var that = this
      var email = this.email
      var resetId = this.resetId
      var password = this.password

      $.post('/auth/resetPassword', {
        email: email,
        password: password,
        resetId: resetId
      })
      .done(function() {
        location.href = '/'
      })
      .fail(function() {
        that.errorMsg = 'Wrong info provided.'
      })
    }
  }
})

$('#resetPassword').validate({
  errorClass: "state-error",
  highlight: function(element, errorClass, validClass) {
    $(element.form).find("label[for=" + element.id + "]")
      .addClass(errorClass).removeClass(validClass)
  },
  submitHandler: function (form) {
    vue.submit()
  }
})
