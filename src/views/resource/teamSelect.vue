<template>
  <section class="team-select-wrap">
    <div class="wrap__tab van-hairline--top" v-if="$route.query.isResend">
      <div @click="changeScoreType(1)" :class="{active:scoreType==1}">默认显示</div>
      <div @click="changeScoreType(2)" :class="{active:scoreType==2}">显示成绩</div>
      <i @click="showTip=true" style="vertical-align: baseline" class="iconGFY icon-tip psa"></i>
    </div>
    <div class="team-select-wrap__body">
      <div class="class-select" v-if="$route.query.type === 'team'" v-for="(item,index) in list" :key="index">
        <!--        <van-checkbox class="parent-checkbox" style="margin-left: 0;" v-model="item.check" :title="item.className" :disabled="!item.tchSubGroup || item.tchSubGroup.length==0 " @click="handleSelectGroupClass(item)">-->
        <!--          <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>-->
        <!--          {{item.className}}-->
        <!--        </van-checkbox>-->

        <div class="jcsb aic mgb10">
          <van-checkbox class="parent-checkbox" style="margin-left: 0;" v-model="item.check" :title="item.className" :disabled="!item.tchSubGroup || item.tchSubGroup.length==0 " @click="handleSelectGroupClass(item)">
            <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
            {{item.className}}
            <span class="mglt10">{{calStuNum(item)}}/{{calGroupNum(item.tchSubGroup)}}</span>
          </van-checkbox>
          <van-icon @click="$set(item,'open',!item.open)" class="mgr10" :name="item.open?'arrow-down':'arrow-up'" />
        </div>
        <div class="team-select-wrap__body__group" v-show="item.open" v-if="!item.tchSubGroup || item.tchSubGroup.length==0">
          此班级无分组
        </div>
        <div class="team-select-wrap__body__group" v-show="item.open" v-else v-for="(g,gi) in item.tchSubGroup" :key="gi">
          <van-checkbox class="gfy-checkbox" style="margin-left: 0;" v-model="g.check" @click="handleSelectParent(g,item)" :disabled="!g.tchClassSubGroupStudent.tchSubGroupStudent || g.tchClassSubGroupStudent.tchSubGroupStudent.length==0">
            <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
            {{g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName}}
          </van-checkbox>
          <div v-if="isfEducation!=='true'" class="team-select-wrap__body__group-wrap">
            <div @click="handleSelectGroupStudent(s,g,item)" v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
              <!-- <span v-if="s.studentNumber>0">{{s.studentNumber}}</span> -->
              {{s.accountNo| getStudentName(item.classId)}}
            </div>
          </div>
          <div v-else class="team-select-wrap__body__group-wrap">
            <div @click="handleSelectGroupStudent(s,g,item)" v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
              {{s.parentName?s.parentName:s.parentAccountNo}}
            </div>
          </div>
        </div>
      </div>

      <!-- <van-radio-group v-if="$route.query.isResend" style="display: flex;margin-bottom:10px" v-model="scoreType" @change="changeScoreType">
        <van-radio name="1" class="mgr10"><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
          默认显示
        </van-radio>
        <van-radio name="2" class="mgr10" :disabled='!isTest'><i slot="icon" slot-scope="props" :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
          显示成绩
        </van-radio>
      </van-radio-group> -->

      <div v-if='$route.query.isResend&&isTest'>
        <div v-show="scoreType==2">
          <div class="team-select-wrap__body__group" v-if="$route.query.type === 'class'" v-for="(c,ci) in list" :key="ci">
            <div class="jcsb aic">
              <van-checkbox class="gfy-checkbox" style="margin-left: 0;" v-model="c.check" @click="handleSelectParent(c)" :disabled="c.disabled">
                <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
                {{c.className}}
                <span class="mglt10">{{calStuNum(c)}}/{{Object.keys(c.classStudent).length}}</span>
              </van-checkbox>
              <van-icon @click="$set(c,'open',!c.open)" class="mgr10" :name="c.open?'arrow-down':'arrow-up'" />
            </div>
            <div v-show="c.open" class="scopeBox" v-for="(sc,sci) in scoreSpan" :key="sci">
              <div class="jcsb aic">
                <van-checkbox class="gfy-checkbox" style="margin-left: 0;" v-model="sc.check" @click="handleSelectScoreParent(sc)" :disabled="!sc.stu.length">
                  <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
                  {{sc.name}}
                  <span class="mglt10">{{calStuScoNum(sc)}}/{{sc.stu.length}}</span>
                </van-checkbox>
              </div>
              <div class="team-select-wrap__body__group-wrap">
                <div @click="handleSelectScoreChild(s,sc,c)" v-for="(s,si) in sc.stu" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
                  {{s.name}} {{s.isFinish=="S03"?s.score+'分':(s.score?s.score+'分':'--分')}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show='scoreType=="1"'>
        <div class="team-select-wrap__body__group" v-if="$route.query.type === 'class'" v-for="(c,ci) in list" :key="ci">
          <div class="jcsb aic">
            <van-checkbox class="gfy-checkbox" style="margin-left: 0;" v-model="c.check" @click="handleSelectParent(c)" :disabled="c.disabled">
              <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
              {{c.className}}
              <span class="mglt10">{{calStuNum(c)}}/{{Object.keys(c.classStudent).length}}</span>
            </van-checkbox>
            <van-icon @click="$set(c,'open',!c.open)" class="mgr10" :name="c.open?'arrow-down':'arrow-up'" />
          </div>
          <div v-if="isfEducation!=='true'" v-show="c.open" class="team-select-wrap__body__group-wrap">
            <div @click="handleSelectChild(s,c)" v-for="(s,si) in c.classStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
              <!-- <span v-if="s.studentNumber>0">{{s.studentNumber}}</span> -->
              {{s.accountNo|getStudentName(c.classId)}}
            </div>
          </div>

          <div v-else v-show="c.open" class="team-select-wrap__body__group-wrap">
            <div @click="handleSelectChild(s,c)" v-for="(s,si) in c.classStudent" :key="si" :class="['team-select-wrap__body__group-wrap-item',{active:s.active}]">
              {{s.parentName?s.parentName:s.parentAccountNo}}
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="team-select-wrap__footer">
      <van-button type="info" class="confirm" @click="handleConfirm">确定</van-button>
    </div>
    <van-popup round v-model="showTip">
      <div class="pd10 fs16 tip-wrap">
        <div style="text-align: center;font-weight:700" class="fs18">显示成绩说明</div>
        <div class="mgt5">{{isfEducation?'家长':'学生'}}完成该试卷任务的具体成绩，如果是心得/讨论任务则没有具体的成绩。</div>
      </div>
    </van-popup>
  </section>
</template>

<script>
import * as calculate from '@/utils/calculate'
import { getStudentName, getParentName } from '@/utils/filter'
export default {
  name: "teamSelect",
  data() {
    return {
      list: [],
      sendStudent: {},
      sendGroup: {},
      isfEducation: this.$route.query.isfEducation,
      isResend: this.$route.query.isResend,
      testPaperId: this.$route.query.testPaperId,
      isSwitchChange: this.$route.query.isSwitchChange,
      scoreType: 1,
      taskFinishInfo: '',
      scoreSpan: [],
      resendList: [],
      isTest: false,
      showTip: false,
    }
  },
  created() {
    let classInfo = this.$store.getters.getTaskClassInfo
    if (classInfo) {
      this.list = JSON.parse(classInfo);
    }

    console.log(this.list, 'this.list')
    //获取选中班级学生
    this.sendStudent = this.$store.getters.getSendTaskClassStudent
    //获取选中班级分组
    this.sendGroup = this.$store.getters.getSendTaskClassSubGroup
    //this.list = JSON.parse(JSON.stringify(this.$store.getters.getTeamList))

    let taskFinishInfo = this.$store.getters.getTaskFinishInfo
    if (taskFinishInfo) {
      this.taskFinishInfo = JSON.parse(taskFinishInfo);
    }
    console.log(this.taskFinishInfo, 'this.taskFinishInfo')
    if (this.isResend) {
      this.isTest = this.taskFinishInfo.taskType == 'T03' || this.taskFinishInfo.taskType == 'T05' || (this.taskFinishInfo.taskType == 'T04' && this.testPaperId && this.testPaperId !== 0) || (this.taskFinishInfo.taskType == 'T01')|| (this.taskFinishInfo.taskType == 'T13')
      console.log(this.isTest, 'this.isTest')
      if (!this.isTest) return
      this.initResendScore()
    }
  },
  methods: {
    /**数组根据数组对象中的某个属性值进行排序的方法 
     * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
     * @param attr 排序的属性 如number属性
     * @param rev true表示升序排列，false降序排序
     * */
    sortBy(attr, rev) {
      //第二个参数没有传递 默认升序排列
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = (rev) ? 1 : -1;
      }
      return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      }
    },
    initResendScore() {
      if (!this.isSwitchChange) {
         //排序
      let arr = []
      this.taskFinishInfo.studentStatList.sort(this.sortBy('score', false))
      this.taskFinishInfo.studentStatList.forEach(v => {
        if (v.isFinish == "S03") {
          arr.push({
            name: this.isfEducation ? getParentName(v.accountNo, this.taskFinishInfo.classId) : getStudentName(v.accountNo, this.taskFinishInfo.classId),
            accountNo: v.accountNo,
            score: v.score,
            isFinish: v.isFinish
          })
        }
      })

      this.taskFinishInfo.studentStatList.forEach(v => {
        if (v.isFinish !== "S03") {
          arr.push({
            name: this.isfEducation ? getParentName(v.accountNo, this.taskFinishInfo.classId) : getStudentName(v.accountNo, this.taskFinishInfo.classId),
            accountNo: v.accountNo,
            score: v.score,
            isFinish: v.isFinish
          })
        }
      })
      }else{
         //排序
      let arr = []
      this.taskFinishInfo.studentStatList.forEach(v => {
          arr.push({
            name: this.isfEducation ? getParentName(v.accountNo, this.taskFinishInfo.classId) : getStudentName(v.accountNo, this.taskFinishInfo.classId),
            accountNo: v.accountNo,
            score: v.score,
            isFinish: v.isFinish
          })
      })
      }
     

      // let obj = {};
      // arr.map((e) => {
      //   obj[e.accountNo] = e;
      // })

      // this.taskFinishInfo.studentStatList = JSON.parse(JSON.stringify(obj))

      //分分数段
      if (this.taskFinishInfo.testPaperScore >= 20) {
        this.scoreSpan = [
          { name: `满分${this.taskFinishInfo.testPaperScore}`, min: 1, max: 2, stu: [] },
          {
            name: `${calculate.mul(this.taskFinishInfo.testPaperScore, 0.9, 0)}-${Math.floor(this.taskFinishInfo.testPaperScore * 0.999)}分`,
            min: 0.9,
            max: 1,
            stu: []
          },
          {
            name: `${calculate.mul(this.taskFinishInfo.testPaperScore, 0.8, 0)}-${Math.floor(this.taskFinishInfo.testPaperScore * 0.899)}分`,
            min: 0.8,
            max: 0.9,
            stu: []
          },
          {
            name: `${calculate.mul(this.taskFinishInfo.testPaperScore, 0.7, 0)}-${Math.floor(this.taskFinishInfo.testPaperScore * 0.799)}分`,
            min: 0.7,
            max: 0.8,
            stu: []
          },
          {
            name: `${calculate.mul(this.taskFinishInfo.testPaperScore, 0.6, 0)}-${Math.floor(this.taskFinishInfo.testPaperScore * 0.699)}分`,
            min: 0.6,
            max: 0.7,
            stu: []
          },
          {
            name: `${calculate.mul(this.taskFinishInfo.testPaperScore, 0.6, 0)}分以下`,
            min: 0,
            max: 0.6,
            stu: []
          },
          { name: '未提交', stu: [] },
        ]
      } else {
        //总分小于20
        this.scoreSpan = [
          { name: `满分${this.taskFinishInfo.testPaperScore}`, min: 1, max: 2, stu: [] },
          {
            name: `${calculate.mul(this.taskFinishInfo.testPaperScore, 0.6, 0)}-${Math.floor(this.taskFinishInfo.testPaperScore * 0.999)}分`,
            min: 0.6,
            max: 1,
            stu: []
          },
          {
            name: `${calculate.mul(this.taskFinishInfo.testPaperScore, 0.6, 0)}分以下`,
            min: 0,
            max: 0.6,
            stu: []
          },
          { name: '未提交', stu: [] },
        ]
      }
    },
    changeScoreType(scoreType) {
      if (this.scoreType == scoreType) return

      if (scoreType === 1) {
        this.scoreType = scoreType
      } else {
        if (!this.isTest) {
          this.$toast("心得/讨论任务没有成绩无法查看")
          return
        }
        this.scoreType = scoreType
        let chooseList = []
        for (let i3 in this.list[0].classStudent) {
          if (this.list[0].classStudent[i3].active) {
            chooseList = Array.from(new Set([...chooseList, this.isfEducation ? this.list[0].classStudent[i3].parentAccountNo : this.list[0].classStudent[i3].accountNo]))
          }
        }

        console.log(chooseList, 'chooseList')

        if (chooseList.length && chooseList[0]) {
          chooseList.forEach(element => {
            // this.taskFinishInfo.studentStatList[element].active = true
            this.taskFinishInfo.studentStatList.some(item=>{
              if (item.accountNo==element) {
                item.active = true
                return true
              }
            })
          })
        }

        this.scoreSpan.forEach(ele => {
          ele.stu = []
        })


        // 分段学生
        for (const key in this.taskFinishInfo.studentStatList) {
          let percent = 0
          if (this.taskFinishInfo.testPaperScore > 0) {
            // percent = Number((v.score / this.taskFinishInfo.testPaperScore * 100).toFixed(2))
            percent = calculate.div(this.taskFinishInfo.studentStatList[key].score, this.taskFinishInfo.testPaperScore, 2)
          }
          if (this.taskFinishInfo.finishStudent.includes(this.taskFinishInfo.studentStatList[key].accountNo)) {
            const index = this.scoreSpan.findIndex(s => percent >= s.min && percent < s.max)
            this.scoreSpan[index].stu.push({
              name: this.isfEducation ? getParentName(this.taskFinishInfo.studentStatList[key].accountNo, this.taskFinishInfo.classId) : getStudentName(this.taskFinishInfo.studentStatList[key].accountNo, this.taskFinishInfo.classId),
              accountNo: this.taskFinishInfo.studentStatList[key].accountNo,
              score: this.taskFinishInfo.studentStatList[key].score,
              isFinish: this.taskFinishInfo.studentStatList[key].isFinish,
              active: this.taskFinishInfo.studentStatList[key].active,
            })
            if (this.taskFinishInfo.studentStatList[key].active) {
              this.scoreSpan[index].check = true
            }
          } else {
            this.scoreSpan[this.scoreSpan.length - 1].stu.push({
              name: this.isfEducation ? getParentName(this.taskFinishInfo.studentStatList[key].accountNo, this.taskFinishInfo.classId) : getStudentName(this.taskFinishInfo.studentStatList[key].accountNo, this.taskFinishInfo.classId),
              accountNo: this.taskFinishInfo.studentStatList[key].accountNo,
              score: this.taskFinishInfo.studentStatList[key].score,
              isFinish: this.taskFinishInfo.studentStatList[key].isFinish,
              active: this.taskFinishInfo.studentStatList[key].active
            })
            if (this.taskFinishInfo.studentStatList[key].active) {
              this.scoreSpan[this.scoreSpan.length - 1].check = true
            }
          }
        }

      }

    },
    handleSelectScoreChild(scoreItem, spanItem, classItem) {
      this.$set(scoreItem, 'active', !scoreItem.active)

      // this.$set(classItem.classStudent[scoreItem.accountNo], 'active', scoreItem.active)
      // this.$set(this.taskFinishInfo.studentStatList[scoreItem.accountNo], 'active', scoreItem.active)

        for (let k in classItem.classStudent) {
          if (classItem.classStudent[k].accountNo==scoreItem.accountNo) {
            classItem.classStudent[k].active=scoreItem.active
            break
          }
        }

      this.taskFinishInfo.studentStatList.some(item=>{
         if (item.accountNo==scoreItem.accountNo) {
           item.active = scoreItem.active
           return true
         }
       })

      if (scoreItem.active) {
        this.$set(classItem, 'check', true)
        this.$set(spanItem, 'check', true)
      } else {
        let classStudent = classItem.classStudent
        let flag = false
        for (let k in classStudent) {
          if (classStudent[k].active) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.$set(item, 'check', false)
        }

        let spanFlag = false
        spanItem.stu.some(ele => {
          if (ele.active) {
            spanFlag = true
            return true
          }
        })
        if (!spanFlag) {
          this.$set(spanItem, 'check', false)
        }
      }
    },
    handleSelectScoreParent(spanItem) {
      if (!spanItem.stu.length) return
      this.$set(spanItem, 'check', !spanItem.check)
      spanItem.stu.forEach(ele => {
        this.$set(ele, 'active', spanItem.check)
        // this.$set(this.list[0].classStudent[ele.accountNo], 'active', spanItem.check)
        // this.$set(this.taskFinishInfo.studentStatList[ele.accountNo], 'active', spanItem.check)
         for (let k in this.list[0].classStudent) {
          if (this.list[0].classStudent[k].accountNo==ele.accountNo) {
            this.list[0].classStudent[k].active=spanItem.check
            break
          }
        }
         this.taskFinishInfo.studentStatList.some(item=>{
         if (item.accountNo==ele.accountNo) {
           item.active = spanItem.check
           return true
         }
       })
      })
    },
    calStuScoNum(groupList) {
      return groupList.stu.reduce((t, v) => {
        if (v.active) t++
        return t
      }, 0)
    },
    calGroupNum(groupList) {
      return groupList.reduce((t, v) => {
        if (v.tchClassSubGroupStudent && v.tchClassSubGroupStudent.tchSubGroupStudent) {
          t += v.tchClassSubGroupStudent.tchSubGroupStudent.length || 0
        }
        return t
      }, 0)
    },
    calStuNum(item) {
      if (this.$route.query.type === 'class') {
        //按班
        return Object.keys(item.classStudent).reduce((t, v) => {
          if (item.classStudent[v].active) t++
          return t
        }, 0)
      } else {
        //按组
        return item.tchSubGroup.reduce((total, v) => {
          if (v.tchClassSubGroupStudent && v.tchClassSubGroupStudent.tchSubGroupStudent) {
            total += v.tchClassSubGroupStudent.tchSubGroupStudent.reduce((t, s) => {
              if (s.active) t++
              return t
            }, 0)
          }
          return total
        }, 0)
      }
    },
    handleConfirm() {
      this.$store.commit('setTeamList', this.list)
      this.$store.commit("setTaskClassInfo", JSON.stringify(this.list))
      this.$router.back()
    },
    handleSelectGroupClass(item) {
      if (!item.tchSubGroup || item.tchSubGroup.length == 0) return
      this.$set(item, 'check', !item.check)
      item.tchSubGroup.forEach(ele => {
        if (ele.tchClassSubGroupStudent && ele.tchClassSubGroupStudent.tchSubGroupStudent) {
          ele.check = !item.check
          this.handleSelectParent(ele)
        }
      })
    },
    handleSelectChild(s, item) {
      this.$set(s, 'active', !s.active)
      if (s.active) {
        this.$set(item, 'check', true)
      } else {
        let classStudent = item.classStudent
        let flag = false
        for (let k in classStudent) {
          if (classStudent[k].active) {
            flag = true
            break
          }
        }
        if (!flag) {
          this.$set(item, 'check', false)
        }
      }


      if (this.isTest && this.isResend) {
      // this.$set(this.isfEducation ? this.taskFinishInfo.studentStatList[s.parentAccountNo] : this.taskFinishInfo.studentStatList[s.accountNo], 'active', s.active)
        if (this.isfEducation) {
          this.taskFinishInfo.studentStatList.some(item=>{
         if (item.accountNo==s.parentAccountNo) {
           item.active = s.active
           return true
         }
       })
        }else{
          this.taskFinishInfo.studentStatList.some(item=>{
         if (item.accountNo==s.accountNo) {
           item.active = s.active
           return true
         }
       })
        }
        
        
      }
    },
    handleSelectParent(p, item) {
      if (p.classStudent || (p.tchClassSubGroupStudent && p.tchClassSubGroupStudent.tchSubGroupStudent)) {
        this.$set(p, 'check', !p.check)
      }
      let classStudent = p.classStudent
      for (let k in classStudent) {
        classStudent[k].active = p.check
      }

      if (p.tchClassSubGroupStudent && p.tchClassSubGroupStudent.tchSubGroupStudent) {
        let groupStudent = p.tchClassSubGroupStudent.tchSubGroupStudent
        for (let k in groupStudent) {
          groupStudent[k].active = p.check
        }
      }

      if (item) {
        let flag1 = false
        for (let sub of item.tchSubGroup) {
          if (sub.check) {
            flag1 = true
            break
          }
        }
        item.check = flag1
      }

      if (this.isTest && this.isResend) {
        this.scoreSpan.forEach(ele => {
          if (ele.stu.length) {
            this.$set(ele, 'check', p.check)
            ele.stu.forEach(element => {
              this.$set(element, 'active', p.check)
            })
          }
        })
        for (const key in this.taskFinishInfo.studentStatList) {
          this.$set(this.taskFinishInfo.studentStatList[key], 'active', p.check)
        }
      }

    },
    handleSelectGroupStudent(s, group, item) {
      this.$set(s, 'active', !s.active)
      let flag = false
      for (let stu of group.tchClassSubGroupStudent.tchSubGroupStudent) {
        if (stu.active) {
          flag = true
          break
        }
      }
      group.check = flag
      let flag1 = false
      for (let sub of item.tchSubGroup) {
        if (sub.check) {
          flag1 = true
          break
        }
      }
      item.check = flag1
    }
  },
  beforeRouteLeave (to, from, next) {
    if(this.showTip){
      this.showTip=false
      next(false)
    }else{
      next()
    }
  }

}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.team-select-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 10px 15px;
    .class-select {
      padding-left: 10px;
      .parent-checkbox {
        margin-left: -10px !important;
        /*margin-bottom: 8px;*/
      }
    }

    .normal {
      background: none;
      border: 1px solid #999;
      border-radius: 1.5px;
    }
    &__group {
      background: #fff;
      font-size: 14px;
      border-radius: 5px;
      margin-bottom: 10px;
      .gfy-checkbox {
        padding: 16px 0 10px 5px;

        i {
          vertical-align: inherit;
        }
      }

      &-wrap {
        padding-left: 5px;
        display: flex;
        flex-wrap: wrap;

        &-item {
          flex: 0 0 98px;
          line-height: 32px;
          border-radius: 15px;
          font-size: 12px;
          margin-right: 14px;
          margin-bottom: 10px;
          background: #eee;
          color: #333;
          text-align: center;
          > span {
            margin-right: 7px;
          }
          &:nth-child(3n) {
            margin-right: 0;
          }

          &.active {
            background: @blue;
            color: #fff;
          }
        }
      }

      .scopeBox {
        padding: 0 10px;
        .team-select-wrap__body__group-wrap-item {
          flex: 0 0 94px;
        }
      }
    }
  }

  &__footer {
    flex: 0 0 55px;
    padding: 5px 10px;

    .confirm {
      width: 100%;
      font-size: 16px;
      border-radius: 22px;
    }
  }
  .radio-normal {
    border: 1px solid #999;
    border-radius: 50%;
    background: none;
  }
  .wrap__tab {
    background-color: #fff;
    flex: 0 0 48px;
    padding: 10px 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      border-radius: 15px;
      font-size: 15px;
      color: #999;
      background: #f5f6fa;
      margin-right: 20px;
      line-height: 30px;
      padding: 0 15px;

      &.active {
        background: linear-gradient(
          0deg,
          rgba(57, 240, 221, 1),
          rgba(140, 247, 238, 1)
        );
        color: #fff;
      }

      &:nth-child(2) {
        margin-right: 2px;
      }
    }
  }
  @{deep} .van-popup {
    width: 280px;
  }
}
</style>
