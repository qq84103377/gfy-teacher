<template>
  <section class="convertRule">
    <van-nav-bar title="兑换规则" left-arrow @click-left="$router.back()">
      <div slot="right" class="tips" @click="$router.push('/service')">为您服务</div>
    </van-nav-bar>
    <div class="convertRule-body">
      <div class="item">
        <h3>规则一</h3>
        <p>
          1.除假期外，当月兑换的奖品通过审核，会在下个月由工作人员联系，进行兑换
        </p>
      </div>
      <div class="item">
        <h3>规则二</h3>
        <p>
          2.奖品质量问题，请收到奖品时及时检查，如有问题，请直接联系工作人员进行更换
        </p>
      </div>
      <div class="item">
        <h3>规则三</h3>
        <p>
          3.如果在兑换奖品过程中有任何问题，请联系工作人员。
        </p>
      </div>

    </div>
  </section>

</template>

<script>
  export default {
    name: "convertRule"
  }
</script>

<style scoped lang="less">
  .convertRule {
    .tips {
      color: #39F0DD;
      font-size: 14px;
    }

    &-body {
      padding: 15px;

      .item {
        margin-bottom: 20px;

        h3 {
          font-size: 16px;
          color: #000000;
          font-weight: 600;
          padding: 10px 0;
        }

        p {
          font-size: 14px;
          color: #333333;
          line-height: 22px;
        }
      }

    }
  }
</style>
