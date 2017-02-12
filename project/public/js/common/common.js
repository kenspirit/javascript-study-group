
function handleErrorResponse(response) {
  var result = typeof(response) === 'string' ? JSON.parse(response) : response
  if (response.responseText) {
    result = JSON.parse(response.responseText)
  }

  if (result.err) {
    this.errorMsg = result.err
  }
  if (response.status == 403) {
    this.errorMsg = '权限不足'
  }
}

function timeFormatter(value, row, index) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
}

function ajaxRequest(params, cb) {
  $.ajax({
    type: params.method,
    url: params.url,
    dataType: 'json',
    data: params.data
  })
  .done(function(result) {
    if (result.err) {
      alert(result.err)
      return
    }

    cb(result)
  })
  .fail(handleErrorResponse.bind(this))
}
