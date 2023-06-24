<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment" />
      <!-- /当前评论项 -->

      <!-- 评论回复列表 -->
      <van-cell title="全部评论" />
      <!-- 将事件处理函数拿到的数据传递给对应的渲染组件 -->
      <common-list :list="commentList" :source="comment.com_id" type="c" />
    </div>

    <!-- 发布评论 -->
    <!-- <div class="post-w">
      <van-button class="post-btn" size="small" round @click="isPostShow = true"
        >写评论</van-button
      >
    </div> -->
    <van-popup v-model="isPostShow" position="bottom">
      <!-- 监听comment-post的自定义事件 -->
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->
    <!-- 发布评论的弹层 -->
    <van-popup v-model="isPostShow" position="bottom">123</van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommonList from './common-list.vue'
import CommentPost from './comment-post.vue'
export default {
  // 组件名称
  name: 'CommentReply',
  // 局部注册的组件
  components: {
    CommentItem,
    CommonList,
    CommentPost
  },
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
      isPostShow: false,
      commentList: []
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
    onPostSuccess(data) {
      // 更新回复的数量
      this.comment.reply_count++

      // 关闭弹层
      this.isPostShow = false

      // 将最新回复的内容展示到列表上
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
.scroll-wrap {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  bottom: 44px;
  overflow-y: auto;
}
</style>
