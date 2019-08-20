<template>
  <section class="lesson-list">
    <div class="lesson-list__body">
      <list-item class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index"
                 :can-slide="true">
<!--        <div slot="badge"><i class="iconGFY icon-send"></i></div>-->
        <div slot="cover" class="cover"><i class="iconGFY icon-video"></i></div>
        <div slot="desc">
          <div class="desc-top">
            <i class="iconGFY icon-share" ></i>
            <i class="iconGFY icon-choice"></i>
          </div>
          <div class="desc-bottom">
            <div><i class="iconGFY icon-feather"></i>裘千仞</div>
            <div><i class="iconGFY icon-points"></i>10</div>
            <div><i class="iconGFY icon-star"></i>10</div>
          </div>
        </div>
<!--        <div slot="btn" class="btn-group van-hairline&#45;&#45;top">-->
<!--          <div @click="$set(item,'see',!item.see)">-->
<!--            <van-icon :name="item.see?'eye':'closed-eye'" class="eye"></van-icon>-->
<!--            <span>{{item.see?'':'不'}}可见</span>-->
<!--          </div>-->
<!--          <div @click="$router.push(`/addTask?type=lesson`)">-->
<!--            <i class="iconGFY icon-plane"></i>-->
<!--            <span>发任务</span>-->
<!--          </div>-->
<!--        </div>-->
      </list-item>
    </div>
    <div class="lesson-list__footer">
      <van-button type="info" class="upload-btn" @click="$router.push(`/uploadLesson`)">上传微课</van-button>
    </div>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'

  export default {
    name: "lessonList",
    components: {listItem},
    data () {
      return {
        show:false,
        list: [{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},]
      }
    }
  }
</script>

<style lang="less" scoped>
  .lesson-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      .cover{
        background: #67E0A3;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .desc-top {
        display: flex;
        margin: 3px 0;
        .iconGFY {
          margin-right: 5px;
        }
      }
      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;
        .iconGFY {
          margin-right: 3px;
        }
        >div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
      .eye {
        color: #F89451;
      }
    }
    &__footer {
      padding: 5px 10px;
      flex: 0 0 55px;
      .upload-btn {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }
  }
</style>
