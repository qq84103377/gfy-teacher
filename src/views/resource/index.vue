<template>
  <section class="resource-wrap">
    <dropdown-header :list="courseList" :course-name="courseName" :tch-course-id="tchCourseId"
                     :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading"
                     :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh"
                     @selectCourse="selectCourse">
      <div slot="left" class="btn-left" @click="$router.push(`/addCourse`)">+ 新建课</div>
      <div slot="right" class="resource-wrap-header-right">
        <van-dropdown-menu active-color="none" class="edit-btn">
          <van-dropdown-item title="编辑" ref="dropdown">
<!--            <edit-course :is-edit="true"></edit-course>-->
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>

    </dropdown-header>
    <div class="resource-wrap__body">
      <van-cell class="fs16" title="微课" is-link @click="goto('/lessonList')"/>
      <van-cell class="fs16" title="素材" is-link @click="goto('/materialList')"/>
      <van-cell class="fs16" title="试卷" is-link @click="goto('/examList')"/>
      <van-cell class="fs16" title="试题" is-link @click="goto('/questionList')"/>
      <van-cell class="fs16" title="讨论" is-link @click="goto('/discussList')"/>
      <van-cell v-if="currentSubjectType === 'S03'" class="fs16" title="口语" is-link @click="goto('/spokenList')"/>
    </div>
  </section>
</template>

<script>
  import dropdownHeader from '../../components/dropdown-header'
  import {getClassTeachCourseInfo} from '@/api/index'

  export default {
    name: "index",
    components: {dropdownHeader},
    data() {
      return {
        courseList: [],
        dropdownPage: 0,
        dropdownListLoading: false,
        dropdownFinish: false,
        dropdownRefLoading: false,
        courseName: '',
        tchCourseId: '',
        sysCourseId: '',
        relationCourseId: '',
        subjectType: '',
        classId: '',
        tchClassCourseInfo: [],
        classGrade: '',
        tchCourseInfo:{}
      }
    },
    computed: {
      currentSubjectType() {
        return localStorage.currentSubjectType
      }
    },
    methods: {
      goto(path) {
        this.$store.commit("setTchCourseInfo", this.tchCourseInfo)
        const {tchCourseId,sysCourseId,relationCourseId,subjectType,classId,tchClassCourseInfo,classGrade,courseName} = this
        this.$router.push({path,query: {tchCourseId,sysCourseId,relationCourseId,subjectType,classId,tchClassCourseInfo,classGrade,courseName}})

      },
      selectCourse(tchCourseInfo, index) {
        this.tchCourseInfo = tchCourseInfo
        this.index = index
        this.courseName = tchCourseInfo.courseName
        this.tchCourseId = tchCourseInfo.tchCourseId
        this.sysCourseId = tchCourseInfo.sysCourseId
        this.relationCourseId = tchCourseInfo.relationCourseId
        this.subjectType = tchCourseInfo.subjectType
        this.classId = tchCourseInfo.tchClassCourseInfo[0].classId
        this.tchClassCourseInfo = tchCourseInfo.tchClassCourseInfo
        this.classGrade = tchCourseInfo.classGrade
      },
      async dropdownOnLoad() {
        this.dropdownPage++

        await this.getClassTeachCourseInfo()
      },
      async dropdownRefresh() {
        this.dropdownListLoading = false
        this.dropdownFinish = false
        this.dropdownPage = 1
        await this.getClassTeachCourseInfo()
        this.$toast('刷新成功')
      },
      async getClassTeachCourseInfo() {

        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "subjectType": localStorage.getItem("currentSubjectType"),
          "classGrade": "",
          "termType": "",
          "pageSize": "20",
          "courseType": "C01",
          "classId": "",
          "currentPage": this.dropdownPage
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getClassTeachCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading',false)
          this.dropdownListLoading = false
          this.dropdownRefLoading = false
          this.total = res.total
          if (res.flag) {
            this.courseList = this.dropdownPage === 1 ? res.data : this.courseList.concat(res.data)
            if (!this.courseName) {
              this.tchCourseInfo = this.courseList[0].tchCourseInfo
              //首次取第一条课程的信息
              this.courseName = this.courseList[0].tchCourseInfo.courseName
              this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId
              this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId
              this.relationCourseId = this.courseList[0].tchCourseInfo.relationCourseId
              this.subjectType = this.courseList[0].tchCourseInfo.subjectType
              this.classId = this.courseList[0].tchCourseInfo.tchClassCourseInfo[0].classId
              this.tchClassCourseInfo = this.courseList[0].tchCourseInfo.tchClassCourseInfo
              this.classGrade = this.courseList[0].tchCourseInfo.classGrade
            }
            if (this.dropdownPage >= res.total) {
              this.dropdownFinish = true
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
    },
    created() {
      this.$store.commit('setVanLoading',true)
      this.dropdownOnLoad()
    },
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .resource-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    &__header {
      flex: 0 0 55px;
      padding: 8px 9px;
      color: #16AAB7;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      .add-class {
        background: #e0fffc;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 66px;
        height: 27px;
        border-radius: 13px;
      }
      .dropdown-btn {
        background: #e0fffc;
        font-size: 14px;
        border-radius: 20px;
        width: 230px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 39px;
        &::after {
          border: none;
        }
        @{deep} .van-dropdown-menu__title{
          text-align: center;
          padding-right: 10px;
          width: 170px;
          display: inline-block;
          overflow : hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &::after {
            right: 6px;
            top: 6px;
            content: '';
          }
          &--down::after{
            top: 10px;
            content: '';
          }
        }
        @{deep} .van-dropdown-item__content {
          height: 95%;
          padding: 8px;
          display: flex;
          flex-direction: column;
          overflow-y: hidden;
        }
        .list-wrap{
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .folder-btn {
          width: 100%;
          flex: 0 0 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .resource-wrap-header-right {
      flex: 0 0 40px;
      .edit-btn {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        /*height: 39px;*/
        &::after {
          border: none;
        }
        @{deep} .van-overlay {
          top: 2px;
        }
        @{deep} .van-dropdown-menu__title{
          font-size: 10px;
          text-align: center;
          display: inline-block;
          color: #16AAB7;
          white-space: nowrap;
          .van-ellipsis {
            display: inline;
          }
          &::after {
            right: 6px;
            top: 6px;
            content: none;
          }
          &--down::after{
            top: 10px;
            content: none;
          }
          &::before {
            content: ' ';
            background: url('../../assets/img/icon-edit-blue.png') no-repeat;
            background-size: contain;
            width: 11px;
            height: 10px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
        @{deep} .van-dropdown-item__content {
          max-height: 95%;
          display: flex;
          flex-direction: column;
          overflow-y: hidden;
        }
      }
    }
    &__body {
      margin-top: 5px;
    }
  }
</style>
