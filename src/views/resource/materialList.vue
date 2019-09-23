<template>
    <section class="material-list-wrap">
      <div class="material-list-wrap__body">
        <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
          <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
            <list-item @clickTo="goto(item)" class="mgt10" style="background: #fff;" @del="modifyTeachCourseRes(item,index)" v-for="(item,index) in list" :key="index"
                       :itemTitle="item.coursewareName"
                       :can-slide="true">
              <div slot="badge"><i class="iconGFY" :class="{'icon-send': item.stateName}"></i></div>
              <div slot="cover" class="cover"><i class="iconGFY" :class="handleIcon(item)"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY" :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                  <i class="iconGFY" :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                  <div><i class="iconGFY icon-download"></i>{{item.downLoadCount}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="modifyTeachCourseRes(item,index,1)">
                  <van-icon :name="item.statusCd=='S02'?'closed-eye':'eye'" class="eye"></van-icon>
                  <span>{{item.statusCd=='S02'?'不':''}}可见</span>
                </div>
                <div @click="">
                  <i class="iconGFY icon-download-orange"></i>
                  <span>下载</span>
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
      <div class="material-list-wrap__footer">
        <van-button type="info" class="btn" @click="$router.push({path:'uploadWare',query:{tchCourseId:$route.query.tchCourseId,sysCourseId:$route.query.sysCourseId,relationCourseId:$route.query.relationCourseId,subjectType:$route.query.subjectType,classId:$route.query.classId,tchClassCourseInfo:$route.query.tchClassCourseInfo}})">上传课件</van-button>
        <van-button type="info" class="btn" @click="$router.push({path:'uploadImg',query:{tchCourseId:$route.query.tchCourseId,sysCourseId:$route.query.sysCourseId,relationCourseId:$route.query.relationCourseId,subjectType:$route.query.subjectType,classId:$route.query.classId,tchClassCourseInfo:$route.query.tchClassCourseInfo}})">上传图片</van-button>
      </div>
    </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import {teachApi} from '@/api/parent-GFY'
  import {modifyTeachCourseRes} from '@/api/index'
  import store from '../../store/store'
  export default {
        name: "materialList",
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
      if((from.path === '/uploadWare'|| from.path === '/uploadImg') && store.getters.getIsAddWare) {
        // 从上传页面返回 并且已经添加了课件 则需要刷新列表(只能通过这种方式刷新,如果通过activated钩子函数刷新会出错)
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
      handleIcon (item) {
        var t = item.srcUrl.substring(item.srcUrl.lastIndexOf('.') + 1).toLowerCase()
        if (t == 'ppt' || t == 'pptx') {
          t = 'icon-ppt'
        } else if (t == 'doc' || t == 'docx') {
          t = 'icon-doc'
        } else if (t == 'xls' || t == 'xlsx') {
          t = 'icon-xls'
        } else if (t == 'zip' || t == 'rar' || t == '7z') {
          // t = 'icon'
        } else if (t == 'pdf') {
          t = 'icon-pdf'
        } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
          t = 'icon-img'
        } else if (t == 'mp4' || t == 'mp3') {
          t = 'icon-video'
        } else {
          // t = 'unkown'
        }
        return t
      },
      goto(item) {
        this.$router.push({path:'/materialDetail',query:{data:item}})
      },
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
          "coursewareClassify": 'C03',
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
        this.$router.push(`/addTask?type=material_t=new`)
      },
    }
  }
</script>

<style lang="less" scoped>
  .material-list-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      .cover{
        background: #F3D233;
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
      flex: 0 0 55px;
      padding: 5px 10px;
      display: flex;
      .btn{
        flex: 1;
        border-radius: 22px;
        font-size: 16px;
        margin-right: 23px;
        &:last-child{
          margin-right: 0;
        }
      }
    }
  }
</style>
