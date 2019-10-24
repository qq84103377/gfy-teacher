<template>
  <section class="question-detail">
    <van-nav-bar
      :title="$route.query.title"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="question-detail__body">
      <div class="question-detail__body__qst-wrap">
<!--        <div class="question-detail__body__qst-wrap__score">-->
<!--          <span>总分: {{info.score}}</span>-->
<!--        </div>-->
        <div v-html="info.title" class="html-img" @click="previewImg"></div>
        <span class="fs12 mgt15" style="display: block;"><i class="iconGFY icon-difficult"></i>&nbsp;{{info.titleDegree==='D01'?'容易':info.titleDegree==='D02'?'中等':'困难'}}</span>
        <div style="display: flex;justify-content: flex-end">
          <div class="question-detail__body__qst-wrap__btn" :class="{active:analyseShow}" @click="analyseShow=!analyseShow">查看解析</div>
        </div>
        <div v-if="analyseShow">
          <div>正确答案及相关解析</div>
          <div>正确答案:</div>
          <div v-html="info.answer"></div>
          <div>解析:</div>
          <div v-html="info.examExplain"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import {getCourseTaskDetail} from '@/api/index'
  import { ImagePreview } from "vant";

  export default {
    name: "questionDetail",
    data() {
      return {
        info: {},
        analyseShow:false
      }
    },
    methods: {
      previewImg($event) {
        if ($event.target.nodeName == "IMG") {
          console.log($event.target.src);
          ImagePreview({
            images: [$event.target.src],
            // startPosition: 1,
            onClose() {
              // do something
              console.log("close");
            }
          });
        }
      },
      getCourseTaskDetail() {
        this.$store.commit('setVanLoading',true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType":"A02",
          "tchCourseId":this.$route.query.tchCourseId,
          "accountNo":this.$store.getters.getUserInfo.accountNo,
          "taskId":this.$route.query.taskId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getCourseTaskDetail(params).then(res => {
          this.$store.commit('setVanLoading',false)
          if(res.flag){
            this.info = res.data[0].examQuestionInfo
          }else {
            this.$toast(res.msg)
          }
        })
      }
    },
    created() {
      this.getCourseTaskDetail()
    }
  }
</script>

<style lang="less" scoped>
  .question-detail {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

      &__qst-wrap {
        background: #fff;
        padding: 10px;
        &__score {
          line-height: 40px;
          text-align: right;
          padding: 0 10px;
          span{
            color: #f00;
            font-size: 15px;
          }
        }
        &__btn {
          font-size: 12px;
          /*width: 63px;*/
          padding: 0 5px;
          line-height: 22px;
          text-align: center;
          border-radius: 10px;
          border: 1px solid #999;
          &.active {
            color: @blue;
            border: 1px solid @blue;
          }
        }
      }
    }
  }
</style>
