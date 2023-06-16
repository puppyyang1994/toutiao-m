/* 用户相关请求模块 */

import request from '@/utils/request' // 用来真正发请求的

import store from '@/store'   //将容器模块 加载进来  这样就可访问到容器里的user的token

// 地址跨域了  需要设置反向代理  接口也换了 要把app去掉

// 登录请求方法
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}

// 短信验证码发送  mobile要作为参数 传过去
// 注意 手机号每分钟现在
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`,
    
  })
}


// 获取用户个人信息接口

export const getUserInfo = () => {
  // 该接口需要授权才能访问
  return request({
    method: 'GET',
    url: '/v1_0/user',
    // 发送请求头数据
  /*   headers: {
      // 注意：该接口需要授权才能访问
      //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
      Authorization: `Bearer ${store.state.user.token}`
    } */
  })
}


// 封装获取用户频道列表的接口
export const getUserChannels = ()=>{
  return request({
    method:'GET',
    url:'/v1_0/user/channels',
  })
}