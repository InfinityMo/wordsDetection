<template>
  <div>
    <div>
      <Header />
      <section class="content">
        <Menu />
        <Main />
      </section>
    </div>
  </div>

</template>

<script>
import Header from './headLayout'
import Menu from './menuLayout'
import Main from './mainLayout'
export default {
  components: {
    Header,
    Menu,
    Main
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  height: 100%;
  padding-top: 70px;
  // max-height: calc(100vh - 70px);
  // overflow: hidden;
}
</style>
