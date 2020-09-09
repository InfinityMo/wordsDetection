<template>
  <div class="copyright">© {{nowYear}} 上海联恩贸易发展有限公司. All rights reserved.</div>
</template>
<script>
export default {
  computed: {
    nowYear () {
      return new Date().getFullYear()
    }
  }
}
</script>
<style lang="less" scoped>
.copyright {
  position: absolute;
  bottom: 10px;
  // width: 100%;
  left: calc((100% - 250px) / 2);
  padding-top: 15px;
  font-size: 15px;
  color: #333;
  // font-weight: bold;
  text-align: center;
  box-sizing: border-box;
  // z-index: 10;
}
</style>
