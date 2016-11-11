var vue = new Vue({
  el: '#resetPasswordRequest',
  data: {
    email: '',
    msgType: '',
    msg: ''
  },
  methods: {
    submit: function() {
      $.post('/auth/resetPasswordRequest', {
        email: this.email
      }, function (result) {
        if (result.err) {
          vue.msgType = 'danger'
          vue.msg = result.err
        } else {
          vue.msgType = 'success'
          vue.msg = 'Email Sent.  Please check.'
        }
      })
    }
  }
})

$('#resetPasswordRequest').validate({
  errorClass: "state-error",
  highlight: function(element, errorClass, validClass) {
    $(element.form).find("label[for=" + element.id + "]")
      .addClass(errorClass).removeClass(validClass)
  },
  submitHandler: function (form) {
    vue.submit()
  }
})
