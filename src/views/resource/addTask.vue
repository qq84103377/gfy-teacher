<template>
  <section class="add-task">

    <van-nav-bar :title="isEdit?'编辑':handleTitle()" @click-left="$router.back()" left-arrow>
    </van-nav-bar>
    <div class="add-task__body">
      <van-cell class="add-task__body__cell">
        <div slot="title" class="add-task__body__cell-ctn mgl5">
          <div><span class="red">*</span>名称:</div>
          <input v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
          <span class="red">{{64 - form.name.length}}</span>
          <van-icon v-show="form.name.length" @click="form.name = ''" class="close" name="clear" />
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title" class="add-task__body__cell-ctn mgl5">
          <div><span class="red">*</span>时长:</div>
          <input v-model="form.duration" type="number" placeholder="请输入时长">
          <span class="grey9">分钟</span>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell" v-if="['lesson','material'].includes($route.query.type)||($route.query.taskType=='T01'||$route.query.taskType=='T02'||$route.query.taskType=='T04')">
        <div slot="title">
          <div class="add-task__body__cell-ctn mgl5" :class="{grey9:isEdit}">
            <div><span class="red">*</span>{{handleLabel()}}:</div>
            <span v-if='!isEdit' class="pdlt10">{{this.resourceInfo.coursewareName}}</span>
            <span v-if='isEdit' class="pdlt10">{{this.resourceInfo.taskName}}</span>
          </div>
          <van-checkbox class="allow-fast" v-model="form.allowFast" v-show="['lesson'].includes($route.query.type)||($route.query.taskType=='T01'||$route.query.taskType=='T02')">
            <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
            允许快进
          </van-checkbox>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell" v-if="['lesson','material','exam'].includes($route.query.type)||($route.query.taskType=='T01'||$route.query.taskType=='T03'||($route.query.taskType=='T04'&&$route.query.testPaperId!=0))">
        <div slot="title">
          <div class="add-task__body__cell-ctn" :class="{ccc:form.comment&&!isEdit,grey9:isEdit,mgl5:$route.query.taskType=='T03'}">
            <div v-if='!isEdit'><span class="red" v-if="$route.query.taskType==='T03'">*</span>试卷:
            </div>
            <div v-if='!isEdit' class="pdlt10" style="flex:1">{{testPaperName || '未选择试卷'}}
            </div>
            <div v-if='isEdit'><span class="red" v-if="$route.query.taskType==='T03'">*</span>试卷: <span class="pdlt10">{{testPaperName}}</span> </div>

            <van-icon v-if="testPaperName&&$route.query.type != 'exam'&&!isEdit" @click="testPaperName = '';testPaperId=''" class="close" :class="{ccc:form.comment}" name="clear" />
            <van-icon v-if="$route.query.type != 'exam'&&!isEdit" @click="selectTestPaper" class="add" :class="{ccc:form.comment}" name="add" />
          </div>
          <van-checkbox class="allow-fast" v-model="form.allowEdit" v-if="form.exam" :name="form.allowEdit">
            <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
            允许学生交卷后重新修改答案
          </van-checkbox>
        </div>

      </van-cell>
      <van-cell class="add-task__body__cell" v-if="['lesson','material'].includes($route.query.type)||($route.query.taskType=='T02'||($route.query.taskType=='T04'&&$route.query.testPaperId==0))">
        <div slot="title">
          <div class="add-task__body__cell-ctn" :class="{ccc:form.exam,grey9:isEdit}">
            <div :class='{mgr10:isEdit}'>心得:</div>
            <van-checkbox v-if='!isEdit' :disabled="testPaperName?true:false" class="comment-check" v-model="form.comment">
              <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked},{'disabled':testPaperName}]"></i>
              学习心得
            </van-checkbox>
            <van-radio-group v-if='isEdit' style="display: flex;" class="mgl10" v-model="form.comment">
              <van-radio name="1"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                <span class="grey9">学习心得</span>
              </van-radio>
            </van-radio-group>
          </div>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title">
          <div class="add-task__body__cell-ctn mgl5">
            <span class="mgr10"><span class="red">*</span>对象:</span>
            <van-radio-group style="display: flex;" v-model="form.object" @change="changeObject">
              <van-radio name="1" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                班
              </van-radio>
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                组
              </van-radio>
            </van-radio-group>
          </div>
          <div class="mgt15">
            <div class="select-wrap" v-for="(item,index) in classList" :key="item.classId">
              <div>
                <van-checkbox class="comment-check" style="margin-left: 0;" v-model="item.check" :name="item.classId" :disabled="item.disabled" @click="handleCheckClass(item,index)">
                  <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
                  {{item.className}}
                </van-checkbox>
                <div class="select-wrap-desc" v-show="item.type!='none'">
                  <div v-if="form.object == 1 ">发布范围:
                    <span v-show="item.type=='all'">全部学生</span>
                    <span v-show="item.type=='part'">部分学生</span>

                  </div>

                  <!--                  <van-checkbox-group v-else class="gfy-checkbox-group" @change="handleCheckChild($event,item)"-->
                  <!--                                      v-model="item.groupSelect">-->
                  <div v-else class="gfy-checkbox-group">
                    <van-checkbox class="gfy-checkbox-group-item" v-for="(g, gi) in item.tchSubGroup" :key="gi" :name="gi" v-model="g.check" @click="handleCheckGroup(g,item)" :disabled="!g.tchClassSubGroupStudent.tchSubGroupStudent || g.tchClassSubGroupStudent.tchSubGroupStudent.length==0">
                      <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
                      {{g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName}}
                    </van-checkbox>
                    <!--                  </van-checkbox-group>-->
                  </div>
                </div>
              </div>
              <van-icon @click="toSelectStudent" class="fs16 grey9" name="arrow"></van-icon>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title">
          <div class="add-task__body__cell-ctn mgl5">
            <span class="mgr10"><span class="red">*</span>时间设置:</span>
            <van-radio-group style="display: flex;" v-model="form.time">
              <van-radio name="1" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                统一设置
              </van-radio>
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                分班设置
              </van-radio>
            </van-radio-group>
          </div>
          <div class="time-wrap" v-if="form.time == 1">
            <div @click="selectTime('begin')" class="time-view">{{form.time1}}</div>
            <span class="divider">~</span>
            <div class="time-view" @click="selectTime('end')">{{form.time2}}</div>
          </div>
          <div class="time-wrap" v-if="form.time==2" v-for="(item,index) in classList" :key="index" v-show="item.check">
            <span class=" fs14 mgr10 class-name" :style="{width:item.className.length>6?'100%':'auto'}">{{item.className}}</span>
            <div style="display: flex;align-items: center;flex: 1">
              <div @click="selectTime('begin',index)" class="time-view">{{item.startDate}}</div>
              <span class="divider">~</span>
              <div @click="selectTime('end',index)" class="time-view">{{item.endDate}}</div>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell class="add-task__body__cell">
        <div slot="title">
          <div class="jcsb">
            <div>描述:</div>
            <span class="red">{{200 - form.desc.length}}</span>
          </div>
          <textarea maxlength="200" v-model="form.desc" type="text" placeholder="请输入描述,字数在200字内" />
          </div>
      </van-cell>
    </div>
    <div class="add-task__footer">
      <van-button v-if='!isEdit' type="info" class="submit" @click="submitSendTask" :loading="showLoading" loading-text="发布中...">发布</van-button>
       <van-button v-else type="info" class="submit" @click="modifyTask" :loading="showLoading" loading-text="提交中...">提交</van-button>
    </div>


    <van-popup
      v-model="showTime"
      position="bottom"
      :style="{ height: '35%' }">
      <van-datetime-picker
        v-model="currentDate"
        :min-date="minDate"
        type="datetime"
        @confirm="handleSelectTime"
        @cancel="showTime=false"
        :formatter="formatter"
      />
    </van-popup>

    <exam-filter :visible.sync="filterShow" :testPaperId.sync="testPaperId" :testPaperName.sync="testPaperName" :tchCourseInfo.sync="tchCourseInfo"  ref="examFilter"></exam-filter>
  </section>
