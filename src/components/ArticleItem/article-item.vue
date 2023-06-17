<template>
  <van-cell class="article-item">
    <!-- 利用插槽来自定义 -->
    <!-- 标题 -->
    <!-- 最多显示两行 -->
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>
    <!-- 内容 -->
    <div slot="label">
      <!-- 图片 -->
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item-img" :src="img" fit="cover" />
        </div>
      </div>
      <!-- 去开发工具中属性名 看数据名 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 插槽 default 往右边插入内容 -->

    <!-- van自带的图片 -->
    <!-- 利用type来判断 -->
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      class="right-cover"
      :src="article.cover.images[0]"
      fit="cover"
    />
  </van-cell>
</template>

<script>
export default {
  // 组件名称
  name: 'ArticleItem',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {}
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
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset; //去掉flex布局
    width: 116px;
    height: 78px;
    padding-left: 15px;
  }
  .right-cover {
    width: 116px;
    height: 78px;
  }
  .label-info-wrap span {
    font-size: 11px;
    color: #b4b4b4;
    margin-right: 15px;
  }
  .cover-wrap {
    display: flex;
    padding: 10px 0;
    .cover-item {
      flex: 1;
      height: 73px;
      // 给除最后一个元素之外的 右边距
      &:not(:last-child) {
        padding-right: 3px;
      }
      .cover-item-img {
        width: 100%;
        height: 73px;
      }
    }
  }
}
</style>
