<template>
  <div class="container">
    <h2>我的消息</h2>
    <ul v-if="messages.length">
      <li v-for="(message, index) in messages" :key="message.get('from').id"> <router-link :to="{ name: 'User', params: { id: message.get('from').id } }">{{ message.get('from').get('username') }}</router-link> 给你发了一条信息
        <p><button @click="destroy(index)">删除</button></p>
        <p>{{ message.get('message') }}</p>
      </li>
    </ul>
    <span v-else>没有消息</span>
  </div>
</template>

<script>
export default {

  name: 'myMessage',

  data () {
    return {
      messages: [],
    }
  },
  created(){
    this.getMessages();
  },
  methods: {
    getMessages(){
      const q = new this.$api.SDK.Query('_Status');
      q.include('from');
      q.equalTo('to', this.$store.state.user)
      q.equalTo('inboxType', 'private');
      q.find().then((messages) => {
        console.log(messages)
        this.messages = messages;
        this.$Progress.finish()
      }).catch((err) => {
        this.$messages.error(err);
      })

      //.catch(this.$message.error)
    },
    destroy(index){
      console.log(index)
      this.messages[index].destroy().then((status) => {
        if (status) {
          this.messages.splice(index, 1);
          this.$messages({ messages: '删除成功', type:'success' });
        }
      })
    }

  }
};
</script>

<style lang="css" scoped>
</style>