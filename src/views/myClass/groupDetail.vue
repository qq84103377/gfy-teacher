<template>
  <section class="group-detail-wrap">
    <van-nav-bar :title="groupList[curIndex].tchClassSubGroupStudent.tchClassSubGroup.subgroupName" @click-left="goBack" left-arrow>
    </van-nav-bar>
    <div class="group-detail-wrap__body">
      <div class="mgb10" :class="{disabled:isAdd}" style="position: relative;">
        <van-cell title="组员" />
        <van-cell v-for="(item,index) in groupList[curIndex].tchClassSubGroupStudent.tchSubGroupStudent" :key="index">
          <div @click="$set(item,'check',!item.check);stuInfo=item" class="aic" slot="title">
            <div class="aic">
              <div class="check-box" :class="{'is-active':item.check}"></div>
              <div class="aic">
                {{item.studentName}}
                <span v-if="item.cadreType === 'T02'" class="class-leader-badge">班</span><span v-if="item.identityType === 'I02'" class="group-leader-badge">组</span>
              </div>
            </div>
          </div>
          <div class="aic" style="justify-content: flex-end">
            <div v-if="item.studentNumber" class="fs15 grey6 mgr10">学号: {{item.studentNumber}}</div>
            <van-icon name="arrow" @click="stuInfo=item;visible=true" style="vertical-align: middle;" />
          </div>
        </van-cell>
        <div v-if="(!groupList[curIndex].tchClassSubGroupStudent.tchSubGroupStudent || groupList[curIndex].tchClassSubGroupStudent.tchSubGroupStudent.length === 0) && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%;" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前没有组员!</div>
        </div>
        <div class="disabled-mask"></div>
      </div>
      <div style="position: relative;" :class="{disabled: isDel}">
        <van-cell title="添加学生" />
        <div>
          <div v-if="gi !== curIndex" v-for="(g,gi) in groupList" :key="gi">
            <van-cell :title="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName" />
            <van-cell v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si">
              <div @click="$set(s,'check',!s.check)" class="aic" slot="title">
                <div class="check-box" :class="{'is-active':s.check}"></div>
                <div class="aic">{{s.studentName}}<span v-if="s.cadreType === 'T02'" class="class-leader-badge">班</span><span v-if="s.identityType === 'I02'" class="group-leader-badge">组</span></div>
              </div>

              <div class="aic" style="justify-content: flex-end">
                <div v-if="s.studentNumber" class="fs15 grey6 mgr10">学号: {{s.studentNumber}}</div>
                <van-icon @click="stuInfo=s;visible=true" name="arrow" style="vertical-align: middle;" />
              </div>
            </van-cell>
          </div>
        </div>
        <div v-if="groupList.filter((v,i) => i !== curIndex).length === 0 && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%;" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前没有学生!</div>
        </div>
        <div class="disabled-mask"></div>
      </div>
    </div>
    <div class="group-detail-wrap__footer">
      <van-button @click="modifyByBatch" type="info" class="btn">{{isAdd?'添加':isDel?'删除':'添加/删除'}}</van-button>
    </div>
    <setting-dialog @success="$toast('设置成功');getSubGroupStudent()" :visible.sync="visible" :classId="$route.params.classId" :stuInfo="stuInfo" :monitorInfo="monitor" :groupLeaderInfo="groupLeader"></setting-dialog>
  </section>
</template>

<script>
import settingDialog from './components/settingDialog'
import { getSubGroupStudent, addSubGroupStudentByBatch, delSubGroupStudentByBatch } from '@/api/index'
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  name: "groupDetail",
  components: { settingDialog },
  computed: {
    ...mapState({
      vanLoading: state => state.setting.vanLoading
    }),
    isAdd() {
      return this.groupList.some((g, gi) => {
        if (gi !== this.curIndex && g.tchClassSubGroupStudent.tchSubGroupStudent) {
          return g.tchClassSubGroupStudent.tchSubGroupStudent.some(s => s.check)
        }
      })
    },
    isDel() {
      return this.groupList[this.curIndex].tchClassSubGroupStudent.tchSubGroupStudent ?
        this.groupList[this.curIndex].tchClassSubGroupStudent.tchSubGroupStudent.some(s => s.check) : false
    },
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
      groupList: JSON.parse(JSON.stringify(this.$route.params.groupList)),
      curIndex: this.$route.params.curIndex,
      visible: false,
      stuInfo: {}
    }
  },
  methods: {
     goBack(){
          this.common.goBack(this)
        },
    modifyByBatch() {
      if (!this.isAdd && !this.isDel) return this.$toast('请选择学生')
      this.$store.commit('setVanLoading', true)
      const studentList = this.groupList.reduce((total, v, i) => {
        if (v.tchClassSubGroupStudent.tchSubGroupStudent && (this.isAdd ? (this.curIndex !== i) : (this.curIndex === i))) {
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
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        subGroupId: this.groupList[this.curIndex].tchClassSubGroupStudent.tchClassSubGroup.subgroupId,
        studentList
      };
      let params = {
        requestJson: JSON.stringify(obj)
      }
      let api = this.isAdd ? addSubGroupStudentByBatch : delSubGroupStudentByBatch
      api(params).then(res => {
        this.$store.commit('setVanLoading', false)
        if (res.flag) {
          this.$toast(this.isAdd ? '添加成功' : '删除成功')
          this.getSubGroupStudent()
        } else {
          this.$toast(res.msg)
        }
      })
    },
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
    }
  }
}
</script>

<style lang="less" scoped>
.group-detail-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  .aic {
    width: 100% !important;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
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
    .disabled-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: none;
    }
    .disabled {
      .van-cell {
        color: #ccc;
      }
      .check-box {
        border: 1px solid #ccc;
      }
      .van-icon-arrow {
        color: #ccc;
      }
      .disabled-mask {
        display: block;
      }
    }
  }
  &__footer {
    flex: 0 0 55px;
    padding: 5px 18px;
    background: #fff;

    .btn {
      border-radius: 20px;
      color: #fff;
      font-size: 18px;
      width: 100%;
    }
  }
}
</style>
