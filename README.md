#### 安装 Vue 脚手架工具

```bash
npm install -g vue-cli
```

#### 初始化项目

选择编译与运行一起的版本。

```bash
vue init webpack fanshu
```

#### 改为运行时的版本

> 你可能会说，为什么多次一举啊！刚开始选择运行版本不就得了。 额，我只是想教你如何改而已。

来到 build/webpack.base.conf.js 文件下面，第 23 行，改成如下配置即可，或者去掉也行。

```
alias: {
 'vue$': 'vue/dist/vue.runtime.esm.js',
 '@': resolve('src')
}
```

把 src/main.js 下面的实例化改一下，改成如下。

```
new Vue({
  el: '#app',
  router,
  // template: '<div><App/></div>',
  // components: { App },
  render: h => h(App)
})
```

#### 运行

打开 localhost:8080 就可以看到正常的页面。

```
npm run dev
```

#### 安装 Vuex 与 LeanCloud JS SKD

```
npm i vuex leancloud-storage -S
```

新建 src/store/index.js 文件

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    }
  }
})

export default store
```

修改 src/main.js

```
import store from './store'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
```

修改 src/App.vue

```
<script>

export default {
  name: 'app',
  created(){
    console.log(this.$store)
  }
}
</script>
```

刷新网页就可以看到控制台打印出了 Store 对象，我们的全局状态就可以存储到这个上面。

新建 src/api/index.js，这里的 appId 和 AppKey是在 LeanCloud 后台获取得到的。（一定要保存好你的 MasterKey，这个相当于最高权限的拥有者）

**参考资料**

[官方SDK的安装指南](https://leancloud.cn/docs/sdk_setup-js.html) [存储的功能的文档](https://leancloud.cn/docs/leanstorage_guide-js.html)

```
import AV from 'leancloud-storage'

const appId = 'QzUCTMntj5AiaESWUzlQP6eL-gzGzoHsz';
const appKey = 'VyS1Dby8u7w46pJL15lxJoWY';
AV.init({ appId, appKey });

export default { SDK: AV };
```

接下来我们来写 LeanCloud JS SDK 的逻辑，来到 src/main.js， 通过 Vue.mixin 注册了一下全局的生命周期函数，会为每一个组件实例都注入 api 对象。

```
import api from './api'

localStorage.setItem('debug', 'leancloud*') // 开启调试模式

Vue.mixin({
  beforeCreate() {
    if (api && !this.$api) {
      this.$api = api;
    }
  }
});
```

在 App.vue 里面打印一下

```js
<script>
export default {
  name: 'app',
  created(){
    console.log(this.$store)
    console.log(this.$api)
  }
}
</script>
```

在网页控制台中，就可以看到 API 对象。



### 5.2 进度条

在 components 下面新建 Header.vue，作为网站的导航栏，为了更优雅的显示效果，我们安装一下进度条的组件 [vue-progressbar](https://github.com/hilongjw/vue-progressbar)。

```
npm install vue-progressbar -S
```

- main.js

代码大多都是由 readme 里面提供，配置项里面的颜色，自己选择一个 [Web 安全色](http://www.bootcss.com/p/websafecolors/) 即可。

```
import VueProgressBar from 'vue-progressbar'
const options = {
  color: '#99CCCC',
  failedColor: '#874b4b',
  thickness: '4px',
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
```

- App.vue

```
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted () {
    //  [App.vue specific] When App.vue is finish loading finish the progress bar
    this.$Progress.finish()
  },
  created () {
    //  [App.vue specific] When App.vue is first loaded start the progress bar
    this.$Progress.start()
    //  hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // parse meta tags
        this.$Progress.parseMeta(meta)
      }
      //  start the progress bar
      this.$Progress.start()
      //  continue to next page
      next()
    })
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      //  finish the progress bar
      this.$Progress.finish()
    })
  }
}
</script>
```

- 新建 components/List.vue

```
<template>
  <div class="container">List</div>
</template>

<script>
export default {

  name: 'List',

  data () {
    return {

    };
  }
};
</script>

<style lang="css" scoped>
</style>
```

- 在 router/index.js 里面添加一个路由

```
import List from '@/components/List'

//...
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/list',
      name: 'List',
      component: List
    }
  ]
