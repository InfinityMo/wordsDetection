<template>
  <div class="main-wrap">
    <breadcrumb />
    <div class="main-content">
      <router-view></router-view>
    </div>
    <copyright />
  </div>
</template>

<script>
import breadcrumb from './breadcrumb'
import copyright from './copyrightLayout'
export default {
  components: {
    breadcrumb,
    copyright
  }
}
</script>

<style lang="less" scoped>
.main-wrap {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 70px);
  padding: 55px 15px 15px 245px;
  box-sizing: border-box;
  .main-content {
    padding: 0 5px 25px 0;
    // background: #fff;
  }
}
</style>>
