<template>
  <div id="app">
    <Header></Header>
    <router-view/>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'App',
  components:{
    Header
  }
  ,
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
