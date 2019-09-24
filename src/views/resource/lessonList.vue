<template>
  <section class="lesson-list">
    <div class="lesson-list__body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
          <list-item class="mgt10" style="background: #fff;" @del="modifyTeachCourseRes(item,index)" v-for="(item,index) in list" :key="index"
                     :itemTitle="item.coursewareName"
                     :can-slide="true">
            <div slot="badge"><i class="iconGFY" :class="{'icon-send': item.stateName}"></i></div>
            <div slot="cover" class="cover" :style="{'background':item.imageUrl?'none':'#67E0A3'}"><img v-if="item.imageUrl" :src="item.imageUrl" alt=""><i v-else class="iconGFY icon-video"></i></div>
            <div slot="desc">
              <div class="desc-top">
                <i class="iconGFY" :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                <i class="iconGFY" :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
              </div>
              <div class="desc-bottom">
                <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
              </div>
            </div>
                    <div slot="btn" class="btn-group van-hairline--top">
                      <div @click="modifyTeachCourseRes(item,index,1)">
                        <van-icon :name="item.statusCd=='S02'?'closed-eye':'eye'" class="eye"></van-icon>
                        <span>{{item.statusCd=='S02'?'不':''}}可见</span>
                      </div>
                      <div @click="sendTask(item)">
                        <i class="iconGFY icon-plane"></i>
                        <span>发任务</span>
                      </div>
                    </div>
          </list-item>

        </van-list>
      </van-pull-refresh>
    </div>
    <div class="lesson-list__footer">
      <van-button type="info" class="upload-btn" @click="$router.push({path:'uploadLesson',query:{tchCourseId:$route.query.tchCourseId,sysCourseId:$route.query.sysCourseId,relationCourseId:$route.query.relationCourseId,subjectType:$route.query.subjectType,classId:$route.query.classId,tchClassCourseInfo:$route.query.tchClassCourseInfo}})">上传微课</van-button>
    </div>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import {teachApi} from '@/api/parent-GFY'
  import {modifyTeachCourseRes} from '@/api/index'
  import store from '../../store/store'

  export default {
    name: "lessonList",
    components: {listItem},
    data () {
      return {
        list: [],
        listLoading: false,
        refLoading: false,
        finished: false,
        currentPage: 0,
        total: 0,
      }
    },
    beforeRouteEnter(to, from, next) {
      if(from.path === '/uploadLesson' && store.getters.getIsAddWare) {
        next(vm => {
          vm.listLoading = false
          vm.refLoading= false
          vm.finished= false
          vm.currentPage= 0
          vm.total= 0
          vm.$store.commit('setIsAddWare',false)
          vm.onLoad()
        })
      }else {
        next()
      }
    },
    methods: {
      modifyTeachCourseRes(item, index, type) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": 'A02',
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": 'R01',
          "resourceId": item.coursewareId,
          "statusCd": type?(item.statusCd=='S02'?'S01':'S02'):'S03'
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        modifyTeachCourseRes(params).then(res => {
          if (res.flag) {
            if(type) {
              item.statusCd = item.statusCd=='S02'?'S01':'S02'
            }else {
              this.list.splice(index, 1)
              this.$toast('删除成功')
            }
          }else {
            this.$toast(res.msg)
          }
        })
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
      getList() {
        const page = this.currentPage
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": 'R01',
          "shareType": '',
          "sourceName": "",
          "pageSize": "10",
          "coursewareClassify": 'C01|C04',
          "currentPage": page
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getTeachCourseResDetail(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0] && res.data[0].courseware && res.data[0].courseware.length) {
            this.list = page === 1 ? res.data[0].courseware : this.list.concat(res.data[0].courseware)
            if (page >= res.total) {
              this.finished = true
            }
          } else {
            this.list = page === 1 ? [] : this.list.concat([])
            this.finished = true
          }
        })
      },
      sendTask(obj){
        console.log("发任务：", obj.coursewareName)
        this.$store.commit('setResourceInfo', obj)
        this.$store.commit("setTaskClassInfo", '')
        this.$router.push(`/addTask?type=lesson&_t=new`)
      }
    }
  }
</script>

<style lang="less" scoped>
  .lesson-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      .cover{
        background: #67E0A3;
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
        margin-bottom: 6px;
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
        >div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
      .eye {
        color: #F89451;
      }
    }
    &__footer {
      padding: 5px 10px;
      flex: 0 0 55px;
      .upload-btn {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }
  }
</style>
