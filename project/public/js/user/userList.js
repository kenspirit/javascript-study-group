var columns = [{
  field: 'imageUrl',
  title: 'Image',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: function(value, row, index) {
    if (value) {
      return `<img src="${value}" width="50px" height="50px">`
    }
    return ''
  }
}, {
  field: 'loginId',
  title: 'Login Id',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: function(value, row, index) {
    if (value) {
      return `<a href="/user/page/load/${row._id}">${value}</a>`
    }
    return ''
  }
}, {
  field: 'phone',
  title: 'Phone',
  width: 60,
  align: 'center',
  halign: 'center'
}, {
  field: 'email',
  title: 'Email',
  width: 60,
  align: 'center',
  halign: 'center'
}]

var vue = new Vue({
  el: '#userList',
  data: {
    url: '/user',
    pageList: [10, 20, 30],
    errorMsg: ''
  },
  ready: function() {
    $('#userTable').bootstrapTable({
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
  }
});
