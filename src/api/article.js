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

// 收藏文章接口封装
export const addCollect = target =>{
    return request({
        method:'POST',
        url:'/v1_0/article/collections',
        data:{
            target
        }

    })
}
// 取消收藏文章接口封装
export const deleteCollect = target =>{
    return request({
        method:'DELETE',
        url:`/v1_0/article/collections/${target}`,
       
    })
}


// 文章点赞
export const addLike = target =>{
    return request({
        method:'POST',
        url:'/v1_0/article/likings',
        data:{
            target
        }
    })
}

// 取消对文章点赞
export const deleteLike = target =>{
    return request({
        method:'DELETE',
        url:`/v1_0/article/likings/${target}`
    })
}

