<template>
  <section class="board-list">
    <div class="board-list__tab">
      <div @click="changeTab(0)" class="van-hairline--right" :class="{active:!tabIndex}">教师白板</div>
      <div @click="changeTab(1)" :class="{active:tabIndex}">学生白板</div>
    </div>
    <div class="board-list__body" ref="body">
      <van-pull-refresh v-show="!tabIndex" v-model="teacher.refLoading" @refresh="onRefresh">
        <van-list v-model="teacher.listLoading" :finished="teacher.finished" finished-text="没有更多了" @load="onLoad"
                  :offset='80'>
          <list-item @clickTo="goto(item.ClassTeachingData)" class="mgt10" style="background: #fff;"
                     @del="handleDelete(item.ClassTeachingData,index)" v-for="(item,index) in teacher.list" :key="index"
                     :itemTitle="item.ClassTeachingData.name"
                     :can-slide="true">
            <div slot="cover" class="cover"><img :src="item.ClassTeachingData.dataUrl" alt=""></div>
            <div slot="desc">
              <div class="desc-top">
                <i class="iconGFY"
                   :class="{'icon-personal':item.ClassTeachingData.shareType === 'S01','icon-school':item.ClassTeachingData.shareType === 'S02','icon-share':item.ClassTeachingData.shareType === 'S03'}"></i>
                <i class="iconGFY"
                   :class="{'icon-choice':item.ClassTeachingData.qualityType === 'Q01','icon-boutique':item.ClassTeachingData.qualityType === 'Q02'}"></i>
              </div>
              <div class="desc-bottom">
                <div v-if="item.ClassTeachingData.belongAccountName"><i class="iconGFY icon-feather"></i>{{item.ClassTeachingData.belongAccountName}}
                </div>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>
      <van-pull-refresh v-show="tabIndex" v-model="stu.refLoading" @refresh="onRefresh">
        <van-list v-model="stu.listLoading" :finished="stu.finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
          <list-item @clickTo="goto(item.ClassTeachingData)" class="mgt10" style="background: #fff;"
                     @del="handleDelete(item.ClassTeachingData,index)" v-for="(item,index) in stu.list" :key="index"
                     :itemTitle="item.ClassTeachingData.name"
                     :can-slide="true">
            <div slot="cover" class="cover"><img :src="item.ClassTeachingData.dataUrl" alt=""></div>
            <div slot="desc">
              <div class="desc-top">
                <i class="iconGFY"
                   :class="{'icon-personal':item.ClassTeachingData.shareType === 'S01','icon-school':item.ClassTeachingData.shareType === 'S02','icon-share':item.ClassTeachingData.shareType === 'S03'}"></i>
                <i class="iconGFY"
                   :class="{'icon-choice':item.ClassTeachingData.qualityType === 'Q01','icon-boutique':item.ClassTeachingData.qualityType === 'Q02'}"></i>
              </div>
              <div class="desc-bottom">
                <div v-if="item.ClassTeachingData.belongAccountName"><i class="iconGFY icon-feather"></i>{{item.ClassTeachingData.belongAccountName}}
                </div>
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
  import {deleteCourseSummitInfo} from '@/api/index'
  import {teachApi} from '@/api/parent-GFY'

  export default {
    name: "boardList",
    components: {listItem},
    data() {
      return {
        tabIndex: 0,
        teacher: {
          listLoading: false,
          refLoading: false,
          finished: false,
          currentPage: 0,
          total: 0,
          list: [],
          scrollTop: 0
        },
        stu: {
          listLoading: false,
          refLoading: false,
          finished: false,
          currentPage: 0,
          total: 0,
          list: [],
          scrollTop: 0
        },
      }
    },
    methods: {
      changeTab(index) {
        this.tabIndex = index
        if(this.tabIndex) {
          this.teacher.scrollTop = this.$refs['body'].scrollTop
          this.$nextTick(() => {
            this.$refs['body'].scrollTo(0,this.stu.scrollTop)
          })
        }else {
          this.stu.scrollTop = this.$refs['body'].scrollTop
          this.$nextTick(() => {
            this.$refs['body'].scrollTo(0,this.teacher.scrollTop)
          })

        }
      },
      goto(item) {
          let type = ''
          const t = item.dataUrl.substring(item.dataUrl.lastIndexOf('.') + 1).toLowerCase();
          if (t === 'ppt' || t === 'pptx') {
            type = 'ppt'
          } else if (t === 'doc' || t === 'docx') {
            type = 'doc'
          } else if (t === 'xls' || t === 'xlsx') {
            type = 'xls'
          } else if (t === 'pdf') {
            type = 'pdf'
          } else if (t == 'jpg' || t == 'png' || t == 'jpeg') {
            type = 'img'
          } else if (t == 'mp4' || t == 'mp3') {
            type = 'video'
          }
          this.$router.push({path: '/boardDetail', query: {data: item,type: 'board'}})
      },
      async onLoad() {
        if (this.tabIndex) {
          this.stu.currentPage++
          if (this.stu.currentPage > this.stu.total && this.stu.currentPage > 1) {
            return
          }
        } else {
          this.teacher.currentPage++
          if (this.teacher.currentPage > this.teacher.total && this.teacher.currentPage > 1) {
            return
          }
        }

        this.getList()
      },
      async onRefresh() {

        // this.listLoading = false
        if (this.tabIndex) {
          this.stu.finished = false
          this.stu.currentPage = 0
        } else {
          this.teacher.finished = false
          this.teacher.currentPage = 0
        }

        this.onLoad()
      },
      getList() {
        const page = this.tabIndex ? this.stu.currentPage : this.teacher.currentPage
        let obj = {
          interUser: 'runLfb',
          interPwd: '25d55ad283aa400af464c76d713c07ad',
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: this.$store.getters.schoolId,
          tchCourseId: this.$route.query.tchCourseId,
          resourceClass: 'C02',
          accountType: this.tabIndex ? 'A03' : 'A02',
          pageSize: 10,
          currentPage: page
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getCourseSummitInfo(params).then(res => {
          if (this.tabIndex) {
            this.stu.listLoading = false
            this.stu.refLoading = false
            this.stu.total = res.total
            if (res.flag && res.data && res.data[0]) {
              this.stu.list = page === 1 ? res.data : this.stu.list.concat(res.data)
              if (page >= res.total) {
                this.stu.finished = true
              }
            } else {
              this.stu.list = page === 1 ? [] : this.stu.list.concat([])
              this.stu.finished = true
            }
          } else {
            this.teacher.listLoading = false
            this.teacher.refLoading = false
            this.teacher.total = res.total
            if (res.flag && res.data && res.data[0]) {
              this.teacher.list = page === 1 ? res.data : this.teacher.list.concat(res.data)
              if (page >= res.total) {
                this.teacher.finished = true
              }
            } else {
              this.teacher.list = page === 1 ? [] : this.teacher.list.concat([])
              this.teacher.finished = true
            }
          }

        })
      },
      handleDelete(item, index) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "seqId": item.seqId,
          "tchCourseId": item.tchCourseId,
          "classId": item.classId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        deleteCourseSummitInfo(params).then(res => {
          if (res.flag) {
            if (this.tabIndex) {
              this.stu.list.splice(index, 1)
            } else {
              this.teacher.list.splice(index, 1)
            }
            this.$toast('删除成功')
          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  .board-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__tab {
      background: #fff;
      flex: 0 0 44px;
      display: flex;
      align-items: center;

      > div {
        flex: 1;
        color: #333;
        font-size: 16px;
        text-align: center;
        line-height: 44px;

        &.active {
          color: @blue;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      .cover {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        img{
          width: 100%;
          height: 100%;
        }
      }

      .desc-top {
        display: flex;
        margin: 3px 0;

        .iconGFY {
          margin-right: 5px;
        }
      }

      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;

        .iconGFY {
          margin-right: 3px;
        }

        > div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
