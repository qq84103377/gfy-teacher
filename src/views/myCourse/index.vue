<template>
  <section class="my-course-list">
    <van-nav-bar title="我的课程" @click-left="goBack" left-arrow>
      <div slot="right" class="fs12 blue" @click="filterShow=true">筛选</div>
    </van-nav-bar>
    <div class="my-course-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && list.length==0" class="empty-page">
          <img src="../../assets/img/preview/task_null.png" alt />
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="list.length?'没有更多了':'当前没有课程,快去新建吧!'" @load="onLoad" :offset='80'>
          <list-item @clickTo="goto(item)" class="mgt10" style="background: #fff;" :fold="item.fold" @del="deleteTeachCourse(item,index)" v-for="(item,index) in list" :key="index" :itemTitle="item.tchCourseInfo.courseName" :class-info-list="item.tchCourseInfo.tchClassCourseInfo" :can-slide="true">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="item.tchCourseInfo.tchClassCourseInfo.length>2?$set(item,'fold',!item.fold):''">
                <i class="iconGFY" :class="{fold:item.fold,'icon-arrow':item.tchCourseInfo.tchClassCourseInfo.length>2,'icon-arrow-grey':item.tchCourseInfo.tchClassCourseInfo.length<=2}"></i>
                <span>班级查看</span>
              </div>
              <div>
                <i class="iconGFY icon-edit"></i>
                <span @click="goEdit(item.tchCourseInfo)">编辑</span>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>
      <div v-if="!listLoading && !list.length" class="empty-btn">
        <van-button class="add-course" type="info" @click="$router.push(`/addCourse`)">新建课</van-button>
      </div>
    </div>
    <div v-if="list.length" class="my-course-list__footer van-hairline--top">
      <van-button class="add-course" type="info" @click="$router.push(`/addCourse`)">新建课</van-button>
    </div>

    <course-filter @confirm="(a,b,c) => {finished=false;currentPage=1;getClassTeachCourseInfo(a,b,c)}" :visible.sync="filterShow" :sysCourseId.sync="sysCourseId" type="myCourse"></course-filter>
  </section>
</template>

<script>
import courseFilter from '../../components/courseFilter'
import listItem from '../../components/list-item'
import { getClassTeachCourseInfo, deleteTeachCourse } from '@/api/index'
import eventBus from "@/utils/eventBus";

export default {
  name: "index",
  components: { listItem, courseFilter },
  data() {
    return {
      sysCourseId: '',
      filterShow: false,
      list: [],
      listLoading: false,
      refLoading: false,
      finished: false,
      currentPage: 0,
      total: 0,
      filterParams: {
        classGrade: '', termType: '', classId: ''
      },
      scrollTop: 0,
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.filterShow) {
      this.filterShow = false
      next(false)
    } else{
     this.scrollTop = this.$refs["body"].scrollTop;
    next();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        // vm.$refs["body"].scrollTo(0, vm.scrollTop);
        vm.$refs["body"].scrollTop = vm.scrollTop
      });
    });
  },
  mounted() {
    eventBus.$off("editMyCourse")
    eventBus.$on("editMyCourse", (data) => {
      this.onRefresh()
    })
  },
  methods: {
     goBack(){
          this.common.goBack(this)
        },
    goEdit(item) {
      this.$router.push({ path: '/editMyCourse', query: { currentTchCourseInfo: item } })
    },
    goto(item) {
      this.$router.push({        path: '/courseDetail', query: {
          // courseName: item.tchCourseInfo.courseName,
          tchCourseId: item.tchCourseInfo.tchCourseId,
          // classGrade: item.tchCourseInfo.classGrade,
          // sysCourseId: item.tchCourseInfo.sysCourseId,
          // termType: item.tchCourseInfo.termType,
          fltGrade: this.filterParams.classGrade,
          fltTerm: this.filterParams.termType,
          fltClassId: this.filterParams.classId,
          // currCourse: item
        }      })
    },
    deleteTeachCourse(item, index) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": 'A02',
        "tchCourseId": item.tchCourseInfo.tchCourseId,
        courseName: item.tchCourseInfo.courseName
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      deleteTeachCourse(params).then(res => {
        if (res.flag) {
          this.list.splice(index, 1)
          this.$toast('删除成功')
        } else {
          this.$toast(res.msg)
        }
      })
    },
    async onLoad() {
      this.currentPage++
      if (this.currentPage > this.total && this.currentPage > 1) {
        return
      }
      this.getClassTeachCourseInfo()
    },
    async onRefresh() {
      this.finished = false
      this.currentPage = 0
      this.onLoad()
    },
    async getClassTeachCourseInfo(classGrade = '', termType = '', classId = '') {
      this.filterParams = {
        classGrade, termType, classId
      }
      const page = this.currentPage
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        // "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": "A02",
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "subjectType": localStorage.getItem("currentSubjectType"),
        classGrade,
        termType,
        classId,
        "pageSize": "10",
        "courseType": "C01",
        "currentPage": page
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getClassTeachCourseInfo(params).then(res => {
        this.listLoading = false
        this.refLoading = false
        this.total = res.total
        if (res.flag && res.data.length) {
          this.list = page === 1 ? res.data : this.list.concat(res.data)
          // this.currentTchCourseInfo = this.courseList[0].tchCourseInfo
          if (page >= res.total) {
            this.finished = true
          }
        } else {
          this.list = page === 1 ? [] : this.list.concat([])
          this.finished = true
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.my-course-list {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  &__body {
    flex: 1;
    overflow-y: auto;
    .null-tips {
      margin-top: 50px;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 100%;
    }

    .empty-btn {
      width: 190px;
      margin: 0 auto;
      .add-course {
        width: 100%;
        border-radius: 22px;
      }
    }
  }
  &__footer {
    flex: 0 0 44px;
    padding: 4px 12px;

    .add-course {
      width: 100%;
      border-radius: 22px;
    }
  }
}
</style>
