import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login') // 路由懒加载
  },
  {
    path: '/',
    // name: 'layout', //如果父路由有默认子路由，那他的name就没有意义 所以这里注掉就好了
    component: () => import('@/views/layout'), // 路由懒加载
    // 配置子路由
    children: [
      {
        path: '', // 留空 代表默认子路由 只能有一个
        name: 'home',
        component: () => import('@/views/home') // 路由懒加载
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa') // 路由懒加载
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video') // 路由懒加载
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my') // 路由懒加载
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
