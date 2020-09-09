export default [
  {
    pId: '1',
    pTitle: '店铺信息管理',
    icon: 'shop',
    item: [{
      path: '/shopMaintain',
      title: '店铺信息维护'
    }
    ]
  },
  {
    pId: '2',
    pTitle: '链接信息管理',
    icon: 'link',
    item: [{
      path: '/link/linkMaintain',
      title: '链接信息维护'
    }
    ]
  },
  {
    pId: '3',
    pTitle: '品牌信息管理',
    icon: 'brand',
    item: [{
      path: '/brand/brandMaintain',
      title: '品牌信息维护'
    }
    ]
  },
  {
    pId: '4',
    pTitle: '违禁词管理',
    icon: 'words',
    item: [
      {
        path: '/words/wordsMaintain',
        title: '违禁词维护'
      }
    ]
  }, {
    pId: '5',
    pTitle: '白名单管理',
    icon: 'whiteList',
    item: [
      {
        path: '/whiteList/whiteListMaintain',
        title: '白名单维护'
      }
    ]
  }, {
    pId: '6',
    pTitle: '检查结果',
    icon: 'checkResult',
    item: [
      {
        path: '/check/checkResult',
        title: '检查结果页'
      }
    ]
  }
]
