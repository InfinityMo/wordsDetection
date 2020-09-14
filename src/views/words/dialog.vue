<template>
  <el-dialog :title="modalTitle"
             :top="offestTop"
             width="800px"
             :destroy-on-close="true"
             :visible.sync="modalShow"
             :before-close="modalCancel">
    <el-form :model="modalForm"
             :rules="modalFormRules"
             ref="moadlForm">
      <el-form-item label="违禁词："
                    prop="word"
                    label-width="115px">
        <el-input v-model="modalForm.word"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="白名单模板："
                    prop="templateGuidList"
                    label-width="115px">
        <el-transfer v-model="modalForm.templateGuidList"
                     filterable
                     filter-placeholder="请输入白名单"
                     :filter-method="filterMethod"
                     :titles="['未选择白名单', '已选择白名单']"
                     :data="wordsArr">
        </el-transfer>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="modalCancel">取 消</el-button>
      <el-button type="primary"
                 @click="modalConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import tableMixin from '@/mixins/dealTable'
import { modalForm, modalFormRules } from './modalFormData'
export default {
  mixins: [tableMixin],
  props: {
    modalTitle: {
      type: String,
      required: true
    },
    offestTop: {
      type: String,
      default: '50px'
    },
    modalShow: {
      type: Boolean,
      required: true,
      default: false
    },
    addEditId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      modalForm: JSON.parse(JSON.stringify(modalForm)),
      modalFormRules: modalFormRules,
      wordsArr: []
    }
  },
  watch: {
  },
  computed: {

  },
  created () {
    // 请求获取白名单模板
    this._getSelectData(1).then(res => {
      res.map(item => {
        this.wordsArr.push({
          label: item.label,
          key: item.value
        })
      })
    })
    // 是编辑获取表单数据
    if (this.addEditId) {
      this.getFormData()
    }
  },
  mounted () {
    // debugger

  },
  methods: {
    // 穿梭框搜索
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    restForm (refId) {
      this.$refs[refId].resetFields()
    },
    modalCancel () {
      this.$emit('modalCancel', false)
      this.restForm('moadlForm')
    },
    getFormData () {
      this.$request.post('getWordAndRelation', { wordGuid: this.addEditId }).then(res => {
        this.modalForm = {
          ...res.data
        }
      })
    },
    modalConfirm () {
      this.$refs.moadlForm.validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          return false
        }
      })
    },
    submitData () {
      const submitParams = {
        wordGuid: this.addEditId,
        word: this.modalForm.word,
        templateGuidList: this.modalForm.templateGuidList
      }
      this.$request.post('/addWord', submitParams).then(res => {
        if (res.errorCode === 1) {
          this.$message.success('保存成功')
          this.$emit('modalConfirm', true)
        } else {
          this.$message.error('保存失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
