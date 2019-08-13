<template>
  <div id="app">
    <p>Hello Vue SSR</p>
    <router-link to="/baz">Baz</router-link>
    <router-link to="/bar">Bar</router-link>
    <router-link to="/foo">Foo</router-link>

    <div>Test</div>

    <router-view></router-view>
  </div>
</template>
<script>
export default {

}
</script>

