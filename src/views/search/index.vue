<template>
  <div class="search-container">
    <!-- 搜索区域 -->
    <!-- 外层包裹了一个form表单：这个不是必须的 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#6db4fb"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
      <!-- 重新获得焦点后 显示推荐 不显示结果 -->
    </form>
    <!-- 3.搜索结果 -->
    <search-result v-if="isResultShow" />
    <!-- /3.搜索结果 -->

    <!-- 2. 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" />
    <!-- 2 联想建议 -->
    <!-- 1.搜索历史记录 -->
    <search-history v-else />
    <!-- /1.搜索历史记录 -->
  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import searchResult from './components/search-result.vue'
import searchSuggestion from './components/search-suggestion.vue'

export default {
  // 组件名称
  name: 'SearchIndex',
  // 局部注册的组件
  components: {
    searchHistory,
    searchSuggestion,
    searchResult
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      searchText: '',
      isResultShow: false //控制搜索结果的展示
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    onSearch(val) {
      this.isResultShow = true
      console.log(val)
    },
    onCancel() {
      //   点击取消后 让页面回到首页
      // 从首页来的 回到首页去
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.van-search__action {
  color: #fff;
}
</style>
