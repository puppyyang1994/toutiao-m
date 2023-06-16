<template>
  <div class="article-list">
    <!-- 下拉刷新组件 -->
    <van-pull-refresh
      v-model="isFreshLoading"
      :success-text="refreshSuccessText"
      @refresh="onRefresh"
    >
      <!-- 列表加载 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
export default {
  // 组件名称
  name: 'ArticleList',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  //   用开发者工具去看看 数据有没有接收成功
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      list: [], //存储列表数据的数组
      loading: false, //控制加载中loading状态
      finished: false, //控制数据加载结束的状态
      error: false, //是否加载失败
      timestamp: null, //请求获取下一页时间戳
      // 控制下拉书信的失败状态
      isFreshLoading: false,
      // 下拉刷新成功的提示案例
      refreshSuccessText: ''
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
    // onLoad的作用就是请求获取数据 再把数据放到list中
    async onLoad() {
      // 初始化 list列表生成后会触发一次load事件
      // console.log('onload')
      // 1. 请求获取数据 异步更新数据

      try {
        const { data } = await getArticle({
          channel_id: this.channel.id, //频道id
          // 简单理解就是请求数据的页面
          // 如果请求第一页 当前数据时间戳
          //如果有获取 this.timestamp 如果没有 Date.now
          timestamp: this.timestamp || Date.now(),
          with_top: 0
        })
        const { results } = data.data
        // 2. 把请求的结果放到list数组中
        // 数组的展开操作符... 会把数组元素一个一个拿出来
        this.list.push(...results)
        // 3. 本次数据加载结束之后 要把加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了 将finished设为true就不再load加载更多了
          this.finished = true
        }
      } catch (error) {
        console.log('请求失败', error)
        this.loading = false //加载完毕
        this.error = true
      }
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
        this.count++
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less"></style>
