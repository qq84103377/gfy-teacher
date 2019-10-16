<template>
  <van-dialog
    class="setting-dialog"
    v-model="show"
    show-cancel-button
    @cancel="show=false"
    @confirm="handleConfirm"
  >
    <div class="setting-dialog-wrap">
      <div class="fs18 mgb10">是否设置为:</div>
      <div class="aic">
        <div @click="studentInfo.cadreType = studentInfo.cadreType === 'T02' ? 'T01' : 'T02'" class="setting-item" :class="{active:studentInfo.cadreType === 'T02'}">班长</div>
        <div v-if="studentInfo.subgroupId > 0" @click="studentInfo.identityType = studentInfo.identityType === 'I02' ? 'I01' : 'I02'" class="setting-item" :class="{active:studentInfo.identityType === 'I02'}">组长</div>
      </div>
      <div class="aic jcsb mgt15">
        <span>填写学生学号</span>
        <span class="red">{{2 - stuNum.toString().length}}</span>
      </div>
<!--      <van-field class="stu-num-input" v-model="stuNum" type="number" maxlength="2" placeholder="请输入学生学号，字数在2字内" />-->
      <input class="stu-num-input" @input="handleInput" maxlength="2" placeholder="请输入学生学号，字数在2字内" type="tel" v-model="stuNum">
      <div class="red fs12">*学号不可重复使用</div>
    </div>
  </van-dialog>
</template>

<script>
  import {updateClassStudent, setSubGroupStudentType} from '@/api/index'
    export default {
        name: "settingDialog",
      props: ['visible','stuInfo','monitorInfo','groupLeaderInfo','classId'], //monitorInfo 班长信息 //groupLeaderInfo组长信息
      computed: {
        show: {
          get() {
            return this.visible
          },
          set() {
            this.stuNum = ''
            this.$emit('update:visible',false)
          }
        }
      },

      watch: {
        // stuInfo: {
        //   handler(newName, oldName) {
        //     this.stuNum = this.stuInfo.studentNumber || ''
        //   },
        //   deep: true,
        //   immediate: true
        // },
        visible() {
          if(this.visible) {
            this.studentInfo = JSON.parse(JSON.stringify(this.stuInfo))
            this.stuNum = this.stuInfo.studentNumber || ''
          }
        }
      },
        data() {
          return {
            stuNum: '',
            studentInfo: {}
          }
      },
      methods: {
         async handleConfirm() {
            // this.show=false    this.studentInfo.identityType === this.stuInfo.identityType
           if(this.studentInfo.cadreType === this.stuInfo.cadreType && this.stuNum === this.stuInfo.studentNumber) {
             //班长没有任何变化并且学号没有任何变化
           }else {
             if(this.stuNum !== this.stuInfo.studentNumber) {
               //改学号
               const res = await this.updateClassStudent(this.studentInfo,this.studentInfo.cadreType,true)
               this.$store.commit('setVanLoading',false)
               if(res.flag) {
                 // if(flag && this.studentInfo.identityType === this.stuInfo.identityType) this.$emit('success')
               }else {
                 return this.$toast(res.msg)
               }
             }

             if(this.studentInfo.cadreType !== this.stuInfo.cadreType) {
               //改班长
               const res = await this.updateClassStudent(this.studentInfo,this.studentInfo.cadreType)
               this.$store.commit('setVanLoading',false)
               if(res.flag) {
                 // if(flag && this.studentInfo.identityType === this.stuInfo.identityType) this.$emit('success')
               }else {
                 return this.$toast(res.msg)
               }
             }

             if(this.monitorInfo.cadreType === 'T02' && (this.monitorInfo.accountNo !== this.studentInfo.accountNo) && this.studentInfo.cadreType === 'T02') {
               // 有班长且班长不是当前学生且当前学生选择的是班长,则需要将原班长撤职
              const res = await this.updateClassStudent(this.monitorInfo,'T01')
               this.$store.commit('setVanLoading',false)
               if(res.flag) {
                 // if(this.studentInfo.identityType === this.stuInfo.identityType) this.$emit('success')
               }else {
                 return this.$toast(res.msg)
               }
             }
             if(this.studentInfo.identityType === this.stuInfo.identityType) this.$emit('success')
           }

            if(this.studentInfo.identityType === this.stuInfo.identityType) {
              //组长没有任何变化
            }else {
              if(this.groupLeaderInfo.identityType === 'I02' && (this.groupLeaderInfo.accountNo !== this.studentInfo.accountNo) && this.studentInfo.identityType === 'I02') {
                // 有组长且组长不是当前学生且当前学生选择的是组长,则需要将原组长撤职
                await this.setSubGroupStudentType(this.groupLeaderInfo,'I01')
              }
             await this.setSubGroupStudentType(this.studentInfo,this.studentInfo.identityType,true)
            }

          },
        handleInput(v) {
          v.target.value = v.target.value.toString().replace(/[^\d]/g, '')
          this.stuNum = v.target.value
        },
       async setSubGroupStudentType(studentInfo,identityType,flag) {
          this.$store.commit('setVanLoading',true)
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            accountNo: studentInfo.accountNo,
            subGroupId: studentInfo.subgroupId,
            identityType
          };
          let params ={
            requestJson: JSON.stringify(obj)
          }
         await setSubGroupStudentType(params).then(res => {
            this.$store.commit('setVanLoading',false)
            if(res.flag) {
              if(flag) this.$emit('success')
            }else {
              this.$toast(res.msg)
            }
          })
        },
       async updateClassStudent(studentInfo,cadreType,flag) {
         this.$store.commit('setVanLoading',true)
         let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            operateType: 'T01',
            "classId": this.classId,
            accountNo: studentInfo.accountNo,
            statusCd: 'S01',
            seqId: studentInfo.schClassStudentSeqId,
            cadreType,
          };
         if(flag) {
           //改学号
           obj.studentNumber = this.stuNum
           obj.operateType = 'T02'
         }
          let params ={
            requestJson: JSON.stringify(obj)
          }
         return updateClassStudent(params)
        }
      }
    }
</script>

<style lang="less" scoped>
  .setting-dialog {
    &-wrap {
      padding: 20px 20px 10px;
      .setting-item {
        text-align: center;
        flex: 0 0 47%;
        border-radius: 5px;
        font-size: 18px;
        color: #666;
        background: #F5F6FA;
        line-height: 38px;
        &:first-child{
          margin-right: 15px;
        }
        &.active {
          background: @blue;
          color: #fff;
        }
      }
      .stu-num-input {
        width: 100%;
        background: #F5F6FA;
        border-radius: 5px;
        margin: 10px 0;
        line-height: 33px;
        padding: 0 10px;
        font-size: 14px;
      }
    }
  }
</style>
