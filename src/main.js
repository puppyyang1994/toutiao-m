import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载vant 组件
import Vant from 'vant'
import 'vant/lib/index.css'

// 加载全局样式

import './styles/index.less'

// 注册使用vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
