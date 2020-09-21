<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="demo-form-inline clearfix">
        <el-col :span="7">
          <el-form-item label="店铺名称："
                        label-width="80px">
            <el-tooltip class="tooltip-reset"
                        effect="dark"
                        :disabled="tipContent ? false:true"
                        :content="tipContent"
                        placement="top-start">
              <el-cascader v-model="searchForm.shopGuid"
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
          <el-form-item label="检测时间："
                        label-width="80px">
            <el-date-picker v-model="searchForm.checkTime"
                            class="form-date-picker"
                            type="daterange"
                            align="right"
                            value-format="yyyy-MM-dd"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="datePickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="链接："
                        label-width="80px">
            <!-- <el-cascader v-model="searchForm.brandName"
                         :disabled="linkDisabled"
                         placeholder="请选择链接"
                         :options="linkOption"
                         filterable>
            </el-cascader> -->
            <el-tooltip class="tooltip-reset"
                        effect="dark"
                        :disabled="linkTipContent ? false:true"
                        :content="linkTipContent"
                        placement="top-start">
              <el-cascader v-model="searchForm.linkGuid"
                           placeholder="请选择链接"
                           :disabled="linkDisabled"
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
        <h4>检查结果详情列表</h4>
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
export default {
  name: 'checkResultInfo',
  mixins: [tableMixin],
  data () {
    return {
      tipContent: '',
      linkTipContent: '',
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
      searchForm: { shopGuid: '', checkTime: '', linkGuid: '' },
      queryFrom: { shopGuid: '', startDate: '', endDate: '', linkGuid: '' },
      columns: columnsData(this.$createElement, this),
      tableData: [],
      shopOption: [],
      linkOption: [],
      linkDisabled: true
    }
  },
  watch: {
    'searchForm.shopGuid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.getLinkSelect(this.searchForm.shopGuid[0])
        this.linkDisabled = false
        this.tipContent = this.shopOption.filter(item => item.value === this.searchForm.shopGuid[0])[0].label
      } else {
        this.searchForm.linkGuid = []
        this.linkDisabled = true
        this.tipContent = ''
      }
    },
    'searchForm.linkGuid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.linkTipContent = this.linkOption.filter(item => item.value === this.searchForm.linkGuid[0])[0].label
      } else {
        this.linkTipContent = ''
      }
    }
  },
  created () {
    // 获取下拉框数据
    this._getSelectData(1).then(res => {
      this.shopOption = res
      const queryParams = this.$route.params
      this.queryFrom.shopGuid = queryParams.shopGuid
      this.queryFrom.startDate = queryParams.checkTime
      this.queryFrom.endDate = queryParams.checkTime
      this.searchForm.shopGuid = [queryParams.shopGuid]
      this.searchForm.checkTime = [queryParams.checkTime, queryParams.checkTime]
      this.getTableData() // 获取列表数据
    })
  },
  mounted () {

  },
  methods: {
    getTableData () {
      this.$request.post('/detailSelect', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        ...this.queryFrom
      }).then(res => {
        const resData = res.data.result || []
        this.tableData = resData
        this.PAGING.total = res.data.total
      })
    },
    getLinkSelect (shopId) {
      this.$request.post('/shoplink', { shop_guid: shopId, template_guid: '' }).then(res => {
        this.linkOption = []
        const linkArr = res.data.all_link || []
        linkArr.map(item => {
          this.linkOption.push({
            value: item.key,
            label: item.label
          })
        })
      })
    },
    queryHandel () {
      this.queryFrom = {
        shopGuid: this.searchForm.shopGuid[0] || '',
        startDate: this.searchForm.checkTime ? this.searchForm.checkTime[0] : '',
        endDate: this.searchForm.checkTime ? this.searchForm.checkTime[1] : '',
        linkGuid: this.searchForm.linkGuid[0] || ''
      }
      this.getTableData()
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
