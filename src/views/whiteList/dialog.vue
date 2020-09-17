<template>
  <el-dialog :title="modalTitle"
             width="750px"
             :top="offestTop"
             :destroy-on-close="true"
             :visible.sync="modalShow"
             :before-close="modalCancel">
    <el-form :model="modalForm"
             v-if="!isNext"
             :rules="modalFormRules"
             ref="moadlForm">
      <el-form-item label="模板名称："
                    prop="template_name"
                    label-width="115px">
        <el-input v-model="modalForm.template_name"
                  placeholder="请输入模板名称"
                  maxlength=50
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="违禁词："
                    prop="select_word"
                    label-width="110px">
        <el-transfer v-model="modalForm.select_word"
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
    </el-form>
    <el-form v-if="isNext"
             :model="modalFormNext"
             :rules="modalFormNextRules"
             ref="modalFormNext">
      <el-form-item label="店铺名称："
                    prop="shop_guid"
                    label-width="115px">
        <el-cascader v-model="modalFormNext.shop_guid"
                     placeholder="请选择所属店铺"
                     popper-class="brand-cascader dialog-cascader"
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
      </el-form-item>
      <el-form-item label="链接："
                    prop="select_link"
                    label-width="110px">
        <el-transfer v-model="modalFormNext.select_link"
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
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="modalCancel">取 消</el-button>
      <el-button type="primary"
                 @click="nextHandle"
                 v-show="!isNext"
                 plain>下一步</el-button>
      <el-button type="primary"
                 @click="modalConfirm">{{buttonText}}</el-button>
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
      isNext: false, // 是否执行下一步
      buttonText: '保存',
      modalForm: JSON.parse(JSON.stringify(modalForm)),
      modalFormRules: modalFormRules,
      modalFormNext: JSON.parse(JSON.stringify(modalForm)),
      modalFormNextRules: modalFormRules,
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
    // 'modalForm.shop_list' (newVal, oldVal) {
    //   if (newVal.length && newVal.length > 0) {
    //     this.customTipContent = this.shopOption.filter(item => item.value === this.modalForm.shop_list[0])[0].label
    //   } else {
    //     this.customTipContent = ''
    //   }
    // }
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
    // shopGetNodes () {
    //   // 手动遍历已选择节点添加title
    //   setTimeout(() => { // 异步操作等待dom更新
    //     const node = document.querySelector('#app').querySelectorAll('.el-tag')
    //     node.forEach((item, index) => {
    //       item.setAttribute('title', item.innerText)
    //       // const ele = document.createElement('el-tooltip')
    //       // ele.className = 'item'
    //       // ele.setAttribute('placement', 'left')
    //       // ele.setAttribute('content', item.innerText)
    //       // item.parentNode.replaceChild(ele, item)
    //       // ele.appendChild(item)
    //     })
    //   })
    // },
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
      this.$request.post('linkUpdate', { template_guid: this.addEditId }).then(res => {
        debugger
        // this.modalForm = {

        // }
      })
    },
    restForm (refId) {
      this.$refs[refId].resetFields()
    },
    nextHandle () {
      this.isNext = true
      this.buttonText = this.isNext ? '确 定' : '保 存'
    },
    modalCancel () {
      this.$emit('modalCancel', false)
      this.restForm('moadlForm')
    },
    modalConfirm () {
      //
      this.templateValidate()
    },
    templateValidate () {
      this.$refs.moadlForm.validate((valid) => {
        if (valid) {
          this.templateSubmit()
        } else {
          return false
        }
      })
    },
    shopLinkValidate () {
      this.$refs.modalFormNext.validate((valid) => {
        if (valid) {
          this.shopLinkSubmit()
        } else {
          return false
        }
      })
    },
    // 模板-违禁词提交
    templateSubmit () {
      const submitParams = {
        template_guid: this.addEditId,
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
    },
    shopLinkSubmit () {

    }
  }
}
</script>

<style lang="less" scoped>
</style>
