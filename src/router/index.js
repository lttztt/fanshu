import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import List from '@/components/List'
import signUp from '@/pages/signUp'
import signIn from '@/pages/signIn'
import ArticleCreate from '@/pages/article/create'
import ArticleList from '@/pages/List'
import ArticleShow from '@/pages/article/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/List',
      name: 'List',
      component: List
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: signUp
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn
    },
    {
      path: '/ArticleCreate',
      name: 'ArticleCreate',
      component: ArticleCreate,
      meat: {
        needLogin: true
      }
    },
    {
      path: '/article/:id',
      name: 'ArticleShow',
      component: ArticleShow
    },
  ]
})
