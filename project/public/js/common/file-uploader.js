function FileUploader(serverUrl, cb) {
  var self = this
  var bodyElm = $('body')

  this.$win = $([
    '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="editorToolImageTitle" aria-hidden="true">',
      '<div class="modal-dialog" role="document">',
        '<div class="modal-content">',
          '<div class="modal-header">',
            '<p class="modal-title">Add</p>',
          '</div>',
          '<div class="modal-body">',
            '<form>',
              '<div class="form-group">',
                '<input type="hidden" value="" name="image" role="upImage">',
              '</div>',
              '<div class="upload-img">',
                '<div class="button">Upload</div>',
                '<span class="tip"></span>',
                '<div class="alert alert-error hide"></div>',
              '</div>',
            '</form>',
          '</div>',
          '<div class="modal-footer">',
            '<button class="btn btn-primary" role="save">Save</button>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
  ].join('')).appendTo(bodyElm)

  this.$win.on('click', '[role=save]', function(){
    self.$win.find('form').submit()
  }).on('submit', 'form', function(){
    var $el = $(this)
    var url = $el.find('[role=upImage]').val()
    cb(url)

    self.$win.modal('hide')
    $el.find('[role=upImage]').val('')

    return false
  })

  this.$upload = this.$win.find('.upload-img').css({
    height: 50,
    padding: '60px 0',
    textAlign: 'center',
    border: '4px dashed#ddd'
  })

  this.$uploadBtn = this.$upload.find('.button').css({
    width: 86,
    height: 40,
    margin: '0 auto'
  })

  this.$uploadTip = this.$upload.find('.tip').hide()
  this.$saveImagePath = this.$win.find('[role=upImage]')

  this.file = false
  var _csrf = $('[name=_csrf]').val()

  this.uploader = window.WebUploader.create({
    swf: '/public/libs/webuploader/Uploader.swf',
    server: serverUrl,
    pick: this.$uploadBtn[0],
    paste: document.body,
    dnd: this.$upload[0],
    auto: true,
    fileSingleSizeLimit: 2 * 1024 * 1024,
    //sendAsBinary: true,
    // 只允许选择图片文件。
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    }
  })

  this.uploader.on('beforeFileQueued', function(file){
    if(self.file !== false){
      return false
    }
    self.showFile(file)
  })

  this.uploader.on('uploadProgress', function(file, percentage){
    self.showProgress(file, percentage * 100)
  })

  this.uploader.on('uploadSuccess', function(file, res){
    if(res.err){
      self.removeFile()
      self.showError(res.msg || 'Upload failed.')
    }
    else{
      var url = res.data
      self.$saveImagePath.val(url)
      self.$uploadTip
        .html('Upload succeeded.')
        .show()
//          self.$win.modal('hide')
    }
  })

  this.uploader.on('uploadComplete', function(file){
    self.uploader.removeFile(file)
    self.removeFile()
  })

  this.uploader.on('error', function(type){
    self.$uploadBtn.show()
    self.removeFile()
    switch(type){
      case 'Q_EXCEED_SIZE_LIMIT':
      case 'F_EXCEED_SIZE':
        self.showError('File size limit is 2M')
        break
      case 'Q_TYPE_DENIED':
        self.showError('Not supported file type.')
        break
      default:
        self.showError('Unknown error.')
    }
  })

  this.uploader.on('uploadError', function(){
    self.removeFile()
    self.showError('Upload failed.')
  })
}

FileUploader.prototype.removeFile = function(){
  //var self = this
  this.file = false
  //this.$uploadBtn.show()
  //this.$uploadTip.hide()
}

FileUploader.prototype.showFile = function(file){
  //var self = this
  this.file = file
  this.$uploadBtn.hide()
  this.$uploadTip.html('Uploading: ' + file.name).show()
  this.hideError()
}

FileUploader.prototype.showError = function(error){
  this.$upload.find('.alert-error').html(error).show()
}

FileUploader.prototype.hideError = function(error){
  this.$upload.find('.alert-error').hide()
}

FileUploader.prototype.showProgress = function(file, percentage){
  this.$uploadTip
    .html('Uploading: ' + file.name + ' ' + percentage + '%')
    .show()
}

FileUploader.prototype.bind = function(){
  this.$win.modal('show')
}
