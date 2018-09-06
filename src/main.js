// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/global.css'

router.beforeEach((to, from, next) =>{
  if(to.matched.some(record => record.meta.needLogin)){
    if(!store.state.user){
      app.$message.error('请先登录!');
      next({
        path:'/signIn'
      })
    } else{
      next()
    }
  }else{
    next();
  }
})

Vue.use(ElementUI)

// 加载进度条
import VueProgressBar from 'vue-progressbar'
const options = {
  color: '#159957',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)


Vue.config.productionTip = false

// localStorage.setItem('debug', 'leancloud*')  //开启调试模式

const user = api.SDK.User.current();

if(user) {
  console.log(user);
  store.commit('setUser', user)
}

Vue.mixin({
  beforeCreate(){
    if(!this.$api){
      this.$api = api;
    }
  }
})

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  store,
  // components: { App },
  // template: '<App/>',
  render: h => h(App)
})
