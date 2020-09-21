export const modalForm = {
  word: '', // 违禁词
  templateGuidList: [] // 已选择违禁词
}

export const modalFormRules = {
  word: [
    { required: true, message: '请输入违禁词', trigger: 'blur' }
  ]
  // templateGuidList: [
  //   { required: true, message: '请选择违禁词', trigger: ['change', 'blur'] }
  // ]
}
