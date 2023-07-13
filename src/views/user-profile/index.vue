<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <van-cell title="头像" is-link>
      <van-image
        class="avatar"
        fit="cover"
        round
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
    </van-cell>
    <van-cell
      title="昵称"
      @click="isUpdateNameShow = true"
      :value="user.name"
      is-link
    ></van-cell>

    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
    ></van-cell>
    <van-cell title="生日" :value="user.birthday" is-link></van-cell>
    <van-popup
      v-model="isUpdateNameShow"
      class="popup"
      style="height: 100%"
      position="bottom"
    >
      <!-- 编辑弹出 层组件 -->
      <!-- 把父组件的昵称传给子组件 -->
      <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
export default {
  // 组件名称
  name: 'UserProfile',
  // 局部注册的组件
  components: { UpdateName },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      user: {}, //返回的个人信息
      isUpdateNameShow: false //是否显示弹出层
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
    this.loadUserProfile()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        console.log(data.data)
        this.user = data.data
      } catch (error) {
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .popup {
    background: #f5f7f9;
  }
}
</style>
