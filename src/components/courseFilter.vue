<template>
  <!--    <section class="course-filter-wrap"></section>-->
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '93%' }">
    <div class="course-filter-wrap">
      <van-overlay
        class-name="mask"
        :show="gradeDropdown||termDropdown||versionDropdown"
        @click="gradeDropdown = false;termDropdown=false;versionDropdown=false"/>

      <div class="course-filter-wrap__header van-hairline--bottom">
        <div v-if="type==='myCourse'" class="course-filter-wrap__header-tab">
          <span :class="{active:item.active}" v-for="(item, index) in subjectList" :key="index">{{item.value}}</span>
        </div>
        <div v-else class="course-filter-wrap__header-tab">
          <span>{{subjectName}}</span>
        </div>
        <van-icon class="icon-close" @click="show=false" name="close"/>
      </div>
      <div class="course-filter-wrap__dropdown van-hairline--bottom">
        <div>
          <div @click="gradeDropdown=!gradeDropdown" v-if="classGradeList.length>0">{{classGradeList[gradeIndex].classGrade|getGradeName}}
            <van-icon :name="gradeDropdown?'arrow-up':'arrow-down'"/></div>
          <div v-show="gradeDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" :class="{active: gradeIndex== index}" v-for="(item,index) in classGradeList" :key="index" @click="changeGrade(index)">{{item.classGrade|getGradeName}}
              <van-icon v-show="gradeIndex == index " class="check blue" name="success"/>
            </div>

          </div>
        </div>
        <div >
          <div @click="termDropdown=!termDropdown">{{termTypeList[termIndex]|getTermName}}
            <van-icon :name="termDropdown?'arrow-up':'arrow-down'"/></div>
          <div v-show="termDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" @click="changeTermType(index)" :class="{active: termIndex== index}" v-for="(item,index) in termTypeList" :key="index">{{item|getTermName}}
              <van-icon v-show="termIndex== index " class="check blue" name="success"/>
            </div>
          </div>
        </div>
        <div>
          <div @click="versionDropdown=!versionDropdown" v-if="bookInfoList.length>0">{{bookInfoList[bookIndex].textBookName}}
            <van-icon :name="versionDropdown?'arrow-up':'arrow-down'"/></div>
          <div v-show="versionDropdown" class="dropdown-menu">
            <div class="dropdown-menu-item" :class="{active: bookIndex== index}"v-for="(item ,index) in bookInfoList" :key="index">{{item.textBookName}}
              <van-icon v-show="bookIndex== index " class="check blue" name="success"/>
            </div>

          </div>
        </div>
      </div>
      <div class="course-filter-wrap__body">
        <div class="course-filter-wrap__body-left">
          <div :class="{'active':unitIndex ==index }" v-for="(item,index) in unitList" :key="index" @click="handleUnit(index)">
            {{item.nodeName}}
          </div>
        </div>
        <div class="course-filter-wrap__body-right">
          <div class="" v-for="(item,index) in courseList" :key="index">
            <div v-if="item.childNodeList && item.childNodeList.length>0">
              <div class="course-first van-hairline--bottom" @click="$set(item,'fold',!item.fold)"><span>{{item.nodeName}}</span>
                <van-icon  class="down-arrow" v-show="item.childNodeList && item.childNodeList.length>0"
                           :name="item.fold?'arrow-up':'arrow-down'"/>
              </div>
              <div  :class="['course-sec',{active:currentSysCourseId == c.courseId}]" v-show="item.fold" @click="selectSysCourse(c.courseId,c.nodeName)"
                    v-for="(c,ci) in item.childNodeList" :key="ci">{{c.nodeName}}
                <van-icon v-show="currentSysCourseId == c.courseId" class="check blue" name="success"/>
            </div>
            </div>
            <div v-else>
              <div :class="['course-sec',{active:currentSysCourseId == item.courseId}]" @click="selectSysCourse(item.courseId,item.nodeName)"><span>{{item.nodeName}}</span>
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
  import {getTextBookCourseInfo,getGradeTermInfo} from '@/api/index'

  export default {
    name: "courseFilter",
    props: ['visible','sysCourseId','type'],
    data() {
      return {
        gradeDropdown: false,
        termDropdown: false,
        versionDropdown: false,
        unit: [{name: '语文', active: false}, {name: '语文', active: false}, {name: '语文', active: false}, {
          name: '语文',
          active: false
        },],
        unitList:[],
        unitIndex:0,
        subjectList: [],
        // subjectList: {'S01':'语文','S02':'数学'},
        courseList:[],
        //sysCourseId:'',
        termTypeList:[],
        termIndex:0,
        gradeTermList: this.$store.getters.getGradeTermInfo,
        subjectName: localStorage.getItem("currentSubjectTypeName"),
        classGradeMap:[],
        gradeIndex:0,
        textBookList:[],
        bookIndex:0,
        currentSysCourseId:this.sysCourseId,
        currentSysCourseName:'',
        isDeploy:false,
        classGradeList:[],
        bookInfoList:[],
        isNowTerm:0,
        gradeTermMap:''
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

      //获取上下学期
      let now = new Date();
      let month = now .getMonth();
      if (7 >= month && month >= 2){
        this.isNowTerm = 1
      } else{
        this.isNowTerm = 0
      }
      //学科信息获取
      if (localStorage.getItem("deployList")){
        this.classGradeList = JSON.parse(localStorage.getItem("deployList"))
        this.bookInfoList = this.classGradeList[this.gradeIndex].bookInfo
        this.termTypeList = this.classGradeList[this.gradeIndex].termInfo
        if (this.termTypeList && this.termTypeList.length > 1) {
          if (this.isNowTerm === 1){
            this.termTypeList.forEach((item,index)=>{
              if (item == "T02") {
                this.termIndex = index
              }
            })
          } else {
            this.termTypeList.forEach((item,index)=>{
              if (item == "T01") {
                this.termIndex = index
              }
            })
          }
        } else {
          this.termIndex = 0
        }
        this.isDeploy = true;
      } else {
        this.$toast("未配置年级学科信息")
      }

      if (localStorage.getItem('gradeTermMap')){
        this.gradeTermMap = JSON.parse(localStorage.getItem("gradeTermMap"))
      } else{
        this.$toast("年级信息错误")
      }
      if(this.isDeploy){
        this.getTextBookCourseInfo()
      }
    },
    created(){
      for(let key in JSON.parse(localStorage.getItem("subjectTypeList"))) {
        this.subjectList.push({
          key,
          value:JSON.parse(localStorage.getItem("subjectTypeList"))[key],
        })
      }
      this.$set(this.subjectList[0],'active',true)
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
      handleSubject(item) {
        if (item.active) return
        this.subjectList.forEach(v => {
          v.active = false
        })
        item.active = true
      },
      handleUnit(index) {
        this.unitIndex = index;
        this.courseList = this.unitList[this.unitIndex].courseList
      },

      async getTextBookCourseInfo(){
        this.unitIndex = 0
        this.bookIndex = 0
        this.unitList = []
        this.courseList = []
        //年级计算
        let key = this.classGradeList[this.gradeIndex].classGrade + "_" + this.termTypeList[this.termIndex];
        let gradeId = this.gradeTermMap[key]

        if (!this.bookInfoList || !this.bookInfoList[this.bookIndex].textBookId){
          this.$toast("版本配置错误")
          return
        }
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "textBookId": this.bookInfoList[this.bookIndex].textBookId,
          "gradeTermId": gradeId,
          "subjectType": localStorage.getItem("currentSubjectType")
        }
        let params ={
          requestJson: JSON.stringify(obj)
        }

        getTextBookCourseInfo(params).then(res=>{
          console.log("课程：" ,res)
          if (res.flag){
            //重构数据
            let textBookList = res.resTextbookCourseInfoList
            if (textBookList){
              //1.找出第一个节点
              let nodeId = "-1";
              for (let book of textBookList){
                if (book.parentId == -1) {
                  nodeId = book.nodeId
                  break
                }
              }

              //2.获取左侧列表
              this.unitList =[]
              let textBookMap ={}
              let list = []
              textBookList.forEach(item=>{
                //按照parentId分组
                if (!textBookMap[item.parentId+'']){
                  textBookMap[item.parentId+'']= [item]
                } else {
                  textBookMap[item.parentId+''].push(item)
                }
                if (item.parentId == nodeId) {
                  this.unitList.push(item)
                }
              })
              //3.组件每单元下的数据
              this.unitList.forEach(item=>{
                let tmp = textBookMap[item.nodeId+'']
                if (tmp){
                  tmp.forEach(obj=>{
                    obj.childNodeList = textBookMap[obj.nodeId+'']
                  })
                  item.courseList = tmp
                }
              })
              this.courseList = this.unitList[this.unitIndex].courseList
            }
          } else {
            this.$toast(res.msg)
          }

        })
      },
      selectSysCourse(id,name){
        this.currentSysCourseId = id
        this.currentSysCourseName =name
      },
      changeTermType(index){
        this.termIndex = index
        this.termDropdown = !this.termDropdown
        this.getTextBookCourseInfo()
      },
      changeGrade(index){
        this.gradeIndex = index
        this.bookInfoList = this.classGradeList[index].bookInfo
        this.termTypeList =this.classGradeList[index].termInfo
        if (this.termTypeList && this.termTypeList.length > 1) {
          if (this.isNowTerm === 1){
            this.termTypeList.forEach((item,index)=>{
              if (item == "T02") {
                this.termIndex = index
              }
            })
          } else {
            this.termTypeList.forEach((item,index)=>{
              if (item == "T01") {
                this.termIndex = index
              }
            })
          }
        } else {
          this.termIndex = 0
        }

        this.bookIndex = 0
        this.gradeDropdown = !this.gradeDropdown
        this.getTextBookCourseInfo()
      },
      changeBook(index){
        this.bookIndex = index
        this.versionDropdown = !this.versionDropdown
        this.getTextBookCourseInfo()
      },
      handleSubmit(){
        this.show = false
        this.$emit('update:visible', false)
        this.$emit('update:sysCourseId', this.currentSysCourseId)
        this.$parent.handleSysCourse(this.currentSysCourseName,this.currentSysCourseId,this.classGradeList[this.gradeIndex].classGrade)
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