//...
```

- 在 components/Hello.vue 里面添加一个路由连接

```
<router-link to="list">List</router-link>
```

现在点击这个链接就可以看到网页顶端有一个进度条。



### 5.3 导航栏

新建 components/Header.vue , 我们使用一波 [ElementUI](http://element.eleme.io/#/zh-CN/component/installation) 这个库。

```
npm i element-ui -S
```

**main.js**

```js
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI)
```

**Header.vue**

使用 Ele 的 Menu 组件，[文档在这里](http://element.eleme.io/#/zh-CN/component/menu)，这里的`router`一定要使用绑定要不然会传递一个字符串“true”。

```
<template>
  <div class="container">
    <el-menu :router="true" :default-active="active" class="el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="/">主页</el-menu-item>
      <el-menu-item index="/list">分类</el-menu-item>

        <el-menu-item index="4" class="right">注册</el-menu-item>
        <el-menu-item index="3" class="right">登陆</el-menu-item>
        <!-- <el-menu-item index="6" class="right">注销</el-menu-item> -->
        <!-- <el-submenu index="5" class="right">
          <template slot="title">用户</template>
          <el-menu-item index="5-1">个人中心</el-menu-item>
          <el-menu-item index="5-2">发布文章</el-menu-item>
          <el-menu-item index="5-3">消息</el-menu-item>
        </el-submenu> -->

    </el-menu>
  </div>


</template>

