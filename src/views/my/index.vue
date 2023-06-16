<template>
  <div class="my-container">
    <!-- 登录时的页面 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <!-- 用vant的图片组件  -->
          <van-image class="avatar" :src="userInfo.photo" fit="cover" round />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button round size="mini">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">10</span>
          <span class="text">{{ userInfo.fans_count }}</span>
        </div>
        <div class="data-item">
          <span class="count">8</span>
          <span class="text">{{ userInfo.like_count }}</span>
        </div>
      </div>
    </div>
    <!-- 未登录是的页面 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <!-- clickable 是否反馈 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <!-- 具名插槽 -->
        <span slot="text" style="font-size: 20px">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" style="font-size: 20px">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- 中间三栏 clickable 有点击反馈-->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />
    <van-cell
      v-if="user"
      class="logout-cell"
      clickable
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
// 把容器当中的数据映射到组件当中
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  // 组件名称
  name: 'MyIndex',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      userInfo: {} //用户信息
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user']) // 把user映射进来了 这样就可以像访问自己的数据一样访问容器里的数据了
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created() {
    // 如果用户登陆了，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    onLogout() {
      // 退出提示
      // 在组件中需要使用this.$dialog
      this.$dialog
        .confirm({
          title: '确认退出吗？'
        })
        .then(() => {
          // on confirm
          // 确认会执行这里
          // 1. 清除操作状态
          this.$store.commit('setUser', null) // 清除容器里的数据   本地存储的数据其实也会改了 是在mutation里的 setItem改的
        })
        .catch(() => {
          // on cancel
          // 取消执行这里
          console.log('取消执行这里')
        })

      // 确认退出：清除登录状态：容器中的user和本地存储中的user
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试') //401表示token无效，已经过期了  请求接口的时候必须带上token
      }
    }
  }
}
</script>

<style scoped lang="less">
// 头部

.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png'); //注意这里路径
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center; //水平居中
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center; //水平居中
      align-items: center;
      .mobile-img {
        height: 132px;
        width: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        letter-spacing: 1px;
        color: #ffffff;
        font-family: MicrosoftYaHei;
      }
    }
  }

  .user-info {
    .base-info {
      display: flex;
      height: 230px;
      padding: 76px 32px 32px;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 10px;
          border: 1px solid #fff;
        }
        .name {
          font-size: 20px;
          color: #fff;
        }
      }
    }
    .data-stats {
      // height: 130px;
      display: flex;
      .data-item {
        flex: 1;
        display: flex;
        height: 130px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 25px;
        }
        .text {
          font-size: 15px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 140px;
      i.toutiao {
        font-size: 25px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .grid-item span.text {
        font-size: 10px;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
