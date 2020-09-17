// 自定义模板
export const modalForm = {
  template_name: '', // 模板名称
  select_word: [] // 已选择违禁词
}

export const modalFormRules = {
  template_name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' }
  ],
  select_word: [
    { required: true, message: '请选择违禁词', trigger: 'blur' }
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
    { required: true, message: '请选择违禁词', trigger: 'change' }
  ]
}
// // 链接模板
// export const linkModalForm = {
//   template_type: '', // 模板类型
//   template_guid: '', // 链接
//   template_name: '', // 模板名称
//   select_word: '', // 已选择违禁词
//   shop_list: '' // 店铺名称
// }

// export const linkModalFormRules = {
//   template_type: [
//     { required: true, message: '请选择模板类型', trigger: 'change' }
//   ],
//   template_name: [
//     { required: true, message: '请输入模板名称', trigger: 'blur' }
//   ],
//   select_word: [
//     { required: true, message: '请选择违禁词', trigger: 'blur' }
//   ],
//   shop_list: [
//     { required: true, message: '请选择店铺名称', trigger: 'change' }
//   ]
// }

// // 店铺模板
// export const shopModalForm = {
//   template_type: '', // 模板类型
//   template_guid: '', // 店铺
//   template_name: '', // 店铺模板名称
//   select_word: '', // 已选择违禁词
//   shop_list: '' // 店铺名称
// }

// export const shopModalFormRules = {
//   template_type: [
//     { required: true, message: '请选择模板类型', trigger: 'change' }
//   ],
//   template_guid: [
//     { required: true, message: '请输入模板名称', trigger: 'blur' }
//   ],
//   select_word: [
//     { required: true, message: '请选择违禁词', trigger: 'blur' }
//   ],
//   shop_list: [
//     { required: true, message: '请选择店铺名称', trigger: 'change' }
//   ]
// }