<script>
export default {

  name: 'Header',
  data() {
    return {
      active: '0'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="css" scoped>
  .container{
    padding: 0 10%;
    background: #eef1f6;
  }

  .right{
    float: right;
  }
</style>
```

为了保持颜色一致，我们可以把导航进度条的颜色也改为 `#20a0ff` ，在 main.js 中修改颜色。此时的导航栏没有ICON图标，这其实是非常不友好的，所以我们再来增加一些 ICON 小图标。

大家可以锻炼一下，自行使用 [vue-awesome](https://github.com/Justineo/vue-awesome) ， 这里我们为了方便直接使用 font-awesome 就好，不使用他人封装好的。

在 index.html 添加 css link，这里使用 bootcdn.cn 的 CDN 加速。使用何种图标 [在这里找到](http://fontawesome.io/icons/)

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>番薯</title>
    <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

然后我们再次修改一下 Header.vue , 将主页修改为 Logo

```
<template>
  <div class="container">
    <el-menu :router="true" default-active="/" class="el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item index="/">番薯</el-menu-item>
      <el-menu-item index="/list"><i class="fa fa-flag" aria-hidden="true"></i> 探索</el-menu-item>

        <el-menu-item index="4" class="right"><i class="fa fa-user-o" aria-hidden="true"></i> 注册</el-menu-item>
        <el-menu-item index="3" class="right"><i class="fa fa-key" aria-hidden="true"></i> 登陆</el-menu-item>
        <!-- <el-menu-item index="6" class="right"><i class="fa fa-sign-out" aria-hidden="true"></i> 注销</el-menu-item> -->
        <!-- <el-submenu index="5" class="right">
          <template slot="title">用户</template>
          <el-menu-item index="5-1">个人中心</el-menu-item>
          <el-menu-item index="5-2">发布文章</el-menu-item>
          <el-menu-item index="5-3">消息</el-menu-item>
        </el-submenu> -->

    </el-menu>
  </div>


</template>

<script>
export default {

  name: 'Header',
  data() {
    return {
      active: '0'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="css" scoped>
  .container{
    padding: 0 10%;
    background: #eef1f6;
  }

  .right{
    float: right;
  }

  .el-menu-item:first-child{
    margin-left: 0;
    font-size: 25px;
    font-weight: 100;
    background: #20a0ff;
    color: #fff;
  }

  .el-menu-item:first-child:hover{
    background: #20a0ff;
  }

</style>
```

在 App.vue 中使用 Header 组件

```
<template>
  <div id="app">
    <my-header></my-header>
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import MyHeader from '@/components/Header';

export default {
  name: 'app',
  components: {
    MyHeader
  },
  mounted () {
    this.$Progress.finish()
  },
  created () {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
  }
}
</script>

<style>
  body{
    margin: 0;
    padding: 0;
  }
</style>
```

新建 src/pages/signUp.vue 。先把 App.vue 里面的图片给去掉 `<img src="./assets/logo.png">`

**signUp.vue**

大部分代码都是来自于 [form 文档](http://element.eleme.io/#/zh-CN/component/form) [消息提示文档](http://element.eleme.io/#/zh-CN/component/message) [字段验证文档](https://github.com/yiminghe/async-validator)

如何实现验证，如何自定义验证，消息提示，都在文档里，读者可以自行查阅。

```
<template>
  <div class="container">
    <h1>注册</h1>

    <div class="from-panel">
      <el-form label-position="top" ref="form" label-width="80px" :rules="rules" :model="user">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="user.pwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input type="password" v-model="user.cpwd"></el-input>
        </el-form-item>

        <div class="oprator">
          <el-button class="submit" type="primary" @click="submitForm('form')">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

  name: 'signUp',

  data() {

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.user.cpwd !== '') {
          this.$refs.form.validateField('cpwd');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      labelPosition: 'top',
      user: {
        name: '',
        email: '',
        pwd: '',
        cpwd: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填入邮箱', trigger: 'blur' },
          { type: 'email', message: '必须是合法的邮箱格式', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '必须填写', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        cpwd: [
          { required: true, message: '必须填写', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
           this.$message.error('错了哦，您填写的信息有错误，请按照提示修改。');
          return false;
        }
      });
    },
  }
};
</script>

<style lang="css" scoped>
.container{
  padding: 60px 10%;
  background: #fafafa;
  height: calc(100vh - 180px);
}

h1{
  text-align: center;
  font-weight: 100;
  font-size: 40px;
  margin-bottom: 35px;
}

.from-panel{
  width: 50%;
  margin: 0 auto;
}

.oprator{
  margin-top: 30px;
  text-align: center;
}

</style>
```

现在我们完成了 UI 验证的逻辑，我们再来完成后端注册逻辑，SKD 使用注册功能的[文档在这里](https://leancloud.cn/docs/leanstorage_guide-js.html#%E7%94%A8%E6%88%B7%E5%90%8D%E5%92%8C%E5%AF%86%E7%A0%81%E6%B3%A8%E5%86%8C)

补充提交 submitForm 方法。这里用到了 VueRouter 和 Vuex 的一些方法，[编程式导航的文档在这](https://router.vuejs.org/zh-cn/essentials/navigation.html) ，关于 commit 的方法在[这里](https://vuex.vuejs.org/zh-cn/mutations.html)

```
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let user = new this.$api.SDK.User();
          user.setUsername(this.user.name);
          user.setPassword(this.user.pwd);
          user.setEmail(this.user.email);

          user.signUp().then((loginUser) => {
            this.$store.commit('setUser', loginUser); // 保存到 Vuex 中
            this.$router.go(-1) // 回到上一页
            this.$message.success("注册成功！")
          }).catch(error => {
            console.error(error)
            this.$message.error(error.message)
          })

        } else {
          console.log('error submit!!');
           this.$message.error('错了哦，您填写的信息有错误，请按照提示修改。');
          return false;
        }
      });
    },
```

当我们注册成功之后。在控制台可以看到相应的数据。

但是这里有个小 Bug，再我们切换页面之后注册按钮还是 active 状态

并且当我们是 /list 页面的时候，刷新之后 /list 路径是不会高亮的。

![img](https://nodelover.me/course/vue-blog/media/14993176410246.jpg)

![img](https://ww4.sinaimg.cn/large/006tNbRwgy1fhck69oot0j31410c2dg3.jpg)

当我们使用 Vue 的调试工具查看的时候，发现他的 Index 还是 signUp, 调试工具的[下载地址](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

![img](https://ww1.sinaimg.cn/large/006tNbRwgy1fhck61kik4j313u0lt75g.jpg)

![img](https://nodelover.me/course/vue-blog/media/14993179374678.jpg)

> 那么怎么解决这个问题呢？

首先我去看了该组件的源码，[地址在这](https://github.com/ElemeFE/element/blob/dev/packages/menu/src/menu.vue#L51) 它会自动跳到 51 行，这里有一个 watch，所以传递给组件的属性 default-active 是可以动态修改的，所以我们通过路由的生命周期钩子修改就好，Router 生命周期钩子[文档在这](https://router.vuejs.org/zh-cn/advanced/navigation-guards.html)。

**Header.vue**

增加一个vue 的 created 生命周期函数。

```
  created(){
    this.active = this.$route.path; // 解决刷新不高亮
    this.$router.afterEach((to,from) => {
      this.active = to.path; // 解决编程式切换路由不高亮
    });
  },
```



### 5.6 登陆状态与 localStorage

Vuex 的 Store 是不会持久存储的，也就是说每次刷新页面，Vuex 里面的所有全局状态都会消失，这个时候我们希望 User 可以不丢失，不必要每次刷新都要重新登陆，所有我们需要用到 localStorage。

其实当我们注册或者登陆之后，SDK 会帮我们自动存入 localStorage 里面，如下图

![img](https://ww2.sinaimg.cn/large/006tNbRwgy1fhck8j5299j313x0kzwfu.jpg)

![img](https://nodelover.me/course/vue-blog/media/14993200505040.jpg)

这里有2条是因为，我们注册了多次又没有注销，所以才会有这个问题，不过取到的值是最新一个注册的值。其实这里完全可以不使用 Vuex 的，因为 SDK 已经帮我们做了所有的事情了，这里之所以会使用 Vuex 是为了让大家体验一下，并且可以挂载一些全局的其他数据（至少目前来说，除了 user，好像没啥其他需要挂的）。

**main.js**

```
const user = api.SDK.User.current()

if (user) {
  store.commit('setUser', user);
}
```

![img](https://ww3.sinaimg.cn/large/006tNbRwgy1fhck8vi8l2j313s0lu3zc.jpg)

![img](https://nodelover.me/course/vue-blog/media/14993202198514.jpg)

现在我们每次刷新都可以在 Vuex 里面看到数据了。

### 5.7 登陆之后的 Header 状态

在 Header 组件里面要使用 Vuex 的状态，可以使用 mapState， [文档在这](https://vuex.vuejs.org/zh-cn/state.html)，mapState 是将 Vuex 里面的状态映射到组件上面去。

修改 Header.vue, 增加了 user 的判断，并修改了 logo 的样式明，因为原来的命名会影响下拉菜单。

```
<template>
  <div class="container">
    <el-menu :router="true" :default-active="active" class="el-menu" mode="horizontal" @select="handleSelect">
      <el-menu-item class="logo" index="/">番薯</el-menu-item>
      <el-menu-item index="/list"><i class="fa fa-flag" aria-hidden="true"></i> 探索</el-menu-item>

        <template v-if="user">
          <el-menu-item index="6" class="right"><i class="fa fa-sign-out" aria-hidden="true"></i> 注销</el-menu-item>
          <el-submenu index="5" class="right">
            <span slot="title"> {{ user.getUsername() }} </span>
            <el-menu-item index="5-1">个人中心</el-menu-item>
            <el-menu-item index="5-2">发布文章</el-menu-item>
            <el-menu-item index="5-3">消息</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item index="/signUp" class="right"><i class="fa fa-user-o" aria-hidden="true"></i> 注册</el-menu-item>
          <el-menu-item index="3" class="right"><i class="fa fa-key" aria-hidden="true"></i> 登陆</el-menu-item>
        </template>


    </el-menu>
  </div>


</template>

<script>

import { mapState } from 'vuex'
export default {

  name: 'Header',
  data() {
    return {
      active: '/'
    };
  },
  created(){
    this.active = this.$route.path;
    this.$router.afterEach((to,from) => {
      this.active = to.path;
    });
  },
  computed: mapState(['user']),
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="css" scoped>
  .container{
    padding: 0 10%;
    background: #eef1f6;
  }

  .right{
    float: right;
  }

  .logo{
    margin-left: 0;
    font-size: 25px;
    font-weight: 100;
    background: #20a0ff;
    color: #fff;
  }

  .logo:hover{
    background: #20a0ff;
  }

</style>
```

### 5.8 登出逻辑

**Header.vue**

修改注销的标签

```
<li class="el-menu-item right" @click="heandleExit"><i class="fa fa-sign-out" aria-hidden="true"></i> 注销</li>
```

来到 store/index.js ，添加2个 action，其实之前在注册的地方直接通过 commit 来做提交是不太对的，使用 Vuex我们必须要知道的是只有 mutations 里面的方法能更改 state，并且它也只能是同步的方法，而 Action 就是供我们 UI 调用的方法，它可以是异步的。

```
const store = new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
  },
  actions: {
    exit(context){
      context.commit('setUser', null);
    },
    login(context, user){
      context.commit('setUser', user);
    }
  }
});

```

修改 signUp.vue 里面的方法，改成 dispatch，通过 dispatch 调用 action

```
this.$store.dispatch('login', loginUser); // 保存到 Vuex 中
this.$router.go(-1) // 回到上一页
this.$message.success("注册成功！")
```

添加 exit 方法, 着这个方法里面调用 Vuex 里面的 exit 方法，不过这次我们通过 mapActions 将这个方法映射到本地。[如何映射点这里](https://vuex.vuejs.org/zh-cn/actions.html)

```js
import { mapState, mapActions } from 'vuex'

methods: {
    handleSelect(key, keyPath) {
     console.log(key, keyPath);
    },
    ...mapActions(['exit']),
    heandleExit(){
      this.exit();
      this.$message.success('成功退出');
    }
}
```

现在我们注销之后，每次刷新，登陆信息又回来了，这是因为我们在 SDK 里面还没有注销。再次修改 heandleExit 方法。

```
heandleExit(){
 this.exit();
 this.$api.SDK.User.logOut() // SDK 的退出
 this.$message.success('成功退出');
}

```

现在退出之后报错了，说没有 getUsername 方法，说明我们 store 里面的初始化数据错了，来 store/index.js 里面修改一下。把默认的空对象改成 null。

```
state: {
    user: null
},
```



### 5.9 登录逻辑

新建 pages/signIn.vue, 代码大多数可以 copy signUp 里面的

```
<template>
  <div class="container">
    <h1>登陆</h1>

    <div class="from-panel">
      <el-form label-position="top" ref="form" label-width="80px" :rules="rules" :model="user">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="user.pwd"></el-input>
        </el-form-item>
        <div class="oprator">
          <el-button class="submit" type="primary" @click="submitForm('form')">登陆</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {

  name: 'signIn',

  data() {

    return {
      labelPosition: 'top',
      user: {
        name: '',
        pwd: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 7, message: '长度在 3 到 7 个字符之间', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '必须填写', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.SDK.User.logIn(this.user.name, this.user.pwd).then((loginUser) => {
            this.$store.dispatch('login', loginUser); // 保存到 Vuex 中
            this.$router.push({path: '/'}) // 回到上一页
            this.$message.success("登陆成功！")
          }).catch(error => {
            console.error(error)
            this.$message.error(error.message)
          })

        } else {
          console.log('error submit!!');
           this.$message.error('错了哦，您填写的信息有错误，请按照提示修改。');
          return false;
        }
      });
    },
  }
};
</script>

<style lang="css" scoped>
.container{
  padding: 60px 10%;
  background: #fafafa;
  height: calc(100vh - 180px);
}

h1{
  text-align: center;
  font-weight: 100;
  font-size: 40px;
  margin-bottom: 35px;
}

.from-panel{
  width: 50%;
  margin: 0 auto;
}

.oprator{
  margin-top: 30px;
  text-align: center;
}

</style>
```

router/index.js 添加路由

```
import SignIn from '@/pages/signIn'


{
     path: '/signIn',
     name: 'signIn',
     component: SignIn
}
```

修改 Header.vue ，添加路径

```
<el-menu-item index="/signIn" class="right"><i class="fa fa-key" aria-hidden="true"></i> 登陆</el-menu-item>
```



### 5.10 发布文章功能

去往 LeanCloud 控制台新建一个叫 Article 的 Class， 我们可以把 Class 理解为数据库中的一章表。

![img](https://nodelover.me/course/vue-blog/media/14993250956142.jpg)

![img](https://ww1.sinaimg.cn/large/006tKfTcgy1fhjlgzc74gj316p0m8wfy.jpg)

再新建一个 Category Class ，也是一样的配置。

![img](https://nodelover.me/course/vue-blog/media/14993253321940.jpg)

![img](https://ww4.sinaimg.cn/large/006tKfTcgy1fhjlh561tnj316o0h874o.jpg)

给 Category 添加一些列字段。

![img](https://nodelover.me/course/vue-blog/media/14993253671935.jpg) ![img](https://ww3.sinaimg.cn/large/006tKfTcgy1fhjlhc0bbsj30ho0eut8x.jpg)

随便添加一些初始化数据。

![img](https://nodelover.me/course/vue-blog/media/14993255864710.jpg)

![img](https://ww4.sinaimg.cn/large/006tKfTcgy1fhjlhgk23sj30zp077wfa.jpg)

新建一个 /src/pages/article/create.vue 文件。并且接下来我们会使用 wangEditor 富文本编辑器。

[Query API](https://leancloud.github.io/javascript-sdk/docs/AV.Query.html) [Query 示例](https://leancloud.cn/docs/leanstorage_guide-js.html#%E6%9F%A5%E8%AF%A2)

修改 index.html 引入一些 CDN 里面的库

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>番薯</title>
    <link href="https://cdn.bootcss.com/wangeditor/2.1.20/css/wangEditor.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/wangeditor/2.1.20/js/lib/jquery-2.2.1.js"></script>
    <script src="https://cdn.bootcss.com/wangeditor/2.1.20/js/wangEditor.min.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

pages/article/create.vue 文件

```
<template>
  <div class="container">
    <h3 class="title is-3">发布一篇新的文章</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择文章分类">
          <el-option v-for="cate in categorys" :key="cate.objectId" :label="cate.get('name')" :value="cate">{{ cate.get('name') }}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>

      <div class="el-form-item is-required" :class="{ 'is-error': validate.error }">
        <label class="el-form-item__label">文章内容</label>
        <div class="el-form-item__content">
          <div id="editor"></div>
          <div v-if="validate.error" class="el-form-item__error">正文怎能没有内容呢？</div>
        </div>
      </div>

      <div class="oprator right">
        <el-button class="submit" type="primary" @click="submit" @keyup.enter="submit">发布文章</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>

import { mapState } from 'vuex';

let editor = null;

export default {

  name: 'create',

  data () {
    return {
      categorys: [],
      form: {
        category: null,
        title: '',
      },
      rules: {
        title: [
          { required: true, message: "必须填写标题哦!", trigger: 'blur' },
        ],
        category: [
          { type: 'object', required: true, message: "必须填写分类哦!", trigger: 'blur' },
        ],

      },

      validate: {
        error: false
      }
    };
  },
  created(){
    this.getCategory();
  },
  mounted(){
    this.initEditor();
  },
  computed: mapState(['user']),
  methods: {
    content(){
      return editor.$txt.html();
    },
    initEditor(){
      let E = window.wangEditor;
      editor = new E('editor')

      editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
          // https://www.kancloud.cn/wangfupeng/wangeditor2/113975 请看这里
          if (item === 'location') {
              return null;
          }
          return item;
      });

      editor.create();

      editor.onchange = () => {
        this.validateContent();
      }

    },
    getCategory(){
      const cq = new this.$api.SDK.Query('Category');
      cq.find().then((categorys) => {
        this.categorys = categorys;
        this.form.category = categorys[0];
      }).catch(console.error)
    },

    validateContent(){
      if (this.content() == '<p><br></p>') {
        this.validate.error = true;
        $('.wangEditor-container').css({borderColor:'red'})
        return;
      }

      this.validate.error = false;
      $('.wangEditor-container').css({borderColor:'#ccc'})
    },

    createArticle(){
      const article = new this.$api.SDK.Object('Article');
      article.set('author', this.user);
      article.set('title', this.form.title);
      article.set('content', this.content());
      article.set('category', this.form.category);
      return article;
    },

    setACL(article){
      // 设置访问权限
      // https://leancloud.cn/docs/acl-guide.html#单用户权限设置
      let acl = new this.$api.SDK.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(this.user,true);
      article.setACL(acl);
    },

    save(article){
      article.save().then((article) => {
        console.log(article);
        const message =  `文章《${article.get('title')}》发布成功`;
        this.$message({message, type: 'success'})
      }).catch(console.error);
    },

    submit(){
      this.$refs.form.validate((valid) => {
        this.validateContent();
        if (valid) {
          const article = this.createArticle();
          this.setACL(article);
          this.save(article);
        } else {
          console.log('error submit!!');
           this.$message.error('错了哦，您填写的信息有错误，请按照提示修改。');
          return false;
        }
      })

    }
  },
};
</script>

<style lang="css" scoped>
.oprator{
  margin-top: 20px;
  float: right;
}
#editor{
  min-height: 300px;
}
</style>
```

为应用添加一个全局样式文件，新建 assets/global.css

```
.container{
  padding: 0 10%;
}
```

设置一下路由 router/index.js

```js
import ArticleCreate from '@/pages/article/create'

{
 path: '/article/create',
 name: 'ArticleCreate',
 component: ArticleCreate,
 meta: {
   needLogin: true
 }
}
```

meta 是我们添加的元信息，为这个路由添加一些标识符，这个 needLogin 代表要求我们登陆。接下来，我们再设置一下权限验证的逻辑，让没有登陆的用户无法访问发布文章的页面。这是通过路由的全局钩子来实现的，代码可以在 vue-router 找到。

```js
import './assets/global.css'

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needLogin)) {
    if (!store.state.user) {
      // Vue.prototype.$message.error("请先登录");
      app.$message.error("请先登录");
      next({
        path: '/signIn'
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

const app = new Vue({
  el: '#app',
  router,
  store,
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
})
```



### 5.11 文章列表功能

page/List

```
<template>
  <div class="container">
    <header>
      <h2>{{ title }}</h2>
    </header>
    <section>
      <article v-for="article in articles">
        <h3>
          <router-link :to="{ name:'ArticleShow', params: { id: article.id }}">{{ article.get('title') }}</router-link>
        </h3>
      </article>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

  name: 'List',

  data () {
    return {
      title: '',
      articles: []
    };
  },
  created(){
      this.match();
  },
  watch: {
    ['$route.query']() {
      console.log('re render');
      this.articles = [];
      this.match();
    }
  },
  computed: mapState(['user']),
  methods: {
    match(){
      let flag = this.$route.query.type || this.$route.query.cid ;

      this.$Progress.start();

      switch(flag){
        case 'me':
          this.getMyArticles();
          break;
        case 'all':
          this.getAllArticles();
          break;
        default:
          this.getCategoryArticle(flag);
      }
    },
    query(){
      let q = new this.$api.SDK.Query('Article');
      q.include('category');
      q.include('author');
      q.descending('cratedAt'); // 新创建的在前面
      return q;
    },
    getCategoryObj(id){
      return this.$api.SDK.Object.createWithoutData('Category', id);
    },
    setArticles(q){
      q.find().then((articles) => {
          this.articles = articles;
          this.$Progress.finish();
      }).catch(this.fail);
    },
    fail(error){
      this.$message.error(error);
      this.$Progress.fail();
    },
    getAllArticles(){
      this.title = "所有文章";
      const q = this.query();
      this.setArticles(q);
    },
    getMyArticles(){
      this.title = "我的文章";
      const q = this.query();
      this.setArticles(q);
    },
    // cid => category_id
    getCategoryArticle(cid){
      let cateObj = this.getCategoryObj(cid);
      const q = this.query();
      q.equalTo('category', cateObj);
      this.setArticles(q);
    }
  }
};
</script>

<style lang="css" scoped>
h2{
  text-align: center;
}

header{
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 5px;
  padding: 20px;
}
</style>
```

app.Vue

```
// this.$router.afterEach((to, from) => {
//   this.$Progress.finish()
// })
```

article/create.vue

```
mounted(){
    this.initEditor();
    this.$Progress.finish();
},
```

router/index.js

```
import ArticleList from '@/pages/List'

    {
      path: '/article',
      name: 'ArticleList',
      component: ArticleList
    },
```

header.vue

```
<el-menu-item index="/article?type=all"><i class="fa fa-flag" aria-hidden="true"></i> 探索</el-menu-item>

<el-menu-item index="/article?type=me">我的文章</el-menu-item>
```



### 5.12 文章显示与删除

article/index.vue

```
<template>
<div class="container">
  <template v-if="article">
    <h2>{{ article.get('title') }}</h2>
    <div class="oprator" v-if="uid == article.get('author').id">
      <button>修改</button>
      <button @click="destroy">删除</button>
    </div>
    <div class="content" v-html="article.get('content')"></div>
  </template>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  name: 'index',

  data () {
    return {
      article: null
    };
  },
  created(){
    const id = this.$route.params.id;
    this.getArticle(id);
  },
  computed: {
    ...mapGetters(['uid'])
  },
  methods: {
    getArticle(id){
      const q = new this.$api.SDK.Query('Article');
      q.include('author');
      q.include('category');
      q.get(id).then((article) => {
        this.article = article;
        this.$Progress.finish();
      }).catch(console.log)
    },
    destroy(){
      this.article.destroy().then(() => {
        this.$message({type:'success', message: '删除成功'});
        this.$router.replace({path:'/article?type=all'});
      })
    }
  }
};
</script>

<style lang="css" scoped>
</style>
```

store/index.js

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    }
  },
  getters: {
    uid({user}) {
      if (user) return user.id;
      return null;
    }
  },
  actions: {
     exit(context){
       context.commit('setUser', null);
     },
     login(context, user){
       context.commit('setUser', user);
     }
   }
})

export default store

```

router/index.js

```
import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import List from '@/pages/List'
import signUp from '@/pages/signUp'
import signIn from '@/pages/signIn'
import ArticleCreate from '@/pages/article/create'
import ArticleShow from '@/pages/article/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/article',
      name: 'ArticleList',
      component: List,
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
      path: '/article/create',
      name: 'ArticleCreate',
      component: ArticleCreate,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/article/:id',
      name: 'ArticleShow',
      component: ArticleShow,
    }
  ]
})
```

再完善一下创建逻辑

```
    save(article){
      article.save().then((article) => {
        console.log(article);
        const message =  `文章《${article.get('title')}》发布成功`;
        this.$message({message, type: 'success'})
        this.$router.replace({name:"ArticleShow", params: { id: article.id }});
      }).catch(console.error);
    },
```



### 5.13 修改文章

article/edit.vue

```
<template>
  <div class="container">
    <h3 class="title is-3">发布一篇新的文章</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择文章分类">
          <el-option v-for="cate in categorys" :key="cate.id" :label="cate.get('name')" :value="cate">{{ cate.get('name') }}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>

      <div class="el-form-item is-required" :class="{ 'is-error': validate.error }">
        <label class="el-form-item__label">文章内容</label>
        <div class="el-form-item__content">
          <div id="editor"></div>
          <div v-if="validate.error" class="el-form-item__error">正文怎能没有内容呢？</div>
        </div>
      </div>

      <div class="oprator right">
        <el-button class="submit" type="primary" @click="submit" @keyup.enter="submit">发布文章</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>

import { mapState } from 'vuex';

let editor = null;

export default {

  name: 'create',

  data () {
    return {
      article: null,
      categorys: [],
      form: {
        category: null,
        title: '',
      },
      rules: {
        title: [
          { required: true, message: "必须填写标题哦!", trigger: 'blur' },
        ],
        category: [
          { type: 'object', required: true, message: "必须填写分类哦!", trigger: 'blur' },
        ],

      },
      validate: {
        error: false
      }
    };
  },
  created(){
    this.getCategory();
    this.getArticle();
  },
  mounted(){
    this.initEditor();
    window.q = this;
  },
  computed: {
    ...mapState(['user']),
    text: {
      get(){
        return editor.$txt.html();
      },
      set(html){
        return editor.$txt.html(html)
      }
    }
  },
  methods: {
    getContent(){
      return editor.$txt.html();
    },
    setContent(html){
      return editor.$txt.html(html)
    },
    getArticle(){
      const id = this.$route.params.id;
      let q = new this.$api.SDK.Query('Article');
      q.include('category');
      q.get(id).then((article) => {
        this.article = article;

        this.form.title = article.get('title');
        const cid = article.get('category').id;

        this.wait(this.categorys.length).then(() => {
          const index = this.categorys.findIndex(c => c.id == cid);
          this.form.category = this.categorys[index];
        })

        this.wait(editor).then(() => {
          this.setContent(article.get('content'))
        });

        this.$Progress.finish();

      })
    },
    wait(flag){
      console.log(flag)
        return new Promise((reslove, reject) => {
          let timer = null;
          if (flag) {
            reslove()
          }else{
            timer = setInterval(() => {
              if (!flag) {return;}
              reslove()
              clearInterval(timer);
            }, 500)

          }
        })
    },
    initEditor(){
      let E = window.wangEditor;
      editor = new E('editor')

      editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
          // https://www.kancloud.cn/wangfupeng/wangeditor2/113975 请看这里
          if (item === 'location') {
              return null;
          }
          return item;
      });

      editor.create();

      editor.onchange = () => {
        this.validateContent();
      }

    },
    getCategory(){
      const cq = new this.$api.SDK.Query('Category');
      cq.find().then((categorys) => {
        this.categorys = categorys;
      }).catch(console.error)
    },

    validateContent(){
      if (this.getContent() == '<p><br></p>') {
        this.validate.error = true;
        $('.wangEditor-container').css({borderColor:'red'})
        return;
      }

      this.validate.error = false;
      $('.wangEditor-container').css({borderColor:'#ccc'})
    },

    setArticle(){
      const article = this.article;
      article.set('author', this.user);
      article.set('title', this.form.title);
      article.set('content', this.getContent());
      article.set('category', this.form.category);
      return article;
    },


    save(article){
      article.save().then((article) => {
        console.log(article);
        const message =  `文章《${article.get('title')}》修改成功`;
        this.$message({message, type: 'success'})
        this.$router.replace({name:"ArticleShow", params: { id: article.id }});
      }).catch(console.error);
    },

    submit(){
      this.$refs.form.validate((valid) => {
        this.validateContent();
        if (valid) {
          const article = this.setArticle();
          this.save(article);
        } else {
          console.log('error submit!!');
           this.$message.error('错了哦，您填写的信息有错误，请按照提示修改。');
          return false;
        }
      })

    }
  },
};
</script>

<style lang="css" scoped>
.oprator{
  margin-top: 20px;
  float: right;
}
#editor{
  min-height: 300px;
}
</style>

```

router/index.js

```
import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import List from '@/pages/List'
import signUp from '@/pages/signUp'
import signIn from '@/pages/signIn'
import ArticleCreate from '@/pages/article/create'
import ArticleShow from '@/pages/article/index'
import ArticleEdit from '@/pages/article/edit'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/article',
      name: 'ArticleList',
      component: List,
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
      path: '/article/create',
      name: 'ArticleCreate',
      component: ArticleCreate,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/article/:id',
      name: 'ArticleShow',
      component: ArticleShow,
    },
    {
      path: '/article/:id/edit',
      name: 'ArticleEdit',
      component: ArticleEdit,
         meta: {
       needLogin: true
      }
    },
  ]
})
```

# 后接 12节



