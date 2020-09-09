export const columnsData = (h, $this) => [{
  dataKey: '_index',
  title: '序号',
  width: 80
}, {
  dataKey: 'brand_name',
  title: '品牌'
}, {
  dataKey: 'parent_brand_name',
  title: '主品牌'
},
{
  dataKey: 'operate',
  title: '操作',
  width: 120,
  render: (h, scoped) => {
    return (
      <div>
        <el-button type="text" onClick={() => $this.editMoadl(scoped)}>编辑</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-popconfirm onOnConfirm={() => $this.deleteHandle(scoped)} placement="top" title="确定删除吗？">
          <el-button type="text" slot="reference" >删除</el-button>
        </el-popconfirm>
      </div>
    )
  }
}]
