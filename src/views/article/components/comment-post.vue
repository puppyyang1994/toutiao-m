<template>
  <div class="comment-post">
    <!-- 用的van-field组件 -->
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <!-- 加一个disabled 完善按钮 -->
    <van-button class="post-btn" @click="onPost" :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  // 组件名称
  name: 'CommentPost',
  // 局部注册的组件
  components: {},
  // 子组件间接收父组件的属性，这种接收不论父子组件嵌套层级多深，都可以拿到数据
  // 比起属性绑定一层一层往下传看起来更具有灵活性
  // 但是该技巧不能滥用，他会使重构变得更加困难，同时所提供的的property是非响应式的
  // inject:['articleId']
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  // 组件参数 接收来自父组件的数据
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      message: '' //评论内容
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
    async onPost() {
      // 添加加载效果
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 //
      })
      try {
        const { data } = await addComment({
          target: this.target.toString(), // // 评论文章即为文章id
          content: this.message,
          // inject了articleId 所以这里做相应的调整
          art_id: this.articleId ? this.articleId.toString() : this.articleId //对文章进行评论，不要传此参数。
        })
        // console.log(data)
        // 关闭弹出层
        // 将发布内容显示到列表顶部
        // 清空文本框
        this.message = ''
        // 在子组件中自定义事件 父组件自己决定传过去的数据怎么用
        this.$emit('post-success', data.data)

        // 发布成功后的提示
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast.fail('发布失败', error)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
