<template>
  <div id="app">
    <!-- 路由出口 不能删除 -->
    <h1>Hello</h1>
    <div>
      <i class="toutiao toutiao-shouye"></i>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less"></style>
