<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="demo-form-inline">
        <el-col :span="7">
          <el-form-item label="店铺名称：">
            <el-cascader v-model="searchForm.row_guid"
                         placeholder="请选择店铺名称"
                         :options="selectOption"
                         filterable>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item class="search-btn">
            <el-button type="primary"
                       @click="queryHandel">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="table-wrap">
      <div class="flex-item-center table-info">
        <h4>店铺信息列表</h4>
        <el-button type="primary"
                   @click="addHandle">新增</el-button>
      </div>
      <standard-table :dataSource="tableData"
                      :columns="columns"
                      :pagination="PAGING"
                      @tableChange="tableChange" />
    </div>
    <Dialog :modalTitle="modalTitle"
            :modalFormRules="modalFormRules"
            :modalForm="modalForm"
            :modalShow="modalShow"
            @modalCancel="modalCancel"
            @modalConfirm="modalConfirm" />
  </div>
</template>
<script>
import tableMixin from '@/mixins/dealTable'
import { columnsData } from './columnsData.js'
import Dialog from './dialog'
import { tableSearchForm } from './searchForm'
import { modalForm, modalFormRules } from './modalFormData'
// 联调后删除
import { tableData } from './data'
export default {
  mixins: [tableMixin],
  components: { Dialog },
  data () {
    return {
      searchForm: tableSearchForm,
      columns: columnsData(this.$createElement, this),
      tableData: tableData,
      queryFrom: { RowGuid: '' },
      selectOption: [],
      modalTitle: '', // 弹窗的名称
      modalShow: false,
      modalForm: modalForm,
      modalFormRules: modalFormRules,
      addEditId: ''// 编辑时存在id，新增时id为空
    }
  },
  created () {
    this._getSelectData(1).then(res => {
      this.selectOption = res
    }) // 获取下拉框数据
  },
  mounted () {
    // this.getTableData() // 获取列表数据
  },
  methods: {
    getTableData () {
      this.$request.post('/brandSelect', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        ...this.queryFrom
      }).then(res => {
        const resData = res.result || []
        resData.map(item => {
          // this.tableData.push({
          //   RowGuid: item.RowGuid,
          //   brand_name: item.brand_name,
          //   parent_brand_name: item.parent_brand_name
          // })
        })
        this.PAGING.total = res.total
      })
    },
    // 新增
    addHandle () {
      this.addEditId = ''
      this.modalTitle = '新增店铺'
      this.modalShow = true
    },
    editMoadl (scoped) {
      this.modalShow = true
      const { row } = scoped
      this.addEditId = row.RowGuid
      this.modalTitle = '编辑店铺'
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
      debugger
    },
    queryHandel () {
      this.queryFrom = {
        // RowGuid: this.searchForm.RowGuid[0]
      }
      this.getTableData()
    },
    // 表格分页的变化
    tableChange (changeParams) {
      this.PAGING.pageSize = changeParams.pageSize
      this.PAGING.pageNum = changeParams.pageNum
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
