export const modalForm = {
  word: '', // 违禁词
  templateList: [] // 已选择白名单模板
}

export const modalFormRules = {
  word: [
    { required: true, message: '请输入违禁词', trigger: 'blur' }
  ]
}
