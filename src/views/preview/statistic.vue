<template>
  <section class="statistic-wrap">
    <van-nav-bar
      :title="info.taskName"
      @click-left="$router.back()"
      left-arrow>
      <div slot="right" class="fs12 blue" @click="viewAnalyse" v-if="isTestPaper">试卷分析</div>
    </van-nav-bar>
    <div class="statistic-wrap__tab-scroll" v-if="$route.query.type != 'inClass'">
      <div v-for="(item,index) in info.tchClassTastInfo" :key="index" @click="handleSelectTab(item)"
           class="statistic-wrap__tab-scroll-item" :class="{'active':item.active}">{{item.className}}
      </div>
    </div>
    <div style="flex: 1;overflow-y: auto">
      <div class="statistic-wrap__pie-chart">
        <div class="statistic-wrap__pie-chart-label divider">任务完成情况:
          <van-button class="notice-btn" :class="{remind: remind}" v-if="$route.query.type != 'inClass'" @click="saveDailyReminder">{{remind?'今日已提醒':'一键提醒'}}</van-button>
        </div>
        <div id="myChart1" ref="myChart1" class="pie-chart"></div>
      </div>
      <div class="statistic-wrap__achievement">
        <div class="statistic-wrap__achievement-label divider">全班成绩概况:</div>
        <div class="statistic-wrap__achievement-score">
          <div>
            <span>班级平均分</span>
            <span class="red">{{taskFinishInfo.finshCount>0?(taskFinishInfo.totalScore / taskFinishInfo.finshCount).toFixed(2):0}}分</span>
          </div>
          <div>
            <span>班级最高分</span>
            <span class="red">{{taskFinishInfo.maxScore}}分</span>
          </div>
          <div>
            <span>班级最低分</span>
            <span class="red">{{taskFinishInfo.minScore}}分</span>
          </div>
        </div>
      </div>
      <div class="statistic-wrap__histogram" v-show="isTestPaper">
        <div class="statistic-wrap__histogram-label">
          <span class="divider">试卷统计:</span>
          <span class="tag">人数</span>
        </div>
        <div id="myChart2" ref="myChart2" class="histogram-chart"></div>
      </div>
      <div class="statistic-wrap__view">
        <div class="statistic-wrap__view-tab">
          <div :class="{active:tabIndex === 0}" @click="tabIndex = 0" v-if="$route.query.taskType === 'T04'">学资源详情
          </div>
          <div :class="{active:tabIndex === 0}" @click="tabIndex = 0"
               v-if="['T01','T02'].includes($route.query.taskType)">微课详情
          </div>
          <div :class="{active:tabIndex === 0}" @click="tabIndex = 0" v-if="['T06'].includes($route.query.taskType)">
            论题内容
          </div>
          <div :class="{active:tabIndex === 1}" @click="tabIndex = 1"
               v-if="['T02','T04'].includes($route.query.taskType)&&!isTestPaper">学生心得详情
          </div>
          <div :class="{active:tabIndex === 1}" @click="tabIndex = 1"
               v-if="['T06'].includes($route.query.taskType)&&!isTestPaper">学生讨论详情
          </div>
          <div :class="{active:tabIndex === 1}" @click="tabIndex = 1"
               v-if="isTestPaper || $route.query.taskType === 'T13'">按题目查看
          </div>
          <div @click="viewStu"
               v-if="isTestPaper|| $route.query.taskType === 'T13'">按学生查看
          </div>
        </div>

        <!--        学生心得-->
        <stu-exp @comment="handleComment" @score="handleScore" @ess="handleEss" @top="handleTop" @praise="handlePraise"
                 :classId="info.tchClassTastInfo.find(t => t.active).classId"
                 v-show="['T02','T04','T06'].includes($route.query.taskType)&&!isTestPaper&&tabIndex === 1"
                 :list="appraiseList">
        </stu-exp>


        <!--        学资源/微课详情-->
        <div class="ware-detail" v-if="$route.query.taskType !== 'T06'" v-show="!isSpoken&&tabIndex === 0">
          <video v-if="type === 'mp4'" controls="controls"
                 controlsList="nodownload" :src="wareDetail.courseware.srcUrl"></video>
          <audio v-else-if="type === 'mp3' && wareDetail.courseware.srcUrl"
                 controls="controls"
                 controlsList="nodownload" :src="wareDetail.courseware.srcUrl"></audio>
          <img v-else-if="type === 'img' && wareDetail.courseware.srcUrl"
               :src="wareDetail.courseware.srcUrl"/>
          <!--      <PDF v-else-if=" type === 'pdf' && info.srcUrl" :url="info.srcUrl"-->
          <!--           style="width: 100%;height: 60vh;overflow-y: scroll"></PDF>-->
          <!--      <iframe v-else-if=" type === 'pdf' && info.srcUrl && !vanLoading" :src="info.srcUrl"></iframe>-->
          <iframe v-else-if=" (type === 'office'||type === 'pdf') && wareDetail.courseware.srcUrl && !vanLoading"
                  :src="wareDetail.courseware.srcUrl"></iframe>

          <list-item class="mgt10" :itemTitle="wareDetail.courseware.coursewareName">
            <!--            <div slot="cover" class="cover"><i class="iconGFY" :class="iconType"></i><img-->
            <!--              v-if="iconType === 'img'" :src="wareDetail.courseware.srcUrl" alt=""></div>-->
            <div slot="desc">
              <div class="desc-top">
                发布者:{{wareDetail.courseware.belongAccountName}}
              </div>
              <div class="desc-bottom">
                <div>
                  <van-icon name="clock-o"></van-icon>
                  {{wareDetail.courseware.createDate}}
                </div>
                <div><i class="iconGFY icon-points"></i>{{wareDetail.courseware.useCount || 0}}</div>
                <div><i class="iconGFY icon-download"></i>{{wareDetail.courseware.downLoadCount || 0}}</div>
              </div>
            </div>
          </list-item>

        </div>
        <div class="ware-detail" v-if="!isSpoken&&tabIndex === 0&&['T06'].includes($route.query.taskType)">
          <div v-html="wareDetail.discussInfo.discussName"></div>
          <div class="dis-ctn" v-html="wareDetail.discussInfo.discussContent"></div>
        </div>

        <!--        主观题 客观题列表-->
        <div v-show="tabIndex === 1" v-if="$route.query.taskType !== 'T13'">
          <div v-if="taskFinishInfo.examstat&&taskFinishInfo.examstat.some(v => v.auto_scoring === '0')">
            <div class="fs12 black statistic-wrap__view-label">主观题</div>
            <div class="statistic-wrap__view-subject">
              <div class="statistic-wrap__view-subject-item" @click="viewSubjectList(item)"
                   v-for="(item,index) in taskFinishInfo.examstat"
                   :key="index" v-if="item.auto_scoring === '0'">
                <div class="pd5">
                  <div>第{{item.exam_index}}题</div>
                  <div>平均分: {{item.avg_score}}</div>
                  <div>总分:{{item.total_score}}</div>
                </div>
                <div class="status">{{(item.student_finish_count > 0 && item.finish_count == item.student_finish_count)?
                  '已批改':'批改'}}
                </div>
              </div>
            </div>
          </div>
          <div v-if="taskFinishInfo.examstat&&taskFinishInfo.examstat.some(v => v.auto_scoring === '1')">
            <div class="fs12 black statistic-wrap__view-label mgt10">客观题</div>
            <div id="myChart3" ref="myChart3" class="subject-pie"></div>
          </div>
        </div>


        <div v-if="$route.query.taskType === 'T13'">
          <spoken-table type="statistic" :list="taskFinishInfo.finishResultBySplit" :classId="info.tchClassTastInfo.find(t => t.active).classId"></spoken-table>
        </div>
      </div>
    </div>

    <div class="statistic-wrap__footer" v-if="$route.query.taskType !== 'T13'">
      <van-button v-if="isTestPaper" class="btn" type="info"
                  @click="$router.push({name:`addSubScore`,params:{info:taskFinishInfo,termType:$route.query.termType}})">
        加分/减分
      </van-button>
      <van-button class="btn" type="info"
                  @click="$router.push({path:`/briefing`,query:{info:taskFinishInfo,title:info.taskName,taskId:info.taskId,classId:info.tchClassTastInfo.find(t => t.active).classId,operateAccountNo:$store.getters.getUserInfo.accountNo,belongSchoolId:$store.getters.schoolId}})">
        分享报告
      </van-button>
    </div>


    <van-dialog v-model="stuStatInfo.statDialog" :show-confirm-button="false">
      <div class="stat-dialog-wrap">
        <div class="stat-dialog-wrap__header"><span
          class="stat-dialog-wrap__header-title">{{stuStatInfo.title}}学生</span>
          <van-icon class="icon-close" name="clear" @click="stuStatInfo.statDialog=false"/>
        </div>
        <div class="stat-dialog-wrap__body">
          <div v-for="(item,index) in stuStatInfo.stu" :key="index">{{item}}</div>
        </div>
        <!--        <div class="stat-dialog-wrap__footer">-->
        <!--          <van-button class="dialog-btn" type="info" @click="stuStatInfo.statDialog=false">确定</van-button>-->
        <!--        </div>-->
      </div>
    </van-dialog>
  </section>
