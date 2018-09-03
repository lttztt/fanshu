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
    data(){
      return {
        active: '0'
      };
    },
    methods: {
      handleSelect(key, keyPath){
        console.log(key, keyPath)
      }
    }
  }
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