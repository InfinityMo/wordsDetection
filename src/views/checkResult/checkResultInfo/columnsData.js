export const columnsData = (h, $this) => [{
  dataKey: '_index',
  title: '序号',
  width: 80
}, {
  dataKey: 'shop_name',
  title: '店铺名称'
}, {
  dataKey: 'link_name',
  title: '标题'
}, {
  dataKey: 'prohibited_word',
  title: '违禁词'
},
{
  dataKey: 'create_time',
  title: '检测时间'
},
{
  dataKey: 'deal_status',
  title: '状态'
}
  // {
  //   dataKey: 'operate',
  //   title: '操作',
  //   width: 120,
  //   render: (h, scoped) => {
  //     return (
  //       <div>
  //         <el-button type="text" onClick={() => $this.editMoadl(scoped)}>查看</el-button>
  //       </div>
  //     )
  //   }
  // }
]
