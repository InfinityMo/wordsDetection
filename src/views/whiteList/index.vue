<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="">
        <div class="clearfix">
          <el-col :span="7">
            <el-form-item label="模板名称："
                          label-width="80px">
              <el-cascader v-model="searchForm.template_name"
                           placeholder="请选择模板名称"
                           popper-class="reset-casc"
                           :options="tempalteOption"
                           filterable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="有效性："
                          label-width="80px">
              <el-select v-model="searchForm.is_valid"
                         placeholder="请选择有效性">
                <el-option v-for="item in effectOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="模板类型："
                          label-width="80px">
              <el-select v-model="searchForm.template_type"
                         placeholder="请选择模板类型">
                <el-option v-for="item in tempalteTypeOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item class="search-btn">
              <el-button type="primary"
                         @click="queryHandel">查询</el-button>
            </el-form-item>
          </el-col>
        </div>
        <div class="clearfix form-row"
             v-if="searchForm.template_type===2">
          <el-col :span="7">
            <el-form-item label="店铺名称："
                          label-width="80px">
              <el-tooltip class="tooltip-reset"
                          effect="dark"
                          :disabled="shopTipContent ? false:true"
                          :content="shopTipContent"
                          placement="top-start">
                <el-cascader v-model="searchForm.shop_guid"
                             placeholder="请选择店铺名称"
                             popper-class="reset-casc"
                             :options="shopOption"
                             filterable
                             clearable>
                  <span slot-scope="{ data }">
                    <el-tooltip effect="dark"
                                :content="data.label"
                                placement="right">
                      <span>{{data.label}}</span>
                    </el-tooltip>
                  </span>
                </el-cascader>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </div>
    <div class="table-wrap">
      <div class="flex-item-center table-info">
        <h4>白名单模板列表</h4>
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
import { columnsData } from './columnsData'
import Dialog from './dialog'
import { modalForm, modalFormRules } from './modalFormData'
import { tableSearchForm } from './searchForm'
export default {
  mixins: [tableMixin],
  components: { Dialog },
  data () {
    return {
      shopTipContent: '',
      searchForm: tableSearchForm,
      queryFrom: { template_name: '', template_type: '', is_valid: -1 },
      columns: columnsData(this.$createElement, this),
      tableData: [],
      tempalteOption: [],
      shopOption: [],
      effectOption: [{
        value: -1,
        label: '全部'
      }, {
        value: 0,
        label: '无效'
      }, {
        value: 1,
        label: '有效'
      }],
      tempalteTypeOption: [{
        value: 0,
        label: '自定义模板'
      }, {
        value: 1,
        label: '店铺模板'
      }, {
        value: 2,
        label: '链接模板'
      }],
      modalTitle: '', // 弹窗的名称
      modalShow: false,
      modalForm: modalForm,
      modalFormRules: modalFormRules,
      addEditId: '' // 编辑时存在id，新增时id为空
    }
  },
  watch: {
    // 店铺名称
    'searchForm.shop_guid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.shopTipContent = this.shopOption.filter(item => item.value === this.searchForm.shop_guid[0])[0].label
      } else {
        this.shopTipContent = ''
      }
    }
  },
  created () {
    this.getSelects()
  },
  mounted () {
    this.getTableData() // 获取列表数据
  },
  methods: {
    getSelects () {
      Promise.all([this._getSelectData(1)]).then(res => {
        this.shopOption = res[0]
      })
    },
    getTableData () {
      this.$request.post('/linkSelect', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        ...this.queryFrom
      }).then(res => {
        const resData = res.data.result || []
        this.tableData = resData
        this.PAGING.total = res.data.total
      })
    },
    // 新增
    addHandle () {
      this.addEditId = ''
      this.modalTitle = '新增白名单模板'
      this.modalShow = true
    },
    editMoadl (scoped) {
      this.modalShow = true
      const { row } = scoped
      this.addEditId = row.RowGuid
      this.modalTitle = '编辑白名单模板'
    },
    // modal确认
    modalConfirm () {
      this.modalShow = false
      this.getTableData()
    },
    // moadl关闭
    modalCancel () {
      this.modalShow = false
    },
    deleteHandle (scoped) {
      const { row } = scoped
      this.$request.post('/linkDelete', {
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
        shop_guid: this.searchForm.shop_guid[0] || '',
        link_row_guid: this.searchForm.link_row_guid[0] || '',
        brand_guid: this.searchForm.brand_guid[0] || ''
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
  .form-row {
    margin-top: 15px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .search-btn {
    display: flex;
    justify-content: flex-end;
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
