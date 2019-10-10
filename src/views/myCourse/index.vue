<template>
    <section class="my-course-list">
      <van-nav-bar
        title="我的课程"
        @click-left="$router.back()"
        left-arrow>
        <div slot="right" class="fs12 blue" @click="filterShow=true">筛选</div>
      </van-nav-bar>
      <div class="my-course-list__body">
        <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
          <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
            <list-item @clickTo="" class="mgt10" style="background: #fff;" :fold="item.fold"
                       @del="deleteTeachCourse(item,index)" v-for="(item,index) in list" :key="index"
                       :itemTitle="item.tchCourseInfo.courseName" :class-info-list="item.tchCourseInfo.tchClassCourseInfo"
                       :can-slide="true">
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$set(item,'fold',!item.fold)">
                  <i class="iconGFY icon-arrow" :class="{fold:item.fold}"></i>
                  <span>班级查看</span>
                </div>
                <div>
                  <i class="iconGFY icon-edit"></i>
                  <span>编辑</span>
                </div>
              </div>
            </list-item>
          </van-list>
        </van-pull-refresh>

      </div>
      <div class="my-course-list__footer van-hairline--top">
        <van-button class="add-course" type="info" @click="$router.push(`/addCourse`)">新建课</van-button>
      </div>

      <course-filter @confirm="(a,b,c) => {finished=false;currentPage=1;getClassTeachCourseInfo(a,b,c)}" :visible.sync="filterShow" :sysCourseId.sync="sysCourseId" type="myCourse"></course-filter>
    </section>
</template>

<script>
  import courseFilter from '../../components/courseFilter'
  import listItem from '../../components/list-item'
  import {getClassTeachCourseInfo, deleteTeachCourse} from '@/api/index'
    export default {
        name: "index",
      components: {listItem,courseFilter},
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
          }
      },
      methods: {
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
        async getClassTeachCourseInfo(classGrade='',termType='',classId='') {
          const page = this.currentPage
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
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
