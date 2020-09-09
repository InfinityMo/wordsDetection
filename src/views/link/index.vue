<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="demo-form-inline">
        <el-col :span="7">
          <el-form-item label="店铺名称："
                        label-width="80px">
            <el-cascader v-model="searchForm.brandName"
                         placeholder="请选择店铺名称"
                         :options="shopOption"
                         filterable>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="链接标题："
                        label-width="80px">
            <el-cascader v-model="searchForm.link_row_guid"
                         placeholder="请选择链接标题"
                         :options="shopOption"
                         filterable>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="品牌名称："
                        label-width="80px">
            <el-cascader v-model="searchForm.link_row_guid"
                         placeholder="请选择品牌名称"
                         :options="shopOption"
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
        <h4>链接信息列表</h4>
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
import { modalForm, modalFormRules } from './modalFormData'
// 联调后删除
import { tableData, shopOption } from './data'
export default {
  mixins: [tableMixin],
  components: { Dialog },
  data () {
    return {
      searchForm: {
        brand_guid: '',
        shop_guid: '',
        link_row_guid: ''
      },
      columns: columnsData(this.$createElement, this),
      tableData: tableData,
      shopOption: shopOption,
      modalTitle: '', // 弹窗的名称
      modalShow: false,
      modalForm: modalForm,
      modalFormRules: modalFormRules,
      addEditId: '' // 编辑时存在id，新增时id为空
    }
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
    editMoadl (scoped) {
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
