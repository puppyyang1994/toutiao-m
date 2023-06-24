<template>
  <!-- 列表组件有一个特点， 不在他的可是区域 他不会加载更多 -->
  <!-- 加上 immediate-check属性（是否在初始化时立即执行滚动位置检查-->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <!--   <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.content"
    /> -->
    <!-- 把获取到的数据遍历项comment传给子组件 然哦户去子组件中声明接收  -->
    <!-- 来到父组件中 监听处理子组件comment item发过来的自定义事件 -->
    <!-- comment list再把它传给 article详情页 -->
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import commentItem from './comment-item.vue'
export default {
  // 组件名称
  name: 'CommonList',
  // 局部注册的组件
  components: {
    commentItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 本来是子组件中的list 为了让父组件来操作这个数据
    // 可以写到props里 然后 让父组件传这个list给子组件
    list: {
      type: Array,
      // required:true 非必须
      default: () => []
    },
    // 自定义prop数据验证
    type: {
      type: String,
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  // 组件状态值
  data() {
    return {
      //   list: [],
      loading: false,
      finished: false,
      offset: null, //获取下一页的一个标记
      limit: 10,
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
  created() {
    // 一上来就渲染出来 还没有拉倒底部  评论列表就自动出来了
    // 当手动初始化onLoad的话 它不会自动开始初识的loading
    // 所以我们要手动的开始loading
    this.loading = true
    this.onLoad()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data } = await getComments({
          type: this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), //文章id或评论id
          //   获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          offset: this.offset, //相当于页面
          limit: this.limit //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data)
        // 在子组件中发布一个自定义事件 传给父组件从而去修改父组件的totalCommentCount

        // 2.将数据添加到列表中
        // 代码命名规范 不允许命名total_count 所以重命名 totalCount
        const { results } = data.data
        this.list.push(...results) //直接数组合并
        // 把文章评论的总数量 传递到外部 (把整个数据对象传出去)
        this.$emit('onload-success', data.data)
        // 然后去父组件中 监听使用onload-success 自定义事件

        //3. 将loading关闭
        this.loading = false
        // 4. 判断是否还有数据 有就更新获取下一页数据
        if (results.length) {
          this.offset = data.data.last_id
        }
        // 没有就显示加载完成 finished = true
        this.finished = true
      } catch (error) {
        // this.$toast.fail('获取数据失败', error)
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
