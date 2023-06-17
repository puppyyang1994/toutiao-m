<template>
  <div class="article-list">
    <!-- 用这个组件把内容包裹住 -->
    <!-- 下拉刷新组件 -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <!-- 遍历文章列表项 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
// 引入文章列表项
import ArticleItem from '@/components/ArticleItem/article-item.vue'

export default {
  // 组件名称
  name: 'ArticleList',
  // 局部注册的组件
  components: { ArticleItem },
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
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null,
      error: false, // 是否加载失败
      // 控制下拉刷新的失败状态
      isreFreshLoading: false,
      // 下来刷新成功的提示文案
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
          with_top: 1
        })

        // 模拟测试错误随机出现的情况
        // 把JSON格式的字符串 转为对象
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdfg')
        // }
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

        // 展示错误提示状态
        this.error = true // 这个是vant list组件自带的
        // 请求失败了 loading也要关闭
        this.loading = false
      }
    },
    // 当下拉刷新的时候 会触发调用改函数
    async onRefresh() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now(), // 下拉刷新每次都应该获取最新数据
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsnajndjsa')
        // }

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3. 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
// 每一个列表都是一个独立的滚动容器
// 这样每个列表的滚动位置就不会相互影响
.article-list {
  height: 97vh;
  overflow-y: auto;
}
</style>
