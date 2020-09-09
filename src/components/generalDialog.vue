<template>
  <el-dialog title="新增店铺"
             top="120px"
             :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="店铺名称"
                    :label-width="formLabelWidth">
        <el-input v-model="form.name"
                  autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogTableVisible: false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
