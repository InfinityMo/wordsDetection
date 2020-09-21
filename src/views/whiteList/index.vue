<template>
  <div class="page">
    <div class="search-wrap">
      <el-form>
        <div class="clearfix">
          <el-col :span="7">
            <el-form-item label="模板名称："
                          label-width="80px">
              <el-tooltip class="tooltip-reset"
                          effect="dark"
                          :disabled="templateTipContent ? false:true"
                          :content="templateTipContent"
                          placement="top-start">
                <el-cascader v-model="searchForm.template_guid"
                             placeholder="请选择模板名称"
                             popper-class="reset-casc"
                             :options="tempalteOption"
                             filterable
                             clearable>
                  <span slot-scope="{ data }">
                    <el-tooltip effect="dark"
                                :content="data.label"
                                placement="left">
                      <span>{{data.label}}</span>
                    </el-tooltip>
                  </span>
                </el-cascader>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="有效性："
                          label-width="80px">
              <el-select v-model="searchForm.is_valid"
                         clearable
                         @clear="validClear"
                         placeholder="请选择有效性">
                <el-option v-for="item in effectOption"
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
            :wordsArr="wordsArr"
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
import { tableSearchForm } from './searchForm'
export default {
  mixins: [tableMixin],
  components: { Dialog },
  data () {
    return {
      templateTipContent: '',
      searchForm: JSON.parse(JSON.stringify(tableSearchForm)),
      queryFrom: { template_guid: '', is_valid: -1 },
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
      addEditId: '', // 编辑时存在id，新增时id为空
      wordsArr: [] // 弹窗违禁词穿梭框数据源
    }
  },
  watch: {
    // 模板名称
    'searchForm.template_guid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.templateTipContent = this.tempalteOption.filter(item => item.value === this.searchForm.template_guid[0])[0].label
      } else {
        this.templateTipContent = ''
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
      Promise.all([this._getSelectData(1), this._getSelectData(4)]).then(res => {
        this.shopOption = res[0]
        this.tempalteOption = res[1]
      })
    },
    getTableData () {
      this.$request.post('/templateSelect', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        ...this.queryFrom
      }).then(res => {
        const resData = res.data.result || []
        resData.forEach((e, index) => {
          e.is_valid === 1 ? resData[index].is_valid = true : resData[index].is_valid = false
        })
        this.tableData = resData
        this.PAGING.total = res.data.total
      })
    },
    // 新增
    addHandle () {
      this._getSelectData(7).then(res => {
        res.forEach(item => {
          this.wordsArr.push({
            label: item.label,
            key: item.value
          })
        })
        this.addEditId = ''
        this.modalTitle = '新增白名单模板'
        this.modalShow = true
      })
    },
    editMoadl (scoped) {
      this._getSelectData(7).then(res => {
        res.forEach(item => {
          this.wordsArr.push({
            label: item.label,
            key: item.value
          })
        })
        this.modalShow = true
        const { row } = scoped
        this.addEditId = row.template_guid
        this.modalTitle = '编辑白名单模板'
      })
    },
    // modal确认
    modalConfirm () {
      this.modalShow = false
      this.wordsArr = []
      this.getTableData()
    },
    // moadl关闭
    modalCancel () {
      this.modalShow = false
      this.wordsArr = []
    },
    switchChange (scoped) {
      const { row } = scoped
      const newRow = this.tableData.filter((item) => {
        return item.template_guid === row.template_guid
      })[0]
      newRow.is_valid = !newRow.is_valid
      this.$request.post('/templateValid', {
        template_guid: row.template_guid,
        is_valid: row.is_valid ? 1 : 0
      }).then(res => {
        if (res.errorCode === 1) {
          this.$message.success('操作成功')
          this.getTableData()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    deleteHandle (scoped) {
      const { row } = scoped
      this.$request.post('/templateDelete', {
        template_guid: row.template_guid
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
    // 有效性清除时恢复为全部状态
    validClear () {
      this.searchForm.is_valid = -1
      this.queryFrom.is_valid = -1
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
