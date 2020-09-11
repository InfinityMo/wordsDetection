export const modalForm = {
  link_title: '', // 链接标题
  seller_type: '', // 售卖类型
  shop_name: '', // 所属店铺
  brand_name: '', // 所属品牌
  link_url: '', // 商品详情地址
  sycm_cate_id: ''// 所属类目
}

export const modalFormRules = {
  link_title: [
    { required: true, message: '请输入链接标题', trigger: 'blur' }
  ],
  seller_type: [
    { required: true, message: '请选择售卖类型', trigger: 'change' }
  ],
  shop_name: [
    { required: true, message: '请选择所属店铺', trigger: 'change' }
  ],
  brand_name: [
    { required: true, message: '请选择所属品牌', trigger: 'change' }
  ],
  link_url: [
    { required: true, message: '请输入商品详情地址', trigger: 'blur' },
    { pattern: /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/, message: '请填写正确的商品链接', trigger: 'blur' }
  ],
  sycm_cate_id: [
    { required: true, message: '请选择所属类目', trigger: 'change' }
  ]
}
