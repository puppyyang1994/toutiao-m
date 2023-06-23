<template>
  <!-- 如果value是true 就star 否则就star-o -->
  <!-- 动态绑定类名  如果value为true 那collected这个类名就作用上了 -->
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value
    }"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  // 组件名称
  name: 'CollectArticle',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  // v-model在父子组件中实现双向绑定， 子组件用value接收 同时
  // 通过触发input事件将更新后的值发送回父组件。
  props: {
    value: {
      type: Boolean,
      required: true
    },
    // 父组件传递文章id（在发送请求接口的时候要求） 子组件要声明接收
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
    async onCollect() {
      // 开始请求
      this.loading = true
      try {
        // 是否收藏
        if (this.value) {
          // 已收藏
          // 收藏得传文章的ID
          // 父组件传递articleId
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        // 更新视图
        // 不能直接更改value 父组件v-model绑定 所以要用input事件
        this.$emit('input', !this.value)
        // 自定义事件修改数据并不是立即的 所以这里也和上面一样 加一个！
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast.fail('操作失败，请重试')
      }
      //   请求结束
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
