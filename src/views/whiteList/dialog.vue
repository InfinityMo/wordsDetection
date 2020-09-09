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
                    prop="brand_name"
                    label-width="115px">
        <el-input v-model="modalForm.brand_name"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="白名单模板："
                    prop="select_brand"
                    label-width="110px">
        <el-transfer v-model="modalForm.select_brand"
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
    }
  },
  data () {
    return {

    }
  },
  watch: {
  },
  computed: {

  },
  created () {

  },
  mounted () {
    // debugger

  },
  methods: {
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
