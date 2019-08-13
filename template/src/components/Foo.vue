<template>
  <div>
    <p>It's Foo</p>
    <p>{{count}} <button @click="add">Add</button></p>
  </div>
</template>
<script>
export default {
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promisec
    console.log('现在触发了服务端的数据预取 fetchCount')
    return store.dispatch('fetchCount', route.params.count)
  },
  computed: {
    // 从 store 的 state 对象中的获取 item。
    count() {
      return this.$store.state.count
    }
  },
  methods: {
    add() {
      console.log(this.$store.state.count)
      this.$store.dispatch('fetchCount', this.$store.state.count)
    }
  }
}
</script>
