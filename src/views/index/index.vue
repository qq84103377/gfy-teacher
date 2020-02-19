<template>
  <section class="index-content-wrap">
    <van-overlay :show="subjectShow" @click="subjectShow = false" z-index="99" class-name="mask" />
    <div class="index-content-wrap__header">
      <div id="gfy_dropdown">
        <div @click="subjectShow = true">
          <span>{{currentSubjectType}} </span>
          <van-icon class="fs16 black" name="arrow-down" />
        </div>

        <van-popup :overlay="false" v-model="subjectShow" get-container="#gfy_dropdown" class="score-pop">
          <div style="position: relative;">
            <div class="score-pop-wrap">
              <div class="score-pop-wrap__item" :class="{active: currentSubjectType== value}" v-for="(value, key) in subjectTypeList" :key="key" @click="handleClosePop(key)">{{value}}
                <!--                <van-icon v-show="currentSubjectType== value " class="check blue" name="success" />-->
              </div>
            </div>
            <div class="parent">
              <div class="child"></div>
            </div>
          </div>
        </van-popup>

      </div>
      <i @click="$router.push(`/myNotice`)" class="iconGFY icon-bell"></i>
    </div>
    <div class="index-content-wrap__body">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-if="index<3" v-for="(image, index) in publishList" :key="index">
          <img :src="image.photoUrl" style="width:calc(100%)" />
        </van-swipe-item>
      </van-swipe>
      <div class="index-content-wrap__body__main-icon">
        <div @click="$router.push(`/preview`)" class="index-content-wrap__body__main-icon-item">
          <div class="icon-wrap blue"><i class="iconGFY icon-book"></i></div>
          <div>预习</div>
        </div>
        <div @click="$router.push(`/inClass`)" class="index-content-wrap__body__main-icon-item">
          <div class="icon-wrap green"><i class="iconGFY icon-play1"></i></div>
          <div>课中</div>
        </div>
        <div class="index-content-wrap__body__main-icon-item" @click="$router.push(`/resource`)">
          <div class="icon-wrap yellow"><i class="iconGFY icon-res"></i></div>
          <div>资源</div>
        </div>
        <div class="index-content-wrap__body__main-icon-item" @click="$router.push(`/layerTaskList`)">
          <div class="icon-wrap orange"><i class="iconGFY icon-layer"></i></div>
          <div>分层</div>
        </div>

      </div>
      <div class="jcsb aic mgb10">
        <span class="fs16 black">未结束任务</span>
        <span class="blue fs12" v-show="taskList && taskList.length>0" @click="$router.push(`/unfinishTaskList`)">查看更多></span>

      </div>
      <van-skeleton :row="11" :loading="loading" :row-width="['40%','100%','100%','40%','100%','100%','40%','100%','100%','40%','100%']">
        <div v-if="!taskList||taskList.length==0" style="text-align: center;color:#999999;font-size: 14px" class="index-content-wrap__body__unfinish-wrap">
          <div class="fix-height">
            <img style="width: 100%;" src="../../assets/img/index/unfinish_task_empty.png" alt />
            <span>当前没有未结束的任务～</span>
          </div>
        </div>
        <div v-else v-for="(item,index) in taskList" :key="item.taskId" class="index-content-wrap__body__unfinish-wrap">
          <list-item ref='listItem' @clickTo="goto(item)" :fold="item.fold" :itemTitle="item.tastName" :test-paper-id="item.testPaperId" :taskType="item.tastType" :class-info-list="item.tchCourseClassInfo"
                     :can-slide="true" @del="delTask(item,index)" @clickDel='clickDel(index)'>
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="item.tchCourseClassInfo.length>2?$set(item,'fold',!item.fold):''">
                <i class="iconGFY" :class="{fold:item.fold,'icon-arrow':item.tchCourseClassInfo.length>2,'icon-arrow-grey':item.tchCourseClassInfo.length<=2}"></i>
                <span>班级查看</span>
              </div>
              <div @click="editTask(item)">
                <i class="iconGFY icon-edit"></i>
                <span>编辑</span>
              </div>
              <div @click="viewStat(item)">
                <i class="iconGFY icon-statistics"></i>
                <span>{{item.finishCount}}/{{item.allCount}}</span>
              </div>
            </div>
          </list-item>
        </div>
      </van-skeleton>
      <div class="divider-title">教学工具</div>
      <div class="icon-group">
        <div @click="$router.push(`/myClassList`)">
          <i class="iconGFY icon-user"></i>
          <span>我的班级</span>
        </div>
        <div @click="$router.push(`/myCourseList`)">
          <i class="iconGFY icon-tv"></i>
          <span>我的课程</span>
        </div>
        <div @click="$router.push(`/errorBook`)">
          <i class="iconGFY icon-errors"></i>
          <span>错题集</span>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import listItem from '../../components/list-item'
