<template>
  <section class="add-group-wrap">
    <div class="add-group-wrap__body">
      <div class="add-group-wrap__body__group-name">
        <div class="aic jcsb mgb15">
          <span class="fs15">填写小组名称</span>
          <span class="red fs10">{{64 - groupName.length}}</span>
        </div>
        <van-field class="group-name-input" v-model="groupName" maxlength="64" placeholder="请输入名称，字数在64字内" />
      </div>
      <div class="add-group-wrap__body__group-list">
        <van-cell :title="isClassParent?'选择家长':'选择学生'" />
        <div v-for="(g,gi) in groupList" :key="gi">
          <van-cell :title="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName" />
          <div v-if='!isClassParent'>
            <van-cell v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si">
              <div @click="$set(s,'check',!s.check)" class="aic" slot="title">
                <div class="check-box" :class="{'is-active':s.check}"></div>
                <div class="aic">{{s.studentName}}<span v-if="s.cadreType === 'T02'" class="class-leader-badge">班</span><span v-if="s.identityType === 'I02'" class="group-leader-badge">组</span></div>
              </div>

              <div class="aic" @click="stuInfo=s;visible=true" style="justify-content: flex-end;height: 100%;">
                <div v-if="s.studentNumber" class="fs15 grey6 mgr10">学号: {{s.studentNumber}}</div>
                <van-icon name="arrow" style="vertical-align: middle;" />
              </div>
            </van-cell>
          </div>
          <div v-else>
            <van-cell v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" v-if='s.parentAccountNo' :key="si">
              <div @click="$set(s,'check',!s.check)" class="aic" slot="title">
                <div class="check-box" :class="{'is-active':s.check}"></div>
                <div class="aic">{{s.parentName?s.parentName:s.parentAccountNo}} —— {{s.studentName}}</div>
              </div>
            </van-cell>
          </div>

        </div>

      </div>
    </div>
    <div class="add-group-wrap__footer">
      <van-button @click="submit" :loading="btnLoading" loading-text="确定" type="info" class="btn">确定</van-button>
    </div>
    <setting-dialog @success="$toast('设置成功');getSubGroupStudent()" :visible.sync="visible" :classId="$route.params.classId" :stuInfo="stuInfo" :monitorInfo="monitor" :groupLeaderInfo="groupLeader"></setting-dialog>
  </section>
</template>

<script>
import { createClassSubGroup, getSubGroupStudent, addSubGroupStudentByBatch } from '@/api/index'
import settingDialog from './components/settingDialog'

export default {
  name: "addGroup",
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
      visible: false,
      stuInfo: {},
      btnLoading: false,
      isClassParent: this.$route.params.isClassParent
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.visible) {
      this.visible = false
      next(false)
    } else {
      next();
    }
  },
  methods: {
    getSubGroupStudent() {
      this.$store.commit('setVanLoading', true)
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "classId": this.$route.params.classId,
        "subjectType": localStorage.currentSubjectType
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      getSubGroupStudent(params).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          this.groupList = res.data
        } else {
          this.$toast(res.msg)
        }
      })
    },
    submit() {
      if (this.groupName) {
        const studentList = this.groupList.reduce((total, v, i) => {
          if (v.tchClassSubGroupStudent.tchSubGroupStudent) {
            let arr = v.tchClassSubGroupStudent.tchSubGroupStudent.reduce((t, s) => {
              if (s.check) {
                t.push({ accountNo: this.isClassParent?s.studentAccountNo:s.accountNo, oldSubGroupId: v.tchClassSubGroupStudent.tchClassSubGroup.subgroupId })
              }
              return t
            }, [])
            total.push(...arr)
          }
          return total
        }, [])
        if(studentList.length > 10) return this.$toast('小组人数不得超过10人')
        if (studentList.length) {
          this.createClassSubGroup(studentList)
        } else {
          this.$toast(this.isClassParent?'请选择家长':'请选择学生')
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
        "subjectType": this.isClassParent?'S20':localStorage.currentSubjectType,
        classId: this.$route.params.classId
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      try{MobclickAgent.onEvent(this.isClassParent?'myClassParentAddGroupSubmit':'addGroupSubmit')}catch(e){console.log(e)}
      createClassSubGroup(params).then(res => {
        this.btnLoading = false
        if (res.flag) {
          console.log(res,' createClassSubGroup res')
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
.add-group-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  &__body {
    flex: 1;
    overflow-y: auto;

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

    .btn {
      width: 100%;
      border-radius: 20px;
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
