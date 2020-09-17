<template>
  <el-breadcrumb class="bread"
                 separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: bread.path }"
                        v-for="(bread,index) in getBreadCurmb"
                        :key="index">{{bread.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  computed: {
    ...mapGetters(['getBreadCurmb'])
  }
}
</script>

<style lang="less" scoped>
.bread {
  position: fixed;
  top: 70px;
  right: 0;
  left: 230px;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  line-height: 40px;
  background-color: #fff;
  box-shadow: 0 1px 2px #ddd;
  z-index: 2500;
}
</style>>
