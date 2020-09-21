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
            <el-date-picker class="form-date-picker"
                            v-model="searchForm.checkTime"
                            value-format="yyyy-MM-dd"
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
export default {
  mixins: [tableMixin],
  data () {
    return {
      tipContent: '',
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
      searchForm: { shopGuid: '', checkTime: '' },
      queryFrom: { shopGuid: '', startDate: '', endDate: '' },
      columns: columnsData(this.$createElement, this),
      tableData: [],
      shopOption: []
    }
  },
  watch: {
    'searchForm.shopGuid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.tipContent = this.shopOption.filter(item => item.value === this.searchForm.shopGuid[0])[0].label
      } else {
        this.tipContent = ''
      }
    }
  },
  created () {
    this._getSelectData(1).then(res => {
      this.shopOption = res
    })
    this.getTableData() // 获取列表数据
  },
  methods: {
    getTableData () {
      this.$request.post('/resultSelect', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        ...this.queryFrom
      }).then(res => {
        const resData = res.data.result || []
        this.tableData = resData
        this.PAGING.total = res.data.total
      })
    },
    viewHandle (scoped) {
      const { row } = scoped
      this.$router.push({
        // path: '/check/checkResultInfo',
        name: 'checkResultInfo',
        params: {
          shopGuid: row.shopGuid || '',
          checkTime: row.checkTime || ''
        }
      })
    },
    queryHandel () {
      this.queryFrom = {
        shopGuid: this.searchForm.shopGuid[0] || '',
        startDate: this.searchForm.checkTime ? this.searchForm.checkTime[0] : '',
        endDate: this.searchForm.checkTime ? this.searchForm.checkTime[1] : ''
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
