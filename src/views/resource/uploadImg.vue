<template>
  <section class="upload-img">
    <div class="upload-img__body">

      <van-cell>
        <div slot="title" class="upload-img__body__cell">
          <div class="aic">
            <div class="fs15"><span class="red">*</span>图片:</div>
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
          <draggable class="img-group" v-model="list" :options="{handle:'.img-group-item'}">
<!--            <transition-group>-->
<!--              <div class="img-group">-->
                <div class="img-group-item" v-for="(item,index) in list" :key="index">
                  <img :src="item.src" alt="">
                  <div class="img-group-item__name" v-if="!item.edit" @click="changeName(item)">{{item.name}}</div>
                  <div class="img-group-item__input" v-if="item.edit"><input @blur="$set(item,'edit',false)" maxlength="20" v-model="item.name" v-focus="item.edit" type="text"><span class="red">{{20 - item.name.length}}</span></div>
                  <van-icon @click="" class="clear" name="clear"/>
                </div>
<!--              </div>-->
<!--            </transition-group>-->
          </draggable>
        </div>
      </van-cell>
      <van-cell class="upload-img__body__cell">
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
      <van-cell class="upload-img__body__cell">
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
    <div class="upload-img__footer">
      <van-button type="info" class="btn" @click="handleSubmit">提交</van-button>
    </div>
  </section>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: "uploadImg",
    components: {
      draggable,
    },
    directives: {
      focus: {
        inserted: (el, {value}) => {
          // console.log(el,value);
          console.log(value);
          if (value) {
            //由于是饿了么的el-input，需要拿到父元素下面的input
            el.focus();
          }
        }
      }
    },
    data() {
      return {
        list: [
          {name: 'asdsd1', src: require('../../assets/img/banner.png')},
          {name: 'asdsd2', src: require('../../assets/img/banner.png')},
          {name: 'asdsd3', src: require('../../assets/img/banner.png')},
          {name: 'asdsd4', src: require('../../assets/img/banner.png')},
          {name: 'asdsd5', src: require('../../assets/img/banner.png')},
          {name: 'asdsd6', src: require('../../assets/img/banner.png')},
        ],
        form: {
          share: '3',
          relate: '2'
        }
      }
    },
    methods: {
      changeName(item) {
        this.$set(item,'edit',true)
      },
      handleSubmit() {
        console.log(this.list);
      }
    }
  }
</script>

<style lang="less" scoped>
  .upload-img {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

      &__cell {
        .add {
          font-size: 22px;
          color: @blue;
        }

        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
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

            .clear {
              position: absolute;
              top: -5px;
              right: -5px;
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
      }
    }

    &__footer {
      flex: 0 0 55px;
      background: #fff;
      padding: 5px 10px;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }
  }
</style>
