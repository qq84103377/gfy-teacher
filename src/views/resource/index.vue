<template>
  <section class="resource-wrap">
    <dropdown-header ref='dropdown' v-show="courseList.length || firstFlag" :list="courseList" :course-name="courseName" :tch-course-id="tchCourseId" :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading" :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh" @selectCourse="selectCourse">
<!--      <div slot="left" class="btn-left" @click="$router.push(`/addCourse`)">+ 新建课</div>-->
<!--      <div slot="right" class="resource-wrap-header-right">-->
<!--        <van-dropdown-menu active-color="none" class="edit-btn">-->
<!--          <van-dropdown-item title="编辑" ref="dropdown">-->
<!--            <edit-course :is-edit="true" :editCourseInfo.sync="tchCourseInfo" class="editClass" @onFinish='toggle'></edit-course>-->
<!--          </van-dropdown-item>-->
<!--        </van-dropdown-menu>-->
<!--      </div>-->
      <div slot="left" class="fs14" @click="changeCourse(0)">上一课</div>
      <div slot="right" class="fs14" @click="changeCourse(1)">下一课</div>
    </dropdown-header>
    <div class="resource-wrap__body">
      <div v-if="!courseList.length && !firstFlag" class="empty-page">
        <img src="../../assets/img/preview/task_null.png" alt />
        <div class="grey9 fs12">当前没有课程,快去新建课程吧！</div>
        <div style="display: flex;justify-content: center;">
          <van-button class="add-course" type="info" @click="$router.push(`/addCourse`)">新建课</van-button>
        </div>
      </div>
      <div v-if="courseList.length || firstFlag">
        <van-cell class="fs16" :title="`微课(${handleCount('R01_1')})`" is-link @click="goto('/lessonList')" />
        <van-cell class="fs16" :title="`素材(${handleCount('R01_2')})`" is-link @click="goto('/materialList')" />
        <van-cell class="fs16" :title="`试卷(${handleCount('R02')})`" is-link @click="goto('/examList')" />
        <van-cell class="fs16" :title="`试题(${handleCount('R03')})`" is-link @click="goto('/questionList')" />
        <van-cell class="fs16" :title="`讨论(${handleCount('R04')})`" is-link @click="goto('/discussList')" />
        <van-cell v-if="currentSubjectType === 'S03'" class="fs16" :title="`口语(${handleCount('R08')})`" is-link @click="goto('/spokenList')" />
      </div>
    </div>
  </section>
</template>

<script>
import dropdownHeader from '../../components/dropdown-header'
import { getClassTeachCourseInfo, getCourseInfoResourceCount } from '@/api/index'
import editCourse from '../preview/addCourse'

