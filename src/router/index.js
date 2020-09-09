import Vue from 'vue'
import VueRouter from 'vue-router'
import baseLayout from '@/layouts/baseLayout'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'shop',
    meta: {
      title: '店铺信息管理'
    },
    component: baseLayout,
    redirect: '/shopMaintain',
    children: [
      {
        path: 'shopMaintain',
        name: 'shopMaintain',
        meta: {
          title: '店铺信息维护'
        },
        component: () => import('@/views/shop/index.vue')
      }
    ]
  },
  {
    path: '/link',
    name: 'link',
    meta: {
      title: '链接信息管理'
    },
    component: baseLayout,
    redirect: '/link/linkMaintain',
    children: [
      {
        path: 'linkMaintain',
        name: 'linkMaintain',
        meta: {
          title: '链接信息维护'
        },
        component: () => import('@/views/link/index.vue')
      }
    ]
  },
  {
    path: '/brand',
    name: 'brand',
    meta: {
      title: '品牌信息管理'
    },
    component: baseLayout,
    redirect: '/brand/brandMaintain',
    children: [
      {
        path: 'brandMaintain',
        name: 'brandMaintain',
        meta: {
          title: '品牌信息维护'
        },
        component: () => import('@/views/brand/index.vue')
      }
    ]
  },
  {
    path: '/words',
    name: 'words',
    meta: {
      title: '违禁词管理'
    },
    component: baseLayout,
    redirect: '/words/wordsMaintain',
    children: [{
      path: 'wordsMaintain',
      name: 'wordsMaintain',
      meta: {
        title: '违禁词维护'
      },
      component: () => import('@/views/words/index.vue')
    }
    ]
  },
  {
    path: '/whiteList',
    name: 'whiteList',
    meta: {
      title: '白名单管理'
    },
    component: baseLayout,
    redirect: '/whiteList/whiteListMaintain',
    children: [
      {
        path: 'whiteListMaintain',
        name: 'whiteListMaintain',
        meta: {
          title: '白名单维护'
        },
        component: () => import('@/views/whiteList/index.vue')
      }
    ]
  },
  {
    path: '/check',
    name: 'check',
    meta: {
      title: '检查结果'
    },
    component: baseLayout,
    redirect: '/check/checkResult',
    children: [
      {
        path: 'checkResult',
        name: 'checkResult',
        meta: {
          title: '检查结果页'
        },
        component: () => import('@/views/checkResult/index.vue')
      }, {
        path: 'checkResultInfo',
        name: 'checkResultInfo',
        meta: {
          title: '检查结果页详情页'
        },
        component: () => import('@/views/checkResult/checkResultInfo/index.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'forbidden',
    component: () => import('@/views/401/index.vue')
  },
  {
    path: '*',
    name: 'None',
    component: () => import('@/views/404/index.vue')
  }
]

const router = new VueRouter({
  routes
})
// 捕获路由异常
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
