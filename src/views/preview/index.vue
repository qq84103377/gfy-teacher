<template>
  <section class="preview-wrap">
    <dropdown-header :list="courseList" :course-name="courseName" :tch-course-id="tchCourseId"
                     :refLoading.sync="dropdownRefLoading" :listLoading.sync="dropdownListLoading"
                     :finished="dropdownFinish" @onLoad="dropdownOnLoad" @refresh="dropdownRefresh"
                      @selectCourse="selectCourse">
      <div slot="left" class="btn-left" @click="$router.push(`/addCourse`)">+ 新建课</div>
      <!--      <div slot="right" ><i class="iconGFY icon-edit-blue"></i> 编辑</div>-->

      <div slot="right" class="preview-wrap-header-right">
        <van-dropdown-menu active-color="none" class="edit-btn">
          <van-dropdown-item title="编辑" ref="dropdown">
            <edit-course :is-edit="true"></edit-course>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>

    </dropdown-header>
    <div class="preview-wrap__body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
          <list-item :fold="item.fold" class="mgt10" style="background: #fff;" v-for="(item,index) in courseTaskList"
                     :key="index" :can-slide="true" :itemTitle="item.taskName" :test-paper-id="item.testPaperId"
                     :taskType="item.taskType" :class-info-list="item.tchClassTastInfo">
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
                <span>{{item.tchClassTastInfo[0].finshCount}}/{{item.tchClassTastInfo[0].allCount}}</span>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="preview-wrap__footer van-hairline--top">
      <van-button class="add-mission" type="info">新建任务</van-button>
    </div>

    <!--    <edit-course></edit-course>-->
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import dropdownHeader from '../../components/dropdown-header'
  import editCourse from './addCourse'
  import {getClassTeachCourseInfo, getCourseTaskList} from '@/api/index'

  export default {
    name: "index",
    components: {listItem, dropdownHeader, editCourse},
    data() {
      return {
        show: false,
        list: [{name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1}, {name: 1},],
        courseList: [],
        courseIndex: 0,
        courseTaskList: [],
        courseName: '',
        tchCourseId: '',
        refLoading: false,
        listLoading: false,
        finished: false,
        currentPage: 0,
        pageSize: 10,
        dropdownPage: 1,
        dropdownRefLoading: false,
        dropdownListLoading: false,
        dropdownFinish: false,
        total: 0
      }
    },
    mounted() {
      // this.getClassTeachCourseInfo()
    },
    methods: {
      viewStat(item) {
        this.$router.push({path:'/statistic',query:{info:item}})
        localStorage.setItem('stat',JSON.stringify(item))
      },
      selectCourse(tchCourseInfo) {
        this.currentPage = 1
        this.courseName = tchCourseInfo.courseName
        this.tchCourseId = tchCourseInfo.tchCourseId
        this.getCourseTaskList(this.courseName, this.tchCourseId)
      },
      dropdownOnLoad() {
        this.dropdownPage++

        this.getClassTeachCourseInfo()
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
        if(this.currentPage > this.total && this.currentPage > 1) {
          return
        }

        if (!this.courseList.length) {
          //首次加载
          await this.getClassTeachCourseInfo()
          this.courseName = this.courseList[0].tchCourseInfo.courseName
          this.tchCourseId = this.courseList[0].tchCourseInfo.tchCourseId
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
          "classGrade": "",
          "termType": "",
          "pageSize": "20",
          "courseType": "C01",
          "classId": "",
          "currentPage": page
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getClassTeachCourseInfo(params).then(res => {
          this.dropdownListLoading = false
          this.dropdownRefLoading = false
          if (res.flag && res.data && res.data[0]) {
            this.courseList = page === 1 ? res.data : this.courseList.concat(res.data)
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
                if (item.tchClassTastInfo) {
                  item.tchClassTastInfo.forEach((obj,i) => {
                    if(i==0) {
                      //跳转到任务统计页面时自动将第一个班级设置为选中状态
                      obj.active = true
                    }
                    if (!classMap[obj.classId] || !classMap[obj.classId].className) {
                      obj['className'] = "--"
                    } else {
                      obj['className'] = classMap[obj.classId].className
                    }
                  })
                }
              })
            }
            if (this.currentPage >= res.total) {
              this.finished = true
            }else {
              this.finished = false
            }
          } else {
            this.courseTaskList = page === 1 ? [] : this.courseTaskList.concat([])
            this.finished = true
          }
        })
      }
    }

  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
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
            content: '';
          }

          &--down::after {
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
  }
</style>
