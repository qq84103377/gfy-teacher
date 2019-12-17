<template>
  <section class="question-item-wrap">
    <i class="iconGFY icon-auto" v-if="item.autoScoring == 1&&!item.groupExamList.length"></i>
    <div class="question-item-wrap__ctn">
      <slot name="num"></slot>
      <div ref="title" v-html="item.title" class="html-img" @click="previewImg"></div>
      <div class="van-hairline--bottom init-wrap" v-for="(child,childIndex) in item.groupExamList" :key="childIndex">
        ({{childIndex+1}})<span v-if="child.examScore>=0">本小题{{child.examScore}}分</span>
        <i class="iconGFY icon-auto" v-if="child.autoScoring == 1"></i>
        <div v-html="child.title" class="html-img" @click="previewImg"></div>
        <div class="question-item-wrap__btn-group" style="justify-content: flex-end;padding-right: 0;">
          <div class="btn-item" :class="{active:child.analyseShow}"
               @click="$set(child,'analyseShow',!child.analyseShow)">查看解析
          </div>
          <div v-if="!isSend&&!isQuestion" class="btn-item" @click="$emit('setPoint',childIndex)">设置分数</div>
        </div>
        <div v-if="child.analyseShow" class="question-item-wrap__analyse mgb10"
             style="padding-left: 0;padding-right: 0;background: #f5f5f5;">
          <div>正确答案及相关解析</div>
          <div>正确答案:</div>
          <div v-html="child.answer"></div>
          <div>解析:</div>
          <div v-html="child.examExplain"></div>
        </div>
      </div>
      <div class="icon-group">
        <span v-if="isQuestion"><i class="iconGFY icon-accuracy"></i>{{item.correctRate}}</span>
        <span><i class="iconGFY icon-points"></i>{{item.useCount||0}}</span>
        <span><i class="iconGFY icon-star"></i>{{item.collectCount||0}}</span>
        <span><i class="iconGFY icon-difficult"></i>{{item.titleDegree==='D01'?'容易':item.titleDegree==='D02'?'中等':'困难'}}</span>
      </div>
    </div>
    <div class="question-item-wrap__btn-group van-hairline--top" :id="'question-item'+index">
      <van-icon v-if="!isSend" @click="tooltip=true" name="ellipsis" class="fs18"></van-icon>
      <div class="aic" style="flex: 1;justify-content: flex-end">
        <div v-if="isSend" class="btn-item" @click="$emit('correct')">纠错</div>
        <div class="btn-item" :class="{active:analyseShow}"
             @click="analyseShow=!analyseShow">查看解析
        </div>
        <div v-if="isQuestion" class="btn-item" :class="{active:item.collectId}" @click="handleCollect(item.collectId)">
          {{item.collectId?'取消':'添加'}}收藏
        </div>
        <div v-if="!isSend&&!isQuestion" class="btn-item" @click="$emit('setPoint')">设置分数</div>
        <div v-if="!isSend" class="btn-item" :class="{active:item.isRemove}"
             @click="handleAdd">
          {{!item.isRemove?'添加':'移除'}}试题
        </div>
      </div>
    </div>
    <div v-if="analyseShow" class="question-item-wrap__analyse">
      <div>试题编号:{{item.examId}}</div>
      <div v-if="item.knowledgePointName">知识点:{{item.knowledgePointName}}</div>
      <div v-if="!item.groupExamList.length">
        <div>正确答案及相关解析</div>
        <div>正确答案:</div>
        <div v-html="item.answer"></div>
        <div>解析:</div>
        <div v-html="item.examExplain"></div>
      </div>
    </div>


    <van-popup v-model="tooltip" :get-container="'#question-item'+index" class="tooltip-pop">
      <div class="tooltip-pop-wrap">
        <div v-if="!isSend" class="tooltip-pop-wrap__item" @click="tooltip=false;$emit('correct')">纠错</div>
        <div v-if="up" @click="tooltip=false;$emit('move',0)" class="tooltip-pop-wrap__item">上移</div>
        <div v-if="down" @click="tooltip=false;$emit('move',1)" class="tooltip-pop-wrap__item">下移</div>
      </div>
    </van-popup>
  </section>
