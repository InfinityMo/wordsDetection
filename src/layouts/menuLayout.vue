<template>
  <div class="menu-wrap">
    <el-menu :unique-opened="true"
             :router="true"
             :default-active="defaultActive"
             background-color="#252836"
             text-color="#fff"
             active-text-color="#409eff"
             class="el-menu-vertical-demo">
      <el-submenu v-for="(menu,index) in menus"
                  :key="menu.pId"
                  :index="String(index)">
        <template slot="title">
          <i class="ststem-icon"
             :class="menu.icon"></i>
          <span>{{menu.pTitle}}</span>
        </template>
        <el-menu-item :index="item.path"
                      @click.native="menuClick(item.path)"
                      v-for="item in menu.item"
                      :key="item.path">{{item.title}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {},
  computed: {
    ...mapGetters(['menus']),
    defaultActive () {
      const breadArr = []
      this.$route.matched.map((item, idnex) => {
        if (item.meta.title) {
          if (!item.path) {
            item.path = item.redirect
          }
          breadArr.push({
            title: item.meta.title,
            path: item.path
          })
        }
      })
      // debugger
      this.setBreadCurmb(breadArr)
      return this.$route.path
    }
  },
  mounted () {

  },
  methods: {
    ...mapMutations(['setBreadCurmb']),
    menuClick (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../common/styles/iconSet";
.menu-wrap {
  position: fixed;
  top: 70px;
  width: 230px;
  height: calc(100vh - 70px);
  overflow: hidden;
  box-sizing: border-box;
  z-index: 1;
  .el-menu {
    height: 100%;
    overflow-y: auto;
    .el-menu-item {
      text-indent: 1.5em;
    }
  }
}
</style>>
