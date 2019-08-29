<template>
  <section class="lecture-list">
    <div class="lecture-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
          <list-item @clickTo="goto(item.ClassTeachingData)" class="mgt10" style="background: #fff;"
                     @del="handleDelete(item.ClassTeachingData,index)" v-for="(item,index) in list" :key="index"
                     :itemTitle="item.ClassTeachingData.name" @up="moveItem(item.ClassTeachingData,index,0)"
                     @down="moveItem(item.ClassTeachingData,index,1)"
                     :can-slide="true" :up="index>0" :down="(list.length - 1) > index">
            <div slot="cover" class="cover"><i class="iconGFY" :class="handleIcon(item.ClassTeachingData)"></i></div>
            <div slot="desc">
              <div class="desc-top">
                <i class="iconGFY"
                   :class="{'icon-personal':item.ClassTeachingData.shareType === 'S01','icon-school':item.ClassTeachingData.shareType === 'S02','icon-share':item.ClassTeachingData.shareType === 'S03'}"></i>
                <i class="iconGFY"
                   :class="{'icon-choice':item.ClassTeachingData.qualityType === 'Q01','icon-boutique':item.ClassTeachingData.qualityType === 'Q02'}"></i>
              </div>
              <div class="desc-bottom">
                <div v-if="item.ClassTeachingData.belongAccountName"><i class="iconGFY icon-feather"></i>{{item.ClassTeachingData.belongAccountName}}</div>
                <div><i class="iconGFY icon-download"></i>{{item.ClassTeachingData.downCount}}</div>
                <div><i class="iconGFY icon-points"></i>{{item.ClassTeachingData.useCount}}</div>
                <div><i class="iconGFY icon-star"></i>{{item.ClassTeachingData.collectCount}}</div>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="lecture-list__footer">
      <van-button type="info" class="btn" @click="popShow=true">选择课件</van-button>
    </div>

    <ware-filter :visible.sync="popShow" @confirm="selectCourse"></ware-filter>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import wareFilter from '../../components/wareFilter'
  import {teachApi} from '@/api/parent-GFY'
  import {deleteCourseSummitInfo, setDataTaskOrder, createCourseSummitInfoList} from '@/api/index'

  export default {
    name: "lectureList",
    components: {listItem, wareFilter},
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
      selectCourse(tchClassTeachingDataList) {
        if(tchClassTeachingDataList.length) {
          this.$store.commit('setVanLoading', true)
          let obj = {
            interUser: 'runLfb',
            interPwd: '25d55ad283aa400af464c76d713c07ad',
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            tchClassTeachingDataList
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          createCourseSummitInfoList(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if(res.flag) {
              this.$refs['body'].scrollTo(0,0)
              this.$toast('添加成功!')
              this.onRefresh()
            }else {
              this.$toast(res.msg)
            }
          })
        }
      },
      goto(item) {
        if (item.resourceType === 'R01') {
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
          this.$router.push({path:'/boardDetail',query:{data:item}})

        }
      },
      moveItem(item, index, type) {
        const tarSeqId = this.list[type?index+1:index-1].ClassTeachingData.seqId
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "oldSeqId": item.seqId,
          tarSeqId,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        setDataTaskOrder(params).then(res => {
          if (res.flag) {
            this.list[index] = this.list.splice(type?index+1:index-1,1,this.list[index])[0]
            this.$toast(`${type?'下':'上'}移成功`)
          }else {
            this.$toast(res.msg)
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
            this.list.splice(index, 1)
            this.$toast('删除成功')
          }
        })
      },
      handleIcon(item) {
        if (item.resourceType === 'R01') {
          const t = item.dataUrl.substring(item.dataUrl.lastIndexOf('.') + 1).toLowerCase();
          if (t === 'ppt' || t === 'pptx') {
            return 'icon-ppt'
          } else if (t === 'doc' || t === 'docx') {
            return 'icon-doc'
          } else if (t === 'xls' || t === 'xlsx') {
            return 'icon-xls'
          } else if (t === 'pdf') {
            return 'icon-pdf'
          } else if (t == 'jpg' || t == 'png' || t == 'jpeg') {
            return 'icon-img'
          } else if (t == 'mp4' || t == 'mp3') {
            return 'icon-video'
          }
        } else {
          //试卷
          return 'icon-exam-100'
        }
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
          interUser: 'runLfb',
          interPwd: '25d55ad283aa400af464c76d713c07ad',
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: this.$store.getters.schoolId,
          tchCourseId: this.$route.query.tchCourseId,
          resourceClass: 'C01',
          pageSize: 10,
          currentPage: this.currentPage
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getCourseSummitInfo(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0]) {
            this.list = page === 1 ? res.data : this.list.concat(res.data)
            if (page >= res.total) {
              this.finished = true
            }
          } else {
            this.list = page === 1 ? [] : this.list.concat([])
            this.finished = true
          }
        })
      }
    },
    created() {

    }
  }
</script>

<style lang="less" scoped>
  .lecture-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

      .cover {
        background: #F3D233;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
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

        > div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
    }

    &__footer {
      background: #fff;
      flex: 0 0 55px;
      padding: 5px 10px;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 18px;
      }
    }
  }
</style>
