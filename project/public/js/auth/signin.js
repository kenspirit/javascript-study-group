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
      $.post(signinUrl, { loginId: this.loginid, password: this.password }, function (result) {
        if (result.err) {
          vue.errorMsg = result.err;
        } else {
          location.href = result.data.homeUrl;
        }
      });
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
