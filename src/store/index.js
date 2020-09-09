import Vue from 'vue'
import Vuex from 'vuex'
import menuData from '@/common/commonData/menuData.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spinning: false, // 加载loading的状态
    slideMenu: menuData,
    breadCurmb: []
  },
  getters: {
    menus: state => state.slideMenu,
    getBreadCurmb: state => state.breadCurmb
  },
  mutations: {
    // 突变配置加载loading的状态
    setSpinning (state, payload) {
      state.spinning = payload
    },
    // 设置面包屑
    setBreadCurmb (state, payload) {
      state.breadCurmb = payload
    }
  },
  // 配置异步提交状态
  actions: {
  },
  // 配置store模块
  modules: {
    // menu
  }
})
