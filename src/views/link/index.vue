<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="demo-form-inline">
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
                              placement="left">
                    <span>{{data.label}}</span>
                  </el-tooltip>
                </span>
              </el-cascader>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="链接标题："
                        label-width="80px">
            <el-tooltip class="tooltip-reset"
                        effect="dark"
                        :disabled="linkTipContent ? false:true"
                        :content="linkTipContent"
                        placement="top-start">
              <el-cascader v-model="searchForm.link_row_guid"
                           placeholder="请选择链接标题"
                           popper-class="reset-casc"
                           :options="linkOption"
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
          <el-form-item label="品牌名称："
                        label-width="80px">
            <el-tooltip class="tooltip-reset"
                        effect="dark"
                        :disabled="brandTipContent ? false:true"
                        :content="brandTipContent"
                        placement="top-start">
              <el-cascader v-model="searchForm.brand_guid"
                           placeholder="请选择品牌名称"
                           popper-class="reset-casc"
                           :options="brandOption"
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
import { modalForm, modalFormRules } from './modalFormData'
import { tableSearchForm } from './searchForm'
export default {
  mixins: [tableMixin],
  components: { Dialog },
  data () {
    return {
      shopTipContent: '',
      linkTipContent: '',
      brandTipContent: '',
      searchForm: JSON.parse(JSON.stringify(tableSearchForm)),
      queryFrom: { shop_guid: '', link_row_guid: '', brand_guid: '' },
      columns: columnsData(this.$createElement, this),
      tableData: [],
      shopOption: [],
      linkOption: [],
      brandOption: [],
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
    },
    // 链接标题
    'searchForm.link_row_guid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.linkTipContent = this.linkOption.filter(item => item.value === this.searchForm.link_row_guid[0])[0].label
      } else {
        this.linkTipContent = ''
      }
    },
    // 品牌名称
    'searchForm.brand_guid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.brandTipContent = this.brandOption.filter(item => item.value === this.searchForm.brand_guid[0])[0].label
      } else {
        this.brandTipContent = ''
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
      Promise.all([this._getSelectData(1), this._getSelectData(2), this._getSelectData(3)]).then(res => {
        this.shopOption = res[0]
        this.brandOption = res[1]
        this.linkOption = res[2]
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
      this.modalTitle = '新增链接'
      this.modalShow = true
    },
    editMoadl (scoped) {
      this.modalShow = true
      const { row } = scoped
      this.addEditId = row.RowGuid
      this.modalTitle = '编辑链接'
    },
    // modal确认
    modalConfirm () {
      this.modalShow = false
      this.shopOption = []
      this.brandOption = []
      this.linkOption = []
      this.getTableData()
      this.getSelects()
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
      this.PAGING.pageNum = 1
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
@import "../../common/styles/page-table";
</style>
