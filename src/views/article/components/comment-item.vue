<template>
  <van-cell class="comment-item">
    <!-- 评论头像 -->
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <!-- 标题 -->
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
      <!-- 处理点赞图标 -->
      <!-- 动态绑定类 -->
      <van-button
        class="like-btn"
        :class="{ liked: comment.is_liking }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="loading"
        @click="onCommentLike"
        >{{ comment.like_count || '赞' }}</van-button
      >
    </div>
    <!-- 评论内容 -->
    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{
          comment.pubdate | relativeTime
        }}</span>
        <!-- 当点击回复按钮的时候 展示弹层 对外发布自定义事件 -->
        <van-button
          class="reply-btn"
          round
          @click="$emit('reply-click', comment)"
          >回复 {{ comment.reply_count }}</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  // 组件名称
  name: 'CommentItem',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    comment: {
      type: Object,
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
    async onCommentLike() {
      this.loading = true
      try {
        if (this.comment.is_liking) {
          // 已经点赞 取消点赞
          await deleteCommentLike(this.comment.com_id)
          // this.comment.like_count--
        } else {
          await addCommentLike(this.comment.com_id)
          // this.comment.like_count++
        }
        this.comment.is_liking = !this.comment.is_liking
      } catch (error) {
        this.$toast.fail('点赞失败', error)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 13px;
    }
  }
  .comment-content {
    margin-top: 35px;
    font-size: 13px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 9px;
    color: #222;
    margin-right: 12px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 67px;
    height: 24px;
    line-height: 24px;
    font-size: 11px;
    color: #222;
  }
  .like-btn {
    height: 15px;
    padding: 0;
    border: none;
    font-size: 10px;
    line-height: 15px;
    margin-right: 4px;
    .van-icon {
      font-size: 15px;
    }
    // 追加一个样式
    &.liked {
      color: #e5645f;
    }
  }
}
</style>
