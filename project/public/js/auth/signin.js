var signinUrl = '/auth/signin';

var vue = new Vue({
  el: '#signin',
  data: {
    loginid: '',
    password: '',
    errorMsg: ''
  },
  methods: {
    submit: function() {
      $.post(signinUrl, { loginId: this.loginid, password: this.password })
        .done(function (result) {
          location.href = result.data.homeUrl;
        })
        .fail(handleErrorResponse.bind(this))
    }
  }
});

$('#signin').validate({
  errorClass: "state-error",
  highlight: function(element, errorClass, validClass) {
    $(element.form).find("label[for=" + element.id + "]")
      .addClass(errorClass).removeClass(validClass)
  },
  submitHandler: function (form) {
    vue.submit();
  }
});
