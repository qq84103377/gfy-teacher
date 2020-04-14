<template>
  <section class="change-score-wrap">
    <van-nav-bar :title="$route.params.className" @click-left="goBack" left-arrow>
    </van-nav-bar>
    <div class="change-score-wrap__body">
      <van-cell title="家长信息" />
      <van-collapse v-model="activeNames">
        <van-collapse-item :name="gi" v-for="(g,gi) in groupList" :key="gi" :disabled='g.disabled'>
          <div slot="title">
            <van-checkbox class="parent-checkbox" style="margin-left: 0;" v-model="g.check" :title="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName" @click="changeGroupParent(g,gi)" :disabled='!g.tchClassSubGroupStudent.tchSubGroupStudent||(!g.tchClassSubGroupStudent.tchSubGroupStudent.some(v => v.parentAccountNo))'>
              <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
              {{g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName}}
            </van-checkbox>
          </div>
          <div class="change-score__body__group" v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" v-if='s.parentAccountNo' :key="si">
            <van-checkbox class="gfy-checkbox fs14" style="margin-left: 0;" v-model="s.check" @click="selectPreParent(g,s,si)">
              <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
              {{s.parentName?s.parentName:s.parentAccountNo}} <span class="fs14" style="color:#999;"> —— {{s.studentName}}</span>
            </van-checkbox>
          </div>
          <div class="change-score-wrap__body__group" v-if="!g.tchClassSubGroupStudent.tchSubGroupStudent||(!g.tchClassSubGroupStudent.tchSubGroupStudent.some(v => v.parentAccountNo))">
            此分组暂无成员
          </div>
        </van-collapse-item>

      </van-collapse>
    </div>
    <div class="change-score-wrap__footer">
      <van-button type="info" class="btn" id="add" @click="changeScore(),addScore=true">加分</van-button>
      <van-button type="info" class="btn" id="sub" @click="changeScore(),addScore=false">减分</van-button>
    </div>

    <van-dialog v-model="showAddBox" show-cancel-button confirmButtonColor='#39f0dd' :before-close='confirmChange'>
      <van-field label-class="gfy-label" required label="请输入分值:">
        <div slot="input" class="input-wrap">
          <input type='number' maxlength="2" v-model.trim="form.score" @focus="showMask = true" style="width: 50%;" />
          <span class="num-tip fs14">0≤分值≤20</span>
        </div>
      </van-field>
      <van-cell class='van-cell--required'>
        <div slot="title" class="gfy-label">
          <div class="jcsb aic">
            <span>请输入{{addScore?'加分':'减分'}}原因:</span>
            <span class="fs14" style="color: red">{{200 - form.desc.length}}</span>
          </div>
          <textarea :placeholder='`请输入${addScore?"加分":"减分"}原因，字数在200字内`' maxlength="200" v-model.trim="form.desc" class="gfy-textarea" rows="3"></textarea>
        </div>
      </van-cell>
    </van-dialog>
  </section>
</template>

<script>
// T01加分  T02减分
import { createClassSubGroup, getSubGroupStudent, addSubGroupStudentByBatch, saveParentRewardScore } from '@/api/index'
import settingDialog from '../myClass/components/settingDialog'

