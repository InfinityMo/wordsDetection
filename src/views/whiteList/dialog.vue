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
      <el-form-item label="模板类型："
                    prop="template_type"
                    label-width="115px">
        <el-select v-model="modalForm.template_type"
                   popper-class="dialog-select"
                   placeholder="请选择模板类型">
          <el-option v-for="item in templateOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 自定义模板 -->
      <template v-if="modalForm.template_type===0">
        <el-form-item label="模板名称："
                      prop="brand_name"
                      label-width="115px">
          <el-input v-model="modalForm.brand_name"
                    placeholder="请输入模板名称"
                    maxlength=50
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="违禁词："
                      prop="select_brand"
                      label-width="110px">
          <el-transfer v-model="modalForm.select_brand"
                       filterable
                       filter-placeholder="请输入违禁词"
                       :filter-method="filterMethod"
                       :titles="['未选择违禁词', '已选择违禁词']"
                       :data="wordsArr">
          </el-transfer>
        </el-form-item>
        <el-form-item label="店铺名称："
                      prop="shop_name"
                      label-width="115px">
          <!-- <el-cascader v-model="modalForm.shop_name"
                       popper-class="brand-cascader dialog-cascader"
                       :disabled="disabled"
                       placeholder="请选择店铺名称"
                       :props="{ multiple: true }"
                       :options="shopOption"
                       clearable
                       filterable>
          </el-cascader> -->
          <el-tooltip class="tooltip-reset"
                      effect="dark"
                      :disabled="customTipContent ? false:true"
                      :content="customTipContent"
                      placement="top-start">
            <el-cascader v-model="modalForm.shop_list"
                         placeholder="请选择所属店铺"
                         popper-class="brand-cascader dialog-cascader"
                         :props="{ multiple: true }"
                         :options="shopOption"
                         filterable
                         clearable>
              <span slot-scope="{ data }">
                <el-tooltip effect="dark"
                            :content="data.label"
                            placement="right">
                  <span>{{data.label}}</span>
                </el-tooltip>
              </span>
            </el-cascader>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="链接："
                      prop="select_brand"
                      label-width="110px">
          <el-transfer v-model="modalForm.select_brand"
                       filterable
                       filter-placeholder="请输入链接"
                       :filter-method="filterMethod"
                       :titles="['未选择链接', '已选择链接']"
                       :data="wordsArr">
            <span slot-scope="{ option }">
              <el-tooltip effect="dark"
                          :content="option.label"
                          placement="right">
                <span>{{option.label}}</span>
              </el-tooltip>
            </span>
          </el-transfer>
        </el-form-item>
      </template>
      <!-- 链接模板 -->
      <template v-if="modalForm.template_type===1">
        <el-form-item label="店铺名称："
                      prop="shop_name"
                      label-width="115px">
          <el-cascader v-model="modalForm.shop_name"
                       popper-class="brand-cascader dialog-cascader"
                       :disabled="disabled"
                       placeholder="请选择店铺名称"
                       :options="shopOption"
                       clearable
                       filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="模板/链接名称："
                      prop="shop_name"
                      label-width="115px">
          <el-cascader v-model="modalForm.shop_name"
                       popper-class="brand-cascader dialog-cascader"
                       :disabled="disabled"
                       placeholder="请选择模板/链接名称"
                       :options="shopOption"
                       clearable
                       filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="违禁词："
                      prop="select_brand"
                      label-width="110px">
          <el-transfer v-model="modalForm.select_brand"
                       filterable
                       filter-placeholder="请输入违禁词"
                       :filter-method="filterMethod"
                       :titles="['未选择违禁词', '已选择违禁词']"
                       :data="wordsArr">
            <span slot-scope="{ option }">
              <el-tooltip effect="dark"
                          :content="option.label"
                          placement="right">
                <span>{{option.label}}</span>
              </el-tooltip>
            </span>
          </el-transfer>
        </el-form-item>
      </template>
      <template v-if="modalForm.template_type===2">
        <el-form-item label="模板名称："
                      prop="brand_name"
                      label-width="115px">
          <el-input v-model="modalForm.brand_name"
                    placeholder="请输入模板名称"
                    maxlength=50
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="违禁词："
                      prop="select_brand"
                      label-width="110px">
          <el-transfer v-model="modalForm.select_brand"
                       filterable
                       filter-placeholder="请输入违禁词"
                       :filter-method="filterMethod"
                       :titles="['未选择违禁词', '已选择违禁词']"
                       :data="wordsArr">
            <span slot-scope="{ option }">
              <el-tooltip effect="dark"
                          :content="option.label"
                          placement="right">
                <span>{{option.label}}</span>
              </el-tooltip>
            </span>
          </el-transfer>
        </el-form-item>
      </template>
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
import { customModalForm, customModalFormRules } from './modalFormData'
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
      customTipContent: '',
      modalForm: JSON.parse(JSON.stringify(customModalForm)),
      modalFormRules: customModalFormRules,
      wordsArr: [],
      shopOption: [],
      templateOptions: [{
        value: 0,
        label: '自定义模板'
      }, {
        value: 1,
        label: '店铺模板'
      }, {
        value: 2,
        label: '链接模板'
      }],
      disabled: false
    }
  },
  watch: {
    'modalForm.shop_list' (newVal, oldVal) {
      if (newVal.length && newVal.length > 0) {
        this.customTipContent = this.shopOption.filter(item => item.value === this.modalForm.shop_list[0])[0].label
      } else {
        this.customTipContent = ''
      }
    }
  },
  computed: {

  },
  created () {
    this.getSelects()
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
    // 穿梭框搜索
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    getSelects () {
      Promise.all([this._getSelectData(1), this._getSelectData(7)]).then(res => {
        this.shopOption = res[0]
        res[1].map(item => {
          this.wordsArr.push({
            label: item.label,
            key: item.value
          })
        })
      })
    },
    getFormData () {
      this.$request.post('linkUpdate', { RowGuid: this.addEditId }).then(res => {
        debugger
        // this.modalForm = {

        // }
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