</template>

<script>
  import {createCollectInfo, delCollectInfo} from '@/api/index'
  import { Dialog } from 'vant';
  import { ImagePreview } from "vant";
  export default {
    name: "questionItem",
    props: ['isSend', 'index', 'isQuestion', 'up', 'down', 'item'],//isQuestion 是否试题页面适用
    data() {
      return {
        analyseShow: false,
        tooltip: false,
        collect: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        //去掉题目内容的audio下载按钮
        let dom = this.$refs['title'].querySelectorAll('audio')
        if(dom.length) {
          dom[0].controlsList="nodownload"
        }
      })
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
      handleAdd() {
        if(this.item.isRemove) {
          Dialog.confirm({
            title: '确定移除当前试题?'
          }).then(() => {
            this.$set(this.item, 'isRemove', !this.item.isRemove)
            this.$emit('add', !this.item.isRemove);
          }).catch(() => {
            // on cancel
          });
        }else {
          this.$set(this.item, 'isRemove', !this.item.isRemove)
          this.$emit('add', !this.item.isRemove);
        }
      },
      handleCollect(v) {
        if (!v) {
          //添加收藏
          let obj = {
            "interUser": "value",
            "interPwd": "value",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "resCollectInfo": {
              "objectTypeCd": "C01",
              "objectId": this.item.examId,
              "collectType": "C01",
              "accountNo": this.$store.getters.getUserInfo.accountNo,
              "statusCd": this.item.statusCd,
              "subjectType": this.$route.query.subjectType
            },
            "sysTypeCd": "S04"   //web传S02 app传S04
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          createCollectInfo(params).then(res => {
            if (res.flag) {
              this.item.collectId = res.resCollectInfo.collectId
              this.item.collectCount++
              this.$toast('收藏成功')
            } else {
              this.$toast(res.msg)
            }
          })
        } else {
          //取消收藏
          let obj = {
            "interUser": "value",
            "interPwd": "value",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "resCollectInfo": {
              "collectId": this.item.collectId,
              "objectTypeCd": "C01",
              "objectId": this.item.examId,
              "collectType": "C01",
              "accountNo": this.$store.getters.getUserInfo.accountNo,
              "statusCd": this.item.statusCd
            },
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          delCollectInfo(params).then(res => {
            if (res.flag) {
              this.item.collectId = 0
              this.item.collectCount--
              this.$toast('取消收藏')
            } else {
              this.$toast(res.msg)
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .question-item-wrap {
    position: relative;
    background: #fff;
    margin-bottom: 10px;

    .icon-auto {
      position: absolute;
      right: 0;
      top: 0;
    }

    .init-wrap {
      margin: 0 -12px;
      padding: 0 12px;
      position: relative;
    }

    .tooltip-pop {
      border-radius: 5px;
      bottom: 90%;
      position: absolute;
      max-height: inherit;
      top: inherit;
      transform: none;
      left: 3%;
      overflow-y: inherit;

      &-wrap {
        padding: 10px;

        &__item {
          text-align: center;
          width: 85px;
          line-height: 24px;
          border-radius: 5px;
          margin-bottom: 5px;
          font-size: 15px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      &::after {
        width: 0;
        height: 0;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent #fff;
        content: ' ';
        position: absolute;
        bottom: -9px;
        left: 2%;
        transform: rotateZ(180deg);
      }
    }

    &__ctn {
      padding: 15px 12px;

      .icon-group {
        display: flex;
        align-items: center;
        margin-top: 22px;
        font-size: 12px;
        color: #666;

        span {
          margin-right: 15px;

          i {
            margin-right: 3px;
          }
        }
      }
    }

    &__btn-group {
      position: relative;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }

    .btn-item {
      flex: 0 0 63px;
      width: 63px;
      line-height: 22px;
      text-align: center;
      border-radius: 10px;
      border: 1px solid #999;
      margin-right: 11px;

      &.active {
        color: @blue;
        border: 1px solid @blue;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    &__analyse {
      padding: 8px 12px;
    }
  }
</style>