</template>

<script>
  import {mapMutations, mapGetters, mapState} from 'vuex'
  import {pubApi} from '@/api/parent-GFY'
  import listItem from '../../components/list-item'
  import spokenTable from '../../components/spokenTable'
  import echarts from "echarts";
  import stuExp from '../../components/stuExp'
  import {
    saveDailyReminder,
    getDailyRemindStatus,
    statTaskStat,
    getCourseTaskDetail,
    getAppraiseV2,
    saveRewardScore,
    addReply,
    essAppraise,
    unessAppraise,
    getReply,
    delPraise,
    addPraise,
    topAppraise,
    untopAppraise
  } from '@/api/index'
  import {getStudentName} from '@/utils/filter'

  export default {
    name: "statistic",
    components: {stuExp, spokenTable, listItem},
    data() {
      return {
        appraiseList: [],
        type: '', //学资源类型
        wareDetail: {courseware: {srcUrl: ''}, discussInfo: {}}, // 学资源详情
        iconType: '',
        // wareActive: false, //学资源详情tab选中状态
        // lessonActive: false, //微课详情tab选中状态
        isSpoken: false,
        tabIndex: 1,
        isWk: true,
        stuStatInfo: {
          title: '',
          stu: [],
          statDialog: false
        },
        // info: JSON.parse(JSON.stringify(this.$route.query.info)),
        info: JSON.parse(localStorage.getItem('stat')),
        taskFinishInfo: {examstat: [], studentStatList: []},
        remind: false,
      }
    },
    computed: {
      isTestPaper() {
        return this.$route.query.testPaperId > 0
      },
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      })
    },
    methods: {
      viewStu() {
        // if(this.$route.query.taskType === 'T13') {
        //   this.$router.push({name:`spokenAnalyse`,query:{type: 'analyse'}})
        // }else {
        this.$router.push({name:`examView`,params:{info:this.taskFinishInfo,title:this.info.taskName}})
        // }
      },
      saveDailyReminder() {
        if(this.remind) return
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          "objectId": this.$route.query.taskId,
          "objectType":'T01',
          accountNoList: this.taskFinishInfo.studentUnfinishList[0].accountNoList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        saveDailyReminder(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if(res.flag) {
            this.remind = true
          }else {
            this.$toast(res.msg)
          }
        })
      },
      getDailyRemindStatus() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          "objectId": this.$route.query.taskId,
          "objectType":'T01',
      }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getDailyRemindStatus(params).then(res => {
          if(res.flag) {
            this.remind = res.data.length > 0
          }else {
            this.$toast(res.msg)
          }
        })
      },
      handleComment(replyContent, item) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          appraiseId: item.appraiseId,
          replyContent,
          parentReplyId: 0,
        }
        addReply(obj).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast('评论成功')
            item.comment = ''
            item.replyList.unshift(res.data[0].pubReplyInfo)
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleScore(item, type) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": this.$route.query.taskId,
          type,
          score: 1,
          "subjectType": localStorage.currentSubjectType,
          "teacherName": localStorage.userInfo.userName,
          "taskName": JSON.parse(localStorage.getItem('stat')).taskName,
          "termType": this.$route.query.termType,
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          "groupIdList": "",
          "accountNoList": item.appraiseAccountNo
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        saveRewardScore(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            const score = item.score * 1 + (type === 'T01' ? 1 : -1)
            item.score = score > 0 ? '+' + score : score
            this.$toast(`${type === 'T01' ? '加' : '减'}分成功`)
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleTop(item) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          appraiseId: item.appraiseId,
        }
          , api
        if (item.topFlag === '1') {
          api = untopAppraise
        } else {
          api = topAppraise
        }
        api(obj).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast(item.topFlag === '1' ? '取消置顶' : '置顶成功')
            this.getAppraise()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleEss(item) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          appraiseId: item.appraiseId,
        }
          , api
        if (item.essFlag === '1') {
          api = unessAppraise
        } else {
          api = essAppraise
        }
        api(obj).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast(item.essFlag === '1' ? '取消精华' : '加精华成功')
            this.getAppraise()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handlePraise(item) {
        this.$store.commit('setVanLoading', true)
        let obj, api
        if (item.good) {
          api = delPraise
          obj = {
            praiseId: item.praiseList.find(p => p.accountNo === JSON.parse(localStorage.userInfo).accountNo).praiseId
          }
        } else {
          api = addPraise
          obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "accountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            classId: this.info.tchClassTastInfo.find(t => t.active).classId,
            objectId: item.appraiseId,
            objectTypeCd: 'P01',
          }
        }
        api(obj).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.$toast(item.good ? '取消点赞' : '点赞成功')
            this.getAppraise()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      async getAppraise() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          currPage: 1,
          isAppendMode: true,
          objectId: this.$route.query.taskId,
          objectTypeCd: 'A01',
          pageSize: 9999,
          praiseType: 1,
          replyType: 1,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getAppraiseV2(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag && res.data[0]) {
            res.data[0].appraiseListInfo.forEach(async v => {
              // 本账号是否有点过赞
              v.good = v.praiseList.some(p => p.accountNo === JSON.parse(localStorage.userInfo).accountNo)
              v.score = this.rewardScore(v.appraiseAccountNo)
              // if(v.replyCount > 0) {
              //  let response = await this.getReply(v.appraiseId)
              //   if(response.flag) {
              //    v.replyList = response.data[0].replyListInfo
              //   }
              // }
              let dom = document.createElement('div')
              v.imgArr = []
              v.audioArr = []
              v.videoArr = []
              dom.innerHTML = v.appraiseContent
              if (v.appraiseContent) {
                const imgArr = dom.querySelectorAll('img')
                const audioArr = dom.querySelectorAll('audio')
                const videoArr = dom.querySelectorAll('video')
                for (let i = 0; i < imgArr.length; i++) {
                  v.imgArr.push(imgArr[i].src)
                  let parent = imgArr[i].parentElement
                  parent.removeChild(imgArr[i])
                }
                for (let i = 0; i < audioArr.length; i++) {
                  v.audioArr.push(audioArr[i].src)
                  let parent = audioArr[i].parentElement
                  parent.removeChild(audioArr[i])
                }
                for (let i = 0; i < videoArr.length; i++) {
                  v.videoArr.push(videoArr[i].src)
                  let parent = videoArr[i].parentElement
                  parent.removeChild(videoArr[i])
                }
              }
              v.text = dom.outerHTML
            })
            this.appraiseList = res.data[0].appraiseListInfo
            console.log(this.appraiseList, '=s=s=s=s=s');
          } else {
            this.appraiseList = []
          }
        })
      },
      rewardScore(accountNo) {
        const score = this.taskFinishInfo.studentStatList.find(v => v.accountNo === accountNo).studentRewardScore
        return score > 0 ? '+' + score : score
      },
      getReply(appraiseId) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          classId: this.info.tchClassTastInfo.find(t => t.active).classId,
          currPage: 1,
          pageSize: 9999,
          appraiseId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        return getReply(params)
      },
      checkUrlPermission() {
        // 课件鉴权
        let permissionParams = {
          'interUser': 'runLfb',
          'interPwd': '25d55ad283aa400af464c76d713c07ad',
          'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
          'belongSchoolId': this.$store.getters.schoolId,
          'url': this.wareDetail.courseware.srcUrl,
          'sysTypeCd': 'S03'
        }
        this.$store.commit('setVanLoading', true)
        pubApi.checkUrlPermission({requestJson: JSON.stringify(permissionParams)}).then((respone) => {
          this.$store.commit('setVanLoading', false)
          if (respone.flag) {
            if (this.type == 'office' || this.type == 'pdf') {
              if (this.wareDetail.courseware.srcUrl.indexOf('pubquanlang') > -1) {
                this.wareDetail.courseware.srcUrl = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl

              } else {
                this.wareDetail.courseware.srcUrl = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl
              }
            } else {
              this.wareDetail.courseware.srcUrl = respone.data[0].accessUrl
            }
          } else {
            this.wareDetail.courseware.srcUrl = ''
          }
        })
      },
      getUrlSuffix(url) {
        var t = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
        console.log(t)
        if (t == 'ppt' || t == 'pptx') {
          t = 'office'
        } else if (t == 'doc' || t == 'docx') {
          t = 'office'
        } else if (t == 'xls' || t == 'xlsx') {
          t = 'office'
        } else if (t == 'zip' || t == 'rar' || t == '7z') {
          t = 'rar'
        } else if (t == 'pdf') {
          t = 'pdf'
        } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
          t = 'img'
        } else if (t == 'mp4') {
          t = 'mp4'
        } else if (t == 'mp3') {
          t = 'mp3'
        } else {
          t = 'unkown'
        }
        return t
      },
      handleIcon(url) {
        var t = url.substring(url.lastIndexOf('.') + 1).toLowerCase()
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
          t = 'img'
        } else if (t == 'mp4' || t == 'mp3') {
          t = 'icon-video'
        } else {
          // t = 'unkown'
        }
        return t
      },
      async getCourseTaskDetail() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          operateRoleType: 'A02',
          tchCourseId: this.$route.query.tchCourseId,
          "taskId": this.$route.query.taskId,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getCourseTaskDetail(params).then(res => {
          if (res.flag) {
            this.wareDetail = res.data[0]
            // this.iconType = this.handleIcon(res.data[0].courseware.srcUrl)
          }
        })
      },
      viewSubjectList(item) {
        const questionList = this.taskFinishInfo.examstat.filter(v => v.auto_scoring === '0')
        const classId = this.info.tchClassTastInfo.find(t => t.active).classId
        this.$router.push({
          path: '/subjectList', query: {
            taskId: this.info.taskId,
            examId: item.exam_id,
            groupId: item.group_id,
            tchCourseId:this.$route.query.tchCourseId,
            classId,
            questionList,
            info: this.taskFinishInfo
          }
        })
      },
      viewAnalyse() {
        this.$router.push(`/examAnalyse?taskId=${this.info.taskId}&classId=${this.info.tchClassTastInfo.find(t => t.active).classId}&testPaperId=${this.$route.query.testPaperId}`)
      },
      async statTaskStat(classId = this.info.tchClassTastInfo[0].classId) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "taskId": this.info.taskId,
          classId
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await statTaskStat(params).then(res => {
          if (res.flag) {
            if(this.$route.query.taskType === 'T13') {
              res.data[0].studentStatList = res.data[0].examstat
            }
            this.taskFinishInfo = res.data[0]
          } else {
            this.$toast(res.msg)
          }
        })
      },
      async handleSelectTab(item) {
        if (item.active) return
        this.$store.commit('setVanLoading', true)
        this.info.tchClassTastInfo.forEach(v => {
          this.$set(v, 'active', false)
        })
        item.active = true

        await this.statTaskStat(item.classId)
        this.drawPie()
        if (this.isTestPaper) {
          this.drawHistogram()
        }
        if (this.taskFinishInfo.examstat) {
          this.drawObjectivePie()
        }

        if (this.$route.query.taskType === 'T04') {
          //如果是学资源则把tab设置为激活
          // this.wareActive = true
          if (!this.isTestPaper) {
            await this.getAppraise()
          }
        }
        this.$store.commit('setVanLoading', false)
      },
      drawPie() {
        this.$nextTick(() => {
          let myChart = echarts.init(this.$refs.myChart1);
          // 绘制图表
          var _option = {
            // title: {
            //   text: '任务完成情况',
            //   x: 20,
            //   y: 10
            // },
            calculable: true,
            // tooltip: {
            //   trigger: 'item',
            //   formatter: "{a} <br/>{b} : {c} ({d}%)"
            // },
            color: ['#FB5522', '#2BFF93'],
            series: [
              {
                name: '文言文全章复习与巩固',
                type: 'pie',
                radius: [0, 53],
                // center: [150, 170],
                label: {
                  // normal: {
                  //   show: true
                  // },
                  emphasis: {
                    show: true
                  },
                  position: 'outside',
                  formatter: `{b}{d}%>\n({c}人)`,
                  align: 'left'
                },
                lableLine: {
                  normal: {
                    show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#ccc',
                  }
                },
                data: [
                  {
                    value: this.taskFinishInfo.studentUnfinishList.reduce((t, v) => {
                      t += v.accountNoList.length
                      return t
                    }, 0), name: '未完成'
                  },
                  {value: this.taskFinishInfo.finshCount, name: '已完成'}
                ]
              }
            ],
            // toolbox: {
            // 	show: true,
            // 	feature: {
            // 		mark: {show: true},
            // 		dataView: {show: true, readOnly: false},
            // 		magicType: {
            // 			show: true,
            // 			type: ['pie', 'funnel']
            // 		},
            // 		restore: {show: true},
            // 		saveAsImage: {show: true}
            // 	}
            // }
          };
          myChart.setOption(_option, true)
          myChart.on('click', params => {
            this.stuStatInfo.stu = []
            this.stuStatInfo.title = params.name
            if (params.name === '未完成') {
              this.taskFinishInfo.studentUnfinishList.forEach(v => {
                v.accountNoList.forEach(s => {
                  const name = getStudentName(s, this.info.tchClassTastInfo.find(t => t.active).classId)
                  this.stuStatInfo.stu.push(name)
                })
              })
            } else {
              this.taskFinishInfo.finishStudent.reduce((t, v) => {
                const name = getStudentName(v, this.info.tchClassTastInfo.find(t => t.active).classId)
                t.push(name)
                return t
              }, this.stuStatInfo.stu)
            }

            this.stuStatInfo.statDialog = true
          })
        });
      },
      drawHistogram() {
        var myChart = echarts.init(document.getElementById('myChart2'));
        // 指定图表的配置项和数据
        var paperOption = {
          calculable: true,
          grid: {
            top: '15%',
            left: '0%',
            right: '4%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            data: ['0-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            axisLabel: {
              // fontSize: 6,
              interval: 0
            },
            // splitLine: {
            //   interval: 0,
            //   show: true
            // }
          },
          yAxis: {},
          series: [
            {
              name: '人数',
              type: 'bar',
              data: Object.keys(this.taskFinishInfo.testPaperStat).map(v => this.taskFinishInfo.testPaperStat[v]),
              itemStyle: {
                normal: {
                  color: '#FEB524'
                },
              }
            }
          ],
        };
        myChart.setOption(paperOption, true);
      },
      drawObjectivePie() {
        //有客观题才渲染
        if (this.taskFinishInfo.examstat.some(v => v.auto_scoring === '1')) {
          var myChart = echarts.init(document.getElementById('myChart3'));
          const objectiveList = this.taskFinishInfo.examstat.filter(v => v.auto_scoring === '1')
          myChart.getDom().style.height = Math.ceil(objectiveList.length / 6) * 60 + 'px'
          myChart.resize()
          // 指定图表的配置项和数据
          let arr = []
          for (let i = 0; i < objectiveList.length; i++) {
            const correct = Number((objectiveList[i].exam_present.split("%")[0]) / 100)
            arr.push({
              name: `第${objectiveList[i].exam_index}题`,
              type: 'pie',
              radius: [22, 26],
              center: [28 + i % 6 * 60, 28 + (((i + 1) / 6 > 1) ? Math.floor(i / 6) * 60 : 0)],
              label: {
                show: false,
                position: 'center',
                formatter: ''
              },
              hoverAnimation: false,
              data: [
                {
                  value: correct, name: '正确率', label: {
                    show: true,
                    position: 'center',
                    formatter: '{a}\n{d}%',
                    textStyle: {
                      baseline: 'bottom',
                      fontSize: 12,
                      color: '#000'
                    }
                  },
                },
                {value: 1 - correct, name: '错误率'}
              ]
            })
          }
          var questionOption = {
            color: ['#5EF0A6', '#FF6666'],
            series: arr
          };

          myChart.setOption(questionOption, true);

          myChart.on('click', params => {
            console.log(params, '=3=3=');
            const questionList = this.taskFinishInfo.examstat.filter(v => v.auto_scoring === '1')
            const item = questionList[params.seriesIndex]
            const classId = this.info.tchClassTastInfo.find(t => t.active).classId
            // this.$router.push(`/subjectAnalyse?taskId=${this.info.taskId}&examId=${item.exam_id}&classId=${classId}&groupId=${item.group_id}`)
            this.$router.push({
              path: '/subjectAnalyse', query: {
                taskId: this.info.taskId,
                examId: item.exam_id,
                groupId: item.group_id,
                classId,
                questionList
              }
            })
          })
        }
      }
    },
    async mounted() {
      this.$store.commit('setVanLoading', true)
      this.getDailyRemindStatus()
      await this.statTaskStat()
      this.drawPie()
      if (this.isTestPaper) {
        this.drawHistogram()
      }
      if (this.taskFinishInfo.examstat) {
        this.drawObjectivePie()
      }
      if (['T01', 'T02', 'T04', 'T06'].includes(this.$route.query.taskType)) {
        //如果是学资源则把tab设置为激活
        // this.wareActive = true
        if (!this.isTestPaper) {
          this.getAppraise()
        }
        await this.getCourseTaskDetail()
        if (this.$route.query.taskType !== 'T06') {
          //讨论不需要鉴权
          this.type = this.getUrlSuffix(this.wareDetail.courseware.srcUrl)
          this.checkUrlPermission()
        }
      }

      this.$store.commit('setVanLoading', false)
      // if (!this.isWk && !this.isSpoken) {
      // }
    },
    async created() {

    }
  }
