<template>
    <section class="material-list-wrap">
      <div class="material-list-wrap__body">
        <list-item @clickTo="$router.push(`/materialDetail`)" class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index"
                   :can-slide="true">
          <div slot="badge"><i class="iconGFY icon-send"></i></div>
          <div slot="cover" class="cover"><i class="iconGFY icon-video"></i></div>
          <div slot="desc">
            <div class="desc-top">
              <i class="iconGFY icon-share" ></i>
              <i class="iconGFY icon-choice"></i>
            </div>
            <div class="desc-bottom">
              <div><i class="iconGFY icon-feather"></i>裘千仞</div>
              <div><i class="iconGFY icon-download"></i>10</div>
              <div><i class="iconGFY icon-points"></i>10</div>
              <div><i class="iconGFY icon-star"></i>10</div>
            </div>
          </div>
          <div slot="btn" class="btn-group van-hairline--top">
            <div @click="$set(item,'see',!item.see)">
              <!--            <i class="iconGFY icon-edit"></i>-->
              <van-icon :name="item.see?'eye':'closed-eye'" class="eye"></van-icon>
              <span>{{item.see?'':'不'}}可见</span>
            </div>
            <div @click="">
              <i class="iconGFY icon-download-orange"></i>
              <span>下载</span>
            </div>
            <div @click="$router.push(`/addTask?type=material`)">
              <i class="iconGFY icon-plane"></i>
              <span>发任务</span>
            </div>
          </div>
        </list-item>

      </div>
      <div class="material-list-wrap__footer">
        <van-button type="info" class="btn" @click="$router.push(`/uploadWare`)">上传课件</van-button>
        <van-button type="info" class="btn" @click="$router.push(`/uploadImg`)">上传图片</van-button>
      </div>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  export default {
        name: "materialList",
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
  .material-list-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      .cover{
        background: #F3D233;
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
      flex: 0 0 55px;
      padding: 5px 10px;
      display: flex;
      .btn{
        flex: 1;
        border-radius: 22px;
        font-size: 16px;
        margin-right: 23px;
        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
</style>
