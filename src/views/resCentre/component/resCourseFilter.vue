<template>
  <!--    <section class="course-filter-wrap"></section>-->
  <van-popup
    :close-on-click-overlay="false"
    v-model="show"
    position="bottom"
    :style="{ height:'93%' }">
    <div class="course-filter-wrap">
      <div class="course-filter-wrap__header van-hairline--bottom">
        <div class="course-filter-wrap__header-tab">
          <span>课程</span>
        </div>
        <van-icon class="icon-close" @click="show=false" name="close"/>
      </div>
      <div class="course-filter-wrap__body">
        <div class="course-filter-wrap__body-left">
          <div :class="{'active':unitIndex ==index }" v-for="(item,index) in unitList" :key="index"
               @click="handleUnit(index)">
            {{item.nodeName}}
          </div>
        </div>
        <div class="course-filter-wrap__body-right">
          <div class="" v-for="(item,index) in courseList" :key="index">
            <div v-if="item.childNodeList && item.childNodeList.length>0">
              <div class="course-first van-hairline--bottom" @click="$set(item,'fold',!item.fold)"><span>{{item.nodeName}}</span>
                <van-icon class="down-arrow" v-show="item.childNodeList && item.childNodeList.length>0"
                          :name="item.fold?'arrow-up':'arrow-down'"/>
              </div>
              <div :class="['course-sec',{active:currentSysCourseId == c.courseId}]" v-show="item.fold"
                   @click="selectSysCourse(c.courseId,c.nodeName,item)"
                   v-for="(c,ci) in item.childNodeList" :key="ci">{{c.nodeName}}
                <van-icon v-show="currentSysCourseId == c.courseId" class="check blue" name="success"/>
              </div>
            </div>
            <div v-else>
              <div :class="['course-sec',{active:currentSysCourseId == item.courseId}]"
                   @click="selectSysCourse(item.courseId,item.nodeName)"><span>{{item.nodeName}}</span>
                <van-icon v-show="currentSysCourseId == item.courseId" class="check blue" name="success"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="course-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="handleSubmit">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {getTextBookCourseInfo} from '@/api/index'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "resCourseFilter",
    props: ['visible', 'sysCourseId','label'],
    data() {
      return {
        unitList: [],
        unitIndex: 0,
        subjectList: [],
        courseList: [],
        subjectName: localStorage.getItem("currentSubjectTypeName"),
        currentSysCourseId: this.sysCourseId,
        currentSysCourseName: '',
        subjectType: '',
        gradeTermId: '',
        textBookId: '',
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
    mounted() {
      eventBus.$off("changeVersion")
      eventBus.$on("changeVersion", ({textBookId,gradeTermId},obj) => {
        this.textBookId = textBookId
        this.gradeTermId = gradeTermId
        // if(obj) {
          //切换学年导致教材切换的时候
          this.subjectType = obj.subjectType
          this.getTextBookCourseInfo()
        // }else {
        //   if(this.subjectType) {
        //     //科目已经加载完毕
        //     this.getTextBookCourseInfo()
        //   }
        // }
      })
      // eventBus.$off("changeSubject")
      // eventBus.$on("changeSubject", (subjectType) => {
      //
      //   this.subjectType = subjectType
      //   if(this.gradeTermId) {
      //     //年级&教材已经加载完毕
      //     this.getTextBookCourseInfo()
      //   }
      // })
    },
    created() {
    },
    methods: {
      handleSelect(item) {
        this.courseList.forEach(v => {
          v.child.forEach(_v => {
            this.$set(_v, 'check', false)
          })
        })
        this.$set(item, 'check', !item.check)
      },
      handleUnit(index) {
        this.unitIndex = index;
        this.courseList = this.unitList[this.unitIndex].courseList
      },

      async getTextBookCourseInfo() {
        this.$store.commit('setVanLoading', true)
        this.unitIndex = 0
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "textBookId": this.textBookId,
          "gradeTermId": this.gradeTermId,
          "subjectType": this.subjectType
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }

        getTextBookCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          console.log("课程：", res)
          if (res.flag) {
            //重构数据
            let textBookList = res.resTextbookCourseInfoList
            if (textBookList) {
              //1.找出第一个节点
              let nodeId = "-1";
              for (let book of textBookList) {
                if (book.parentId == -1) {
                  nodeId = book.nodeId
                  break
                }
              }

              //2.获取左侧列表
              this.unitList = []
              let textBookMap = {}
              let list = []
              textBookList.forEach(item => {
                //按照parentId分组
                if (!textBookMap[item.parentId + '']) {
                  textBookMap[item.parentId + ''] = [item]
                } else {
                  textBookMap[item.parentId + ''].push(item)
                }
                if (item.parentId == nodeId) {
                  this.unitList.push(item)
                }
              })
              //3.组件每单元下的数据
              this.unitList.forEach(item => {
                let tmp = textBookMap[item.nodeId + '']
                if (tmp) {
                  tmp.forEach(obj => {
                    obj.childNodeList = textBookMap[obj.nodeId + '']
                  })
                  item.courseList = tmp
                }
              })
              this.courseList = (this.unitList[this.unitIndex]&&this.unitList[this.unitIndex].courseList)?this.unitList[this.unitIndex].courseList:[]
              //选默认值
              if(this.courseList.length) {
                const item = this.courseList[0]
                if(item.childNodeList && item.childNodeList.length>0) {
                    this.$set(item,'fold',true)
                    this.selectSysCourse(item.childNodeList[0].courseId,item.childNodeList[0].nodeName)
                }else {
                  this.$set(item,'fold',true)
                    this.selectSysCourse(item.courseId,item.nodeName)
                }
                this.$emit('update:label',this.currentSysCourseName)
                this.$emit('filter',this.currentSysCourseId)
              }else {
                this.$emit('update:label','')
                this.$emit('filter','')
              }
              // this.$emit('update:label',(this.unitList[this.unitIndex]&&this.unitList[this.unitIndex].courseList)?(this.unitList[this.unitIndex].nodeName+ this.currentSysCourseName):'' )

            }
          } else {
            // this.$toast(res.msg)
            this.courseList = []
            this.unitList = []
            this.unitIndex = 0
            this.selectSysCourse('','')
            this.$emit('filter',this.currentSysCourseId)
            // this.$emit('update:label',this.unitList[this.unitIndex]?(this.unitList[this.unitIndex].nodeName+ this.currentSysCourseName):'' )
            this.$emit('update:label',this.currentSysCourseName)

          }

        })
      },
      selectSysCourse(id, name) {
        this.currentSysCourseId = id
        this.currentSysCourseName = name
      },
      handleSubmit() {
        this.show = false
        this.$emit('filter',this.currentSysCourseId)
        // this.$emit('update:label',this.unitList[this.unitIndex]?(this.unitList[this.unitIndex].nodeName+ this.currentSysCourseName):'' )
        this.$emit('update:label',this.currentSysCourseName)
      },
    }
  }
