<template>
  <section class="board-list">
    <div class="board-list__tab">
      <div @click="changeTab(false)" class="van-hairline--right" :class="{active:!tabIndex}">教师白板</div>
      <div @click="changeTab(true)" :class="{active:tabIndex}">学生白板</div>
    </div>
    <div class="board-list__body" ref="body">
      <van-pull-refresh v-show="!tabIndex" v-model="teacher.refLoading" @refresh="onRefresh">
        <div v-if="!teacher.listLoading && teacher.list.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/board_empty.png" alt />
        </div>
        <van-list v-model="teacher.listLoading" :finished="teacher.finished" :finished-text="teacher.list.length>0?'没有更多了':'当前没有白板～'" @load="onLoad"
                  :offset='80'>
          <van-swipe-cell v-for="(item,index) in teacher.list" :key="index" class="mgt10" style="background: #fff;">
            <div class="board-list__body__item">
              <img :src="item.ClassTeachingData.dataUrl" alt="">
              <div class="board-list__body__item-name"><span>{{item.ClassTeachingData.name}}</span><span>{{item.sendRangeName}}</span></div>
              <div class="board-list__body__item-time">{{item.ClassTeachingData.createDate}}</div>
            </div>
            <template slot="right">
              <van-button @click="handleDelete(item.ClassTeachingData,index)" style="background: #ccc;height: 100%;border: none;color: #fff" square text="删除" />
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
      <van-pull-refresh v-show="tabIndex" v-model="stu.refLoading" @refresh="onRefresh">
        <div v-if="!stu.listLoading && stu.list.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/preview/board_empty.png" alt />
        </div>
        <van-list v-model="stu.listLoading" :finished="stu.finished" :finished-text="stu.list.length>0?'没有更多了':'当前没有白板～'" @load="onLoad" :offset='80'>
          <van-swipe-cell v-for="(item,index) in stu.list" :key="index" class="mgt10" style="background: #fff;">
            <div class="board-list__body__item">
              <img :src="item.ClassTeachingData.dataUrl" alt="">
              <div class="board-list__body__item-name"><span>{{item.ClassTeachingData.name}}</span><span>{{item.sendRangeName}}</span></div>
              <div class="board-list__body__item-time">{{item.ClassTeachingData.createDate}}</div>
            </div>
            <template slot="right">
              <van-button @click="handleDelete(item.ClassTeachingData,index)" style="background: #ccc;height: 100%;border: none;color: #fff" square text="删除" />
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>

    </div>
  </section>
</template>

<script>
  import {deleteCourseSummitInfo} from '@/api/index'
  import {teachApi} from '@/api/parent-GFY'

  export default {
    name: "boardList",
    data() {
      return {
        tabIndex: this.$store.getters.getIsStuBoard,
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
        firstFlag: false // 首次加载学生白板
      }
    },
    beforeRouteLeave(to, from, next) {
      if(this.tabIndex) {
        this.teacher.scrollTop = this.$refs['body'].scrollTop
      }else {
        this.stu.scrollTop = this.$refs['body'].scrollTop
      }
      next();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$nextTick(() => {
          vm.$refs["body"].scrollTo(0, vm.tabIndex?vm.stu.scrollTop:vm.teacher.scrollTop);
        });
      });
    },
    methods: {
      changeTab(bol) {
        // this.tabIndex = index
        // if(this.tabIndex) {
        //   this.teacher.scrollTop = this.$refs['body'].scrollTop
        //   if(this.firstFlag) {
        //     this.$nextTick(() => {
        //       this.$refs['body'].scrollTo(0,this.stu.scrollTop)
        //     })
        //   }else {
        //     this.firstFlag = true
        //     this.onLoad()
        //   }
        // }else {
        //   this.stu.scrollTop = this.$refs['body'].scrollTop
        //   this.$nextTick(() => {
        //     this.$refs['body'].scrollTo(0,this.teacher.scrollTop)
        //   })
        // }
        this.$store.commit('setIsStuBoard',bol)
        this.$router.back()
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
          currentPage: page,
          classId: this.$route.query.classId,
          batchNo: this.$route.query.batchNo
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
        this.$dialog.confirm({
          title: '',
          message: '确定删除吗?'
        }).then(() => {
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
        }).catch(() => {
          // on cancel
        });
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

      &__item {
        padding: 10px;
        img {
          width: 100%;
          height: 204px;
        }
        &-name {
          margin-top: 9px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        &-time {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
  .null-tips {
    margin-top: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
</style>
