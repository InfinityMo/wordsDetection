<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="demo-form-inline clearfix">
        <el-col :span="7">
          <el-form-item label="店铺名称："
                        label-width="80px">
            <el-cascader v-model="searchForm.brandName"
                         popper-class="reset-casc"
                         placeholder="请选择店铺"
                         :options="shopOption"
                         clearable
                         filterable>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="检测时间："
                        label-width="80px">
            <el-date-picker class="form-date-picker"
                            v-model="searchForm.ceate_time"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="datePickerOptions">
            </el-date-picker>
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
        <h4>检查结果列表</h4>
      </div>
      <standard-table :dataSource="tableData"
                      :columns="columns"
                      :pagination="PAGING"
                      @tableChange="tableChange" />
    </div>
  </div>
</template>
<script>
import tableMixin from '@/mixins/dealTable'
import { columnsData } from './columnsData.js'
import { modalForm, modalFormRules } from './modalFormData'
// 联调后删除
import { tableData } from './data'
export default {
  mixins: [tableMixin],
  data () {
    return {
      datePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchForm: { brandName: '' },
      columns: columnsData(this.$createElement, this),
      tableData: tableData,
      shopOption: [],
      modalTitle: '', // 弹窗的名称
      modalShow: false,
      modalForm: modalForm,
      modalFormRules: modalFormRules,
      addEditId: '' // 编辑时存在id，新增时id为空
    }
  },
  created () {
    this._getSelectData(1).then(res => {
      this.shopOption = res
    })
  },
  mounted () {
    // 联调时删除
    this.PAGING.total = this.tableData.length
  },
  methods: {
    // 新增
    addHandle () {
      this.addEditId = ''
      this.modalTitle = '新增品牌'
      this.modalShow = true
    },
    viewHandle (scoped) {
      this.modalShow = true
      const { row } = scoped
      this.addEditId = row.id
      this.modalTitle = '编辑品牌'
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
      console.log(this.searchForm.brandName[0])
    },
    // 表格分页的变化
    tableChange (changeParams) {
      this.paging.pageSize = changeParams.pageSize
      this.paging.currentPage = changeParams.currentPage
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