</script>

<style lang="less" scoped>
  .course-filter-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;

    .mask {
      background: transparent;
    }

    &__header {
      flex: 0 0 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;

      &-tab {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin-right: 35px;
          font-size: 16px;
          color: #666;

          &:last-child {
            margin-right: 0;
          }

          &.active {
            color: @blue;
            font-size: 18px;
          }
        }
      }

      .icon-close {
        font-size: 22px;
        color: #ccc;
      }
    }

    &__dropdown {
      display: flex;
      flex: 0 0 44px;

      > div {
        flex: 1;
        font-size: 16px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #ccc;
        position: relative;
        min-width: 0;

        &:last-child {
          border-right: none;
        }

        .dropdown-menu {
          position: absolute;
          width: 100%;
          top: 44px;
          left: 0;
          z-index: 2;
          box-shadow: 0px 5px 9px 0px rgba(204, 204, 204, 1);
          color: #333;
          font-size: 14px;
          background: #fff;
          max-height: 220px;
          overflow-y: auto;

          &-item {
            line-height: 44px;
            text-align: center;

            &.active {
              color: @blue;
            }
          }
        }
      }

      .dropdown-title {
        min-width: 0;
        padding: 0 5px;
        display: flex;
        align-items: center;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }
        .arrow {
          margin-left: 3px;
        }
      }
    }

    &__body {
      display: flex;
      flex: 1;

      &-left {
        flex: 0 0 125px;
        overflow-y: auto;

        > div {
          line-height: 44px;
          color: #000;
          font-size: 15px;
          text-align: center;
          border-left: 3px solid transparent;

          &.active {
            border-left: 3px solid #16aab7;
            color: @blue;
          }
        }
      }

      &-right {
        flex: 1;
        overflow-y: auto;

        .course-first {
          height: 44px;
          display: flex;
          align-items: center;
          color: #000;
          font-size: 14px;
          padding-right: 10px;
          word-break: break-all;
          justify-content: space-between;

          .down-arrow {
            flex: 0 0 20px;
            text-align: right;
          }
        }

        .course-sec {
          justify-content: space-between;
          height: 44px;
          display: flex;
          align-items: center;
          color: #666;
          font-size: 12px;
          padding: 0 5px;
          word-break: break-all;

          .check {
            flex: 0 0 20px;
            text-align: right;
          }

          &.active {
            color: @blue;
          }

          &:last-child {
            border-bottom: 1px solid #ebedf0;
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
