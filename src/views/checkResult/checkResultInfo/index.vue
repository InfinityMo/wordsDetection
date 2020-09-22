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
        <el-col :span="8">
          <el-form-item label="检测时间："
                        label-width="70px">
            <el-date-picker class="form-date-picker"
                            v-model="searchForm.checkTime"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            type="datetimerange"
                            align="right"
                            unlink-panels
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :picker-options="datePickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="链接："
                        label-width="80px">
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
        <el-col :span="2">
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
      if (newVal.length && newVal.length > 0 && newVal[0]) {
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
      if (Object.keys(queryParams).length > 0) {
        this.queryFrom.shopGuid = queryParams.shopGuid
        this.queryFrom.startDate = queryParams.checkTime
        this.queryFrom.endDate = queryParams.checkTime
        this.searchForm.shopGuid = [queryParams.shopGuid]
        this.searchForm.checkTime = [queryParams.checkTime, queryParams.checkTime]
      }
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
        // 标题选中标红
        resData.map((item, index) => {
          const arr = item.prohibitedWord.split(',').join('|')
          const reg = new RegExp(arr, 'g')
          resData[index].linkTitle = item.linkTitle.replace(reg, ($1) => {
            return `<span style="color:red;font-weight:bold;">${$1}</span>`
          })
        })
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
      this.PAGING.pageSize = changeParams.pageSize
      this.PAGING.pageNum = changeParams.pageNum
      this.getTableData()
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../common/styles/page-table";
/deep/.standard-table.el-table td {
  padding: 13px 0;
}
</style>
