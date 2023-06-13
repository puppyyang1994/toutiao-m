<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录表单栏 -->

    <!-- 表单验证
    1. 给 vant-field 组件配置rules验证规则
    2. 当表单提交的时候会自动触发表单验证
    3.如果验证通过， 会自动触发submit事件
    4. 如果验证不通过， 不会触发 -->

    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>

      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- 给time 设置倒计时时长 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 30"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            round
            size="small"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>

      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="default" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  data() {
    return {
      // 可以用vue调试工具看是否绑定成功数据
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号吗格式错误' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码错误' }
        ]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      //  1. 获取表单数据
      const user = this.user
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 //
      })
      //  2. 表单验证
      // 3.提交表单 请求登录
      try {
        // 这里一定要解构 不然后面的status判断不出类型
        const res = await login(user)
        const { data } = res

        // 在组件中必须通过 this.$toast 来调用
        // 登录成功后 修改state中的数据
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')

        // 登录成功 跳转回原来页面
        // back方式不严谨 后面讲功能优化时再说
        this.$router.back()
      } catch (err) {
        console.log(err)
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误!')
        } else {
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
      // 4. 根据请求响应结果 处理后续操作
    },
    async onSendSms() {
      console.log('send')
      // 1. 验证手机号是否有效  validate方法会返回一个promise
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        // 用return 让验证失败后 代码停止
        return console.log('验证失败', err)
      }

      // 2. 验证通过， 显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码（调用接口）
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败 关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁，请稍后重试')
        } else {
          this.$toast('发送失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    // 字体大小由高决定

    font-size: 32px;
  }

  .send-sms-btn {
    background-color: #ededed;
    color: #666666;
    width: 152px;
    height: 46px;
    font-size: 18px;
    line-height: 46px;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      color: #fff;
      border: none;
    }
  }
}
</style>
