<template>
  <el-dialog :title="modalTitle"
             width="750px"
             :top="offestTop"
             :destroy-on-close="true"
             :visible.sync="modalShow"
             :before-close="modalCancel">
    <el-form :model="modalForm"
             :rules="modalFormRules"
             ref="moadlForm">
      <el-form-item label="链接标题："
                    prop="link_title"
                    label-width="115px">
        <el-input v-model="modalForm.link_title"
                  maxlength="50"
                  placeholder="请输入链接标题"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <div class="clearfix">
        <el-col :span="12">
          <el-form-item label="售卖类型："
                        prop="seller_type"
                        label-width="115px">
            <el-select v-model="modalForm.seller_type"
                       popper-class="dialog-select"
                       :disabled="disabled"
                       placeholder="请选择售卖类型">
              <el-option v-for="item in sellerType"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属店铺："
                        prop="shop_name"
                        label-width="115px">
            <el-cascader v-model="modalForm.shop_name"
                         popper-class="brand-cascader dialog-cascader"
                         :disabled="disabled"
                         placeholder="请选择所属店铺"
                         :options="shopOption"
                         clearable
                         filterable>
            </el-cascader>
          </el-form-item>
        </el-col>
      </div>
      <el-form-item label="所属品牌："
                    prop="brand_name"
                    label-width="115px">
        <el-cascader v-model="modalForm.brand_name"
                     popper-class="brand-cascader dialog-cascader"
                     :disabled="disabled"
                     placeholder="请选择所属品牌"
                     :options="brandOption"
                     clearable
                     filterable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品详情地址："
                    prop="link_url"
                    label-width="115px">
        <el-input v-model="modalForm.link_url"
                  :disabled="disabled"
                  maxlength="500"
                  placeholder="请输入商品详情地址"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="所属类目："
                    prop="sycm_cate_id"
                    label-width="115px">
        <el-cascader v-model="modalForm.sycm_cate_id"
                     class="category-cascader"
                     clearable
                     separator=" - "
                     placeholder="请选择所属类目"
                     popper-class="dialog-cascader"
                     :options="category"></el-cascader>
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
      shopOption: [],
      brandOption: [],
      category: [],
      sellerType: [
        {
          value: 1,
          label: '天猫'
        }, {
          value: 2,
          label: '淘宝'
        }
      ],
      disabled: false
    }
  },
  watch: {
  },
  computed: {

  },
  created () {
    this.getSelects()
    this.getCascaderData()
    if (this.addEditId) {
      this.disabled = true
      this.getFormData()
    } else {
      this.disabled = false
    }
  },
  mounted () {
    // debugger

  },
  methods: {
    getSelects () {
      Promise.all([this._getSelectData(1), this._getSelectData(2)]).then(res => {
        this.shopOption = res[0]
        this.brandOption = res[1]
      })
    },
    getCascaderData () {
      this.$request.post('/catedropdownlist').then(res => {
        this.category = res.data
      })
    },
    getFormData () {
      this.$request.post('linkUpdate', { RowGuid: this.addEditId }).then(res => {
        this.modalForm = {
          ...res.data,
          shop_name: [res.data.shop_name],
          brand_name: [res.data.brand_name]
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
        link_title: this.modalForm.link_title,
        seller_type: this.modalForm.seller_type,
        shop_name: this.modalForm.shop_name[0],
        brand_name: this.modalForm.brand_name[0],
        link_url: this.modalForm.link_url,
        sycm_cate_id: this.modalForm.sycm_cate_id[this.modalForm.sycm_cate_id.length - 1]
      }
      this.$request.post('/linkSave', submitParams).then(res => {
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