import {  getUnFinishCourseTask, getMySchoolInfo, getClassStudent, getSubGroupStudent, getGradeTermInfo, getPublishByRole,
  getClassTeacherCourseDeploy, getCourseTaskDetail, deleteCourseTask} from '@/api/index'
import { pubApi } from '@/api/parent-GFY'
import eventBus from "@/utils/eventBus";

export default {
  name: "index",
  components: { listItem },
  data() {
    return {
      fold: false,
      subjectShow: false,
      taskList: [],
      subjectTypeList: {},
      currentSubjectType: '',
      loading: true,
      publishList: [],
      clickIndex:0
    }
  },
  activated() {
    console.log("index activated");
    //在别的地方修改科目以后返回到首页要重新获取对应的科目
    this.currentSubjectType = localStorage.getItem("currentSubjectTypeName") || ''
  },
  mounted() {
    this.$store.commit('setVanLoading', true)
    Promise.all([this.getMySchoolInfo(), this.getGradeTermInfo(), this.getPublishByRole(), this.getClassTeacherCourseDeploy()]).then(res => {
      this.$store.commit('setVanLoading', false)
    }).catch(err => {
      this.$store.commit('setVanLoading', false)
    })
    eventBus.$off("indexEditTask")
    eventBus.$on("indexEditTask", (data) => {
      console.log("index eventbus");
      this.getUnFinishCourseTask()
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs['listItem']&&this.$refs['listItem'][this.clickIndex]&&this.$refs['listItem'][this.clickIndex].showDialog) {
      this.$refs['listItem'][this.clickIndex].close()
      next(false)
    }else{
      next()
    }
  },
  methods: {
    clickDel(index){
      this.clickIndex=index
    },
    delTask(item, index) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "taskId": item.taskId,
        "tchCourseId": item.tchCourseId
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      deleteCourseTask(params).then(res => {
        if (res.flag) {
          this.getUnFinishCourseTask()
          this.$toast('删除成功')
        } else {
          this.$toast(res.msg)
        }
      });
    },
    viewStat(item) {
      this.$store.commit('setVanLoading', true)
      //估计后台字段任务名称写错了
      item.taskName = item.tastName
      let classMap = JSON.parse(localStorage.getItem("classMap"));
      for (const key in classMap) {
        for (var i = 0; i < item.courseClassList.length; i++) {
          if (classMap[key].classId == item.courseClassList[i].classId) {
            item.courseClassList[i].className = classMap[key].className
          }
        }
      }
      let tchCourseInfo = {
        tchCourseId: item.tchCourseId,
        tchClassCourseInfo: item.courseClassList,
        subjectType: item.subjectType,
      }
      localStorage.setItem('taskTchCourseInfo', JSON.stringify(tchCourseInfo))
      localStorage.setItem('stat', JSON.stringify(item))
      this.$router.push({
        path: '/statistic',
        query: {
          info: item,
          testPaperId: item.testPaperId,
          termType: item.tchCourseClassInfo[0].termType,
          tchCourseId: item.tchCourseId,
          taskId: item.taskId,
          taskType: item.tastType,
          resourceType: item.resourceType,
          courseName:item.courseName
        }
      })
    },
    goto(item) {
      if (item.testPaperId > 0) {
        this.$router.push({
          path: `/examDetail`, query: {
            flag: 1,
            // "tchCourseId": this.$route.query.tchCourseId,
            "sysCourseId": item.tchCourseClassInfo[0].sysCourseId,
            // "relationCourseId": this.$route.query.relationCourseId,
            type: 1,
            testPaperId: item.testPaperId,
            subjectType: localStorage.currentSubjectType,
            classGrade: item.tchCourseClassInfo[0].classGrade,
            title: item.tchCourseClassInfo[0].testPaperName,
            fromTask: 1
          }
        })
      } else if (item.tastType === 'T03') {
        if (item.resourceType === 'R03') {
          //单道试题
          this.$router.push(`/questionDetail?tchCourseId=${item.tchCourseId}&taskId=${item.taskId}&title=${item.tastName}`)
        }
      } else if (['T13'].includes(item.tastType)) {
        //口语
        this.$router.push(`/spokenDetail?spokenId=${item.resourceId}&sysCourseId=${item.tchCourseClassInfo[0].sysCourseId}`)
      } else if (['T02', 'T04', 'T06'].includes(item.tastType)) {
        // 学资源 微课+心得 讨论  跳任务统计
        this.viewStat(item)
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
        tchCourseId: item.tchCourseId,
        "taskId": item.taskId,
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getCourseTaskDetail(params).then(res => {
        if (res.flag) {
          if (['T04'].includes(item.tastType)) {
            localStorage.setItem('materialDetail',JSON.stringify(res.data[0].courseware))
            this.$router.push({ path: '/materialDetail'})
          } else if (['T06'].includes(item.tastType)) {
            this.$router.push({ path: `/discussDetail`, query: { data: res.data[0].discussInfo } })
          } else if (['T01', 'T02'].includes(item.taskType)) {
            console.log(res.data[0], 'res.data[0]////////////');
            if (res.data[0] && res.data[0].courseware && res.data[0].courseware.srcUrl) {
              this.checkUrlPermission(res.data[0].courseware.srcUrl, item.tastName)
            }
          }
        }
      })
    },
    handleClosePop(key) {
      this.subjectShow = false
      this.currentSubjectType = this.subjectTypeList[key]
      localStorage.setItem("currentSubjectTypeName", this.currentSubjectType);
      localStorage.setItem("currentSubjectType", key);
    },
    getUnFinishCourseTask() {
      let obj = {
        operateAccountNo: this.$store.getters.getUserInfo.accountNo,
        currentPage: 1,
        pageSize: 2
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getUnFinishCourseTask(params).then(res => {
        console.log(res)
        if (res.flag) {
          this.taskList = res.data;
          if (localStorage.getItem("classMap") && this.taskList && this.taskList.length > 0) {
            let classMap = JSON.parse(localStorage.getItem("classMap"));
            this.taskList.forEach(item => {
              if (item.tchCourseClassInfo) {
                item.tchCourseClassInfo.forEach((obj, i) => {
                  if (i == 0) {
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
              //任务统计需要tchClassTastInfo字段,但getUnFinishCourseTask接口字段为tchCourseClassInfo
              item.tchClassTastInfo = item.tchCourseClassInfo
            });
          }
          this.loading = false
        } else {
          this.$toast(res.msg)
        }
      })
    },
    async getMySchoolInfo() {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "userType": "A02"
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }

      await getMySchoolInfo(params).then(res => {
        console.log(res)
        if (res.flag) {
          //重构数据
          if (!res.data) {
            this.$toast("该老师未配置学校信息")
            return
          }
          let mySchool = res.data[0].mySchoolInfo
          if (!mySchool || mySchool.length == 0) {
            this.$toast("该老师未配置学校信息");
            return;
          }
          let schoolMap = {}
          let classMap = {}
          let hisClassMap = {}
          let that = this
          let gradeList = []
          mySchool.forEach(item => {
            schoolMap[item.schoolId] = {
              schoolId: item.schoolId,
              schoolName: item.schoolName,
              schoolType: item.schoolType
            }
            if (item.myClassInfo) {
              item.myClassInfo.forEach(obj => {
                if (!gradeList.some(v => v.classGrade === obj.classGrade)) {
                  gradeList.push({ classGrade: obj.classGrade, gradeName: obj.gradeName, teacherInfoList: [...obj.teacherInfoList] || [] })
                } else {
                  //有的时候
                  const index = gradeList.findIndex(v => v.classGrade === obj.classGrade)
                  obj.teacherInfoList.forEach(s => {
                    // if (!gradeList[index].teacherInfoList.some(sub => sub.subjectType === s.subjectType)) {
                      gradeList[index].teacherInfoList.push(s)
                    // }
                  })
                }
                classMap[obj.classId] = obj
                if (obj.teacherInfoList) {
                  obj.teacherInfoList.forEach(obj2 => {
                    if (!localStorage.getItem("subGroup_" + obj2.subjectType + "_" + obj.classId)) {
                      this.getSubGroupStudent(item.schoolId, obj.classId, obj2.subjectType);
                    }


                    if (obj2.subjectType != 'S20') {
                      that.subjectTypeList[obj2.subjectType] = obj2.subjectName
                    }
                  })
                }
                if (!localStorage.getItem("classStudent_" + obj.classId)) {
                  this.getClassStudent(item.schoolId, obj.classId)
                }
              })

            }
            if (item.myHisClassInfo) {
              item.myHisClassInfo.forEach(obj => {
                hisClassMap[obj.classId] = obj
              })
            }
          })
          localStorage.setItem("subjectTypeList", JSON.stringify(that.subjectTypeList));
          localStorage.setItem("gradeList", JSON.stringify(gradeList));
          console.log(that.subjectTypeList)
          console.log(hisClassMap)
          console.log(classMap)
          console.log(schoolMap)
          for (let key in that.subjectTypeList) {
            console.log("属性：" + key + ",值：" + that.subjectTypeList[key]);
            that.currentSubjectType = that.subjectTypeList[key];
            localStorage.setItem("currentSubjectTypeName", this.currentSubjectType);
            localStorage.setItem("currentSubjectType", key);
            break
          }

          console.log(that.currentSubjectType)
          localStorage.setItem("classMap", JSON.stringify(classMap))
          this.$store.commit('setClassIndex',Object.keys(JSON.parse(localStorage.getItem("classMap")))[0])
          localStorage.setItem("hisClassMap", JSON.stringify(hisClassMap))
          // localStorage.setItem("schoolMap", JSON.stringify(schoolMap))
          this.$store.commit('setSchoolMap', schoolMap)
          eventBus.$emit('checkUpgrade')
          this.getUnFinishCourseTask()

          //获取班级学生信息

          //获取班级分组信息

        } else {
          this.$toast(res.msg)
        }
      })
    },
    async getSubGroupStudent(schoolId, classId, subjectType) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": schoolId,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "classId": classId,
        "subjectType": subjectType
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }

      getSubGroupStudent(params).then(res => {
        if (res.flag) {
          console.log(classId, ",班级学生分组", res.data)
          if (res.data && res.data.length > 0) {
            let subMap = []
            res.data.forEach(item => {
              let id = item.tchClassSubGroupStudent.tchClassSubGroup.subgroupId
              if (id != 0) {
                subMap.push(item)
              }
            })
            let key = "subGroup_" + subjectType + "_" + classId
            localStorage.setItem(key, JSON.stringify(subMap))
          }
        } else {
          this.$toast(res.msg)
        }
      })
    },
    async getClassStudent(schoolId, classId) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": schoolId,
        "classId": classId
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }

      getClassStudent(params).then(res => {
        if (res.flag) {
          console.log(classId, ",班级学生：", res.data)
          if (res.data && res.data.length > 0 && res.data[0].classStudent) {
            let classStudent = res.data[0].classStudent
            let classStudentMap = {}
            classStudent.forEach(item => {
              classStudentMap[item.accountNo] = item
            })

            let key = "classStudent_" + classId
            localStorage.setItem(key, JSON.stringify(classStudentMap))
          }

        } else {
          this.$toast(res.msg)
        }
      })

    },
    async getGradeTermInfo() {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getGradeTermInfo(params).then(res => {
        console.log(res)
        if (res.flag) {
          this.$store.commit('setGradeTermList', res.resGradeTermList)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    async getPublishByRole() {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "belongSchoolId": '',
        "roleType": "A02",
        "type": "T06",
        "pageSize": "10",
        "currPage": "1"
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getPublishByRole(params).then(res => {
        console.log(res)
        if (res.flag) {
          this.publishList = res.data
        } else {
          this.$toast(res.msg)
        }
      })
    },
    async getClassTeacherCourseDeploy() {
      let obj = {
        'operateAccountNo': this.$store.getters.getUserInfo.accountNo
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getClassTeacherCourseDeploy(params).then(res => {
        if (res.flag) {
          if (!res.data || res.data.length == 0) {
            this.$toast("未配置建课信息，请联系管理人员")
            return
          }
          let deployMap = {}
          let key = ""
          let gradeMap = {}
          let dataList = res.data
          dataList.forEach(item => {
            if (item.gradeTermInfo) {
              gradeMap[item.gradeTermInfo.grade] = item.gradeTermInfo.grade
            }
          })
          let deployList = []
          let gradeTermMap = {}
          for (let k in gradeMap) {

            //配置的学期列表、版本列表
            let termMap = {}
            let bookMap = {}
            let bookList = [];
            let termList = [];

            dataList.forEach(item => {
              if (item.gradeTermInfo) {
                gradeTermMap[item.gradeTermInfo.grade + '_' + item.gradeTermInfo.term] = item.gradeTermInfo.gradeTermId
                if (k === item.gradeTermInfo.grade) {
                  if (!bookMap[item.textBookId]) {
                    bookMap[item.textBookId] = item.textBookName
                    bookList.push({
                      textBookId: item.textBookId,
                      textBookName: item.textBookName,
                      subjectType:item.subjectType
                    })
                  }
                  if (!termMap[item.gradeTermInfo.term]) {
                    termMap[item.gradeTermInfo.term] = item.gradeTermInfo.term
                    termList.push(termMap[item.gradeTermInfo.term])
                  }
                }
              }
            })
            let obj = {
              classGrade: k,
              bookInfo: bookList,
              termInfo: termList
            }
            deployList.push(obj)
          }

          console.log("配置列表", deployList)
          localStorage.setItem("deployList", JSON.stringify(deployList))
          localStorage.setItem("gradeTermMap", JSON.stringify(gradeTermMap))
        } else {
          this.$toast("获取老师课程配置：" + res.msg)
        }

      });
    },
    checkUrlPermission(url, title) {
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
        let assUrl
        if (respone.flag) {
          if (this.type == 'office' || this.type == 'pdf') {
            if (url.indexOf('pubquanlang') > -1) {
              assUrl = 'http://ow365.cn/?i=17383&n=5&furl=' + respone.data[0].accessUrl

            } else {
              assUrl = 'http://ow365.cn/?i=17387&n=5&furl=' + respone.data[0].accessUrl
            }
          } else {
            assUrl = respone.data[0].accessUrl
          }
        } else {
          assUrl = ''
        }

        if (!assUrl) {
          this.$toast('暂无资源')
          return
        }

        this.$router.push({ name: 'videoPage', query: { src: assUrl, title } })
      }).catch(() => {
        this.$toast('资源错误')
      })

    },
    editTask(item) {
      console.log(item, 'editTask  item');
      // let classList = []
      let classMap = JSON.parse(localStorage.getItem("classMap"));
      for (const key in classMap) {
        for (var i = 0; i < item.courseClassList.length; i++) {
          if (classMap[key].classId == item.courseClassList[i].classId) {
            item.courseClassList[i].className = classMap[key].className
            // classList.push({ classId: item.courseClassList[i].classId, className: classMap[key].className, })
          }
        }
      }
      console.log(item.courseClassList, 'item.courseClassList');
      let tchCourseInfo = {
        tchCourseId: item.tchCourseId,
        tchClassCourseInfo: item.courseClassList,
        subjectType: item.subjectType,
      }
      this.$store.commit('setResourceInfo', item)
      this.$store.commit("setTchCourseInfo", tchCourseInfo)
      console.log(tchCourseInfo, 'tchCourseInfo');
      this.$store.commit("setTaskClassInfo", '')
      this.$router.push({
        path: '/addTask?_t=new',
        query: {
          info: item,
          testPaperId: item.testPaperId,
          // termType: this.termType,
          tchCourseId: item.tchCourseId,
          taskId: item.taskId,
          taskType: item.taskType ? item.taskType : item.tastType,
          resourceType: item.resourceType,
          isEdit: true,
          from: 'index',
        }
      })
    },
  }
}

</script>

<style lang="less" scoped>
.index-content-wrap {
  display: flex;
  flex-direction: column;
  .mask {
    background: transparent;
  }
  &__header {
    flex: 0 0 44px;
    padding: 0 15px;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: @black;
    #gfy_dropdown {
      position: relative;
      .score-pop {
        left: -10%;
        position: absolute;
        max-height: inherit;
        top: 140%;
        transform: none;
        overflow-y: inherit;
        box-shadow: 0px 2px 5px 0px #999;
        &-wrap {
          &__item {
            background: #fff;
            text-align: center;
            width: 108px;
            line-height: 44px;
            font-size: 14px;
            border-top: 1px solid #eee;

            &.active {
              color: @blue;
            }
          }
        }
        .parent {
          top: -10px;
          left: 50%;
          width: 0px;
          height: 0px;
          border-width: 0 10px 10px;
          border-style: solid;
          border-color: transparent transparent #eee;
          position: absolute;
          transform: translateX(-50%);
        }
        .child {
          width: 0px;
          height: 0px;
          border-width: 0 9px 9px;
          border-style: solid;
          border-color: transparent transparent #fff;
          position: absolute;
          top: 1px;
          left: -9px;
        }
        /*&::after {*/
        /*  width: 0;*/
        /*  height: 0;*/
        /*  border-width: 0 10px 10px;*/
        /*  border-style: solid;*/
        /*  border-color: transparent transparent #fff;*/
        /*  content: ' ';*/
        /*  position: absolute;*/
        /*  top: -10px;*/
        /*  left: 50%;*/
        /*  transform: translateX(-50%);*/
        /*}*/
      }
    }
  }
  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 10px 16px;
    .van-swipe {
      height: 150px;
      border-radius: 5px;
      img {
        height: 100%;
      }
    }
    &__main-icon {
      display: flex;
      justify-content: space-around;
      margin: 18px 0 40px 0;
      &-item {
        flex: 0 0 45px;
        text-align: center;
        font-size: 12px;
        .icon-wrap {
          width: 100%;
          height: 45px;
          margin-bottom: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          &.blue {
            background: linear-gradient(
              0deg,
              rgba(37, 219, 241, 1),
              rgba(149, 249, 238, 1)
            );
          }
          &.green {
            background: linear-gradient(
              0deg,
              rgba(107, 218, 33, 1),
              rgba(190, 243, 89, 1)
            );
          }
          &.yellow {
            background: linear-gradient(
              0deg,
              rgba(255, 173, 30, 1),
              rgba(247, 220, 64, 1)
            );
          }
          &.orange {
            background: linear-gradient(
              0deg,
              rgba(232, 118, 35, 1),
              rgba(252, 164, 99, 1)
            );
          }
        }
      }
    }
    &__unfinish-wrap {
      border: 1px solid #eee;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow-x: hidden;
      .fix-height {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 10px 0;
      }
    }
    .divider-title {
      margin: 30px 0 15px;
      font-size: 16px;
      color: #333;
    }
    .icon-group {
      display: flex;
      padding-left: 10px;
      > div {
        margin-right: 15px;
        font-size: 12px;
        color: #666;
        display: flex;
        flex-direction: column;
        align-items: center;
        i {
          width: 20px;
          height: 20px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
