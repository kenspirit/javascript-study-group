var columns = [{
  field: 'url',
  title: 'Image',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: function(value, row, index) {
    if (value) {
      return `<a href="/image/page/load/${row._id}"><img src="${value}" width="50px" height="50px"></a>`
    }
    return ''
  }
}, {
  field: 'gender',
  title: 'Gender',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: function(value, row, index) {
    switch(value) {
      case 'F':
        return 'Female'
      case 'M':
        return 'Male'
      default:
        return ''
    }
  }
}, {
  field: 'createdAt',
  title: 'Created At',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: timeFormatter
}, {
  field: 'createdUser',
  title: 'Created By',
  width: 60,
  align: 'center',
  halign: 'center'
}, {
  field: 'updatedAt',
  title: 'Updated At',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: timeFormatter
}, {
  field: 'updatedUser',
  title: 'Updated By',
  width: 60,
  align: 'center',
  halign: 'center'
}, {
  field: 'deleted',
  title: 'Deleted?',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: function(value, row, index) {
    return value === true ? 'Deleted' : ''
  }
}, {
  field: '',
  title: '',
  width: 60,
  align: 'center',
  halign: 'center',
  events: {
    'click .edit': (e, value, row, index, activeBtn) => {
      $('#imageId').val(row._id)
      $('#imageUrl').val(row.url)
      $('#gender').val(row.gender)
      $('#deleted').prop('checked', row.deleted)
      $('#imageDialog').modal('toggle')
    }
  },
  formatter: function(value, row, index) {
    return `<div class="btn-group dropdown">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Action <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li class="edit"><a href="#">Edit</a></li>
      </ul>
    </div>`
  }
}]

var vue = new Vue({
  el: '#imageList',
  data: {
    url: '/image',
    pageList: [10, 20, 30],
    errorMsg: ''
  },
  ready: function() {
    $('#imageTable').bootstrapTable({
      columns: columns,
      queryParams: (p) => {
        for (var v in self.params) {
          p[v] = self.params[v]
        }

        return p
      }
    })
  },
  methods: {
    createImage: function() {
      window.location = '/image/page/load'
    },
    saveImage: function() {
      var id = $('#imageId').val()
      var gender = $('#gender').val()
      var url = $('#imageUrl').val()
      var deleted = $('#deleted').prop('checked')

      var params = {
        method: 'post',
        url: '/image/' + id,
        data: {
          gender: gender,
          deleted: deleted,
          url: url
        }
      }

      ajaxRequest(params, (data) => {
        $('#imageTable').bootstrapTable('refresh')
        $('#imageDialog').modal('toggle')
      })
    }
  }
});
