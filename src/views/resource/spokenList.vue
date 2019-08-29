<template>
    <section class="spoken-list">
      <div class="spoken-list__body">
        <list-item @clickTo="$router.push(`/spokenDetail`)" class="mgt10" style="background: #fff;" v-for="(item,index) in list" :key="index"
                   :can-slide="true">
          <div slot="badge"><i class="iconGFY icon-send"></i></div>
          <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
          <div slot="desc">
            <div class="desc-top">
              <i class="iconGFY icon-personal" ></i>
              <i class="iconGFY icon-choice"></i>
            </div>
            <div class="desc-bottom">
              <div>难度: 困难</div>
              <div>单词: 10</div>
              <div>句子: 10</div>
            </div>
          </div>
          <div slot="btn" class="btn-group van-hairline--top">
            <div @click="isEdit=true;popShow=true">
              <i class="iconGFY icon-edit-orange"></i>
              <span>编辑</span>
            </div>
            <div @click="isEdit=false;popShow=true">
              <i class="iconGFY icon-copy-orange"></i>
              <span>复制任务</span>
            </div>
            <div @click="$router.push(`/addTask?type=spoken`)">
              <i class="iconGFY icon-plane"></i>
              <span>发任务</span>
            </div>
          </div>
        </list-item>

      </div>

      <van-popup
        v-model="popShow"
        position="bottom">
        <div class="spoken-pop">
          <div class="spoken-pop__title">{{isEdit?'编辑':'复制'}}</div>
          <van-cell class="spoken-pop__cell">
            <div slot="title" class=" aic">
              <div><span class="red">*</span>名称:</div>
              <input class="pdlt10" style="flex: 1" v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
              <span class="red">{{64 - form.name.length}}</span>
              <van-icon v-show="form.name.length" @click="form.name = ''" class="clear" name="clear"/>
            </div>
          </van-cell>
          <van-cell v-if="isEdit" class="spoken-pop__cell">
            <div slot="title" class="aic">
              <span class="mgr10"><span class="red">*</span>口语难度:</span>
              <van-radio-group style="display: flex;" v-model="form.difficult">
                <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                  易
                </van-radio>
                <van-radio name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                  中
                </van-radio>
                <van-radio name="4" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                  难
                </van-radio>
              </van-radio-group>
            </div>
          </van-cell>
          <van-cell v-if="isEdit" class="spoken-pop__cell">
            <div slot="title" class="aic">
              <span class="mgr10"><span class="red">*</span>共享级别:</span>
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
          <div class="spoken-pop__footer">
            <van-button type="info" class="btn" @click="">提交</van-button>
          </div>
        </div>
      </van-popup>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  export default {
        name: "spokenList",
    components: {listItem},
    data() {
          return {
            list: [{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},{name:1},],
            popShow: false,
            isEdit: false,
            form: {
              name: '',
              difficult: '2',
              share: '2',
            }
          }
    }
  }
</script>

<style lang="less" scoped>
  .spoken-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    .spoken-pop {
      &__title{
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 47px;
      }
      .clear {
        color: @blue;
        margin-left: 10px;
      }
      .radio-normal  {
        border: 1px solid #999;
        border-radius: 50%;
        background: none;
      }
      &__footer {
        padding: 5px 10px;
        .btn {
          width: 100%;
          border-radius: 22px;
          font-size: 16px;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;
      .cover{
        background: #FCA361;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .desc-top {
        display: flex;
        margin-bottom: 6px;

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
  }
</style>
