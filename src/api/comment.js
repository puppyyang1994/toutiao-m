/* 
评论请求模块
*/
import request from "@/utils/request"


// 获取文章评论列表

export const getComments = params =>{
    return request({
        method:'GET',
        url:'/v1_0/comments',
        params
    })
}

// 对评论点赞
// target 是评论点赞的那个id
export const addCommentLike = target =>{
    return request({
        method:'POST',
        url:'/v1_0/comment/likings',
        data:{
            target
        }

    })
}

// 取消对评论点赞
export const deleteCommentLike = target =>{
    return request({
        method:'DELETE',
        url:`/v1_0/comment/likings/${target}`
    })
}
