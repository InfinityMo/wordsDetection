<template>
  <el-dialog :title="modalTitle"
             :top="offestTop"
             :destroy-on-close="true"
             :visible.sync="modalShow"
             width="800px"
             :before-close="modalCancel">
    <el-form :model="modalForm"
             :rules="modalFormRules"
             ref="moadlForm">
      <el-form-item label="店铺名称："
                    prop="shop_name"
                    label-width="110px">
        <el-input v-model="modalForm.shop_name"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <div class="clearfix">
        <el-col :span="12">
          <el-form-item label="店铺user_id："
                        prop="user_id"
                        label-width="110px">
            <el-input v-model="modalForm.user_id"
                      autocomplete="off">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺shop_id："
                        prop="shop_id"
                        label-width="110px">
            <el-input v-model="modalForm.shop_id"
                      autocomplete="off">
            </el-input>
          </el-form-item>
        </el-col>
      </div>
      <div class="clearfix">
        <el-col :span="12">
          <el-form-item label="店铺类型："
                        prop="shop_type"
                        label-width="110px">
            <el-select v-model="modalForm.shop_type"
                       placeholder="请选择店铺类型">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="店铺归属："
                        prop="is_owner"
                        label-width="110px">
            <el-select v-model="modalForm.is_owner"
                       placeholder="请选择店铺类型">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </div>
      <el-form-item label="店铺链接："
                    prop="shop_url"
                    label-width="110px">
        <el-input v-model="modalForm.shop_url"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="品牌："
                    prop="select_brand"
                    label-width="110px">
        <el-transfer v-model="modalForm.select_brand"
                     :titles="['未选择品牌', '已选择品牌']"
                     :data="brandArr"></el-transfer>
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
import { modalForm, modalFormRules } from './modalFormData'
export default {
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
      modalForm: JSON.parse(JSON.stringify(modalForm)),
      modalFormRules: modalFormRules,
      disabled: true,
      selectOption: [],
      options: [
        {
          value: '1',
          label: '黄金糕1'
        }, {
          value: '2',
          label: '黄金糕2'
        }
      ],
      brandArr: [{
        key: '1',
        label: '悦诗风吟'
      }, {
        key: '2',
        label: '7T'
      }]
    }
  },
  created () {
    this._getSelectData(6).then(res => {
      this.selectOption = res
    })
    if (this.addEditId) {
      this.disabled = false
      this.getFormData()
    } else {
      this.disabled = true
    }
  },
  methods: {
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
