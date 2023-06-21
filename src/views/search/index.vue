<template>
  <div class="search-container">
    <!-- cell单元格的to属性和VueRouter中的RouterLink的导航组件的to属性用法是一样的 -->
    <!-- 搜索区域 -->
    <!-- 外层包裹了一个form表单：这个不是必须的 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search-form" action="/">
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
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /3.搜索结果 -->

    <!-- 2. 联想建议 -->
    <search-suggestion
      :search-text="searchText"
      v-else-if="searchText"
      @search="onSearch"
    />
    <!-- 2 联想建议 -->
    <!-- 在父组件中 将搜索历史数据传递给子组件 -->
    <!-- 1.搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-history="searchHistories = []"
      @search="onSearch"
    />
    <!-- /1.搜索历史记录 -->
  </div>
</template>

<script>
import searchHistory from './components/search-history.vue'
import searchResult from './components/search-result.vue'
import searchSuggestion from './components/search-suggestion.vue'
import { setItem, getItem } from '@/utils/storage'
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
      isResultShow: false, //控制搜索结果的展示
      //初识化的时候从本地存储获取数据
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] //用来存储历史记录
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchHistories(value) {
      // 同步到本地存储
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
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
      // 更新文本框内容
      this.searchText = val
      // 在触发搜索的时候，记录历史记录

      // 存储搜索历史记录
      // 要求:不要有重复的历史记录，最新的排在最前
      // indexOf等于-1 表示某个元素在数组中不存在
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        // 表示某个关键词在数组中已经存在 所以要先在历史记录中删除
        // splice(开始删除元素的索引, 删除的个数)
        this.searchHistories.splice(index, 1)
      }
      // 把这个关键词放到搜索历史数组 最前面
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
      // console.log(val)
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
.search-container {
  padding-top: 54px;

  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
