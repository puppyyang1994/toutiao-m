
import request from "@/utils/request"

// 获取联想建议数据接口封装
export const getSearchSuggestions = q =>{
    return request({
        method:'GET',
        url:'/v1_0/suggestion',
        params:{
            q
        }
    })
}

// query参数