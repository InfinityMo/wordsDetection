<template>
  <div>
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
                    :disabled="disabled"
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
                       @change="wordsChange"
                       filter-placeholder="请输入违禁词"
                       :filter-method="filterMethod"
                       :titles="['未选择违禁词', '已选择违禁词']"
                       :data="wordsArr">
            <span slot-scope="{ option }">
              <el-tooltip effect="dark"
                          :content="option.label"
                          placement="left">
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
                       @change="shopChange"
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
        </el-form-item>
        <el-form-item label="链接："
                      prop="select_link"
                      label-width="110px">
          <transferCom :shopLinkArr="shopLinkArr"
                       ref="transferCom"
                       :key="transferKey"
                       @selectLinkChange="selectLinkChange"
                       :selectedlink="select_link">
          </transferCom>
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
                   v-show="!isNext"
                   @click="saveTempalte(false)">保 存</el-button>
        <el-button type="primary"
                   v-show="isNext&&shopIsChange"
                   @click="modalConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 店铺切换时提示 -->
    <el-dialog title="提示"
               :visible.sync="shopChangeTip"
               width="30%"
               center>
      <span>是否保存已选择的数据？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="shopChangeCancel">取 消</el-button>
        <el-button type="primary"
                   @click="shopChangeOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import transferCom from './transferCom'
import tableMixin from '@/mixins/dealTable'
import { modalForm, modalFormRules, modalFormNext, modalFormNextRules } from './modalFormData'
export default {
  components: { transferCom },
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
    },
    wordsArr: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      transferKey: String(Math.random() * 100000000),
      wordsArrChange: false,
      shopChangeTip: false,
      shopIsChange: false, // 判断店铺下拉框值是否变化 true：可点击确定提交，false：只可取消
      linkSelectIsChange: false,
      nextId: '', // 下一步保存使用的id
      isNext: false, // 是否执行下一步
      modalForm: JSON.parse(JSON.stringify(modalForm)),
      modalFormRules: modalFormRules,
      modalFormNext: JSON.parse(JSON.stringify(modalFormNext)),
      modalFormNextRules: modalFormNextRules,
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
      shopLinkArr: [], // 店铺对应链接数据源
      select_link: [],
      disabled: false,
      cacheSelectLink: '', // 缓存下拉框上次的选择记录
      oldShopGuid: '' // 缓存下拉框上次的shopId
    }
  },
  watch: {
    'modalFormNext.shop_guid' (newVal, oldVal) {
      if (oldVal && oldVal.length > 0) {
        this.oldShopGuid = oldVal[0]
      }
    }
  },
  async created () {
    await this.getSelects()
    if (this.addEditId) {
      this.disabled = true
      this.getFormData()
    } else {
      this.disabled = false
    }
  },
  mounted () {
    this.nextId = this.addEditId
    if (!this.addEditId) {
      this.editModalFormRules()
    } else {
      this.modalFormRules.template_name[0].validator = null
    }
  },
  methods: {
    // 穿梭框搜索
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    getSelects () {
      Promise.all([this._getSelectData(1)]).then(res => {
        this.shopOption = res[0]
      })
    },
    getFormData () {
      this.$request.post('/templatewordUpdate', { template_guid: this.addEditId }).then(res => {
        this.modalForm = {
          ...res.data
        }
      })
    },
    restForm (refId) {
      this.$refs[refId].resetFields()
    },
    nextHandle () {
      this.saveTempalte(true)
    },
    modalCancel () {
      this.isNext ? this.$emit('modalCancel', false, true) : this.$emit('modalCancel', false, false)
    },
    // 保存模板
    saveTempalte (toNext) {
      this.$refs.moadlForm.validate((valid) => {
        if (valid) {
          if (this.wordsArrChange) {
            this.templateSubmit(toNext).then(res => {
              this.isNext = toNext
              this.nextId = res
            })
          } else {
            this.isNext = toNext
          }
        } else {
          return false
        }
      })
    },
    modalConfirm () {
      this.$refs.modalFormNext.validate((valid) => {
        if (valid) {
          this.shopLinkSubmit()
        } else {
          return false
        }
      })
    },
    // 模板-违禁词提交
    templateSubmit (toNext) {
      const submitParams = {
        template_guid: this.addEditId,
        template_name: this.modalForm.template_name,
        select_word: this.modalForm.select_word.join()
      }
      return new Promise((resolve, reject) => {
        this.$request.post('/templatewordSave', submitParams).then(res => {
          if (res.errorCode === 1) {
            this.nextId = res.data
            resolve(res.data)
            this.$message.success('保存成功')
            if (!toNext) {
              this.$emit('modalConfirm', true)
            }
          } else {
            reject(new Error())
            this.$message.error('保存失败')
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    shopLinkSubmit () {
      const submitParams = {
        template_guid: this.nextId,
        shop_guid: this.modalFormNext.shop_guid[0],
        select_link: this.$refs.transferCom.moadlSelectedLink.join()
      }
      this.$request.post('/templatelinkSave', submitParams).then(res => {
        if (res.errorCode === 1) {
          this.$message.success('保存成功')
          this.$emit('modalConfirm', true)
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    // 店铺名称下拉数据变化时触发
    shopChange (shopId) {
      // 缓存选择的数据
      this.cacheSelectLink = this.$refs.transferCom.moadlSelectedLink.join()
      this.shopLinkArr = []
      if (shopId && shopId.length > 0) {
        this.shopIsChange = true
        if (this.shopIsChange && this.linkSelectIsChange) {
          this.shopChangeTip = true
        } else {
          this.shopChangeTip = false
        }
        // 获取当前店铺所有链接，及已选择链接
        this.$request.post('/shoplink', { shop_guid: shopId[0], template_guid: this.nextId }).then(res => {
          this.transferKey = String(Math.random() * 100000000)
          this.shopLinkArr = res.data.all_link
          this.select_link = res.data.select_link || []
        })
      } else {
        this.shopLinkArr = []
        this.shopIsChange = false
        this.linkSelectIsChange = false
      }
    },
    wordsChange (wordsArr) {
      this.wordsArrChange = true
    },
    selectLinkChange (falg) {
      this.linkSelectIsChange = falg
    },
    shopChangeCancel () {
      this.shopChangeTip = false
      this.linkSelectIsChange = false
      this.cacheSelectLink = ''
    },
    shopChangeOk () {
      this.$refs.modalFormNext.validate((valid) => {
        if (valid) {
          const submitParams = {
            template_guid: this.nextId,
            shop_guid: this.oldShopGuid,
            select_link: this.cacheSelectLink
          }
          this.$request.post('/templatelinkSave', submitParams).then(res => {
            if (res.errorCode === 1) {
              this.$message.success('保存成功')
              this.linkSelectIsChange = false
              this.shopChangeTip = false
            } else {
              this.linkSelectIsChange = false
              this.shopChangeTip = false
              this.$message.error('保存失败')
            }
          })
        } else {
          return false
        }
      })
    },
    editModalFormRules () {
      this.$nextTick(() => {
        this.modalFormRules.template_name[0].validator = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入模板名称'))
          } else {
            this.$request.post('/templatenamecheck', { template_name: value }).then(res => {
              if (res.errorCode === 1) {
                if (res.data) {
                  callback(new Error('已存在相同的模板名称，请重新输入'))
                } else {
                  callback()
                }
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
