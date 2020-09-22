<template>
  <div class="head">
    <div class="head-content flex-item-center">
      <h1>标题违禁词检测系统</h1>
      <!-- 用户信息 -->
      <!-- <div class="flex-item-center user">
        <div><img src="@/assets/img/custom/cat.jpg"></div>
        <p>欢迎您！Infinity</p>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {}
}
</script>

<style lang="less" scoped>
.head {
  position: fixed;
  width: 100%;
  height: 70px;
  background-color: #252836;
  box-shadow: 0 1px 4px rgba(255, 255, 255, 0.1);
  z-index: 2500;
  .head-content {
    height: 100%;
    padding: 0 30px;
    h1 {
      font-size: 28px;
      font-weight: bold;
      color: #fff;
    }
    .user {
      div {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }

      p {
        font-size: 14px;
        margin-left: 15px;
        color: #fff;
      }
    }
  }
}
</style>>
