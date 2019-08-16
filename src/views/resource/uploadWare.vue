<template>
    <section class="upload-ware">
      <div class="upload-ware__body">
        <van-cell class="upload-ware__body__cell">
          <div slot="title" class=" aic">
            <div><span class="red">*</span>名称:</div>
            <input class="pdlt10" style="flex: 1" v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
            <span class="red">{{64 - form.name.length}}</span>
            <van-icon v-show="form.name.length" @click="form.name = ''" class="close" name="clear"/>
          </div>
        </van-cell>
        <van-cell class="upload-ware__body__cell">
          <div slot="title">
            <div class="jcsb">
              <div>简介:</div>
              <span class="red">{{200 - form.desc.length}}</span>
            </div>
            <textarea maxlength="200" v-model="form.desc" type="text" placeholder="请输入描述,字数在200字内"/>
          </div>
        </van-cell>
        <van-cell class="upload-ware__body__cell">
        <div slot="title" class="aic">
          <div><span class="red">*</span>课件:</div>
          <div class="pdlt10" style="flex:1">轻触此添加office或pdf</div>
          <van-icon @click="" class="add" name="add"/>
        </div>
      </van-cell>
        <van-cell class="upload-ware__body__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>共享:</span>
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
        <van-cell class="upload-ware__body__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>课中:</span>
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
      </div>
      <div class="upload-ware__footer">
        <van-button type="info" class="btn">提交</van-button>
      </div>
    </section>
</template>

<script>
    export default {
        name: "uploadWare",
      data() {
          return {
            form: {
              name: '',
              desc: '',
              share: '3',
              relate: '2'
            }
          }
      }
    }
</script>

<style lang="less" scoped>
  .upload-ware {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      &__cell {
        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }
        .close, .add {
          color: @blue;
          margin-left: 10px;
        }
        .add {
          font-size: 22px;
        }
        .jcsb {
          padding-left: 8px;
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
      background: #fff;
      flex: 0 0 55px;
      padding: 5px 10px;
      .btn{
        font-size: 16px;
        border-radius: 22px;
        width: 100%;
      }
    }
  }
</style>
