import Vue from 'vue'
import Vuex from 'vuex'
import {getItem, setItem}from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // user是一个对象 用来存储当前登录用户信息，用来存储token等数据
    // user: null //初始化数据
    // user: JSON.parse( window.localStorage.getItem(TOKEN_KEY)) //还原成对象

    user:getItem(TOKEN_KEY)
  },
  getters: {
  },
  mutations: {
    // 通过mutations来修改state数据
    setUser(state, data){
      state.user = data

      // 为了防止刷新丢失，我们需要把数据备份到本地存储
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))  //把对象转为JSON格式的字符串 来进行本地存储
      setItem(TOKEN_KEY, state.user)
    }
    // 然后调用mutations 实现对state里数据的修改
  },
  actions: {
  },
  modules: {
  }
})
