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
          <van-cell title="选择学生"/>
          <div v-for="(g,gi) in groupList" :key="gi">
            <van-cell :title="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName"/>
            <van-cell v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si">
              <div @click="$set(s,'check',!s.check)" class="aic" slot="title">
                <div class="check-box" :class="{'is-active':s.check}"></div>
                <div>{{s.studentName}}</div>
              </div>
              <van-icon @click="stuInfo=s;visible=true" name="arrow" style="vertical-align: middle;" />
            </van-cell>
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
  import {createClassSubGroup, getSubGroupStudent} from '@/api/index'
  import settingDialog from './components/settingDialog'
  export default {
        name: "addGroup",
    components: {settingDialog},
    computed: {
        monitor() {
          let obj = {}
          for(let k in this.groupList) {
            const item = this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent ?
              this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent.find(s => s.cadreType === 'T02') : ''
            if(item) {
              obj = item
              break
            }
          }
          return obj
        },
        groupLeader() {
          let obj = {}
          for(let k in this.groupList) {
            const item = this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent ?
              this.groupList[k].tchClassSubGroupStudent.tchSubGroupStudent.find(s => s.identityType === 'I02') : ''
            if(item) {
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
            btnLoading: false
          }
      },
      methods: {
        getSubGroupStudent() {
          this.$store.commit('setVanLoading',true)
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "accountNo": this.$store.getters.getUserInfo.accountNo,
            "classId": this.$route.params.classId,
            "subjectType": localStorage.currentSubjectType
          };
          let params ={
            requestJson: JSON.stringify(obj)
          }
          getSubGroupStudent(params).then(res => {
            this.$store.commit('setVanLoading',false)
            if(res.flag) {
              this.groupList = res.data
            }else {
              this.$toast(res.msg)
            }
          })
        },
        submit() {
          this.createClassSubGroup()
        },
        createClassSubGroup() {
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
          let params ={
            requestJson: JSON.stringify(obj)
          }
          createClassSubGroup(params).then(res => {
            this.btnLoading = false
            if(res.flag) {
              this.getSubGroupStudent()
              this.groupName = ''
            }else {
              this.$toast(res.msg)
            }
          })
        }
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
        .check-box {
          flex: 0 0 16px;
          height: 16px;
          border: 1px solid #999;
          border-radius: 1.5px;
          margin-right: 9px;

          &.is-active {
            background: url("../../assets/img/icon-check.png") no-repeat center center;
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
      .btn{
        width: 100%;
        border-radius: 20px;
        color: #fff;
        font-size: 18px;
      }
    }
  }
</style>
