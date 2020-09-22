<template>
  <el-dialog :title="modalTitle"
             :top="offestTop"
             :destroy-on-close="true"
             :visible.sync="modalShow"
             :before-close="modalCancel">
    <el-form :model="modalForm"
             :rules="modalFormRules"
             ref="moadlForm">
      <el-form-item label="品牌名称："
                    prop="brand_name"
                    label-width="120px">
        <el-input v-model="modalForm.brand_name"
                  placeholder="请输入品牌名称"
                  maxlength=50
                  @input="valueChnage"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <div class="clearfix">
        <el-col :span="12">
          <el-form-item label="主品牌："
                        prop="parent_brand_guid"
                        label-width="120px">
            <el-tooltip class="tooltip-reset"
                        effect="dark"
                        :disabled="tipContent ? false:true"
                        :content="tipContent"
                        placement="top-start">
              <el-cascader v-model="modalForm.parent_brand_guid"
                           placeholder="请选择主品牌"
                           popper-class="brand-cascader dialog-cascader"
                           :disabled="disabled"
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
        <el-col :span="12">
          <el-form-item label="生意参谋品牌ID："
                        label-width="120px">
            <el-input v-model="modalForm.brand_id"
                      maxlength=20
                      placeholder="请输入生意参谋品牌ID"
                      autocomplete="off">
            </el-input>
          </el-form-item>
        </el-col>
      </div>
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
      default: '120px'
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
      tipContent: '',
      disabled: true,
      selectOption: [],
      copySelectOption: [],
      modalForm: JSON.parse(JSON.stringify(modalForm)),
      modalFormRules: modalFormRules
    }
  },
  watch: {
    'modalForm.parent_brand_guid' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.tipContent = this.selectOption.filter(item => item.value === this.modalForm.parent_brand_guid[0])[0].label
      } else {
        this.tipContent = ''
      }
    },
    'modalForm.brand_name' (newVal, oldVal) {
      if (!this.addEditId && !newVal) {
        this.disabled = true
      }
    }
  },
  computed: {

  },
  created () {
    this.initSelectData().then(res => {
      if (this.addEditId) {
        this.disabled = false
        this.getFormData()
      } else {
        this.disabled = true
      }
    })
  },
  methods: {
    initSelectData () {
      return new Promise((resolve, reject) => {
        this._getSelectData(6).then(res => {
          this.selectOption = res
          this.copySelectOption = res
          resolve(true)
        })
      })
    },
    valueChnage (value) {
      if (!this.addEditId) {
        if (value.trim()) {
          this.selectOption = JSON.parse(JSON.stringify(this.copySelectOption))
          this.selectOption.unshift({
            value: '-1',
            label: value
          })
          this.disabled = false
        } else {
          this.modalForm.parent_brand_guid = ''
        }
      }
    },
    getFormData () {
      this.$request.post('brandUpdate', { RowGuid: this.addEditId }).then(res => {
        this.modalForm = {
          brand_name: res.data.brand_name,
          parent_brand_guid: [res.data.parent_brand_guid],
          brand_id: res.data.brand_id
        }
      })
    },
    restForm (refId) {
      this.$refs[refId].resetFields()
    },
    modalCancel () {
      this.$emit('modalCancel', false)
      this.restForm('moadlForm')
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
        RowGuid: this.addEditId,
        brand_name: this.modalForm.brand_name,
        parent_brand_guid: this.modalForm.parent_brand_guid[0],
        brand_id: this.modalForm.brand_id
      }
      this.$request.post('/brandSave', submitParams).then(res => {
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
