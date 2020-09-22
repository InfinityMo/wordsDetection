// 自定义模板
export const modalForm = {
  template_name: '', // 模板名称
  select_word: [] // 已选择违禁词
}

export const modalFormRules = {
  template_name: [
    { required: true, trigger: 'blur' }
  ],
  select_word: [
    { required: true, message: '请选择违禁词', trigger: ['blur', 'change'] }
  ]
}
export const modalFormNext = {
  shop_guid: '', // 店铺名称
  select_link: [] // 已选择链接
}

export const modalFormNextRules = {
  shop_guid: [
    { required: true, message: '请选择店铺名称', trigger: 'change' }
  ],
  select_link: [
    { required: false, message: '请选择链接', trigger: 'change' }
  ]
}
