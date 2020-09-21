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
  left: calc((100% - 245px) / 2);
  // left: calc(50% - 5px);
  padding-top: 15px;
  font-size: 15px;
  color: #333;
  text-align: center;
  box-sizing: border-box;
}
</style>
