<template>
  <el-transfer v-model="moadlSelectedLink"
               @change="selectLinkChange"
               filterable
               filter-placeholder="请输入链接"
               :filter-method="filterMethod"
               :titles="['未选择链接', '已选择链接']"
               :data="shopLinkArr">
    <span slot-scope="{ option }">
      <el-tooltip effect="dark"
                  :content="option.label"
                  placement="left">
        <span>{{option.label}}</span>
      </el-tooltip>
    </span>
  </el-transfer>
</template>

<script>
export default {
  props: {
    shopLinkArr: {
      type: Array,
      required: true
    },
    selectedlink: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      moadlSelectedLink: [...this.selectedlink]
    }
  },
  mounted () {
    console.log(this.selectedlink)
  },
  methods: {
    // 穿梭框搜索
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    selectLinkChange (linkList) {
      this.$emit('selectLinkChange', true)
    }
  }
}
</script>

<style>
</style>
