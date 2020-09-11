<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="demo-form-inline">
        <el-col :span="7">
          <el-form-item label="违禁词："
                        label-width="80px">
            <el-cascader v-model="searchForm.wordGuid"
                         placeholder="请选择违禁词"
                         popper-class="reset-casc"
                         :options="selectOption"
                         filterable
                         clearable>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="有效性："
                        label-width="80px">
            <el-select v-model="searchForm.valid"
                       clearable
                       placeholder="请选择有效性">
              <el-option v-for="item in effectOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item class="search-btn">
            <el-button type="primary"
                       @click="queryHandel">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="table-wrap">
      <div class="flex-item-center table-info">
        <h4>违禁词列表</h4>
        <el-button type="primary"
                   @click="addHandle">新增</el-button>
      </div>
      <standard-table :dataSource="tableData"
                      :columns="columns"
                      :pagination="PAGING"
                      @tableChange="tableChange" />
    </div>
    <Dialog :modalTitle="modalTitle"
            :addEditId="addEditId"
            v-if="modalShow"
            :modalShow="modalShow"
            @modalCancel="modalCancel"
            @modalConfirm="modalConfirm" />
  </div>
</template>
<script>
import tableMixin from '@/mixins/dealTable'
import { columnsData } from './columnsData.js'
import Dialog from './dialog'
export default {
  mixins: [tableMixin],
  components: { Dialog },
  data () {
    return {
      effectOptions: [{
        value: 0,
        label: '无效'
      }, {
        value: 1,
        label: '有效'
      }],
      searchForm: {
        wordGuid: '',
        valid: ''
      },
      queryFrom: { wordGuid: '', valid: '' },
      columns: columnsData(this.$createElement, this),
      tableData: [],
      selectOption: [],
      modalTitle: '', // 弹窗的名称
      modalShow: false,
      addEditId: '' // 编辑时存在id，新增时id为空
    }
  },
  created () {
    this._getSelectData(7).then(res => {
      this.selectOption = res
    }) // 获取下拉框数据
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.$request.post('/getwordinfo', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        ...this.queryFrom
      }).then(res => {
        const resData = res.data.result || []
        this.tableData = resData
        this.PAGING.total = res.data.total
      })
    },
    // 有效性开关事件
    switchChange (scoped) {
      const newRow = this.tableData.filter((item) => {
        return item.id === scoped.row.id
      })[0]
      newRow.effective = !newRow.effective
    },
    // 新增
    addHandle () {
      this.addEditId = ''
      this.modalTitle = '新增违禁词'
      this.modalShow = true
    },
    editMoadl (scoped) {
      this.modalShow = true
      const { row } = scoped
      this.addEditId = row.RowGuid
      this.modalTitle = '编辑违禁词'
    },
    // modal确认
    modalConfirm () {
      debugger
    },
    // moadl关闭
    modalCancel () {
      this.modalShow = false
    },
    deleteHandle (scoped) {
      const { row } = scoped
      this.$request.post('/shopDelete', {
        RowGuid: row.RowGuid
      }).then(res => {
        if (res.errorCode === 1) {
          this.$message.success('删除成功')
          // 删除时需判断是不是最后一页
          this._isLastPage()
          this.getTableData()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    queryHandel () {
      this.queryFrom = {
        wordGuid: this.searchForm.wordGuid[0] || '',
        valid: this.searchForm.valid
      }
      this.getTableData()
    },
    // 表格分页的变化
    tableChange (changeParams) {
      this.PAGING.pageSize = changeParams.pageSize
      this.PAGING.pageNum = changeParams.pageNum
      this.getTableData()
    }
  }
}
</script>
<style lang="less" scoped>
.search-wrap {
  // width: 100%;
  padding: 15px;
  background-color: #fff;
  .el-form-item {
    margin-bottom: 0;
  }
}
.table-wrap {
  padding: 15px;
  margin-top: 15px;
  background-color: #fff;
  .table-info {
    margin-bottom: 20px;
    h4 {
      font-size: 20px;
      // font-weight: bold;
    }
  }
}
</style>
