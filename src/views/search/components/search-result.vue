<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败"
      @load="onLoad"
    >
      <!-- 注意给title不是直接传title title是一个对象 而应该是传他的属性 item.title -->
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  // 组件名称
  name: 'SearchResult',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, //自己定义一个page
      per_page: 20,
      error: false
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
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, //页码
          per_page: this.per_page, //每页大小
          q: this.searchText
        })
        // console.log(data)
        // 2.将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据， 如
        // 如果没有：将加载更新的状态设置为结束
        if (results.length) {
          // 果有：更新获取下一个数据的页码
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        // 加载失败了 loading也要关闭
        this.loading = false
        this.$toast('数据获取失败，请稍后重试', error)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
