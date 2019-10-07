<template>
  <section class="spoken-list">
    <div class="spoken-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <van-list v-model="listLoading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset='80'>
          <list-item @clickTo="$router.push(`/spokenDetail?spokenId=${item.spokenId}&sysCourseId=${$route.query.sysCourseId}`)" class="mgt10" style="background: #fff;"
                     v-for="(item,index) in list" :key="index"
                     @del="modifyTeachCourseRes(item,index)" :itemTitle="item.spokenTitle" :can-slide="true">
            <div slot="badge"><i class="iconGFY" :class="{'icon-send': item.isSend==='S05'}"></i></div>
            <div slot="cover" class="cover"><i class="iconGFY icon-en"></i></div>
            <div slot="desc">
              <div class="desc-top">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
                </div>
              </div>
              <div class="desc-bottom">
                <div>难度: {{item.spokenDegree==='D01'?'容易':item.spokenDegree==='D02'?'中等':'困难'}}</div>
                <div>单词: {{item.wordCount}}</div>
                <div>句子: {{item.sentenceCount}}</div>
              </div>
            </div>
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="modify(item,true)">
                <i class="iconGFY icon-edit-orange"></i>
                <span>编辑</span>
              </div>
              <div @click="modify(item,false)">
                <i class="iconGFY icon-copy-orange"></i>
                <span>复制任务</span>
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

    <van-popup
      v-model="popShow"
      position="bottom">
      <div class="spoken-pop">
        <div class="spoken-pop__title">{{isEdit?'编辑':'复制'}}</div>
        <van-cell class="spoken-pop__cell">
          <div slot="title" class=" aic">
            <div><span class="red">*</span>名称:</div>
            <input class="pdlt10" style="flex: 1" v-model="form.name" type="text" maxlength="64"
                   placeholder="请输入名称,字数在64字内">
            <span class="red">{{64 - form.name.length}}</span>
            <van-icon v-show="form.name.length" @click="form.name = ''" class="clear" name="clear"/>
          </div>
        </van-cell>
        <van-cell v-if="isEdit" class="spoken-pop__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>口语难度:</span>
            <van-radio-group style="display: flex;" v-model="form.difficult">
              <van-radio name="D01" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                易
              </van-radio>
              <van-radio name="D02" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                中
              </van-radio>
              <van-radio name="D03" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                难
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-cell v-if="isEdit" class="spoken-pop__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>共享级别:</span>
            <van-radio-group style="display: flex;" v-model="form.share">
              <van-radio name="S01" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                仅自己
              </van-radio>
              <van-radio name="S02" class="mgr10"><i slot="icon" slot-scope="props"
                                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                校内
              </van-radio>
              <van-radio name="S03"><i slot="icon" slot-scope="props"
                                       :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                公开
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <div class="spoken-pop__footer">
          <van-button :loading="form.btnLoading" loading-text="提交" type="info" class="btn" @click="submit">提交
          </van-button>
        </div>
      </div>
    </van-popup>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import {teachApi} from "../../api/parent-GFY";
  import {
    modifyTeachCourseRes,
    getSpokenResourceSingle,
    addSpokenResource,
    addTeachCourseRes,
    addShareSpokenResource,
    modifySpokenResource,
    modifyShareSpokenResource
  } from '@/api/index'

  export default {
    name: "spokenList",
    components: {listItem},
    watch: {
      popShow(v) {
        if (!v) {
          this.form = {
            name: '',
            difficult: '',
            share: '',
            spokenId: '',
            btnLoading: false
          }
        }
      }
    },
    data() {
      return {
        popShow: false,
        isEdit: false,
        form: {
          name: '',
          difficult: '',
          share: '',
          spokenId: '',
          btnLoading: false
        },
        list: [],
        listLoading: false,
        refLoading: false,
        finished: false,
        currentPage: 0,
        total: 0,
      }
    },
    methods: {
      modify(item,bol) {
        if(bol) {
          //编辑
          this.form.share = item.shareType
          this.form.difficult = item.spokenDegree
        }
        this.isEdit = bol;
        this.popShow = true;
        this.form.spokenId = item.spokenId;
        this.form.name = item.spokenTitle
      },
      async submit() {
        if (!this.form.name) {
          return this.$toast('请输入名称')
        }
        this.form.btnLoading = true
        let obj = {
          "spokenId": this.form.spokenId,
          "belongSchoolId": this.$store.getters.schoolId,
          "courseId": this.$route.query.sysCourseId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        let res = await getSpokenResourceSingle(params)
        this.form.btnLoading = false
        if (this.isEdit) {
          this.edit(res)
        } else {
          this.copy(res)
        }
      },
      async edit(res) {
        this.form.btnLoading = true
        delete res.data[0].createDate
        let params = {
          requestJson: JSON.stringify({
            ...res.data[0],
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            knowledgePointId: res.data[0].shareSpokenResourceList[0].knowledgePointId,
            spokenTitle: this.form.name,
            shareType: this.form.share,
            spokenDegree: this.form.difficult,
          })
        }
        let response = await modifySpokenResource(params)
        if(response.flag) {
          let r = await modifyShareSpokenResource({
           requestJson: JSON.stringify({
              "interUser":"value",
              "interPwd":"value",
              "operateAccountNo":this.$store.getters.getUserInfo.accountNo,
              "belongSchoolId":this.$store.getters.schoolId,
              "shareId":res.data[0].shareSpokenResourceList[0].shareId,
              "spokenId":this.form.spokenId,
              "classGrade": res.data[0].shareSpokenResourceList[0].classGrade,
              "subjectType": res.data[0].shareSpokenResourceList[0].subjectType,
              "termType": res.data[0].shareSpokenResourceList[0].termType,
              "knowledgePointId": res.data[0].shareSpokenResourceList[0].knowledgePointId,
              "createAccountNo": res.data[0].shareSpokenResourceList[0].createAccountNo
            })
          })
          if(r.flag) {
            this.$toast('编辑成功')
            const index = this.list.findIndex(v => v.spokenId === this.form.spokenId)
            this.list[index].spokenTitle = this.form.name
            this.list[index].spokenDegree = this.form.difficult
            this.list[index].shareType = this.form.share
            this.popShow = false
          }else {
            this.$toast(r.msg)
          }
        }else {
          this.$toast(response.msg)
        }
        this.form.btnLoading = false
      },
      async copy(res) {
        this.form.btnLoading = true
        if (res.flag && res.data[0]) {
          delete res.data[0].createDate
          let respond = await addSpokenResource({
            requestJson: JSON.stringify({
              ...res.data[0],
              operateAccountNo: this.$store.getters.getUserInfo.accountNo,
              knowledgePointId: res.data[0].shareSpokenResourceList[0].knowledgePointId,
              spokenTitle: this.form.name
            })
          })
          if (respond.flag && respond.data[0]) {
            let r = await addTeachCourseRes({
              requestJson: JSON.stringify({
                "tchCourseId": this.$route.query.tchCourseId,
                "sysCourseId": this.$route.query.sysCourseId,
                "resourceType": "R08",
                "resourceId": respond.data[0]
              })
            })
            if (r.flag) {
              let ret = await addShareSpokenResource({
                requestJson: JSON.stringify(
                  {
                    "interUser": "runLfb",
                    "interPwd": "1234578",
                    "belongSchoolId": this.$store.getters.schoolId,
                    "spokenId": respond.data[0],
                    "classGrade": res.data[0].shareSpokenResourceList[0].classGrade,
                    "subjectType": res.data[0].shareSpokenResourceList[0].subjectType,
                    "termType": res.data[0].shareSpokenResourceList[0].termType,
                    "knowledgePointId": res.data[0].shareSpokenResourceList[0].knowledgePointId,
                    "createAccountNo": res.data[0].shareSpokenResourceList[0].createAccountNo
                  }
                )
              })
              if (ret.flag) {
                this.$refs['body'].scrollTo(0, 0)
                this.onRefresh()
                this.$toast('复制成功')
                this.popShow = false
              } else {
                this.$toast(ret.msg)
              }
            } else {
              this.$toast(r.msg)
            }
          } else {
            this.$toast(respond.msg)
          }
        } else {
          this.$toast(res.msg)
        }
        this.form.btnLoading = false
      },
      modifyTeachCourseRes(item, index) {
        if (item.isSend === 'S05') {
          return this.$toast('已发任务的口语资源不能删除')
        }
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": 'A02',
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": 'R08',
          "resourceId": item.spokenId,
          "statusCd": 'S03'
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        modifyTeachCourseRes(params).then(res => {
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
          "resourceType": 'R08',
          "shareType": '',
          "sourceName": "",
          "pageSize": "10",
          "currentPage": page
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getTeachCourseResDetail(params).then(res => {
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0] && res.data[0].spokenResourceInfo && res.data[0].spokenResourceInfo.length) {
            this.list = page === 1 ? res.data[0].spokenResourceInfo : this.list.concat(res.data[0].spokenResourceInfo)
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
        if (!obj.wordCount || obj.sentenceCount) {
          this.$toast("该口语不含单词或者句子")
          return
        }
        console.log("发任务：", obj.spokenTitle)
        this.$store.commit('setResourceInfo', obj)
        this.$store.commit("setTaskClassInfo", '')
        this.$router.push(`/addTask?type=spoken_t=new`)
      }

    }
  }
</script>

<style lang="less" scoped>
  .spoken-list {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    .spoken-pop {
      &__title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 47px;
      }

      .clear {
        color: @blue;
        margin-left: 10px;
      }

      .radio-normal {
        border: 1px solid #999;
        border-radius: 50%;
        background: none;
      }

      &__footer {
        padding: 5px 10px;

        .btn {
          width: 100%;
          border-radius: 22px;
          font-size: 16px;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      .cover {
        background: #FCA361;
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
  }
</style>
