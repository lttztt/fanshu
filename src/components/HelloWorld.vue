<template>
  <div class="hello container">
    <h1>{{ msg }}</h1>
    <img src="../assets/images/bg1.jpg" class="bannerImg">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome my friend!'
    }
  },
  mounted(){
    this.$Progress.finish();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bannerImg{
    width: 100%;
  }
h1, h2 {
  font-weight: normal;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
