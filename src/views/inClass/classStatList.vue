<template>
    <section class="class-stat-list">
      <div class="class-stat-list__body">
        <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
          <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
            <list-item @clickTo="$router.push(`/examDetail?type=1`)" class="mgt10" style="background: #fff;"
                       @del="handleDelete(item,index)" v-for="(item,index) in list" :key="index"
                       :itemTitle="item.taskName"
                       :can-slide="true">
              <div slot="desc">
                <div class="desc-bottom">
                  <div v-for="(c,ci) in item.tchClassTastInfo" :key="ci">{{handleClassName(c.classId)}}:{{c.startDate}} -- {{c.endDate}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="$router.push(`/statistic?type=inClass`)">
                  <i class="iconGFY icon-statistics"></i>
                  <span>{{item.tchClassTastInfo[0].finshCount}}/{{item.tchClassTastInfo[0].allCount}}</span>
                </div>
              </div>
            </list-item>
          </van-list>
        </van-pull-refresh>


      </div>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import {getClassTeachCourseInfo, getCourseTaskList, deleteCourseTask} from '@/api/index'
  export default {
        name: "classStatList",
    components: {listItem},
    data() {
      return {
        list: [],
        popShow: false,
        listLoading: false,
        refLoading: false,
        finished: false,
        currentPage: 0,
        total: 0,
      }
    },
    methods: {
      handleDelete(item, index) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": item.taskId,
          "tchCourseId": item.tchCourseId,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        deleteCourseTask(params).then(res => {
          if (res.flag) {
            this.list.splice(index, 1)
            this.$toast('删除成功')
          }
        })
      },
      handleClassName(id) {
        return this.$route.query.tchClassCourseInfo.find(v => v.classId === id).className
      },
      async onLoad() {
        this.currentPage++
        if (this.currentPage > this.total && this.currentPage > 1) {
          return
        }
        this.getList()
      },
      async onRefresh() {

        // this.listLoading = false
        this.finished = false
        this.currentPage = 0
        this.onLoad()
      },
      async getList() {
        const page = this.currentPage
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "tchCourseId": this.$route.query.tchCourseId,
          "taskType": 'T10',
          "pageSize": 10,
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
            this.list = page === 1 ? res.data[0].tchCourseTaskInfo : this.list.concat(res.data[0].tchCourseTaskInfo)

            //设置班级名称
            if (localStorage.getItem("classMap")) {
              let classMap = JSON.parse(localStorage.getItem("classMap"))
              this.list.forEach(item => {
                if (item.tchClassTastInfo) {
                  item.tchClassTastInfo.forEach(obj => {
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
  .class-stat-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      .desc-top {
        display: flex;
        margin: 3px 0;
        .iconGFY {
          margin-right: 5px;
        }
      }
      .desc-bottom {
        margin-top: 18px;
        display: flex;
        font-size: 12px;
        color: #666;
        .iconGFY {
          margin-right: 3px;
        }
        >div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
