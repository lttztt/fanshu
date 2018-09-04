<template>
  <div class="container" v-if="current_user">
    <h3>{{ current_user.get('username') }}</h3>

    <hr>
    <div class="oprator" v-if="user">
      <button v-if="user.id != current_user.id" @click="toggleFollow">{{ followed? '取消关注':'关注' }}该用户</button>
    </div>
    <ul>
      <li v-for="article in articles" :key="article.id"><router-link :to="{ name: 'ArticleShow', params: {id: article.id} }">{{ article.get('title') }}</router-link></li>
    </ul>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

  name: 'user',

  data () {
    const id = this.$route.params.id;
    return {
      current_user: null,
      articles: null,
      followed: false,
      id,
    };
  },
  computed: mapState(['user']),
  created(){
    this.getCurrentUser();
  },
  methods: {
    getCurrentUser(){
      const id = this.id;
      let q = new this.$api.SDK.Query('_User');
      q.get(id).then((user) => {
        this.current_user = user;
        return user;
      }).then((user) => {
        this.getArticles(user);
        this.checkFollowed();
      }).catch(console.error);
    },
    getArticles(user){
      let q = new this.$api.SDK.Query('Article');
      q.equalTo('author', user);
      q.ascending('createdAt');
      q.find().then(articles => {
        this.articles = articles;
        this.$Progress.finish();
      }).catch(console.error)
    },
    toggleFollow(){
      const id = this.id;
      if(this.followed){
        // 取消关注
        this.user.unfollow(id).then(() => {
          this.followed = false;
          this.$message({type:'success', message: '取消关注成功'});
        }).catch(console.error);
      }else{
        // 关注
        this.user.follow(id).then(() => {
          this.followed = true;
          this.$message({type:'success', message: '关注成功'});
        }).catch(console.error);
      }
    },
    checkFollowed(){
      const id = this.id;
      const q = this.user.followeeQuery();
      q.include('followee');
      q.find().then(followee => {
        if (followee.length) {
          if (followee.some(f => f.id == id)) {
            this.followed = true;
          }
          return;
        }
      }).catch(console.error)

    }
  }

};
</script>

<style lang="css" scoped>
</style>