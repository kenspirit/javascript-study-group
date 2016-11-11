
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

function mergeVuePagingOptions(options, gridNames, presetRecordPerPage) {
  options.data = options.data || {}
  options.methods = options.methods || {}

  options.data.recordPerPageOptions = presetRecordPerPage ?
    [presetRecordPerPage] : [10, 25, 50, 100, 0]

  options.data.paging = gridNames.reduce(function(obj, name) {
      obj[name] = {
        data: [],
        recordPerPage: presetRecordPerPage || 10, // Should be same as first value in recordPerPageOptions
        totalPages: 0,
        totalCount: 0,
        startRow: 0,
        endRow: 0,
        pageButtons: [],
        currentPage: 1
      }

      return obj
    }, {})

  options.methods.initPagingInfo = function(pagingInfo) {
    pagingInfo.totalPages = pagingInfo.recordPerPage === 0 ?
      1 : Math.ceil(pagingInfo.totalCount / pagingInfo.recordPerPage)
    pagingInfo.pageButtons = []

    for (var i = 0; i < pagingInfo.totalPages; i++) {
      if (i > 6) {
        // Limited to only show 7 pages button
        break
      }
      pagingInfo.pageButtons.push(i + 1)
    }

    var recordPerPage = pagingInfo.recordPerPage
    var currentPage = pagingInfo.currentPage
    var start = recordPerPage * (currentPage - 1)

    pagingInfo.startRow = start + 1
    if (recordPerPage === 0) {
      pagingInfo.endRow = pagingInfo.data.length
    } else {
      pagingInfo.endRow = (start + recordPerPage > pagingInfo.totalCount ? pagingInfo.totalCount : start + recordPerPage)
    }
  }

  options.methods.page = function(event, fn, pagingInfo, newPage) {
    var currentPage = event.target.innerHTML
    switch (currentPage) {
      case '...':
        return
      case '&lt;':
      case '&gt;':
        currentPage = newPage
        break
      default:
        currentPage = parseInt(currentPage)
        break
    }

    if (currentPage > pagingInfo.totalPages) {
      currentPage = 1
    }
    if (currentPage < 1) {
      currentPage = pagingInfo.totalPages
    }

    pagingInfo.currentPage = currentPage

    fn.call(this, pagingInfo.currentPage, pagingInfo.recordPerPage)
  }

  options.methods.pageLabel = function(pagingInfo, pagePosition) {
    if (pagingInfo.totalPages < 7) {
      return pagePosition
    }

    // For position 1, 2, 6, 7
    switch (pagePosition) {
      case 1: 
        return 1
      case 7:
        return pagingInfo.totalPages
      case 2:
        if (pagingInfo.currentPage > 4) {
          return '...'
        } else {
          return pagePosition
        }
      case 6:
        if (pagingInfo.totalPages - pagingInfo.currentPage > 3) {
          return '...'
        } else {
          return pagingInfo.totalPages - 1
        }
    }

    // For position 3, 4, 5
    if (pagingInfo.currentPage - 1 >= 3) {

      if (pagingInfo.totalPages - pagingInfo.currentPage < 3) {
        return pagingInfo.totalPages - (7 - pagePosition)
      }
      return pagingInfo.currentPage - (4 - pagePosition)
    } else {
      return pagePosition
    }
  }

  options.methods.isActivePage = function(pagingInfo, position) {
    var label = this.pageLabel(pagingInfo, position)

    if (label === '...') {
      return ''
    }

    return label == pagingInfo.currentPage ? ' active ' : ''
  }
  
  options.methods.changeRecordPerPage = function(pagingInfo, fn, recordPerPage) {
    pagingInfo.recordPerPage = recordPerPage

    fn.call(this, pagingInfo.currentPage, pagingInfo.recordPerPage)
  }
}
