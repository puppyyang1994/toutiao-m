/* 用户相关请求模块 */

import request from '@/utils/request' // 用来真正发请求的

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
// 地址跨域了  需要设置反向代理  接口也换了 要把app去掉
