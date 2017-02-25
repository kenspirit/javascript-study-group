var userId = $('#user-id').val()

var vue = new Vue({
  el: '#user-profile',
  data: {
    pageTitle: 'User Profile',
    submitUrl: '/user',
    imageUrl: '',
    id: '',
    loginId: '',
    phone: '',
    email: '',
    password: '',
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
    getUser: function() {
      $.get(this.submitUrl, function (result) {
        if (result.err) {
          vue.errorMsg = result.err
        } else {
          var user = result.data

          vue.loginId = user.loginId
          vue.imageUrl = user.imageUrl
          vue.phone = user.phone
          vue.email = user.email
        }
      })
    },
    submit: function() {
      var body = {
        loginId: this.loginId,
        phone: this.phone,
        email: this.email,
        imageUrl: this.imageUrl
      }

      if (this.password) {
        body.password = this.password
      }

      $.post(this.submitUrl, body,
        function (result) {
          if (result.err) {
            vue.errorMsg = result.error
          } else {
            location.href = '/user/page/load/' + userId
          }
        })
    }
  }
})

$('#profileSection').validate({
  errorClass: "state-error",
  highlight: function(element, errorClass, validClass) {
    $(element.form).find("label[for=" + element.id + "]")
      .addClass(errorClass).removeClass(validClass)
  },
  submitHandler: function (form) {
    vue.submit()
  }
})

$('#passwordSection').validate({
  errorClass: "state-error",
  highlight: function(element, errorClass, validClass) {
    $(element.form).find("label[for=" + element.id + "]")
      .addClass(errorClass).removeClass(validClass)
  },
  submitHandler: function (form) {
    vue.submit()
  }
})

if (userId) {
  vue.id = userId
  vue.submitUrl = '/user/' + userId
  vue.getUser()
}

$(function () {
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function (e, res) {
      vue.imageUrl = res.result.data
    }
  })
})
