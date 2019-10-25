<template>
  <section class="class-detail-wrap">
    <van-nav-bar
      :title="$route.query.className"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="class-detail-wrap__body">
      <div class="mgb10">
        <van-cell title="学生分组"/>
        <van-cell v-for="(item,index) in groupList" :key="index"
                  v-if="item.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0"
                  :title="item.tchClassSubGroupStudent.tchClassSubGroup.subgroupName"
                  @click="$router.push({name:'groupDetail',params:{curIndex:index,groupList,classId:$route.query.classId}})"
                  is-link/>
        <div v-if="groupList.filter(v => v.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0).length === 0 && !vanLoading" style="text-align: center;color: #999999;background: #fff;" class="fs12">
          <img class="null-tips" style="width: 70%" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前没有分组信息,快去分小组吧!</div>
        </div>
      </div>
      <div>
        <van-cell title="未分组学生"/>
        <van-cell v-if="groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent"
                  @click="visible=true;stuInfo=item"
                  v-for="(item,index) in groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent"
                  :key="index" :title="item.studentName" is-link/>
        <div v-if="(!groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent || !groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent.length) && !vanLoading" style="text-align: center;color: #999999;background: #fff;" class="fs12">
          <img class="null-tips" style="width: 70%" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前无数据~</div>
        </div>
      </div>
    </div>
    <div class="class-detail-wrap__footer">
      <van-button type="info" class="btn" id="add" @click="copyGroup">复制其他老师分组</van-button>
      <van-button type="info" class="btn" id="sub"
                  @click="$router.push({name:'addGroup',params:{groupList,classId:$route.query.classId}})">新建小组
      </van-button>
    </div>

    <van-popup v-model="teacherGroupShow" get-container=".class-detail-wrap__footer" class="teacher-group-pop"
               :style="{left: '30%'}">
      <div class="teacher-group-pop-wrap">
        <div class="teacher-group-pop-wrap__item"
             v-if="item.accountNo != $store.getters.getUserInfo.accountNo && item.subjectType !== localStorage.currentSubjectType"
             v-for="(item,index) in classTeacherList" :key="index" @click="handleClosePop(item)">
          {{item.subjectType|getSubjectName}}-{{item.teacherName}}
        </div>
      </div>
    </van-popup>

    <setting-dialog @success="$toast('设置成功');getSubGroupStudent()" :classId="$route.query.classId"
                    :visible.sync="visible" :stuInfo="stuInfo" :monitorInfo="monitor"
                    :groupLeaderInfo="groupLeader"></setting-dialog>

  </section>
</template>

<script>
  import {getSubGroupStudent, getClassTeacher, getSubjectType} from '@/api/index'
  import settingDialog from './components/settingDialog'
  import {getSubjectName} from '@/utils/filter'
  import { mapMutations, mapGetters, mapState } from 'vuex'

  export default {
    name: "classDetail",
    components: {settingDialog},
    computed: {
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      }),
      localStorage() {
        return localStorage
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
        teacherGroupShow: false,
        groupList: [{tchClassSubGroupStudent: {tchClassSubGroup: {}, tchSubGroupStudent: []}}],
        classTeacherList: [],
        visible: false,
        stuInfo: {}
      }
    },
    created() {
      this.getClassTeacher()
    },
    activated() {
      this.$store.commit('setVanLoading', true)
      Promise.all([this.getSubGroupStudent()]).then(res => {
        this.$store.commit('setVanLoading', false)
      })
    },
    methods: {
      copyGroup() {
        const arr = this.classTeacherList.filter(item => item.accountNo != this.$store.getters.getUserInfo.accountNo && item.subjectType !== localStorage.currentSubjectType)
        if (arr.length) {
          this.teacherGroupShow = true
        } else {
          this.$toast('没有其他老师分组')
        }
      },
      handleClosePop(item) {
        this.teacherGroupShow = false
        const title = `${getSubjectName(item.subjectType)}-${item.teacherName}`
        this.$router.push(`/copyGroup?classId=${this.$route.query.classId}&accountNo=${item.accountNo}&subjectType=${item.subjectType}&title=${title}`)
      },
      async getClassTeacher() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "classId": this.$route.query.classId,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getClassTeacher(params).then(res => {
          if (res.flag) {
            this.classTeacherList = res.data[0].classTeacher
          } else {
            this.$toast(res.msg)
          }
        })
      },
      async getSubGroupStudent() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "classId": this.$route.query.classId,
          "subjectType": localStorage.currentSubjectType
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await getSubGroupStudent(params).then(res => {
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
  .class-detail-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;
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

    .teacher-group-pop {
      border-radius: 10px;
      bottom: 55px;
      position: absolute;
      max-height: inherit;
      top: inherit;
      transform: translateX(-50%);
      overflow-y: inherit;

      &-wrap {
        padding: 10px;
        max-height: 150px;
        overflow-y: auto;

        &__item {
          background: transparent;
          text-align: center;
          width: 100px;
          line-height: 30px;
          border-radius: 5px;
          margin-bottom: 5px;
          font-size: 15px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      &::after {
        width: 0;
        height: 0;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent #fff;
        content: ' ';
        position: absolute;
        bottom: -9px;
        left: 50%;
        transform: translateX(-50%) rotateZ(180deg);
      }
    }

  }
</style>
