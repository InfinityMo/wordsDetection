export const columnsData = (h, $this) => [{
  dataKey: '_index',
  title: '序号',
  width: 80
}, {
  dataKey: 'forbid_words',
  title: '违禁词'
}, {
  dataKey: 'effective',
  title: '有效性',
  render: (h, scoped) => {
    return (
      <div>
        <el-switch
          value={scoped.row.effective}
          onchange={() => $this.switchChange(scoped)}
          active-color="#409eff"
          inactive-color="#dcdfe6">
        </el-switch>
      </div>
    )
  }
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