export default {
  name: "changeScore",
  components: { settingDialog },
  computed: {
    monitor() {
      let obj = {}
      for (let k in this.groupList) {
        const item = this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent ?
          this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent.find(s => s.cadreType === 'T02') : ''
        if (item) {
          obj = item
          break
        }
      }
      return obj
    },
    groupLeader() {
      let obj = {}
      for (let k in this.groupList) {
        const item = this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent ?
          this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent.find(s => s.identityType === 'I02') : ''
        if (item) {
          obj = item
          break
        }
      }
      return obj
    }
  },
  data() {
    return {
      groupName: '',
      groupList: JSON.parse(JSON.stringify(this.$route.params.groupList)),
      activeNames: ['0'],
      showAddBox: false,
      form: {
        score: '',
        desc: ''
      },
      addScore: true,
      isClassParent: this.$route.params.isClassParent
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.showAddBox) {
      this.showAddBox = false
      next(false)
    } else {
      next();
    }
  },
  mounted() {
    // this.groupList.filter(ele=>{
    //   if (!ele.tchClassSubGroupStudent.tchSubGroupStudent||!ele.tchClassSubGroupStudent.tchSubGroupStudent.length) {
    //     this.$set(ele, 'disabled', false)
    //   }
    // })
  },
  methods: {
    goBack() {
      this.common.goBack(this)
    },
    changeScore() {
      const studentList = this.groupList.reduce((total, v, i) => {
        if (v.tchClassSubGroupStudent.tchSubGroupStudent) {
          let arr = v.tchClassSubGroupStudent.tchSubGroupStudent.reduce((t, s) => {
            if (s.check) {
              t.push(this.isClassParent ? s.parentAccountNo : s.studentAccountNo)
            }
            return t
          }, [])
          total.push(...arr)
        }
        return total
      }, [])
      if (studentList.length) {
        this.showAddBox = true
      } else {
        this.$toast('请选择家长!')
      }
    },
    confirmChange(action, done) {
      if (action === 'cancel') {
        done()
        return
      }
      const studentList = this.groupList.reduce((total, v, i) => {
        if (v.tchClassSubGroupStudent.tchSubGroupStudent) {
          let arr = v.tchClassSubGroupStudent.tchSubGroupStudent.reduce((t, s) => {
            if (s.check) {
              t.push(this.isClassParent ? s.parentAccountNo : s.studentAccountNo)
            }
            return t
          }, [])
          total.push(...arr)
        }
        return total
      }, [])
      if (!studentList.length) {
        this.$toast('请选择家长!')
        done()
        return
      }

      if (!this.form.score) {
        this.$toast('请输入分值!')
        done(false)
        return
      }

      if (this.form.score > 20 || this.form.score < 0) {
        this.$toast('请输入分值在0~20之间')
        done(false)
        return
      }

      if (!this.form.desc) {
        this.$toast('请输入原因!')
        done(false)
        return
      }

      this.saveParentRewardScore(studentList.toString())
      done()

    },
    saveParentRewardScore(studentList) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        type: this.addScore ? 'T01' : 'T02',
        score: this.form.score,
        subjectType: 'S20',
        classId: this.$route.params.classId,
        accountNoList: studentList,
        rewardReason: this.form.desc,
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      saveParentRewardScore(params).then(res => {
        console.log("saveParentRewardScore res", res)
        if (res.flag) {
          this.$toast(res.msg)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    selectPreParent(item, element, index) {
      this.$set(element, 'check', !element.check)
      const i = item.tchClassSubGroupStudent.tchSubGroupStudent.findIndex(ele => {
        if (ele.parentAccountNo && ele.check) {
          return true
        }
      })
      if (i > -1) {
        this.$set(item, 'check', true)
      } else {
        this.$set(item, 'check', false)
      }
    },
    changeGroupParent(item, index) {
      item.disabled = true
      setTimeout(() => {
        item.disabled = false
        this.$set(item, 'disabled', false)
        this.$forceUpdate()
      }, 0);

      if (!item.tchClassSubGroupStudent.tchSubGroupStudent || (!item.tchClassSubGroupStudent.tchSubGroupStudent.some(v => v.parentAccountNo))) return

      this.$set(item, 'check', !item.check)

      item.tchClassSubGroupStudent.tchSubGroupStudent.forEach(ele => {
        if (ele.parentAccountNo) {
          this.$set(ele, 'check', item.check)
        }
      })

    },

    submit() {
      if (this.groupName) {
        const studentList = this.groupList.reduce((total, v, i) => {
          if (v.tchClassSubGroupStudent.tchSubGroupStudent) {
            let arr = v.tchClassSubGroupStudent.tchSubGroupStudent.reduce((t, s) => {
              if (s.check) {
                t.push({ accountNo: s.accountNo, oldSubGroupId: s.subgroupId })
              }
              return t
            }, [])
            total.push(...arr)
          }
          return total
        }, [])
        if (studentList.length) {
          this.createClassSubGroup(studentList)
        } else {
          this.$toast('请选择学生')
        }
      } else {
        this.$toast('请输入组名')
      }
    },
    createClassSubGroup(studentList) {
      this.btnLoading = true
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        subGroupName: this.groupName,
        "subjectType": localStorage.currentSubjectType,
        classId: this.$route.params.classId
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      createClassSubGroup(params).then(res => {
        this.btnLoading = false
        if (res.flag) {
          this.addSubGroupStudentByBatch(res.data[0].tchClassSubGroup.subgroupId, studentList)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    addSubGroupStudentByBatch(subGroupId, studentList) {
      this.btnLoading = true
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        subGroupId,
        studentList
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      addSubGroupStudentByBatch(params).then(res => {
        this.btnLoading = false
        if (res.flag) {
          this.$toast('新建成功')
          this.groupName = ''
          this.$router.back()
        } else {
          this.$toast(res.msg)
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.change-score-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  @{deep} .van-dialog {
    padding-top: 10px;
    .gfy-label {
      font-size: 15px;
      color: #000;

      .gfy-textarea {
        width: 100%;
        margin-top: 15px;
        background: #f5f6fa;
        padding: 15px 12px;
        border-radius: 5px;
        color: #1e1e1e;
        font-size: 14px;
      }
    }
    .input-wrap {
      position: relative;
      padding-right: 40px;

      input {
        padding-left: 5px;
        background: #f5f6fa;
        border-radius: 5px;
        color: #1e1e1e;
      }

      .num-tip {
        position: absolute;
        color: grey;
        font-size: 10px;
        right: 22px;
        top: 50%;
        transform: translateY(-50%);
      }

      .close {
        margin-left: 10px;
        position: absolute;
        font-size: 15px;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        color: @blue;
      }
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;

    .class-select {
      padding-left: 10px;
      .parent-checkbox {
        margin-left: -10px !important;
        margin-bottom: 8px;
      }
    }

    .normal {
      background: none;
      border: 1px solid #999;
      border-radius: 1.5px;
    }

    @{deep}.van-collapse-item__content {
      .change-score__body__group {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
      }
    }

    @{deep}.parent-checkbox {
      width: 80%;
    }

    &__group-name {
      background: #fff;
      padding: 10px;
      margin-bottom: 10px;

      .group-name-input {
        width: 100%;
        background: #f5f6fa;
        border-radius: 5px;
      }
    }

    &__group-list {
      background: #fff;
      .class-leader-badge,
      .group-leader-badge {
        width: 17px;
        line-height: 17px;
        border-radius: 50%;
        margin-left: 6px;
        color: #fff;
        font-size: 10px;
        background: #f06839;
        text-align: center;
      }
      .group-leader-badge {
        background: #f0ad39;
      }
      .check-box {
        flex: 0 0 16px;
        height: 16px;
        border: 1px solid #999;
        border-radius: 1.5px;
        margin-right: 9px;

        &.is-active {
          background: url("../../assets/img/icon-check.png") no-repeat center
            center;
          background-size: contain;
          border: 1px solid transparent;
        }
      }
    }
  }

  &__footer {
    flex: 0 0 55px;
    padding: 5px 18px;
    background: #fff;
    align-items: center;
    justify-content: space-between;
    display: flex;
    position: relative;

    .btn {
      padding: 0;
      border-radius: 20px;
      color: #fff;
      font-size: 18px;
      margin-left: 10px;
      flex: 1;
      position: relative;

      &:first-child {
        margin-right: 0;
      }
    }
  }
}
</style>
