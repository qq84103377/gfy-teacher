<template>
    <section class="index-content-wrap">
      <van-overlay
        :show="subjectShow"
        @click="subjectShow = false"
        z-index="99"
      />
      <div class="index-content-wrap__header">
        <div id="gfy_dropdown">
          <div @click="subjectShow = true">
            <span>{{currentSubjectType}}</span>
            <van-icon class="fs16 black" name="arrow-down" />
          </div>

          <van-popup :overlay="false" v-model="subjectShow" get-container="#gfy_dropdown" class="score-pop">
            <div style="position: relative;">
              <div class="score-pop-wrap">
                <div class="score-pop-wrap__item" v-for="(value, key) in subjectTypeList" :key="key" @click="handleClosePop(key)">{{value}}</div>
              </div>
              <div class="parent">
                <div class="child"></div>
              </div>
            </div>
          </van-popup>

        </div>
        <i class="iconGFY icon-bell"></i>
      </div>
      <div class="index-content-wrap__body">
        <img src="../../assets/img/banner.png" alt="">
        <div class="index-content-wrap__body__main-icon">
          <div @click="$router.push(`/preview`)" class="index-content-wrap__body__main-icon-item">
            <div class="icon-wrap blue"><i class="iconGFY icon-book"></i></div>
            <div>预习</div>
          </div>
          <div @click="$router.push(`/inClass`)" class="index-content-wrap__body__main-icon-item">
            <div class="icon-wrap green"><i class="iconGFY icon-play"></i></div>
            <div>课中</div>
          </div>
          <div class="index-content-wrap__body__main-icon-item" @click="$router.push(`/resource`)">
            <div class="icon-wrap yellow"><i class="iconGFY icon-res"></i></div>
            <div>资源</div>
          </div>
          <div class="index-content-wrap__body__main-icon-item">
            <div class="icon-wrap orange"><i class="iconGFY icon-plus"></i></div>
            <div>更多</div>
          </div>
        </div>
        <div class="jcsb aic mgb10">
          <span class="fs16 black">未结束任务</span>
          <span class="blue fs12">查看更多></span>
        </div>
        <div v-for="item in taskList" :key="item.taskId"  class="index-content-wrap__body__unfinish-wrap">
          <list-item :fold="item.fold" :itemTitle="item.tastName" :test-paper-id="item.testPaperId" :taskType="item.tastType" :class-info-list="item.tchCourseClassInfo">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="$set(item,'fold',!item.fold)">
                <i class="iconGFY icon-arrow" :class="{fold:item.fold}"></i>
                <span>班级查看</span>
              </div>
              <div>
                <i class="iconGFY icon-edit"></i>
                <span>编辑</span>
              </div>
              <div>
                <i class="iconGFY icon-statistics"></i>
                <span>{{item.finishCount}}/{{item.allCount}}</span>
              </div>
            </div>
          </list-item>
        </div>

        <div class="divider-title">教学工具</div>
        <div class="icon-group">
          <div>
            <i class="iconGFY icon-user"></i>
            <span>我的班级</span>
          </div>
          <div>
            <i class="iconGFY icon-tv"></i>
            <span>我的课程</span>
          </div>
          <div>
            <i class="iconGFY icon-errors"></i>
            <span>错题集</span>
          </div>
          <div>
            <i class="iconGFY icon-res-plus"></i>
            <span>智能补强</span>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import { getUnFinishCourseTask,getMySchoolInfo } from '@/api/index'

  export default {
        name: "index",
      components: {listItem},
      data() {
          return {
            fold:false,
            subjectShow:false,
            taskList:[],
            subjectTypeList:{},
            currentSubjectType:''
          }
      },
    mounted() {
      this.getMySchoolInfo()

    },
    methods: {
        handleClosePop(key) {
          this.subjectShow = false
          this.currentSubjectType = this.subjectTypeList[key]
          localStorage.setItem("currentSubjectType", key);
        },
        getUnFinishCourseTask(){
          let obj = {
            operateAccountNo:this.$store.getters.getUserInfo.accountNo,
            currentPage:1,
            pageSize:2
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          getUnFinishCourseTask(params).then(res=>{
            console.log(res)
            if (res.flag){
              this.taskList = res.data;
              if (localStorage.getItem("classMap")){
                let classMap = JSON.parse(localStorage.getItem("classMap"))
                this.taskList.forEach(item=>{
                  if (item.tchCourseClassInfo){
                    item.tchCourseClassInfo.forEach(obj=>{
                      if (!classMap[obj.classId] || !classMap[obj.classId].className) {
                        obj['className'] = "--"
                      } else{
                        obj['className']= classMap[obj.classId].className
                      }
                    })
                  }
                })
              }
            } else{
              this.$toast(res.msg)
            }
          })
        },
        getMySchoolInfo(){
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "accountNo": this.$store.getters.getUserInfo.accountNo,
            "userType": "A02"
          };
          let params ={
            requestJson: JSON.stringify(obj)
          }

          getMySchoolInfo(params).then(res =>{
            console.log(res)
            if (res.flag){
              //重构数据
              if (!res.data){
                this.$toast("该老师未配置学校信息")
                return
              }
              let mySchool = res.data[0].mySchoolInfo
              if (!mySchool){
                this.$toast("该老师未配置学校信息")
                return
              }
              let schoolMap = {}
              let classMap = {}
              let hisClassMap={}
              let that = this
              mySchool.forEach(item=>{
                schoolMap[item.schoolId] = {
                  schoolId:item.schoolId,
                  schoolName:item.schoolName,
                  schoolType:item.schoolType
                }
                if (item.myClassInfo) {
                  item.myClassInfo.forEach(obj=>{
                    classMap[obj.classId] = obj
                    if (obj.teacherInfoList) {
                      obj.teacherInfoList.forEach(obj2=>{
                        that.subjectTypeList[obj2.subjectType] = obj2.subjectName
                      })

                    }
                  })
                }
                if (item.myHisClassInfo) {
                  item.myHisClassInfo.forEach(obj=>{
                    hisClassMap[obj.classId] = obj
                  })
                }
              })
              console.log(that.subjectTypeList)
              console.log(hisClassMap)
              console.log(classMap)
              console.log(schoolMap)
              for(let key in that.subjectTypeList){
                console.log("属性：" + key + ",值：" + that.subjectTypeList[key]);
                that.currentSubjectType = that.subjectTypeList[key];
                localStorage.setItem("currentSubjectType", key);
                break
              }

              console.log(that.currentSubjectType)
              localStorage.setItem("classMap", JSON.stringify(classMap))
              localStorage.setItem("hisClassMap", JSON.stringify(hisClassMap))
              localStorage.setItem("schoolMap", JSON.stringify(schoolMap))
              this.getUnFinishCourseTask()
            } else {
              this.$toast.error(res.msg)
            }
          })
        }
      }
    }
