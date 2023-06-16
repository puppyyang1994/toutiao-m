// 文章请求模块

import request from "@/utils/request"

// 请求获取文章列表数据
export const getArticle = (params)=>{
    return request({
        method:'GET',
        url:'/v1_0/articles',
        params:params //用来传输query查询参数 可以简写 params


    })
}