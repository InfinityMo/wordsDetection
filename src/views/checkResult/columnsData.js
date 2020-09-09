export const columnsData = (h, $this) => [{
  dataKey: '_index',
  title: '序号',
  width: 80
}, {
  dataKey: 'shop_name',
  title: '店铺名称'
}, {
  dataKey: 'check_title_amount',
  title: '检查标题数'
}, {
  dataKey: 'error_amount',
  title: '总错误数'
},
{
  dataKey: 'error_link_amount',
  title: '出错标题数'
},
{
  dataKey: 'create_time',
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
