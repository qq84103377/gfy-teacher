<template>
  <section class="preview-wrap">
    <dropdown-header :list="courseList" :course-name="courseName" :tch-course-id="tchCourseId" :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading" :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh" @selectCourse="selectCourse">
      <div v-if="$route.query.from==='course'" slot="left" class="fs14" style="color: #16AAB7" @click="changeCourse(0)">上一课</div>
      <div v-else slot="left" class="btn-left" @click="$router.push(`/addCourse`)">+ 新建课</div>
      <!--      <div slot="right" ><i class="iconGFY icon-edit-blue"></i> 编辑</div>-->
      <div v-if="$route.query.from==='course'" slot="right" class="fs14" style="color: #16AAB7" @click="changeCourse(1)">下一课</div>
      <div v-else slot="right" class="preview-wrap-header-right">
        <van-dropdown-menu active-color="none" class="edit-btn">
          <van-dropdown-item title="编辑" ref="dropdown">
            <edit-course :is-edit="true" :editCourseInfo.sync="currentTchCourseInfo" class="editClass"></edit-course>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>

    </dropdown-header>
    <div class="preview-wrap__body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && courseTaskList.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/task_null.png" alt />
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="courseTaskList.length>0?'没有更多了':'当前没有已发任务，快去新建任务吧！'" @load="onLoad" :offset='80'>
          <list-item :fold="item.fold" class="mgt10" style="background: #fff;" v-for="(item,index) in courseTaskList" @clickTo="goto(item)" :key="index" :can-slide="true" :top="courseTaskList.length>1 && index!=0" :up="courseTaskList.length>1 &&index!=0" :down="courseTaskList.length>1 &&index!=courseTaskList.length-1" :itemTitle="item.taskName" :test-paper-id="item.testPaperId" :taskType="item.taskType" :class-info-list="item.tchClassTastInfo" @up="moveTask(item,index,0)" @top="topTask(item,index)" @down="moveTask(item,index,1)" @del="delTask(item,index)">
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="$set(item,'fold',!item.fold)">
                <i class="iconGFY icon-arrow" :class="{fold:item.fold}"></i>
                <span>班级查看</span>
              </div>
              <div>
                <i class="iconGFY icon-edit"></i>
                <span>编辑</span>
              </div>
              <div @click="viewStat(item)">
                <i class="iconGFY icon-statistics"></i>
                <span>{{item.finishCount}}/{{item.allCount}}</span>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="preview-wrap__footer van-hairline--top">
      <van-button class="add-mission" type="info" @click="$router.push(`/resource`)">新建任务</van-button>
    </div>

    <!--    <edit-course></edit-course>-->
  </section>
</template>

<script>
import listItem from '../../components/list-item'
import dropdownHeader from '../../components/dropdown-header'
import editCourse from './addCourse'
import { pubApi } from '@/api/parent-GFY'
import {
  getClassTeachCourseInfo,
  getCourseTaskList,
  setCourseTaskOrder,
  topCourseTask,
  deleteCourseTask,
  getCourseTaskDetail
} from '@/api/index'

