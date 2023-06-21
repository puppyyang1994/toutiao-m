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

// 获取文章详情
export const getArticleById= (articleId)=>{
    return request({
        method:'GET',
        url:`/v1_0/articles/${articleId}` //天哪 这里的路径一定要注意啊  之前：王姐删除了~~~
    })
}