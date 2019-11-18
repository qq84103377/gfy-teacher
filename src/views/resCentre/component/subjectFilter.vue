<template>
  <van-popup
    v-model="show"
    :close-on-click-overlay="false"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="res-filter-wrap">
      <div class="res-filter-wrap__header van-hairline--bottom">
        <div class="res-filter-wrap__header-tab">
          <span>科目</span>
          <van-icon class="icon-close" @click="closePop" name="close"/>
        </div>
      </div>
      <div class="res-filter-wrap__body">
        <div class="res-filter-wrap__body-left">
          <div @click="selectParent(item,index)" v-for="(item,index) in subjectList" :key="index"
               :class="{active:item.active}">{{item.name}}
          </div>
        </div>
        <div class="res-filter-wrap__body-right">
          <div class="" v-for="(child,ci) in subjectList[index].child" :key="ci">
            <div @click="handleSelect(child)" class="van-hairline--bottom">
              <div :class="['cell__item',{active:child.check}]">{{child.subjectName}}
                <van-icon v-show="child.check" class="check blue" name="success"/>
              </div>
<!--              <div v-if="!item.tchCourseInfo.sysCourseId" class="fs12 red tip">如没有进行添加到具体课程，则自动添加到「资源中心」-「私人资源」-「试卷」-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="res-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="confirm">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {Dialog} from 'vant';
  import {getSubjectType} from '@/api/index'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "subjectFilter",
    props: ['visible','label'],
    data() {
      return {
        index: 0,
        subjectList: [
          {name: '小学',value:'Y01',active:true,child:[]},
          {name: '初中',value:'Y02',active:false,child:[]},
          {name: '高中',value:'Y03',active:false,child:[]},
        ],
        tempList: [],
        tempIndex: 0,
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
          this.$emit('update:visible', false)
        }
      },
    },
    watch: {
      visible(v) {
        if (v) {
          this.tempIndex = this.index
          this.tempList = JSON.parse(JSON.stringify(this.subjectList))
        }
      }
    },
   created() {
      this.subjectList.forEach((v,i) => {
       this.getSubjectType(i)
      })
    },
    methods: {
     getSubjectType(index = 0) {
        // if(this.filter.subjectList[index].done) return
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          yearSection: this.subjectList[index].value,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
       getSubjectType(params).then(res => {
          // this.$set(this.filter.subjectList[index],'done',true) // 是否已加载了数据
          if(res.flag) {
            this.subjectList[index].child = res.resSubjectTypeInfoList
            if(!index) {
              const subjectIndex = this.subjectList[index].child.findIndex(v => v.subjectType === localStorage.currentSubjectType)
              this.$emit('update:label',this.subjectList[index].name + this.subjectList[index].child[subjectIndex].subjectName)
              this.$set(this.subjectList[index].child[subjectIndex],'check',true)
              eventBus.$emit('changeSubject',this.subjectList[index].child[subjectIndex].subjectType)
            }
          }
        })
      },

      confirm() {
        const item = this.subjectList[this.index].child.find(v => v.check)
        if(this.index !== this.tempIndex) {
         //切换过学年
          if(item) {
            eventBus.$emit('changeYear',this.index, item?item.subjectType:'')
            this.$emit('update:label',this.subjectList[this.index].name + (item?item.subjectName:''))
          }
       }else {
         //没有切换学年,只切换学科
         eventBus.$emit('changeSubject',item?item.subjectType:'')
          this.$emit('update:label',this.subjectList[this.index].name + (item?item.subjectName:''))
        }
        this.show = false
      },
      closePop() {
        // this.subjectList = this.tempList
        // this.index = this.tempIndex
        this.show = false
      },
      handleSelect(item) {
        if (item.check) return

        if(item.subjectType !== localStorage.currentSubjectType) {
          this.$dialog.confirm({
            title: '提示',
            message: '是否进行科目的切换？科目切换后，首页的科目也将进行切换'
          }).then(() => {
            this.subjectList.forEach(v => {
              v.child.forEach(c => {
                this.$set(c,'check',false)
              })
            })
            this.$set(item, 'check', true)
            localStorage.setItem("currentSubjectTypeName", item.subjectName);
            localStorage.setItem("currentSubjectType", item.subjectType);
          }).catch(() => {

          })
        }else {
          this.subjectList.forEach(v => {
            v.child.forEach(c => {
              this.$set(c,'check',false)
            })
          })
          this.$set(item, 'check', true)
        }

      },
      selectParent(item, index) {
        this.index = index
        if (item.active) return
        this.subjectList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        // this.$set(item.child[0],'check',true)
        // this.$emit('selectParent', index)
      },
    }
  }
</script>

<style lang="less" scoped>
  .res-filter-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      flex: 0 0 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      &-tab {
        flex: 1;
        text-align: center;
        position: relative;

        span {
          font-weight: bold;
          font-size: 18px;
          color: #666;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            color: @blue;
            font-size: 18px;
          }
        }

        .icon-close {
          font-size: 22px;
          color: #ccc;
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }


    }


    &__body {
      display: flex;
      flex: 1;

      &-left {
        flex: 0 0 95px;
        overflow-y: auto;

        > div {
          height: 44px;
          display: flex;
          justify-content: center;
          text-align: center;
          align-items: center;
          font-size: 15px;
          border-left: 2.5px solid transparent;

          &.active {
            color: @blue;
            border-left: 2.5px solid #16aab7;
          }
        }
      }

      &-right {
        flex: 1;
        overflow-y: auto;

        .tip {
          padding: 0 20px 10px;
        }

        .cell__item {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 14px;
          word-break: break-all;
          padding: 0 20px;

          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 6px 10px;

      .confirm-btn {
        width: 100%;
        color: #fff;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
</style>
