<template>
    <section class="discuss-list">
      <div class="discuss-list__body">
        <list-item @clickTo="$router.push(`/discussDetail`)" class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index"
                   :can-slide="true">
          <div slot="badge"><i class="iconGFY icon-send"></i></div>
          <div slot="cover" class="cover"><i class="iconGFY icon-chat"></i></div>
          <div slot="desc">
            <div class="desc-top">
              <i class="iconGFY icon-personal" ></i>
              <i class="iconGFY icon-choice"></i>
            </div>
            <div class="desc-bottom">
              <div><i class="iconGFY icon-feather"></i>裘千仞</div>
              <div><van-icon name="clock-o" />2019-06-03 14:51:45</div>
            </div>
          </div>
          <div slot="btn" class="btn-group van-hairline--top">
            <div @click="isAdd=false;popShow=true">
              <i class="iconGFY icon-edit-orange"></i>
              <span>编辑</span>
            </div>
            <div @click="$router.push(`/addTask?type=discuss`)">
              <i class="iconGFY icon-plane"></i>
              <span>发任务</span>
            </div>
          </div>
        </list-item>

      </div>
      <div class="discuss-list__footer">
        <van-button type="info" class="btn" @click="isAdd=true;popShow=true">新建论题</van-button>
      </div>



      <van-popup
        v-model="popShow"
        position="bottom"
      :style="{height: '93%'}">
        <div class="save-pop">
          <div class="save-pop__title">{{isAdd?'新建论题':'编辑'}} <van-icon name="close" @click="popShow = false" class="close"></van-icon></div>
          <van-cell class="save-pop__cell">
            <div slot="title" class="align aic">
              <div class="fs15"><span class="red">*</span>主题:</div>
              <input class="pdlt10" style="flex: 1" v-model="form.name" type="text" maxlength="128" placeholder="请输入主题,字数在128字内">
              <span class="red">{{128 - form.name.length}}</span>
              <van-icon v-show="form.name.length" @click="form.name = ''" class="clear" name="clear"/>
            </div>
          </van-cell>
          <van-cell class="save-pop__cell">
            <div slot="title" class="">
              <div class="aic jcsb">
                <div class="fs15">简介:</div>
                <div class="red fs10">{{300 - form.desc.length}}</div>
              </div>
              <textarea v-model="form.desc" maxlength="300" rows="4" placeholder="请输入描述，字数在300字内"></textarea>
            </div>
          </van-cell>
          <van-cell class="save-pop__cell">
            <div slot="title">
              <div class="aic">
                <div class="fs15">图片:</div>
                <div class="pdlt10 fz10 grey9" style="flex:1">轻触此可添加多张图片(点击图片名可改名)</div>
                <van-icon @click="" class="add" name="add"/>

                <!--            <input-->
                <!--              type="file"-->
                <!--              id="fileSelect"-->
                <!--              accept="image/*"-->
                <!--              capture="camera"-->
                <!--              style="display: none;"-->
                <!--            />-->
              </div>
              <draggable class="img-group" v-model="imgList" :options="{handle:'.img-group-item'}">
                <div class="img-group-item" v-for="(item,index) in imgList" :key="index">
                  <img :src="item.src" alt="">
                  <van-icon @click="" class="del" name="clear"/>
                </div>
              </draggable>
              <van-checkbox
                style="margin-left: 0;"
                v-model="form.check"
                @click=""
              >
                <i
                  slot="icon"
                  slot-scope="props"
                  :class="['iconGFY','icon-check',{'normal':!props.checked}]"
                ></i>
                学生发帖后才能查看评论
              </van-checkbox>
            </div>

          </van-cell>
          <div class="save-pop__footer">
            <van-button type="info" class="btn" @click="">提交</van-button>
          </div>
        </div>
      </van-popup>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import draggable from 'vuedraggable'
  export default {
        name: "discussList",
    components: {listItem,draggable},
    data () {
      return {
        popShow:false,
        isAdd: false,
        form: {
          name: '',
          desc: '',
          check: false
        },
        imgList: [
          {name: 'asdsd1', src: require('../../assets/img/banner.png')},
          {name: 'asdsd2', src: require('../../assets/img/banner.png')},
          {name: 'asdsd3', src: require('../../assets/img/banner.png')},
          {name: 'asdsd4', src: require('../../assets/img/banner.png')},
          {name: 'asdsd5', src: require('../../assets/img/banner.png')},
          {name: 'asdsd6', src: require('../../assets/img/banner.png')},
        ],
        list: [{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},]
      }
    }
  }
</script>

<style lang="less" scoped>
  .discuss-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      .cover{
        background: #F691F3;
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
    }
    &__footer {
      background: #fff;
      flex: 0 0 55px;
      padding: 5px 10px;
      .btn{
        width: 100%;
        border-radius: 22px;
        font-size: 18px;
      }
    }
    .save-pop {
      &__footer {
        padding: 5px 10px;
        .btn {
          width: 100%;
          border-radius: 22px;
          font-size: 16px;
        }
      }
      &__title {
        font-size: 18px;
        font-weight: bold;
        line-height: 47px;
        text-align: center;
        position: relative;
        .close {
          font-size: 22px;
          color: #999;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      &__cell {
        .align {
          margin-left: -7px;
        }
        .img-group {
          display: flex;
          flex-wrap: wrap;
          margin-top: 15px;
          &-item {
            flex: 0 0 107px;
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;


            img {
              width: 100%;
              height: 70px;
            }

            .del {
              position: absolute;
              top: -5px;
              right: -5px;
              color: #000;
            }
            &__input {
              display: flex;
              background: #F5F6FA;
              width: 107px;
              align-items: center;
              input {
                width: 80%;
                padding: 3px 5px;
              }
              span{
                /*flex: 0 0 20%;*/
              }
            }
            &__name {
              background: #F5F6FA;
              padding: 3px 5px;
              text-align: center;
              width: 100%;
              word-break: break-all;
            }

            &:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
        .add {
          font-size: 22px;
          color: @blue;
        }
        .clear {
          margin-left: 10px;
          font-size: 15px;
          color: @blue;
        }
        textarea{
          width: 100%;
          color: #999;
          padding: 10px;
          border-radius: 5px;
          margin-top: 15px;
          background: #f5f6fa;
        }
        .normal {
          background: none;
          border: 1px solid #999;
          border-radius: 1.5px;
        }
      }
    }
  }
</style>
