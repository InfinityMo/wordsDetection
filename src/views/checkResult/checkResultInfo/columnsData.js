export const columnsData = (h, $this) => [{
  dataKey: '_index',
  title: '序号',
  width: 80
}, {
  dataKey: 'shopName',
  title: '店铺名称',
  width: 150
}, {
  dataKey: 'linkTitle',
  isShowHtml: true,
  title: '标题'
}, {
  dataKey: 'prohibitedWord',
  title: '违禁词',
  width: 150
},
{
  dataKey: 'checkTime',
  title: '检测时间',
  width: 140
}, {
  dataKey: 'operate',
  title: '操作',
  width: 80,
  render: (h, scoped) => {
    return (
      <div>
        <el-button type="text" onClick={() => $this.viewHandle(scoped)}>查看</el-button>
      </div>
    )
  }
}]
