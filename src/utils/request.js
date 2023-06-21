/* 请求模板 */
import axios from "axios"
import JSONBig from "json-bigint"  //解决安全整数范围问题
// 提供了两个方法  JSONBig.parse 把JSON格式的字符串转为JS对象
// 和JSONBig.stringfy  把JS对象转为JSON格式的字符串
import store from "@/store"
import router from "@/router"

// 注意JSONBig的书写 不能写成jsonBig 否则不生效
//使用的时候 需要把BigNumber 类型的数据转为字符串来使用

// axios.create 方法：复制一个 axios
const request = axios.create({
  baseURL: "http://toutiao.itheima.net",// 基础路径
  transformResponse:[function (data) {
        try {
          return JSONBig.parse(data)  //data就是后端返回的原始数据 // 说白了就是JSON格式的字符串
          
        } catch (err) {
          return data
        }
      }
    ]
});

/**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
// 自定义后端返回的原始数据
// axios默认会在内部这样来处理后端返回的数据


// 请求拦截器
request.interceptors.request.use(
  function(config) {
    const user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // Do something before request is sent
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
);

// 响应拦截器
request.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应对象
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 如果响应码是 401 ，则请求获取新的 token

    // 响应拦截器中的 error 就是那个响应的错误对象
    console.dir(error)
    if (error.response && error.response.status === 401) {
      // 校验是否有 refresh_token
      const user = store.state.user

      if (!user || !user.refresh_token) {
        router.push("/login")

        // 代码不要往后执行了
        return
      }

      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: "PUT",
          url: "http://toutiao.itheima.net/v1_0/authorizations",
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })

        // 如果获取成功，则把新的 token 更新到容器中
        console.log("刷新 token  成功", res);
        store.commit("setUser", {
          token: res.data.data.token, // 最新获取的可用 token
          refresh_token: user.refresh_token // 还是原来的 refresh_token
        })

        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config)
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log("请求刷线 token 失败", err)
        router.push("/login")
      }
    }

    return Promise.reject(error)
  }
);

export default request