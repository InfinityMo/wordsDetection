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
    modalForm: {
      type: Object,
      required: true,
      default: () => { }
    },
    modalFormRules: {
      type: Object,
      default: () => { }
    },
    addEditId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      parentBrandDisabled: true,
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
  watch: {
    'addEditId' (oldVal, newVal) {
      if (this.addEditId) {
        this.parentBrandDisabled = false
        // 获取编辑数据返显
        this.getFormData()
      } else {
        this.parentBrandDisabled = true
      }
    }
  },
  created () {
    this._getSelectData(6).then(res => {
      this.selectOption = res
    })
  },
  methods: {
    getFormData () {
      this.$request.post('brandUpdate', { RowGuid: this.addEditId }).then(res => {
        debugger
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
          this.modalCancel()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
