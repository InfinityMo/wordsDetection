<template>
  <div class="page">
    <div class="search-wrap">
      <el-form class="demo-form-inline">
        <el-col :span="7">
          <el-form-item label="违禁词："
                        label-width="80px">
            <el-tooltip class="tooltip-reset"
                        effect="dark"
                        :disabled="wordsTipContent ? false:true"
                        :content="wordsTipContent"
                        placement="top-start">
              <el-cascader v-model="searchForm.wordGuid"
                           placeholder="请选择违禁词"
                           popper-class="reset-casc"
                           :options="selectOption"
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
            <el-select v-model="searchForm.valid"
                       clearable
                       @clear="validClear"
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
            :whiteList="whiteList"
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
import { tableSearchForm } from './searchForm'
export default {
  mixins: [tableMixin],
  components: { Dialog },
  data () {
    return {
      wordsTipContent: '',
      effectOptions: [{
        value: -1,
        label: '全部'
      }, {
        value: 0,
        label: '无效'
      }, {
        value: 1,
        label: '有效'
      }],
      searchForm: JSON.parse(JSON.stringify(tableSearchForm)),
      queryFrom: { wordGuid: '', valid: -1 },
      columns: columnsData(this.$createElement, this),
      tableData: [],
      selectOption: [],
      whiteList: [],
      modalTitle: '', // 弹窗的名称
      modalShow: false,
      addEditId: '' // 编辑时存在id，新增时id为空
    }
  },
  watch: {
    // 模板名称
    'searchForm.wordGuid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.wordsTipContent = this.selectOption.filter(item => item.value === this.searchForm.wordGuid[0])[0].label
      } else {
        this.wordsTipContent = ''
      }
    }
  },
  created () {
    this.getSelectData()
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getSelectData () {
      Promise.all([this._getSelectData(7), this._getSelectData(4)]).then(res => {
        this.selectOption = res[0] // 模板名称
        res[1].map(item => {
          this.whiteList.push({
            label: item.label,
            key: item.value
          })
        })
      })
    },
    getTableData () {
      this.$request.post('/getwordinfo', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        ...this.queryFrom
      }).then(res => {
        const resData = res.data.result || []
        resData.forEach((e, index) => {
          e.valid === 1 ? resData[index].valid = true : resData[index].valid = false
        })
        this.tableData = resData
        this.PAGING.total = res.data.total
      })
    },
    // 有效性清除时恢复为全部状态
    validClear () {
      this.searchForm.valid = -1
      this.queryFrom.valid = -1
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
      this.addEditId = row.guid
      this.modalTitle = '编辑违禁词'
    },
    // modal确认
    modalConfirm () {
      this.modalShow = false
      this.selectOption = []
      this.whiteList = []
      this.getTableData()
      this.getSelectData() // 重新获取下拉框数据
    },
    // moadl关闭
    modalCancel () {
      this.modalShow = false
    },
    // 有效性开关事件
    switchChange (scoped) {
      const newRow = this.tableData.filter((item) => {
        return item.guid === scoped.row.guid
      })[0]
      newRow.valid = !newRow.valid
      // 保存有效性的更改
      this.deleteHandle(scoped, '操作', 0)
    },
    deleteHandle (scoped, warnStr = '删除', requestType = 1) {
      const { row } = scoped
      this.$request.post('/updateWordInfo', {
        wordGuid: row.guid,
        valid: row.valid ? 1 : 0,
        delete: requestType
      }).then(res => {
        if (res.errorCode === 1) {
          this.$message.success(`${warnStr}成功`)
          if (requestType) {
            // 删除时需判断是不是最后一页
            this._isLastPage()
          }
          this.getTableData()
        } else {
          this.$message.error(`${warnStr}失败`)
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
@import "../../common/styles/page-table";
</style>
