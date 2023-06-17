// 用vue的模板过滤器来处理  所以要引入vue

import Vue from 'vue'




import dayjs from 'dayjs' // ES 2015


// 加载中文语言包
import 'dayjs/locale/zh-cn' // ES 2015 

// 引入插件
import relativeTime  from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件

dayjs.extend(relativeTime)

// 把下面的代码改成ES6语法
// var relativeTime = require('dayjs/plugin/relativeTime')
// dayjs.extend(relativeTime)


dayjs.locale('zh-cn') // 全局使用

// 定义一个全局过滤器，然后可以在任何组件的模板中使用
// 过滤器 相当于一个全局可用的方法， 仅供模板使用（template里的html标签 js是无法调用的）
// 过滤器名称 过滤器函数
// 使用方式 {{表达式 | 过滤器名称}}
// 管道符前面的表达式的结果会作为参数传递到过滤器函数中
// 过滤器的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value=>{
    return dayjs().to(dayjs(value))
})




// 以下为测试代码

// dayjs()获取当前最新时间 format()方法  在main.js中测试
// console.log(dayjs().format('YYYY-MM-DD'))

// console.log( dayjs().to(dayjs('1990-01-01'))) //33年前

// dayjs().from(dayjs('1990-01-01')) // 31 年后
// dayjs().from(dayjs('1990-01-01'), true) // 31 年
// dayjs().fromNow()

// dayjs().to(dayjs('1990-01-01')) // 31 年前
// dayjs().toNow()