export default {
  name: "index",
  components: { listItem, dropdownHeader, editCourse },
  data() {
    return {
      show: false,
      list: [{ name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 }, { name: 1 },],
      courseList: [],
      courseTaskList: [],
      courseName: '',
      tchCourseId: '',
      termType: '',
      refLoading: false,
      listLoading: false,
      finished: false,
      currentPage: 0,
      pageSize: 10,
      dropdownPage: 1,
      dropdownRefLoading: false,
      dropdownListLoading: false,
      dropdownFinish: false,
      total: 0,
      currentTchCourseInfo: {},
      classGrade: '',
      sysCourseId: '',
      courseIndex: 0, //选中的课程index
      currCourse: this.$route.query.currCourse ? JSON.parse(JSON.stringify(this.$route.query.currCourse)) : ''  //我的课程跳过来才有的
    }
  },
  mounted() {
    // this.getClassTeachCourseInfo()
  },
  methods: {
    async changeCourse(type) {
      if (type) {
        //下一题
        if (this.courseIndex >= this.courseList.length - 1) {
          // 当前课程已是列表的最后一个
          if (!this.dropdownFinish) {
            //还能加载下一页
            await this.dropdownOnLoad()
            this.courseIndex++
            this.selectCourse(this.courseList[this.courseIndex].tchCourseInfo, this.courseIndex)
          } else {
            //最后一页
            this.$toast('没有下一课了')
          }
        } else {
          this.courseIndex++
          this.selectCourse(this.courseList[this.courseIndex].tchCourseInfo, this.courseIndex)
        }

      } else {
        //上一题
        if (this.courseIndex <= 0) {
          // 当前课程已是列表的第一个
          this.$toast('没有上一课了')
        } else {
          this.courseIndex--
          if (this.courseIndex > this.courseList.length - 1) {
            //如果跳转过来选中的课程的index超过首次加载第一页的数量,
          }
          this.selectCourse(this.courseList[this.courseIndex].tchCourseInfo, this.courseIndex)
        }
      }
    },
    goto(item) {
      if (item.taskType === 'T03') {
        if (item.resourceType === 'R03') {
          //单道试题
          this.$router.push(`/questionDetail?tchCourseId=${this.tchCourseId}&taskId=${item.taskId}&title=${item.taskName}`)
        } else {
          //试卷
          this.$router.push(`/examDetail?type=1&testPaperId=${item.testPaperId}&subjectType=${localStorage.getItem("currentSubjectType")}&classGrade=${this.classGrade}&title=${item.testPaperName}`)
        }
      } else if (['T04'].includes(item.taskType)) {
        // 学资源
        this.getCourseTaskDetail(item)
      } else if (['T01', 'T02'].includes(item.taskType)) {
        //微课   由于需要自动横屏全屏播放 暂时不弄
        this.getCourseTaskDetail(item)
      } else if (['T06'].includes(item.taskType)) {
        //讨论
        this.getCourseTaskDetail(item)
      } else if (['T13'].includes(item.taskType)) {
        //口语
        this.$router.push(`/spokenDetail?spokenId=${item.resourceId}&sysCourseId=${this.sysCourseId}`)
      }
    },
    getCourseTaskDetail(item) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        operateRoleType: 'A02',
        tchCourseId: this.tchCourseId,
        "taskId": item.taskId,
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getCourseTaskDetail(params).then(res => {
        if (res.flag) {
          console.log(item.tastType,"item.tastType");
          if (['T04'].includes(item.taskType)) {
            this.$router.push({ path: '/materialDetail', query: { data: res.data[0].courseware } })
          } else if (['T06'].includes(item.taskType)) {
            this.$router.push({ path: `/discussDetail`, query: { data: res.data[0].discussInfo } })
          } else if (['T01', 'T02'].includes(item.taskType)) {
            console.log(res.data[0], 'res.data[0]////////////');
            if (res.data[0] && res.data[0].courseware && res.data[0].courseware.srcUrl) {
              this.checkUrlPermission(res.data[0].courseware.srcUrl)
            }
          }
        }
      })
    },
    viewStat(item) {
      if (item.tchClassTastInfo.some(v => v.classId === 0)) {
        return this.$toast('任务班级已不在当前课程的班级中，无法查看任务统计！')
      }
      this.$store.commit('setVanLoading', true)
      this.$router.push({
        path: '/statistic',
        query: {
          info: item,
          testPaperId: item.testPaperId,
          termType: this.termType,
          tchCourseId: item.tchCourseId,
          taskId: item.taskId,
          taskType: item.taskType,
          resourceType: item.resourceType
        }
      })
      localStorage.setItem('stat', JSON.stringify(item))
    },
    async selectCourse(tchCourseInfo, index) {
      this.courseIndex = index
      this.currentTchCourseInfo = tchCourseInfo
      this.$store.commit('setVanLoading', true)
      this.currentPage = 1
      this.classGrade = tchCourseInfo.classGrade
      this.courseName = tchCourseInfo.courseName
      this.tchCourseId = tchCourseInfo.tchCourseId
      this.termType = tchCourseInfo.termType
      this.sysCourseId = tchCourseInfo.sysCourseId
      await this.getCourseTaskList(this.courseName, this.tchCourseId)
      this.$store.commit('setVanLoading', false)
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
    async onLoad() {
      this.currentPage++
      if (this.currentPage > this.total && this.currentPage > 1) {
        return
      }

      if (!this.courseList.length) {
        //首次加载
        await this.getClassTeachCourseInfo()
        if (this.$route.query.from === 'course') {
          this.courseName = this.$route.query.courseName
          this.classGrade = this.$route.query.classGrade
          this.sysCourseId = this.$route.query.sysCourseId
          this.tchCourseId = this.$route.query.tchCourseId
          this.termType = this.$route.query.termType
        } else {
          this.courseName = this.courseList[0].tchCourseInfo.courseName
          this.classGrade = this.courseList[0].tchCourseInfo.classGrade
          this.sysCourseId = this.courseList[0].tchCourseInfo.sysCourseId
          this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId
          this.termType = this.courseList[0].tchCourseInfo.termType
        }

      }
      this.getCourseTaskList(this.courseName, this.tchCourseId)
    },
    async onRefresh() {

      // this.listLoading = false
      this.finished = false
      this.currentPage = 1
      await this.getCourseTaskList(this.courseName, this.tchCourseId)
      this.$toast('刷新成功')
    },
    async getClassTeachCourseInfo() {
      const page = this.dropdownPage
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": "A02",
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "subjectType": localStorage.getItem("currentSubjectType"),
        "classGrade": this.$route.query.fltGrade || '',
        "termType": this.$route.query.fltTerm || '',
        "classId": this.$route.query.fltClassId || '',
        "pageSize": "20",
        "courseType": "C01",
        "currentPage": page
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getClassTeachCourseInfo(params).then(res => {
        this.dropdownListLoading = false
        this.dropdownRefLoading = false
        if (res.flag && res.data && res.data[0]) {
          if (this.$route.query.from === 'course') {
            const index = res.data.findIndex(v => v.tchCourseInfo.tchCourseId == this.$route.query.tchCourseId)
            if (index > -1) {
              res.data.splice(index, 1)
            }
            if (page === 1) {
              console.log(this.currCourse, 'this.$route.query.currCoursethis.$route.query.currCourse');
              res.data.unshift({ ...this.currCourse })
              this.courseList = res.data
            } else {
              this.courseList = this.courseList.concat(res.data)
            }
            // this.courseList = page === 1 ? res.data.unshift(...this.$route.query.currCourse) : this.courseList.concat(res.data)

          } else {
            this.courseList = page === 1 ? res.data : this.courseList.concat(res.data)
          }
          this.currentTchCourseInfo = this.courseList[0].tchCourseInfo
          if (page >= res.total) {
            this.dropdownFinish = true
          }
        } else {
          this.courseList = page === 1 ? [] : this.courseList.concat([])
          this.dropdownFinish = true
        }
      })
    },
    async getCourseTaskList(name, id) {
      const page = this.currentPage
      let obj = {
        "interUser": "runLfb",
        "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": "A02",
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "tchCourseId": this.tchCourseId,
        "pageSize": this.pageSize,
        "currentPage": this.currentPage
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getCourseTaskList(params).then(res => {
        this.listLoading = false
        this.refLoading = false
        this.total = res.total
        if (res.flag && res.data && res.data[0]) {
          this.courseTaskList = page === 1 ? res.data[0].tchCourseTaskInfo : this.courseTaskList.concat(res.data[0].tchCourseTaskInfo)

          //设置班级名称
          if (localStorage.getItem("classMap")) {
            let classMap = JSON.parse(localStorage.getItem("classMap"))
            this.courseTaskList.forEach(item => {
              let finishCount = 0
              let allCount = 0
              if (item.tchClassTastInfo) {
                item.tchClassTastInfo.forEach((obj, i) => {
                  if (i == 0) {
                    //跳转到任务统计页面时自动将第一个班级设置为选中状态
                    obj.active = true
                  }
                  finishCount += obj.finshCount
                  allCount += obj.allCount
                  if (!classMap[obj.classId] || !classMap[obj.classId].className) {
                    obj['className'] = "--"
                  } else {
                    obj['className'] = classMap[obj.classId].className
                  }
                })
              }
              item.finishCount = finishCount
              item.allCount = allCount
            })
          }
          if (this.currentPage >= res.total) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          this.courseTaskList = page === 1 ? [] : this.courseTaskList.concat([])
          this.finished = true
        }
      })
    },
    moveTask(item, index, type) {
      const tarTaskId = this.courseTaskList[type ? index + 1 : index - 1].taskId
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "tarTaskId": tarTaskId,
        "oldTaskId": item.taskId
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      setCourseTaskOrder(params).then(res => {
        if (res.flag) {
          this.courseTaskList[index] = this.courseTaskList.splice(type ? index + 1 : index - 1, 1, this.courseTaskList[index])[0]
          this.$toast(`${type ? '下' : '上'}移成功`)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    topTask(item, index) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "tchCourseId": this.tchCourseId,
        "taskId": item.taskId
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      topCourseTask(params).then(res => {
        if (res.flag) {
          this.courseTaskList[index] = this.courseTaskList.splice(0, 1, this.courseTaskList[index])[0]
          this.$toast('置顶成功')
        } else {
          this.$toast(res.msg)
        }

      })
    },
    delTask(item, index) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "taskId": item.taskId,
        "tchCourseId": this.tchCourseId
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      deleteCourseTask(params).then(res => {
        if (res.flag) {
          this.courseTaskList.splice(index, 1)
          this.$toast('删除成功')
        } else {
          this.$toast(res.msg)
        }
      });
    },
    checkUrlPermission(url) {
      // 课件鉴权
      let permissionParams = {
        'interUser': 'runLfb',
        'interPwd': '25d55ad283aa400af464c76d713c07ad',
        'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
        'belongSchoolId': this.$store.getters.schoolId,
        'url': url,
        'sysTypeCd': 'S03'
      }
      this.$store.commit('setVanLoading', true)
      pubApi.checkUrlPermission({ requestJson: JSON.stringify(permissionParams) }).then((respone) => {
        this.$store.commit('setVanLoading', false)
        if (respone.flag) {
          if (this.type == 'office' || this.type == 'pdf') {
            if (url.indexOf('pubquanlang') > -1) {
              url = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl

            } else {
              url = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl
            }
          } else {
            url = respone.data[0].accessUrl
          }
        } else {
          url = ''
        }

        if (!url) {
          this.$toast('暂无资源')
          return
        }

        this.$router.push({ name: 'videoPage', query: { src: url } })
      }).catch(() => {
        this.$toast('资源错误')
      })

    }

  }

}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.preview-wrap {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;

  &__header {
    /*width: 100%;*/
    /*position: absolute;*/
    /*height: 55px;*/
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

  &__body {
    flex: 1;
    overflow-y: auto;
    /*padding-top: 55px;*/
  }

  &__footer {
    flex: 0 0 44px;
    padding: 4px 12px;

    .add-mission {
      width: 100%;
      border-radius: 22px;
    }
  }

  .preview-wrap-header-right {
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
        height: 95%;
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
      }
    }
  }
}

.editClass {
  height: 100%;
  width: 100%;
  position: absolute;
}

.null-tips {
  margin-top: 50px;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 100%;
}
</style>