</script>

<style lang="less" scoped>
  .statistic-wrap {
    background: #f5f5f5;
    flex-direction: column;
    display: flex;

    .pie-chart {
      width: 100%;
      height: 160px;
      margin: 0 auto;
      margin-top: 20px;
    }

    .subject-pie {
      width: 100%;
      margin: 0 auto;
    }

    .histogram-chart {
      width: 100%;
      height: 300px;
      margin: 0 auto;
    }

    .divider {
      &::after {
        content: ' ';
        display: block;
        width: 30px;
        height: 2px;
        background: @blue;
      }
    }

    &__tab-scroll {
      flex: 0 0 42px;
      background: #f5f5f5;
      display: flex;
      overflow-x: auto;
      width: 100%;
      white-space: nowrap;
      align-items: center;

      &-item {
        display: inline-block;
        background: #ddd;
        border-radius: 11px;
        font-size: 12px;
        color: #999;
        padding: 0 8px;
        line-height: 22px;
        margin-left: 10px;
        /*&:last-child{*/
        /*  margin-right: 0;*/
        /*}*/

        &.active {
          background: linear-gradient(0deg, rgba(57, 240, 221, 1), rgba(140, 247, 238, 1));
          color: #fff;
        }
      }
    }

    &__pie-chart {
      background: #fff;
      padding: 15px 10px;

      &-label {
        font-size: 15px;
        color: #333;

        .notice-btn {
          padding: 0;
          font-size: 12px;
          width: 82px;
          border-radius: 11px;
          height: 26px;
          line-height: 26px;
          color: #fff;
          background: @blue;
          &.remind {
            color: #999;
            background: #f5f6fa;
          }
        }
      }
    }

    &__achievement {
      background: #fff;
      padding: 15px 10px;
      margin-top: 5px;

      &-label {
        font-size: 15px;
        color: #333;
        line-height: 26px;
      }

      &-score {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 12px;

        > div {
          font-size: 12px;
          margin-right: 24px;
          color: #333;
          display: flex;
          flex-direction: column;
          align-items: center;

          &:last-child {
            margin-right: 0;
          }

          .red {
            color: #ff6666;
            margin-top: 8px;
          }
        }
      }
    }

    &__histogram {
      margin-top: 5px;
      padding: 15px 10px;
      background: #fff;

      &-label {
        font-size: 15px;
        line-height: 26px;
        color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tag {
          font-size: 10px;

          &::before {
            background: @graOrange;
            display: inline-block;
            width: 19px;
            height: 9px;
            content: ' ';
            margin-right: 5px;
          }
        }
      }
    }

    &__view {
      padding: 15px 10px;
      margin-top: 5px;
      background: #fff;

      .ware-detail {
        overflow-x: hidden;
        .dis-ctn {
          img {
            width: 100%;
          }
        }
        > img, > video, > iframe {
          width: 100%;
          height: 200px;
        }

        > audio {
          height: 95px;
          width: 100%;
        }

        .cover {
          background: #F3D233;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 5px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .desc-top {
          font-size: 10px;
          color: #666;
        }

        .desc-bottom {
          display: flex;
          font-size: 12px;
          color: #666;
          justify-content: flex-start;

          .iconGFY {
            margin-right: 3px;
          }

          > div {
            margin-right: 6px;
            display: flex;
            align-items: center;
          }
        }
      }

      > video {
        width: 100%;
        height: 200px;
      }

      &-tab {
        display: flex;
        margin-bottom: 16px;

        > div {
          background: #f5f6fa;
          border-radius: 11px;
          font-size: 14px;
          color: #333;
          line-height: 26px;
          text-align: center;
          padding: 0 9px;
          margin-right: 8px;

          &.active {
            background: @graOrange;
            color: #fff;
          }
        }
      }

      &-label {
        line-height: 24px;
        margin-bottom: 10px;

        &::after {
          width: 18px;
          content: " ";
          display: block;
          height: 2px;
          background: @blue;
        }
      }

      &-subject {
        display: flex;
        flex-wrap: wrap;

        &-item {
          border: 1px solid #fbdd31;
          color: #333;
          font-size: 10px;
          margin-bottom: 5px;
          flex: 0 0 80px;
          margin-right: 8px;

          &:nth-child(4n) {
            margin-right: 0;
          }

          .status {
            color: #fff;
            background: @graOrange;
            display: flex;
            height: 18px;
            align-items: center;
            justify-content: center;
          }
        }
      }

      &-desc {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-cover {
          flex: 0 0 69px;
          height: 74px;
          border-radius: 5px;
          background: #b9fff8;
          margin-right: 4px;
        }

        &-content {
          .desc {
            i {
              margin-right: 3px;
            }
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      background: #fff;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn {
        border-radius: 22px;
        color: #fff;
        font-size: 18px;
        flex: 1;

        &:nth-child(2n) {
          margin-left: 23px;
        }
      }
    }

    .stat-dialog-wrap {
      display: flex;
      flex-direction: column;

      &__header {
        font-size: 18px;
        color: #010101;
        flex: 0 0 40px;
        display: flex;
        align-items: center;
        position: relative;

        &-title {
          flex: 1;
          text-align: center;
        }

        .icon-close {
          position: absolute;
          font-size: 22px;
          color: @blue;
          right: 10px;
        }
      }

      &__body {
        max-height: 240px;
        overflow-y: auto;
        font-size: 14px;
        color: #666;
        padding: 10px 20px;
        display: flex;
        flex-wrap: wrap;

        div {
          flex: 0 0 66px;
          padding: 4px;
          text-align: center;
        }
      }

      &__footer {
        flex: 0 0 55px;
        padding: 0 20px;
        display: flex;
        align-items: center;

        .dialog-btn {
          border-radius: 22px;
          color: #fff;
          font-size: 18px;
          flex: 1;
        }
      }
    }
  }
</style>
