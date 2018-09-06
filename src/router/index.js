import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import signUp from '@/pages/signUp'
import signIn from '@/pages/signIn'
import ArticleCreate from '@/pages/article/create'
import ArticleList from '@/pages/List'
import ArticleShow from '@/pages/article/index'
import ArticleEdit from '@/pages/article/edit'
import User from '@/pages/user/index'
import Followee from '@/pages/user/myFollowee'
import Follower from '@/pages/user/myFollower'
import Friend from '@/pages/user/friend'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/article',
      name: 'ArticleList',
      component: ArticleList
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
    {
      path: '/article/:id/edit',
      name: 'ArticleEdit',
      component: ArticleEdit,
        meta: {
          needLogin: true
        }
    },
    {
      path: '/user/:id',
      name: 'User',
      component: User
    },
    {
      path: '/followee',
      name: 'Followee',
      component: Followee,
      meta: {
       needLogin: true
      }
    },
    {
      path: '/follower',
      name: 'Follower',
      component: Follower,
      meta: {
       needLogin: true
      }
    },
    {
      path: '/friend',
      name: 'Friend',
      component: Friend
    }
  ]
})
