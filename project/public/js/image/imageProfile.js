$(document).ready(function () {
  var vue = new Vue({
    el: '#imageProfile',
    data: {
      errorMsg: '',
      successMsg: '',
      pageTitle: 'Image Profile',
      url: '',
      gender: '',
      deleted: false,
      submitUrl: '/image'
    },
    methods: {
      getImage: function() {
        var that = this

        $.get(this.submitUrl)
          .done(function (result) {
            var image = result.data
            that.url = image.url
            that.gender = image.gender
            that.deleted = image.deleted
          })
          .fail(handleErrorResponse.bind(this))
      },
      updateImage: function() {
        var body = {
          url: this.url,
          gender: this.gender,
          deleted: this.deleted
        }

        var that = this
        $.post(this.submitUrl, body)
          .done(function (result) {
            that.successMsg = '更新成功'
            that.errorMsg =  ''
          })
          .fail(handleErrorResponse.bind(this))
      },
      renderSystemTime: timeFormatter
    }
  })

  $('#image-profile').validate({
    errorClass: "state-error",
    highlight: function(element, errorClass, validClass) {
      $(element).closest('.field').addClass(errorClass).removeClass(validClass);
    },
    submitHandler: function (form) {
      vue.updateImage();
    }
  });

  var imageId = $('#imageId').val();
  if (imageId) {
    vue.imageId = imageId
    vue.submitUrl += '/' + imageId
    vue.getImage()
  }

  $('#fileupload').fileupload({
    dataType: 'json',
    done: function (e, res) {
      vue.url = res.result.data
    }
  })
})
