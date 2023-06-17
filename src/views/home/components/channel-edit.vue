<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <!-- 用插槽 方便后面自定义样式 -->
      <div slot="title" class="title-text">我的频道</div>
      <!-- 这里用van按钮是因为 它本身默认就是放在右边的位置 -->
      <van-button class="edit-btn" round type="info" plain size="small"
        >编辑</van-button
      >
    </van-cell>
    <!-- 每一个格子项  宫格 -->
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        icon="clear"
      >
        <!-- 专门写一个标签来定制文本高亮 自定义样式 -->
        <!-- 第一个active（键）是类名的名字 第二个表达式的结果要是一个布尔值    第二个active是父组件传过来的props里的数据 -->
        <span slot="text" class="text" :class="{ active: index === active }">
          {{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <!-- 推荐频道 -->
    <van-cell :border="false">
      <!-- 用插槽 方便后面自定义样式 -->
      <div slot="title" class="title-text">频道推荐</div>
      <!-- 这里用van按钮是因为 它本身默认就是放在右边的位置 -->
    </van-cell>
    <!-- 每一个格子项  宫格 -->
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
      />
    </van-grid>
    <!-- /推荐频道 -->
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  // 组件名称
  name: 'ChannelEdit',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      allChannels: [] //所有频道
    }
  },
  // 计算属性
  computed: {
    // 推荐频道的数据  = 所有频道的数据 - 我的频道的数据
    recommendChannels() {
      const channels = [] //用来存放符合条件的频道
      this.allChannels.forEach((channel) => {
        // 看看在 我的频道中是否有这个频道（所有频道里的频道） 如果有 则不要      find方法返回的是第一个满足条件的元素
        const ret = this.myChannels.find((myChannel) => {
          // 如果满足 则返回满足条件的元素 这里是myChannel
          return myChannel.id === channel.id
        })

        // 然后取反 如果我的频道中 不包括该频道项， 则收集到推荐频道中
        if (!ret) {
          channels.push(channel) //注意这里面push的是 所有频道中符合条件的channel
        }
      })

      return channels //把计算结果返回给channels
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created() {
    this.loadAllChannels()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        console.log('请求成功', data)
      } catch (error) {
        this.$toast.fail('数据请求失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 40px 0;
  .title-text {
    font-size: 16px;
    color: #3333;
  }
  .edit-btn {
    width: 52px;
    height: 24px;
    font-size: 13px;
    border: 1px solid #1989fa;
  }
  /deep/.grid-item {
    .van-grid-item__content {
      width: 75px;
      height: 40px;

      position: relative;
      flex-direction: row;
      background-color: #f4f5f6;
      //   设置不折行
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 14px;
        color: #222;
      }
      .active {
        color: #1989fa;
      }
      .van-icon-plus {
        font-size: 14px;
      }
      //   文字上面有一个外边距 所以和+不平行 去掉就可以
      .van-grid-item__text {
        margin-top: 0px;
        margin-left: 2px;
      }
      .van-icon.van-icon-clear.van-grid-item__icon {
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 15px;
        color: #cacaca;
      }
    }
  }
  //   作用域问题 deep
}
</style>
