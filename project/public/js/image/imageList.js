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
}]

if (isAdmin) {
  columns.push({
    field: 'status',
    title: 'Status',
    width: 60,
    align: 'center',
    halign: 'center',
    formatter: function(value, row, index) {
      switch (value) {
        case 'P':
          return 'Pending'
        case 'A':
          return 'Approved'
        case 'R':
          return 'Rejected'
      }
    }
  })
}

if (isLogin) {
  function setDeleted(id, deleteStatus) {
    $.post(`/image/${id}/delete`, { status: deleteStatus })
      .done(function (result) {
        $('#imageTable').bootstrapTable('refresh')
      })
      .fail(handleErrorResponse.bind(this))
  }

  function setStatus(id, status) {
    $.post(`/image/${id}/status`, { status: status })
      .done(function (result) {
        $('#imageTable').bootstrapTable('refresh')
      })
      .fail(handleErrorResponse.bind(this))
  }

  columns.push({
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
      },
      'click .delete': (e, value, row, index, activeBtn) => {
        setDeleted(row._id, true)
      },
      'click .restore': (e, value, row, index, activeBtn) => {
        setDeleted(row._id, false)
      },
      'click .approve': (e, value, row, index, activeBtn) => {
        setStatus(row._id, 'A')
      },
      'click .reject': (e, value, row, index, activeBtn) => {
        setStatus(row._id, 'R')
      }
    },
    formatter: function(value, row, index) {
      if (row.createdUserId !== userId) {
        return ''
      }

      var adminMenu = ''
      if (isAdmin) {
        adminMenu = '<li role="separator" class="divider"></li>' +
          '<li class="approve"><a href="#">Approve</a></li>' +
          '<li class="reject"><a href="#">Reject</a></li>'
      }
      var deleteMenu = row.deleted ? '<li class="restore"><a href="#">Restore</a></li>' :
        '<li class="delete"><a href="#">Delete</a></li>'

      return `<div class="btn-group dropdown">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Action <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li class="edit"><a href="#">Edit</a></li>
          ${deleteMenu}
          ${adminMenu}
        </ul>
      </div>`
    }
  })
}

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

      $.post(`/image/${id}`, {
          gender: gender,
          deleted: deleted,
          url: url
        })
        .done(function (result) {
          $('#imageTable').bootstrapTable('refresh')
          $('#imageDialog').modal('toggle')
        })
        .fail(handleErrorResponse.bind(this))
    }
  }
});
