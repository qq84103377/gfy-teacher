<template>
  <section class="exam-list">
    <div class="exam-list__body">
      <list-item @clickTo="$router.push(`/examDetail?type=${item.send?1:0}`)" class="mgt10" style="background: #fff;"
                 v-for="(item,index) in list" :key="index"
                 :can-slide="true">
        <div slot="badge" v-if="item.send"><i class="iconGFY icon-send"></i></div>
        <div slot="cover" class="cover"><i class="iconGFY icon-exam-100"></i></div>
        <div slot="desc">
          <div class="desc-top">
            <i class="iconGFY icon-share"></i>
            <i class="iconGFY icon-choice"></i>
          </div>
          <div class="desc-bottom">
            <div><i class="iconGFY icon-difficult"></i>困难</div>
            <div><i class="iconGFY icon-zhu"></i>10</div>
            <div><i class="iconGFY icon-ke"></i>10</div>
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
          <div @click="addExam.title = '编辑';addExam.show = true">
            <i class="iconGFY icon-edit-orange"></i>
            <span>编辑</span>
          </div>
          <div @click="addExam.title = '复制';addExam.show = true">
            <i class="iconGFY icon-copy-orange"></i>
            <span>复制</span>
          </div>
          <div @click="$router.push(`/addTask?type=material`)">
            <i class="iconGFY icon-plane"></i>
            <span>发任务</span>
          </div>
        </div>
      </list-item>

    </div>
    <div class="exam-list__footer">
      <van-button type="info" class="btn" @click="addExam.title = '新建试卷';addExam.show = true">新建试卷</van-button>
    </div>

    <van-popup
      v-model="addExam.show"
      position="bottom">
      <div class="exam-pop">
        <div class="exam-pop__title">{{addExam.title}}</div>
        <van-cell class="exam-pop__cell">
          <div slot="title" class=" aic">
            <div><span class="red">*</span>名称:</div>
            <input class="pdlt10" style="flex: 1" v-model="addExam.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
            <span class="red">{{64 - addExam.name.length}}</span>
            <van-icon v-show="addExam.name.length" @click="addExam.name = ''" class="clear" name="clear"/>
          </div>
        </van-cell>
        <van-cell v-if="addExam.title != '复制'" class="exam-pop__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>试卷难度:</span>
            <van-radio-group style="display: flex;" v-model="addExam.difficult">
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
        <van-cell v-if="addExam.title != '复制'" class="exam-pop__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>共享级别:</span>
            <van-radio-group style="display: flex;" v-model="addExam.share">
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
        <div class="exam-pop__footer">
          <van-button type="info" class="btn" @click="handleSubmit">提交</van-button>
        </div>
      </div>
    </van-popup>

  </section>
</template>

<script>
  import listItem from '../../components/list-item'

  export default {
    name: "examList",
    components: {listItem},
    data() {
      return {
        addExam: {
          show:false,
          title: '',
          name:'',
          difficult: '2',
          share: '2'
        },
        list: [{name: 1,send:true}, {name: 1,send:false}, {name: 1,send:true}, {name: 1,send:true}, {name: 1,send:true}, {name: 1,send:true}, {name: 1,send:true}, {name: 1,send:true}, {name: 1,send:true}, {name: 1,send:true},]
      }
    },
    methods: {
      handleSubmit() {
        if(this.addExam.title == '新建试卷') {
          this.$router.push(`/questionList`)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .exam-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    .exam-pop {
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
        background: @blue;
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
          margin-right: 7px;
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
      background: #fff;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }
  }
</style>