</template>

<script>
import { formatTime, generateTimeReqestNumber } from '@/utils/filter'
import examFilter from '../../components/examFilter'
import {
  createCourseTask, modifyCourseTask
} from '@/api/index'
import eventBus from "@/utils/eventBus";

export default {
  name: "addTask",
  components: { examFilter },
  data() {
    return {
      isEdit: this.$route.query.isEdit,
      filterShow: false,
      currentDate: new Date(),
      tchCourseInfo: {},
      resourceInfo: '',
      form: {
        name: '',
        duration: this.$route.query.isEdit ? "" : '10',
        allowFast: false,
        allowEdit: false,
        comment: this.$route.query.isEdit ? "1" : false,
        exam: '',
        object: this.$route.query.isEdit ? "" : '1',
        time: '1',
        time1: formatTime(new Date()),
        time2: '',
        desc: '',
        resourceId: '',
      },
      showTime: false,
      showLoading: false,
      classList: {},
      testPaperId: '',
      testPaperName: '',
      timeType: {},
      currentClassIdIndex: '',
      minDate: new Date(),
      currentTchCourseId: '',
      sendTaskClassStudent: {
      },
      sendTaskClassSubGroup: {
      },
      examCount: 0,
      result: [],
      firstFlag: true

    }
  },
  mounted() {
    // return
    this.resourceInfo = this.$store.getters.getResourceInfo
    console.log('课件', this.resourceInfo)

    if (this.resourceInfo && !this.isEdit) {
      console.log(this.$route.query.type, '/////////////////');
      if (this.$route.query.type === 'lesson' || this.$route.query.type === 'material') {
        if (this.resourceInfo.coursewareName) {
          if (this.resourceInfo.coursewareName.length > 64) {
            this.form.name = this.resourceInfo.coursewareName.substring(0, 64)
          } else {
            this.form.name = this.resourceInfo.coursewareName
          }
        }

        this.form.resourceId = this.resourceInfo.coursewareId
      } else if (this.$route.query.type === 'exam') {
        if (this.resourceInfo.testPaperName.length > 64) {
          this.form.name = this.resourceInfo.testPaperName.substring(0, 64)
        } else {
          this.form.name = this.resourceInfo.testPaperName
        }
        this.testPaperId = this.resourceInfo.testPaperId
        this.testPaperName = this.resourceInfo.testPaperName
        this.form.exam = this.resourceInfo.testPaperName
        this.form.resourceId = this.resourceInfo.testPaperId
        this.examCount = this.resourceInfo.objectiveItemNum + this.resourceInfo.subjectiveItemNum
      } else if (this.$route.query.type === 'discuss') {
        console.log('this.$route.query.type discuss//////////////');
        if (this.resourceInfo.discussName.length > 64) {
          this.form.name = this.resourceInfo.discussName.substring(0, 64)
        } else {
          this.form.name = this.resourceInfo.discussName
        }
        this.form.resourceId = this.resourceInfo.discussId

      } else if (this.$route.query.type === 'spoken') {
        if (this.resourceInfo.spokenTitle.length > 64) {
          this.form.name = this.resourceInfo.spokenTitle.substring(0, 64)
        } else {
          this.form.name = this.resourceInfo.spokenTitle
        }
        this.form.resourceId = this.resourceInfo.spokenId
      }
    } else if (this.resourceInfo && this.isEdit) {

      this.form.duration = this.resourceInfo.duration
      this.form.allowEdit = this.resourceInfo.modifyAfterSubmit == "M02" ? true : false
      this.form.allowFast = this.resourceInfo.isDrag == "I01" ? true : false
      if (this.resourceInfo.description) {
        this.form.desc = this.resourceInfo.description
      } else if (this.resourceInfo.desc) {
        this.form.desc = this.resourceInfo.desc
      }

      this.testPaperName = this.resourceInfo.testPaperName
      this.form.comment = '1'


      // this.form.object = this.resourceInfo.description
      this.resourceInfo.tchClassTastInfo.forEach(ele => {
        if (ele.tchClassSubGroup && ele.tchClassSubGroup.length != 0) {
          this.form.object = '2'
        } else {
          this.form.object = '1'
        }

      })

      if (this.resourceInfo.tastName) {
        this.resourceInfo.taskName = this.resourceInfo.tastName
      }

      if (this.resourceInfo.taskName.length > 64) {
        this.form.name = this.resourceInfo.taskName.substring(0, 64)
      } else {
        this.form.name = this.resourceInfo.taskName
        console.log(this.resourceInfo.taskName, 'this.resourceInfo.taskName');
      }
      this.form.resourceId = this.resourceInfo.resourceId

      if (this.$route.query.taskType === 'T01' || this.$route.query.taskType === 'T02' || this.$route.query.taskType === 'T04') { //lesson  material

      } else if (this.$route.query.taskType === 'T03') {//试卷exam

        this.testPaperId = this.resourceInfo.testPaperId
        this.testPaperName = this.resourceInfo.testPaperName
        this.form.exam = this.resourceInfo.testPaperName
        this.form.resourceId = this.resourceInfo.testPaperId
        // this.examCount = this.resourceInfo.objectiveItemNum + this.resourceInfo.subjectiveItemNum
      } else if (this.$route.query.taskType === 'T06') {//discuss

      } else if (this.$route.query.taskType === 'T13') {
        if (this.resourceInfo.spokenTitle.length > 64) {
          this.form.name = this.resourceInfo.spokenTitle.substring(0, 64)
        } else {
          this.form.name = this.resourceInfo.spokenTitle
        }
        this.form.resourceId = this.resourceInfo.spokenId
      }

    }
    this.initClass()

  },

  methods: {
    initClass() {

      //课程信息
      this.tchCourseInfo = this.$store.getters.getTchCourseInfo
      console.log("课程", this.tchCourseInfo)

      if (this.tchCourseInfo) {
        this.currentTchCourseId = this.tchCourseInfo.tchCourseId
        // if (!this.isEdit) {
        let endDate = new Date(this.tchCourseInfo.tchClassCourseInfo[0].endDate)
        endDate.setHours(23)
        endDate.setMinutes(59)
        let now = new Date()
        if (endDate.getTime() < now.getTime()) {
          now.setDate(now.getDate() + 3)
          this.form.time2 = formatTime(now);
        } else {
          this.form.time2 = formatTime(endDate);
        }
        // }
        console.log(this.form.time2,"this.form.time2");

        let taskClass = this.$store.getters.getTaskClassInfo
        if (taskClass) {
          this.classList = JSON.parse(taskClass)
          this.classList.forEach(item => {
            this.$set(item, 'type', "all")
            if (!item.check) {
              this.$set(item, 'type', "none")
            } else {
              for (let m in item.classStudent) {
                if (!item.classStudent[m].active) {
                  this.$set(item, 'type', "part")
                  break
                }
              }
            }

          })
          return
        }

        this.classList = this.tchCourseInfo.tchClassCourseInfo
        let subjectType = this.tchCourseInfo.subjectType
        

        this.sendTaskClassStudent = this.$store.getters.getSendTaskClassStudent
        //获取分组信息
        this.classList.forEach(item => {
          let key = "subGroup_" + subjectType + "_"
          let classKey = "classStudent_"
          key += item.classId
          let group = {}
          if (localStorage.getItem(key)) {
            let tmp = JSON.parse(localStorage.getItem(key))

            if (Object.keys(tmp).length === 0) {
              item.tchSubGroup = []
              this.$set(item, 'tchSubGroup', [])
            } else {
              this.$set(item, 'tchSubGroup', tmp)
              item.tchSubGroup.forEach((sub, index) => {
                if (sub.tchClassSubGroupStudent.tchSubGroupStudent) {
                  let stu = {}
                  sub.tchClassSubGroupStudent.tchSubGroupStudent.forEach(obj => {
                    stu[obj.accountNo] = true
                    this.$set(obj, 'active', true)
                  })
                  group[sub.tchClassSubGroupStudent.tchClassSubGroup.subgroupId] = stu
                  this.$set(sub, 'check', true)
                } else {
                  this.$set(sub, 'check', false)
                }
              })
            }
          } else {
            item.tchSubGroup = []
          }
          if (this.$route.query._t == "new") {
            this.sendTaskClassSubGroup[item.classId] = { data: group }
            if (Object.keys(group).length === 0) {
              this.$set(this.sendTaskClassSubGroup[item.classId], 'check', false)
            } else {
              this.$set(this.sendTaskClassSubGroup[item.classId], 'check', true)

            }
            // this.$set(this.sendTaskClassSubGroup[item.classId], 'data', group)

          }
          console.log("发任务的班级分组学生信息；", this.sendTaskClassSubGroup)
          classKey += item.classId
          let classStudent = JSON.parse(localStorage.getItem(classKey))

          if (classStudent) {
            let student = {}
            for (let k in classStudent) {
              this.$set(classStudent[k], 'active', true)
              student[classStudent[k].accountNo] = true
            }

            if (this.$route.query._t == "new") {
              this.sendTaskClassStudent[item.classId] = { data: student }
            }

            console.log("发任务的班级学生信息；", this.sendTaskClassStudent)
            item.classStudent = classStudent
          } else {
            item.classStudent = []
          }

          if (!item.classStudent || Object.keys(item.classStudent).length == 0) {
            this.$set(item, 'check', false)
            this.$set(item, 'type', "none")
            this.$set(item, 'disabled', true)
          } else {
            this.$set(item, 'disabled', false)
            if (this.sendTaskClassStudent[item.classId].data) {
              this.$set(item, 'check', true)
              this.$set(item, 'type', "all")
              this.$set(this.sendTaskClassStudent[item.classId], 'check', true)
            } else {
              //item.check = false
              this.$set(this.sendTaskClassStudent[item.classId], 'check', false)
              this.$set(item, 'check', false)
              this.$set(item, 'type', "none")
            }
          }
          if (!this.isEdit) {
          }
          item.startDate = this.form.time1
          item.endDate = this.form.time2
          console.log("classlist//////////////",this.classList);
        })
        // return
        this.$store.commit('setTeamList', this.form.class)

        if (this.isEdit) {
          let tchClassCourseInfo = this.resourceInfo.tchClassTastInfo
          let classStart = {}
          let classEnd = {}
          // console.log(tchClassCourseInfo, 'tchClassCourseInfo///');

          //判断是分班设置还是统一设置
          let flag = false
          let start = tchClassCourseInfo[0].startDate
          let end = tchClassCourseInfo[0].endDate
          tchClassCourseInfo.forEach(item => {
            classStart[item.classId] = item.startDate
            classEnd[item.classId] = item.endDate
            this.result.push(item.classId)
            if (start != item.startDate || end != item.endDate) {
              flag = true
            }
          })

          console.log(this.classList, 'this.classList///');

          if (flag) {
            console.log("分班设置时间");
            this.form.time = "2"
            //分班
            for (let m in this.classList) {
              tchClassCourseInfo.forEach(ele => {
                if (ele.classId == this.classList[m].classId) {
                  this.$set(this.classList[m], 'startDate', formatTime(new Date(ele.startDate)))
                  this.$set(this.classList[m], 'endDate', formatTime(new Date(ele.endDate)))

                  this.classList[m]['startDate'] = formatTime(new Date(ele.startDate))
                  this.classList[m]['endDate'] = formatTime(new Date(ele.endDate))
                }
              })
            }
          } else {
            console.log("统一设置时间");
            //统一
            this.form.time = "1"

            this.form.time1 = formatTime(new Date(tchClassCourseInfo[0].startDate))
            this.form.time2 = formatTime(new Date(tchClassCourseInfo[0].endDate))
          }


          this.classList.forEach(item => {
            item.check = false
            item.type = 'none'
            this.$set(item, 'type', "none")
            this.resourceInfo.tchClassTastInfo.forEach(element => {
              if (item.classId == element.classId) {
                console.log(item.classId == element.classId, 'item.classId == element.classId');
                item.check = true
                item.type = 'all'
                this.$set(item, 'type', "all")
                if (element.accountNo.length && Object.keys(item.classStudent).length != element.accountNo.length) {
                  this.$set(item, 'type', "part")
                }

                for (const key in item.classStudent) {
                  this.$set(item.classStudent[key], 'active', false)
                  item.classStudent[key].active = false
                  element.accountNo.forEach(i => {
                    if (key == i) {
                      this.$set(item.classStudent[key], 'active', true)
                      item.classStudent[key].active = true
                    }
                  })
                }

                item.tchSubGroup.forEach((ele, index) => {
                  this.$set(ele, 'check', false)
                  if (ele.tchClassSubGroupStudent.tchSubGroupStudent && ele.tchClassSubGroupStudent.tchSubGroupStudent.length != 0) {
                    ele.tchClassSubGroupStudent.tchSubGroupStudent.forEach(s => {
                      s.active = false
                      this.$set(s, 'active', false)
                      element.tchClassSubGroup && element.tchClassSubGroup.forEach(i => {
                        if (s.subgroupId == i) {
                          s.active = true
                        }
                      })
                    })
                  }
                  if (element.tchClassSubGroup) {
                    element.tchClassSubGroup.forEach(i => {
                      if (ele.tchClassSubGroupStudent && ele.tchClassSubGroupStudent.tchClassSubGroup && ele.tchClassSubGroupStudent.tchClassSubGroup.subgroupId == i) {
                        console.log("相等==");
                        this.$set(ele, 'check', true)
                        ele.check = true
                      }
                    })
                  }

                })
              } else {
                item.tchSubGroup.forEach(obj => {
                  obj.check = item.check
                  if (obj.tchClassSubGroupStudent.tchSubGroupStudent && obj.tchClassSubGroupStudent.tchSubGroupStudent.length != 0) {
                    obj.tchClassSubGroupStudent.tchSubGroupStudent.forEach(s => {
                      s.active = item.check
                    })
                  }
                })
              }
            })

          })
          console.log(this.classList, 'this.classList////////');
        }
      } else {
        this.$toast("课程信息错误,请重新选择课程")
        return
      }
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === "day") {
        return `${value}日`
      } else if (type === "hour") {
        return `${value}时`
      } else if (type === "minute") {
        return `${value}分`
      }
      return value;
    },

    handleLabel() {
      if (this.$route.query.type === 'lesson' || (this.$route.query.taskType === 'T01' || this.$route.query.taskType === 'T02')) {
        return '微课'
      } else if (this.$route.query.type === 'material' || (this.$route.query.taskType === 'T04')) {
        return '素材'
      }
    },
    handleTitle() {
      if (this.$route.query.type === 'lesson') {
        return '微课任务'
      } else if (this.$route.query.type === 'material') {
        return '学资源任务'
      } else if (this.$route.query.type === 'exam') {
        return '试卷任务'
      } else if (this.$route.query.type === 'discuss') {
        return '讨论'
      } else if (this.$route.query.type === 'spoken') {
        return '口语'
      }
    },
    handleCheckGroup(group, classItem) {
      if (!group.tchClassSubGroupStudent.tchSubGroupStudent || group.tchClassSubGroupStudent.tchSubGroupStudent.length == 0) {
        return
      }
      console.log(group.check)
      group.check = !group.check
      group.tchClassSubGroupStudent.tchSubGroupStudent.forEach(s => {
        s.active = group.check
      })
      if (group.check) {
        classItem.check = true
      } else {
        let flag = true
        for (let item of classItem.tchSubGroup) {
          if (item.check) {
            flag = false
            break
          }
        }
        if (flag) {
          classItem.check = false
        }
      }


      console.log(group.check)
    },
    handleCheckClass(item, index) {
      console.log('handleCheckClass');
      if (item.disabled) {
        return
      }
      item.check = !item.check
      if (this.form.object == "1") {
        //取消班级
        for (let k in this.classList[index].classStudent) {
          this.classList[index].classStudent[k].active = item.check
        }
        if (item.check) {
          item.type = 'all'
        } else {
          item.type = 'none'

        }
      } else {
        item.tchSubGroup.forEach(obj => {

          if (obj.tchClassSubGroupStudent.tchSubGroupStudent) {
            obj.check = item.check
            obj.tchClassSubGroupStudent.tchSubGroupStudent.forEach(s => {
              s.active = item.check
            })
          }

        })
      }
    },
    changeObject() {
      if (this.isEdit && this.firstFlag) {
        this.firstFlag = false
        return
      }
      console.log(this.form.object)
      if (this.form.object === "1") {
        console.log("按班级发任务")
        this.classList.forEach(item => {
          if (item.classStudent || Object.keys(item.classStudent).length > 0) {
            this.$set(item, "disabled", false)
          } else {
            this.$set(item, "disabled", true)
          }
          for (let key in item.classStudent) {
            item.classStudent[key].active = false
          }
          this.$set(item, "check", false)
          // this.$set(item, "type", 'none')
        });
      } else if (this.form.object === "2") {
        console.log("按组发任务")
        this.classList.forEach(item => {
          if (item.tchSubGroup && item.tchSubGroup.length > 0) {
            this.$set(item, "disabled", false)
          } else {
            this.$set(item, "disabled", true)
          }
          item.tchSubGroup.forEach(obj => {
            this.$set(obj, "check", false)
            if (obj.tchClassSubGroupStudent.tchSubGroupStudent) {
              obj.tchClassSubGroupStudent.tchSubGroupStudent.forEach(s => {
                s.active = false
              })
            }

          })
          this.$set(item, "check", false)
        })
      }
    },
    selectTime(type, index) {
      //统一设置
      this.timeType = type
      this.showTime = true
      this.currentClassIdIndex = index
      if (this.form.time == "1") {
        if (type == "begin") {
          this.minDate = new Date()
          this.currentDate = new Date(this.form.time1)
        } else if (type == "end") {
          let date = new Date(this.form.time1)
          date.setDate(date.getDate() + 1)
          this.minDate = date
          this.currentDate = new Date(this.form.time2)
        }

        //分班设置
      } else if (this.form.time == "2") {
        if (type == 'begin') {//开始时间
          this.minDate = new Date()
          this.currentDate = new Date(this.classList[index].startDate)
        } else if (type == 'end') {//结束时间
          let date = new Date(this.classList[index].startDate)
          date.setDate(date.getDate() + 1)
          this.minDate = date
          this.currentDate = new Date(this.classList[index].endDate)
        }

      }
    },
    handleSelectTime(v) {
      //统一设置
      if (this.form.time == "1") {
        if (this.timeType == 'begin') {
          this.form.time1 = formatTime(v)
          //判断结束时间时候小于结束时间
          let time1 = new Date(this.form.time1)
          let time2 = new Date(this.form.time2)
          if (time1.getTime() >= time2.getTime()) {
            time1.setDate(time1.getDate() + 3)
            this.form.time2 = formatTime(time1)
          }
        } else if (this.timeType == 'end') {
          this.form.time2 = formatTime(v)
        }
        //分班设置
      } else if (this.form.time == "2") {
        if (this.timeType == 'begin') {
          this.classList[this.currentClassIdIndex]['startDate'] = formatTime(v)
          let begin = new Date(this.classList[this.currentClassIdIndex]['startDate'])
          let end = new Date(this.classList[this.currentClassIdIndex]['endDate'])
          if (begin.getTime() >= end.getTime()) {
            begin.setDate(begin.getDate() + 3)
            this.classList[this.currentClassIdIndex]['endDate'] = formatTime(begin)
          }
        } else if (this.timeType == 'end') {
          this.classList[this.currentClassIdIndex]['endDate'] = formatTime(v)
        }
      }
      this.showTime = false
    },
    toSelectStudent() {
      //设置学生
      this.$store.commit("setTaskClassInfo", JSON.stringify(this.classList))
      let type = this.form.object == 1 ? 'class' : 'team'
      this.$router.push(`/teamSelect?type=` + type)
    },
    selectTestPaper() {
      this.filterShow = true;
      this.$refs.examFilter.getTeachCourseResDetail()
    },
    submitSendTask() {
      if (!this.currentTchCourseId) {
        this.$toast("课程信息错误,请重新选择课程")
        return
      }
      if (!this.form.name) {
        this.$toast("请输入任务名称")
        return
      }

      if (!this.form.duration) {
        this.$toast("请输入任务时长")
        return
      }

      if (this.form.duration > 9999) {
        this.$toast("任务时长最大只可以设置为9999")
        return
      }

      if (this.$route.query.type === 'lesson' || this.$route.query.type === 'material') {
        //微课、学资源任务判断
        if (!this.resourceInfo.coursewareId) {
          this.$toast("请选择课件")
          return
        }

        //判断是否不含试卷和未选择心得
        if (!this.form.comment && !this.testPaperId) {
          this.$toast("请选择心得或者试卷")
          return
        }
      }
      if (!this.form.resourceId) {
        this.$toast("未获取到资源编号，请返回重新选择")
        return
      }

      //时间判断
      if (this.form.time === "1") {
        //统一设置
        if (!this.form.time1) {
          this.$toast("请设置任务开始时间")
          return
        }
        if (!this.form.time2) {
          this.$toast("请设置任务结束时间")
          return
        }
      } else if (this.form.time === "2") {
        //分班设置
      } else {
        this.$toast("时间设置信息有误")
        return
      }

      //任务类型
      let taskType = ""
      let resourceType = ""
      let isDrag = ""
      if (this.$route.query.type === 'lesson') {
        if (this.testPaperId) {
          //微课+试卷
          taskType = "T01"
        } else {
          //微课+心得
          taskType = "T02"
        }
        resourceType = "R01"
        if (this.form.allowFast) {
          isDrag = "I01"
        } else {
          isDrag = "I02"
        }
      } else if (this.$route.query.type === 'material') {
        //学资源
        taskType = "T04";
        resourceType = "R01"

      } else if (this.$route.query.type === 'exam') {
        //试卷
        taskType = "T03";
        resourceType = "R02"
      } else if (this.$route.query.type === 'discuss') {
        //讨论
        taskType = "T06";
        resourceType = "R04"
      } else if (this.$route.query.type === 'spoken') {
        //口语
        taskType = "T13";
        resourceType = "R08"
      }

      //是否允许修改答案
      let modifyAfterSubmit = ""
      if (this.testPaperId) {
        if (this.form.allowEdit) {
          modifyAfterSubmit = "M02"
        } else {
          modifyAfterSubmit = "M01"
        }
      }

      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": 24,
        "tchCourseId": this.currentTchCourseId,
        "tastOrigin": "T03",
        "taskName": this.form.name,
        "tastType": taskType,
        "resourceType": resourceType,
        "resourceId": this.form.resourceId,
        "statusCd": "S01",
        "isRedo": "I01",
        "duration": this.form.duration,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "desc": this.form.desc,
        "courseType": "C01",
        "isDrag": isDrag,
        "testPaperId": this.testPaperId,
        "modifyAfterSubmit": modifyAfterSubmit,
        "sysTypeCd": "S02"
      };
      //发布任务的学生
      let classListSelect = []
      if (this.form.object == "2") {
        //按照分组
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            let subgroupIdList = []
            let accountNoList = []
            classListSelect.push(item.classId)
            item.tchSubGroup.forEach(group => {
              if (group.check) {
                subgroupIdList.push(group.tchClassSubGroupStudent.tchClassSubGroup.subgroupId)
                group.tchClassSubGroupStudent.tchSubGroupStudent.forEach(s => {
                  if (s.active) {
                    accountNoList.push(s.accountNo)
                  }
                })
              }
            })
            obj['subgroupIdList' + index] = subgroupIdList.join("|")
            obj['accountNoList' + index] = accountNoList.join("|")
            index++
          }
        });

        obj['classCount'] = classListSelect.length

      } else if (this.form.object === "1") {
        //按照班级
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            let accountNoList = []
            classListSelect.push(item.classId)
            for (let k in item.classStudent) {
              if (item.classStudent[k].active) {
                accountNoList.push(item.classStudent[k].accountNo)
              }
            }
            obj['accountNoList' + index] = accountNoList.join("|")
            index++
          }
        });

        obj['classCount'] = classListSelect.length

      } else {
        this.$toast("发任务对象错误")
        return
      }
      if (classListSelect.length === 0) {
        this.$toast('未选择班级学生')
        return
      }
      //时间设置
      if (this.form.time === "1") {
        //统一设置
        let start = this.form.time1
        let end = this.form.time2
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            obj['classTaskInfo' + index] = item.classId + '|' + start + '|' + end
            index++
          }
        })
      } else if (this.form.time === "2") {
        //分班设置
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            obj['classTaskInfo' + index] = item.classId + '|' + item.startDate + '|' + item.endDate
            index++
          }
        })
      } else {
        this.$toast("时间设置参数错误")
        return
      }

      console.log(obj)
      let params = {
        requestJson: JSON.stringify(obj)
      }
      this.showLoading = true
      createCourseTask(params).then(res => {
        if (res) {
          this.showLoading = false
          if (res.flag) {
            this.$router.push('/taskDetail?tchCourseId=' + this.currentTchCourseId + '&taskId=' + res.data[0].taskId)
            let taskInfo = {
              taskName: this.form.name,
              desc: this.form.desc,
              examCount: this.examCount,
              duration: this.form.duration,
              taskType: taskType
            };
            this.$store.commit('setSendTaskInfo', taskInfo)
          } else {
            this.$toast(res.msg)
          }
        } else {
          this.showLoading = false
          this.$toast("请求错误")
          return
        }
      }, error => {
        this.showLoading = false
      })
    },
    modifyTask() {
      if (!this.currentTchCourseId) {
        this.$toast("课程信息错误,请重新选择课程")
        return
      }
      if (!this.form.name) {
        this.$toast("请输入任务名称")
        return
      }

      if (!this.form.duration) {
        this.$toast("请输入任务时长")
        return
      }

      if (this.form.duration > 9999) {
        this.$toast("任务时长最大只可以设置为9999")
        return
      }

      if (this.$route.query.type === 'lesson' || this.$route.query.type === 'material') {
        //微课、学资源任务判断
        if (!this.resourceInfo.coursewareId) {
          this.$toast("请选择课件")
          return
        }

        //判断是否不含试卷和未选择心得
        if (!this.form.comment && !this.testPaperId) {
          this.$toast("请选择心得或者试卷")
          return
        }
      }
      if (!this.form.resourceId) {
        this.$toast("未获取到资源编号，请返回重新选择")
        return
      }

      //时间判断
      if (this.form.time === "1") {
        //统一设置
        if (!this.form.time1) {
          this.$toast("请设置任务开始时间")
          return
        }
        if (!this.form.time2) {
          this.$toast("请设置任务结束时间")
          return
        }
      } else if (this.form.time === "2") {
        //分班设置
      } else {
        this.$toast("时间设置信息有误")
        return
      }

      //任务类型
      let taskType = this.$route.query.taskType
      let resourceType = this.$route.query.resourceType
      let isDrag = ""

      if (taskType == "T01" || taskType == "T02") {
        if (this.form.allowFast) {
          isDrag = "I01"
        } else {
          isDrag = "I02"
        }
      }

      //是否允许修改答案
      let modifyAfterSubmit = ""
      if (this.testPaperId) {
        if (this.form.allowEdit) {
          modifyAfterSubmit = "M02"
        } else {
          modifyAfterSubmit = "M01"
        }
      }

      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": 24,
        "tchCourseId": this.currentTchCourseId,
        "taskName": this.form.name,
        "tastType": taskType,
        "resourceType": resourceType,
        "resourceId": this.form.resourceId,
        "statusCd": "S01",
        "isRedo": "I01",
        "duration": this.form.duration,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "desc": this.form.desc,
        "courseType": "C01",
        "isDrag": isDrag,
        "testPaperId": this.testPaperId,
        "modifyAfterSubmit": modifyAfterSubmit,
        "taskId": this.$route.query.taskId,
        // "layerStatus": '',

      };
      //发布任务的学生
      let classListSelect = []
      if (this.form.object == "2") {
        //按照分组
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            let subgroupIdList = []
            let accountNoList = []
            classListSelect.push(item.classId)
            item.tchSubGroup.forEach(group => {
              if (group.check) {
                subgroupIdList.push(group.tchClassSubGroupStudent.tchClassSubGroup.subgroupId)
                group.tchClassSubGroupStudent.tchSubGroupStudent.forEach(s => {
                  if (s.active) {
                    accountNoList.push(s.accountNo)
                  }
                })
              }
            })
            obj['subgroupIdList' + index] = subgroupIdList.join("|")
            obj['accountNoList' + index] = accountNoList.join("|")
            index++
          }
        });

        obj['classCount'] = classListSelect.length

      } else if (this.form.object === "1") {
        //按照班级
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            let accountNoList = []
            classListSelect.push(item.classId)
            for (let k in item.classStudent) {
              if (item.classStudent[k].active) {
                accountNoList.push(item.classStudent[k].accountNo)
              }
            }
            obj['accountNoList' + index] = accountNoList.join("|")
            index++
          }
        });

        obj['classCount'] = classListSelect.length

      } else {
        this.$toast("发任务对象错误")
        return
      }
      if (classListSelect.length === 0) {
        this.$toast('未选择班级学生')
        return
      }
      //时间设置
      if (this.form.time === "1") {
        //统一设置
        let start = this.form.time1
        let end = this.form.time2
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            obj['classTaskInfo' + index] = item.classId + '|' + start + '|' + end
            index++
          }
        })
      } else if (this.form.time === "2") {
        //分班设置
        let index = 1
        this.classList.forEach((item) => {
          if (item.check) {
            obj['classTaskInfo' + index] = item.classId + '|' + item.startDate + '|' + item.endDate
            index++
          }
        })
      } else {
        this.$toast("时间设置参数错误")
        return
      }

      console.log(obj)
      let params = {
        requestJson: JSON.stringify(obj)
      }
      this.showLoading = true
      modifyCourseTask(params).then(res => {
        if (res) {
          this.showLoading = false
          if (res.flag) {
            this.$toast.success("提交成功")
            eventBus.$emit(this.$route.query.from + "EditTask", true);
            this.$router.back()

          } else {
            this.$toast(res.msg)
          }
        } else {
          this.showLoading = false
          this.$toast("请求错误")
          return
        }
      }, error => {
        this.showLoading = false
      })
    }
  },
  computed: {
    teamList() {
      return this.$store.getters.getTeamList
    }
  },
  created() {

  },
  watch: {
    '$route'() {
      this.initClass()
    }
  },

}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.add-task {
  display: flex;
  flex-direction: column;

  .mgl5 {
    margin-left: -7px;
  }

  &__body {
    flex: 1;
    overflow-y: auto;

    &__cell {
      .allow-fast {
        padding-left: 43px;
        display: flex;
        align-items: center;

        .icon-check {
          vertical-align: initial;
        }
      }

      .select-wrap {
        background: #f5f6fa;
        border-radius: 5px;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;

        .comment-check {
          .icon-check {
            vertical-align: initial;
          }
        }

        &-desc {
          color: #666;
          font-size: 12px;
          padding-left: 25px;

          .gfy-checkbox-group {
            display: flex;
            flex-wrap: wrap;

            .normal {
              background: none;
              border: 1px solid #999;
              border-radius: 1.5px;
            }

            &-item {
              margin-right: 15px;
            }
          }
        }
      }

      .time-wrap {
        align-items: center;
        background: #f5f6fa;
        border-radius: 10px;
        display: flex;
        padding: 10px;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 5px;
        .class-name {
        }
        .divider {
          margin: 0 5px;
        }

        .time-view {
          flex: 1;
          /*width: 120px;*/
          height: 18px;
          background: #fff;
          border-radius: 10px;
          border: 1px solid #999;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
        }
      }

      .comment-check {
        margin-left: 10px;

        .icon-check {
          vertical-align: initial;
        }
      }

      .normal {
        background: none;
        border: 1px solid #999;
        border-radius: 1.5px;
      }

      .disabled {
        background: none;
        border: 1px solid #ccc;
      }

      &-ctn {
        display: flex;
        align-items: center;

        input {
          flex: 1;
          padding: 0 10px;
        }

        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }
      }

      .img-group {
        display: flex;
        flex-wrap: wrap;
        margin-top: 18px;

        .img-wrap {
          position: relative;
          flex: 0 0 107px;
          height: 70px;
          margin-right: 10px;
          margin-bottom: 10px;

          img {
            width: 100%;
            height: 100%;
          }

          i {
            position: absolute;
            right: -6px;
            top: -6px;
            width: 15px;
            height: 15px;
            font-size: 15px;
            color: #000;
          }
        }
      }

      .close,
      .add {
        color: @blue;
        margin-left: 10px;
      }

      .add {
        font-size: 22px;
      }

      textarea {
        background: #f5f6fa;
        border-radius: 5px;
        height: 105px;
        width: 100%;
        margin-top: 15px;
        padding: 10px;
      }
    }
  }

  &__footer {
    flex: 0 0 55px;
    padding: 5px 10px;

    .submit {
      width: 100%;
      border-radius: 22px;
      font-size: 16px;
    }
  }

  @{deep} .van-popup--bottom {
    overflow-y: hidden;
  }
}
</style>
