// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api'

Vue.config.productionTip = false

localStorage.setItem('debug', 'leancloud*')  //开启调试模式

Vue.mixin({
  beforeCreate(){
    if(!this.$api){
      this.$api = api;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // components: { App },
  // template: '<App/>',
  render: h => h(App)
})