</script>

<style lang="less" scoped>
  .index-content-wrap {
    display: flex;
    flex-direction: column;
    &__header {
      flex: 0 0 44px;
      padding: 0 15px;
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: @black;
      #gfy_dropdown {
        position: relative;
        .score-pop {
          left: -10%;
          position: absolute;
          max-height: inherit;
          top: 140%;
          transform: none;
          overflow-y: inherit;
          box-shadow:0px 5px 9px 0px rgba(83,167,163,1);
          &-wrap {

            &__item {
              background: #fff;
              text-align: center;
              width: 108px;
              line-height: 44px;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
          }
          .parent {
              top: -10px;
              left: 50%;
            width: 0px;
            height: 0px;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent #eee;
            position: absolute;
              transform: translateX(-50%);
          }
          .child {
            width: 0px;
            height: 0px;
            border-width:0 9px 9px;
            border-style:solid;
            border-color:transparent transparent #fff;
            position: absolute;
            top: 1px;
            left: -9px;
          }
          /*&::after {*/
          /*  width: 0;*/
          /*  height: 0;*/
          /*  border-width: 0 10px 10px;*/
          /*  border-style: solid;*/
          /*  border-color: transparent transparent #fff;*/
          /*  content: ' ';*/
          /*  position: absolute;*/
          /*  top: -10px;*/
          /*  left: 50%;*/
          /*  transform: translateX(-50%);*/
          /*}*/
        }
      }
    }
    &__body {
      flex: 1;
      overflow-y: auto;
      padding: 10px 16px;
      >img {
        width: 100%;
        height: 150px;
        border-radius: 5px;
      }
      &__main-icon {
        display: flex;
        justify-content: space-around;
        margin: 18px 0 40px 0;
        &-item {
          flex: 0 0 45px;
          text-align: center;
          font-size: 12px;
          .icon-wrap {
            width: 100%;
            height: 45px;
            margin-bottom: 12px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            &.blue {
              background: linear-gradient(0deg,rgba(37,219,241,1),rgba(149,249,238,1));
            }
            &.green {
              background: linear-gradient(0deg,rgba(107,218,33,1),rgba(190,243,89,1));
            }
            &.yellow {
              background: linear-gradient(0deg,rgba(255,173,30,1),rgba(247,220,64,1));
            }
            &.orange {
              background: linear-gradient(0deg,rgba(232,118,35,1),rgba(252,164,99,1));
            }
          }
        }
      }
      &__unfinish-wrap {
        border: 1px solid #eee;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .divider-title{
        margin: 30px 0 15px;
        font-size: 16px;
        color: #333;
      }
      .icon-group{
        display: flex;
        padding-left: 10px;
        >div {
          margin-right: 15px;
          font-size: 12px;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
          i {
            width: 20px;
            height: 20px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
