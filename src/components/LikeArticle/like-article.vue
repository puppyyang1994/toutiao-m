<template>
  <van-button
    class="btn-item"
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: value === 1 }"
    @click="onLike"
    :loading="loading"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  // 组件名称
  name: 'LikeArticle',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      loading: false
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
    async onLike() {
      this.loading = true
      try {
        let status = -1 //没有点赞的状态
        // 是否已点赞
        if (this.value === 1) {
          // 如果已点赞
          await deleteLike(this.articleId)
        } else {
          // 未点赞 就增加点赞
          await addLike(this.articleId)
          status = 1
        }
        // 视图也要更新
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('点赞失败，请稍后重试', error)
      }
      // 请求结束
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.liked {
  .van-icon {
    color: #e5645f !important;
  }
}
</style>
