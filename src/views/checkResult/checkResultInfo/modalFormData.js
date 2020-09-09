export const modalForm = {
  brand_name: '', // 品牌名称
  parent_brand_name: '', // 主品牌
  brand_id: ''// 生意参谋品牌id
}

export const modalFormRules = {
  brand_name: [
    { required: true, message: '请输入品牌名称' }
  ],
  parent_brand_name: [
    { required: true, message: '请选择主品牌' }
  ]
}
