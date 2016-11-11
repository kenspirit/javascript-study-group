var navVue = new Vue({
  el: '#nav',
  methods: {
    signin: function() {
      location.href = '/auth/signin'
    },
    signout: function() {
      $.post('/auth/signout', function(result) {
        location.href = '/'
      })
    }
  }
})
