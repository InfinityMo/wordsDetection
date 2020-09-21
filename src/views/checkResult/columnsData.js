export const columnsData = (h, $this) => [{
  dataKey: '_index',
  title: '序号',
  width: 80
}, {
  dataKey: 'shopName',
  title: '店铺名称'
}, {
  dataKey: 'linkAmount',
  title: '检查标题数'
}, {
  dataKey: 'errorAmount',
  title: '总错误数'
},
{
  dataKey: 'errorLinkAmount',
  title: '出错标题数'
},
{
  dataKey: 'checkTime',
  title: '检查时间'
},
{
  dataKey: 'operate',
  title: '操作',
  width: 120,
  render: (h, scoped) => {
    return (
      <div>
        <el-button type="text" onClick={() => $this.viewHandle(scoped)}>查看</el-button>
      </div>
    )
  }
}]