export default {
  name: "index",
  components: { dropdownHeader ,editCourse},
  data() {
    return {
      courseList: [],
      dropdownPage: 0,
      dropdownListLoading: false,
      dropdownFinish: false,
      dropdownRefLoading: false,
      dropdownTotal: 0,
      courseName: '',
      tchCourseId: '',
      sysCourseId: '',
      relationCourseId: '',
      subjectType: '',
      classId: '',
      tchClassCourseInfo: [],
      classGrade: '',
      tchCourseInfo: {},
      resourceCount: [
        { resourceType: 'R01', resourceCount: 0 },
        { resourceType: 'R02', resourceCount: 0 },
        { resourceType: 'R03', resourceCount: 0 },
        { resourceType: 'R04', resourceCount: 0 },
        { resourceType: 'R08', resourceCount: 0 },
      ],
      firstFlag: true,
      currentTchCourseInfo: {},
      index: 0, //选中的课程index
      currCourse: this.$route.query.currCourse ? JSON.parse(JSON.stringify(this.$route.query.currCourse)) : '',  //预习跳过来才有的
      isfEducation: this.$route.query.isfEducation
    }
  },
  computed: {
    currentSubjectType() {
      return localStorage.currentSubjectType
    }
  },
   beforeRouteLeave(to, from, next) {
     if (this.$refs['dropdown']&&this.$refs['dropdown'].showDrop) {
      this.$refs['dropdown'].showDrop = false
      this.$refs['dropdown'].close()
      next(false)
    }else{
    next();
    }
  },
  methods: {
    // toggle(data) {
    //   this.$refs.dropdown.toggle()
    //   this.courseName = data
    //   this.dropdownRefresh()
    // },
    handleCount(resourceType) {
     return this.resourceCount.find(v => v.resourceType === resourceType)?this.resourceCount.find(v => v.resourceType === resourceType).resourceCount:0
    },
    getCourseInfoResourceCount() {
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "roleType": "A03",
        tchCourseInfoList: [{tchCourseId: this.tchCourseId,sysCourseId: this.sysCourseId}]
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getCourseInfoResourceCount(params).then(res => {
        this.$store.commit('setVanLoading', false)
        if(res.flag) {
          this.resourceCount = res.data[0].countViewList
        }
      })
    },
    async changeCourse(type) {
      if (type) {
        //下一题
        if (this.index >= this.courseList.length - 1) {
          // 当前课程已是列表的最后一个
          if (!this.dropdownFinish) {
            //还能加载下一页
            await this.dropdownOnLoad()
            this.index++
            this.courseName = this.courseList[this.index].tchCourseInfo.courseName
            this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId
            this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId
            this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId
            this.tchCourseInfo = this.courseList[this.index].tchCourseInfo
            // this.resourceCount = this.courseList[this.index].resourceCount
            this.getCourseInfoResourceCount()
          } else {
            //最后一页
            this.$toast('没有下一课了')
          }
        } else {
          this.index++
          this.courseName = this.courseList[this.index].tchCourseInfo.courseName
          this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId
          this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId
          this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId
          this.tchCourseInfo = this.courseList[this.index].tchCourseInfo
          // this.resourceCount = this.courseList[this.index].resourceCount
          this.getCourseInfoResourceCount()
        }

      } else {
        //上一题
        if (this.index <= 0) {
          // 当前课程已是列表的第一个
          this.$toast('没有上一课了')
        } else {
          this.index--
          this.courseName = this.courseList[this.index].tchCourseInfo.courseName
          this.tchCourseId = this.courseList[this.index].tchCourseInfo.tchCourseId
          this.sysCourseId = this.courseList[this.index].tchCourseInfo.sysCourseId
          this.relationCourseId = this.courseList[this.index].tchCourseInfo.relationCourseId
          this.tchCourseInfo = this.courseList[this.index].tchCourseInfo
          // this.resourceCount = this.courseList[this.index].resourceCount
          this.getCourseInfoResourceCount()
        }
      }
    },
    goto(path) {
      this.$store.commit("setTchCourseInfo", this.tchCourseInfo)
      const { tchCourseId, sysCourseId, relationCourseId, subjectType, classId, tchClassCourseInfo, classGrade, courseName } = this
      this.$router.push({ path, query: { tchCourseId, sysCourseId, relationCourseId, subjectType, classId, tchClassCourseInfo, classGrade, courseName , isfEducation:this.isfEducation} })

    },
    selectCourse(tchCourseInfo, index, resourceCount) {
      this.tchCourseInfo = tchCourseInfo
      // this.resourceCount = resourceCount

      this.index = index
      this.courseName = tchCourseInfo.courseName
      this.tchCourseId = tchCourseInfo.tchCourseId
      this.sysCourseId = tchCourseInfo.sysCourseId
      this.relationCourseId = tchCourseInfo.relationCourseId
      this.subjectType = tchCourseInfo.subjectType
      this.classId = tchCourseInfo.tchClassCourseInfo[0].classId
      this.tchClassCourseInfo = tchCourseInfo.tchClassCourseInfo
      this.classGrade = tchCourseInfo.classGrade
      this.getCourseInfoResourceCount()
    },
    async dropdownOnLoad() {
      this.dropdownPage++
      if (this.dropdownPage > this.dropdownTotal && this.dropdownPage > 1) {
        return
      }
      await this.getClassTeachCourseInfo()
      this.getCourseInfoResourceCount()
    },
    async dropdownRefresh() {
      this.dropdownListLoading = false
      this.dropdownFinish = false
      this.dropdownPage = 1
      await this.getClassTeachCourseInfo()
      this.getCourseInfoResourceCount()
      this.$toast('刷新成功')
    },
    async getClassTeachCourseInfo() {
      const page = this.dropdownPage

      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        // "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": "A02",
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "subjectType": this.isfEducation?'S20':localStorage.getItem("currentSubjectType"),
        "classGrade": "",
        "termType": "",
        "pageSize": "20",
        "courseType":this.isfEducation?'C02': "C01",
        "classId": "",
        "currentPage": page
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getClassTeachCourseInfo(params).then(res => {
        this.$store.commit('setVanLoading', false)
        this.dropdownListLoading = false
        this.dropdownRefLoading = false
        this.dropdownTotal = res.total
        if (res.flag && res.data && res.data[0]) {
          if (this.$route.query.from === 'preview') {
            const index = res.data.findIndex(v => v.tchCourseInfo.tchCourseId == this.currCourse.tchCourseInfo.tchCourseId && v.tchCourseInfo.sysCourseId == this.currCourse.tchCourseInfo.sysCourseId)
            console.log(index,"index")
            if (index > -1) {
              res.data.splice(index, 1)
            }
            if (page === 1) {
              res.data.unshift({ ...this.currCourse })
              this.courseList = res.data
            } else {
              this.courseList = this.courseList.concat(res.data)
            }
          }else {
            this.courseList = page === 1 ? res.data : this.courseList.concat(res.data)
          }

          if (!this.courseName) {
            this.tchCourseInfo = this.courseList[0].tchCourseInfo
            // this.resourceCount = this.courseList[0].resourceCount
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
          if (page >= res.total) {
            this.dropdownFinish = true
          }
        } else {
          this.courseList = page === 1 ? [] : this.courseList.concat([])
          this.dropdownFinish = true
        }
        this.firstFlag = false
      }).catch(err => {
        this.firstFlag = false
      })
    },
  },
  created() {
    this.$store.commit('setVanLoading', true)
    this.dropdownOnLoad()
  },
  activated() {
    if (this.tchCourseId) {
      this.getCourseInfoResourceCount()
    }
  },
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.resource-wrap {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  &__header {
    flex: 0 0 55px;
    padding: 8px 9px;
    color: #16aab7;
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
      @{deep} .van-dropdown-menu__title {
        text-align: center;
        padding-right: 10px;
        width: 170px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &::after {
          right: 6px;
          top: 6px;
          content: "";
        }
        &--down::after {
          top: 10px;
          content: "";
        }
      }
      @{deep} .van-dropdown-item__content {
        height: 95%;
        padding: 8px;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
      }
      .list-wrap {
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
      @{deep} .van-dropdown-menu__title {
        font-size: 10px;
        text-align: center;
        display: inline-block;
        color: #16aab7;
        white-space: nowrap;
        .van-ellipsis {
          display: inline;
        }
        &::after {
          right: 6px;
          top: 6px;
          content: none;
        }
        &--down::after {
          top: 10px;
          content: none;
        }
        &::before {
          content: " ";
          background: url("../../assets/img/icon-edit-blue.png") no-repeat;
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
        position: relative;
      }
    }
  }
  &__body {
    margin-top: 5px;
    .null-tips {
      margin-top: 50px;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 100%;
    }
    .add-course {
      width: 190px;
      height: 44px;
      border-radius: 22px;
      font-size: 16px;
      margin-top: 10px;
    }
  }
}
.editClass {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  // position: absolute;
}
</style>
