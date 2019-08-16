<template>
  <section class="upload-lesson">
    <div class="upload-lesson__body">
      <van-cell class="upload-lesson__body__cell">
        <div slot="title" class="upload-lesson__body__cell-ctn mgl5">
          <div><span class="red">*</span>名称:</div>
          <input v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
          <span class="red">{{64 - form.name.length}}</span>
          <van-icon v-show="form.name.length" @click="form.name = ''" class="close" name="clear"/>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title">
          <div class="jcsb">
            <div>简介:</div>
            <span class="red">{{200 - form.desc.length}}</span>
          </div>
          <textarea maxlength="200" v-model="form.desc" type="text" placeholder="请输入描述,字数在200字内"/>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title" class="upload-lesson__body__cell-ctn mgl5">
          <div><span class="red">*</span>音视频:</div>
          <div class="pdlt10" style="flex:1">音视频名字</div>
          <van-icon @click="" class="add" name="add"/>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title">
          <div class="jcsb">
            <div>封面图:</div>
            <span style="flex: 1" class="pdlt10 grey9">轻触此添加封面图</span>
            <van-icon @click="" class="add" name="add"/>
          </div>
          <div class="img-group">
            <div class="img-wrap">
              <img src="../../assets/img/banner.png" alt="">
              <van-icon @click="" name="clear"/>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title" class="aic">
          <span class="mgr10">共享:</span>
          <van-radio-group style="display: flex;" v-model="form.share">
            <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              仅自己
            </van-radio>
            <van-radio name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              校内
            </van-radio>
            <van-radio name="4"><i slot="icon" slot-scope="props"
                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              公开
            </van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title" class="aic">
          <span class="mgr10">课中:</span>
          <van-radio-group style="display: flex;" v-model="form.relate">
            <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              仅资源
            </van-radio>
            <van-radio name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              关联到课中
            </van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <div class="fs10 red pd10">
        <div>注:</div>
        <div>1.请上传MP4、WMV、AVI格式的视频文件,使用格式エ厂迸行转换,转换吗成AVG(H264),比特率为500KB/s的MP4格式。</div>
        <div>2..上传WMV、AVI格式的文件时后台会対文件迸行装換，请稍后回来再刷新页面査看文件</div>
      </div>
    </div>
    <div class="upload-lesson__footer">
      <van-button type="info" class="submit">提交</van-button>
    </div>
  </section>
</template>

<script>
  export default {
    name: "uploadLesson",
    data() {
      return {
        form: {
          share: '3',
          relate: '2',
          name: '',
          desc: '',
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .upload-lesson {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    .mgl5 {
      margin-left: -7px;
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      &__cell {
        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }

        &-ctn {
          display: flex;
          align-items: center;

          input {
            flex: 1;
            padding: 0 10px;
          }
        }

        .img-group {
          display: flex;
          flex-wrap: wrap;
          margin-top: 18px;

          .img-wrap {
            position: relative;
            flex: 0 0 107px;
            height: 70px;
            margin-right: 10px;
            margin-bottom: 10px;

            img {
              width: 100%;
              height: 100%;
            }

            i {
              position: absolute;
              right: -6px;
              top: -6px;
              width: 15px;
              height: 15px;
              font-size: 15px;
              color: #000;

            }
          }
        }

        .close, .add {
          color: @blue;
          margin-left: 10px;
        }

        .add {
          font-size: 22px;
        }

        textarea {
          background: #F5F6FA;
          border-radius: 5px;
          height: 105px;
          width: 100%;
          margin-top: 15px;
          padding: 10px;
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 5px 10px;

      .submit {
        border-radius: 22px;
        width: 100%;
        font-size: 16px;
      }
    }
  }
</style>
