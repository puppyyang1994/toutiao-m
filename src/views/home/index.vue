<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar">
      <!-- 搜索栏 -->
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- 滑动标签页 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <!-- 拿到数据后渲染 -->
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <!-- 把父组件的数据channel传给子组件， 然后子组件要声明接收一下 -->
        <article-list :channel="channel" />
        <!-- 文章列表 -->
      </van-tab>

      <!-- 加一个插槽占位 这样就不会遮挡最后一个内容 这是一个经验 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 使用汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
// 引入子组件（文章列表）
import ArticleList from './components/article-list.vue'
export default {
  // 组件名称
  name: 'HomeIndex',
  // 局部注册的组件
  components: { ArticleList },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      active: 0, //借助这个变量来识别当前所选择的频道
      channels: [] //定义一个数据 用来获取频道列表数据
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
    this.loadChannels()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadChannels() {
      try {
        const { data } = await getUserChannels()
        // console.log('获取成功', data)
        this.channels = data.data.channels
      } catch (err) {
        this.$toast.fail('获取失败', res)
      }
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-bottom: 80px;
  // deep是深度递归的意思 在css类名或者id名前面加上，从而找到对应的标签
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .page-nav-bar {
    .search-btn {
      width: 200px;
      background-color: #5babfb;
    }
  }

  // 给tabs添加样式  vant自带的样式 类名可以通过去开发工具里面看
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 50px;
    }
    .van-tab__text {
      height: 80px;
      line-height: 80px;
    }
    .van-tab {
      min-width: 80px;
      border-right: 1px solid #edeff3;
      font-size: 15px;
      color: #777777;
      z-index: 1;
    }
    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background: #3296fa;
    }
  }
  .placeholder {
    width: 60px;
    height: 50px;
  }
  // 汉堡按钮样式
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 50px;
    background-color: #fff;
    opacity: 0.902; //透明效果
    i.toutiao {
      font-size: 20px;
    }
    // &:before {
    //   content: '';
    //   position: absolute;
    //   left: 0;
    //   width: 1px;
    //   height: 100%;
    //   background-image: url('~@/assets/gradient-gray-line.png');
    //   // 填充模式
    //   background-size: contain;
    // }
  }
}
</style>