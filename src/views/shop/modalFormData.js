export const modalForm = {
  shop_name: '', // 店铺名称
  user_id: '', // 店铺user_id
  shop_id: '', // 店铺shop_id
  shop_type: '', // 店铺类型
  is_owner: '', // 店铺归属
  shop_url: '', // 店铺链接
  select_brand: [], // 已选择品牌
  abandon_brand: ''// 未选择品牌
}

export const modalFormRules = {
  shop_name: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' }
  ],
  shop_type: [
    { required: true, message: '请选择店铺类型', trigger: 'change' }
  ],
  is_owner: [
    { required: true, message: '请选择店铺归属', trigger: 'change' }
  ],
  shop_url: [
    { required: true, message: '请填写店铺链接', trigger: 'blur' },
    // eslint-disable-next-line no-useless-escape
    { pattern: /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/, message: '请填写正确的店铺链接！' }
  ],
  select_brand: [
    { required: true, message: '请选择品牌' }
  ]
}
