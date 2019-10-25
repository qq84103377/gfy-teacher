<template>
  <!--    <section class="exam-filter-wrap"></section>-->
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="exam-filter-wrap">
<!--      <van-overlay-->
<!--        :show="all||personal||school||share"-->
<!--        @click="all = false;personal=false;school=false;share=false"/>-->

      <div class="exam-filter-wrap__header van-hairline--bottom">
        <div class="exam-filter-wrap__header-tab">
          <span>选择试卷</span>
          <van-icon class="icon-close" @click="show=false" name="close"/>
        </div>
      </div>
      <div class="exam-filter-wrap__dropdown van-hairline--bottom">
        <div v-for="(item , index) in shareList" :key="index" @click="getTeachCourseResDetail(item.code,1)">
          <div  :class="{blue:item.code == shareType}">{{item.name}}
<!--            <van-icon :name="all?'arrow-up':'arrow-down'"/>-->
          </div>
<!--          <div v-show="all" class="dropdown-menu">-->
<!--            <div class="dropdown-menu-item">上学期</div>-->
<!--            <div class="dropdown-menu-item">下学期</div>-->
<!--          </div>-->
        </div>
        <!--<div >-->
          <!--<div @click="personal=!personal;all=false;school=false;share=false" :class="{blue:personal}">个人-->
<!--&lt;!&ndash;            <van-icon :name="personal?'arrow-up':'arrow-down'"/>&ndash;&gt;-->
          <!--</div>-->
<!--&lt;!&ndash;          <div v-show="personal" class="dropdown-menu">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="dropdown-menu-item">上学期</div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="dropdown-menu-item">下学期</div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
        <!--</div>-->
        <!--<div>-->
          <!--<div @click="school=!school;personal=false;all=false;share=false" :class="{blue:school}">校内-->
<!--&lt;!&ndash;            <van-icon :name="school?'arrow-up':'arrow-down'"/>&ndash;&gt;-->
          <!--</div>-->
<!--&lt;!&ndash;          <div v-show="school" class="dropdown-menu">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="dropdown-menu-item">上学期</div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="dropdown-menu-item">下学期</div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
        <!--</div>-->
        <!--<div>-->
          <!--<div @click="share=!share;personal=false;school=false;all=false" :class="{blue:share}">共享-->
<!--&lt;!&ndash;            <van-icon :name="share?'arrow-up':'arrow-down'"/>&ndash;&gt;-->
          <!--</div>-->
<!--&lt;!&ndash;          <div v-show="share" class="dropdown-menu">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="dropdown-menu-item">上学期</div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="dropdown-menu-item">下学期</div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
        <!--</div>-->
      </div>
      <div class="exam-filter-wrap__body">
        <div class="exam-filter-wrap__body-right">
          <div class="" v-for="(item,index) in testPaperList" :key="index" @click="selectTest(item)">
<!--            <div class="course-first van-hairline&#45;&#45;bottom"><span>说和做——记闻一多先生言行片段asdasdasdsads</span>-->
<!--              <van-icon @click="$set(item,'fold',!item.fold)" class="down-arrow"-->
<!--                        :name="item.fold?'arrow-up':'arrow-down'"/>-->
<!--            </div>-->
            <div  :class="['course-sec',{active:item.testPaperId == currentTestPaperId}]">{{item.testPaperName}}
              <van-icon v-show="item.testPaperId == currentTestPaperId" class="check blue" name="success"/>
            </div>
          </div>
          <div v-if="!testPaperList.length" style="text-align: center;color: #999999">
            <img class="null-tips" style="width: 70%;" src="../assets/img/empty-2.png" alt />
            <div>当前无数据~</div>
          </div>
        </div>
      </div>
      <div class="exam-filter-wrap__footer">
        <van-button type="info" class="confirm-btn" @click="show=false;chooseTestPaper()">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import {teachApi} from '@/api/parent-GFY'

  export default {
    name: "examFilter",
    props: ['visible','testPaperId','testPaperName','tchCourseInfo'],
    data() {
      return {
        all: false,
        personal: false,
        school: false,
        share: false,
        shareType:'',
        shareList:[
          {"name":"全部", "code": ""},
          {"name":"个人", "code": "S01"},
          {"name":"校内", "code": "S02"},
          {"name":"共享", "code": "S03"}
        ],
        testPaperList:[],
        courseList: [{child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]}, {child: [{}, {}]},],
        refLoading: false,
        listLoading: false,
        finished: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        paperInfo:{},
        currentTestPaperId:this.testPaperId,
        currentTestPaperName:'',

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
      }
    },
    mounted(){

    },
    methods: {
      handleSelect(item) {
        this.courseList.forEach(v => {
          v.child.forEach(_v => {
            this.$set(_v,'check',false)
          })
        })
        this.$set(item,'check',!item.check)
      },
      handleUnit(item) {
        if (item.active) return
        this.unit.forEach(v => {
          v.active = false
        })
        item.active = true
      },
      async onLoad() {
        this.currentPage++
        if(this.currentPage > this.total && this.currentPage > 1) {
          return
        }
        this.getTeachCourseResDetail(this.shareType,this.currentPage)
      },
      async onRefresh() {
        this.finished = false
        this.currentPage = 1
        await this.getTeachCourseResDetail(this.shareType,this.currentPage)
        this.$toast('刷新成功')
      },
      getTeachCourseResDetail(code,pageNo){
        console.log("查询试卷",this.tchCourseInfo)
        if (!this.tchCourseInfo){
          this.$toast("课程信息错误")
          this.testPaperList = []
          return
        }
        this.shareType = code
        const page = pageNo
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "tchCourseId": this.tchCourseInfo.tchCourseId,
          "sysCourseId": this.tchCourseInfo.sysCourseId,
          "relationSeqId": this.tchCourseInfo.relationCourseId,
          "resourceType": "R02",
          "sourceName": "",
          "shareType": code,
          "pageSize": this.pageSize,
          "currentPage": pageNo,
          "schoolIdList":this.$store.getters.schoolIdList
        }
        let params ={
          requestJson: JSON.stringify(obj)
        }
        teachApi.getTeachCourseResDetail(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0] && res.data[0].testPaperInfo) {
            this.testPaperList = res.data[0].testPaperInfo
          } else {
            this.testPaperList = page === 1 ? [] : this.testPaperList.concat([])
            this.finished = true
          }
        })
      },
      selectTest(obj){
        this.paperInfo = obj
        this.currentTestPaperName = this.paperInfo.testPaperName
        this.currentTestPaperId = this.paperInfo.testPaperId
      },
      chooseTestPaper(){
        console.log("选择试卷", this.paperInfo);

        this.$emit('update:testPaperId', this.paperInfo.testPaperId)
        this.$emit('update:testPaperName', this.paperInfo.testPaperName)
      }
    }
  }
</script>

<style lang="less" scoped>
  .exam-filter-wrap {
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

          &-item {
            line-height: 44px;
            text-align: center;

            &.active {
              color: @blue;
            }
          }
        }
      }
    }

    &__body {
      display: flex;
      flex: 1;


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
          border-bottom: 1px solid #ebedf0;
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
    &__footer{
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
