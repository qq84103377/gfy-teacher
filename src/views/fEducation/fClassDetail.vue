<template>
  <section class="class-detail-wrap">
    <van-nav-bar class="top-nav" :title="$route.query.className" @click-left="goBack" left-arrow>
      <p v-if='!isClassParent' slot="right" class="copy-team" @click="copyGroup"><span>复制其他</span><span>老师分组</span></p>
      <p v-else slot="right" class="copy-team" @click="copyGroupParent"><span>复制本班</span><span>学生分组</span></p>
    </van-nav-bar>
    <div v-if='!isClassParent' class="class-detail-wrap__body">
      <div class="mgb10">
        <van-cell class='fs16' title="学生分组" />
        <van-cell class='pre-cell fs14' v-for="(item,index) in groupList" :key="index" v-if="item.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0" :title="item.tchClassSubGroupStudent.tchClassSubGroup.subgroupName" @click="$router.push({name:'groupDetail',params:{curIndex:index,groupList,classId:$route.query.classId}})" is-link />
        <div v-if="groupList.filter(v => v.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0).length === 0 && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%;" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前没有分组信息,快去分小组吧!</div>
        </div>
      </div>
      <div>
        <van-cell class="fs16" title="未分组学生" />
        <van-cell class='pre-cell fs14' v-if="groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent" @click="visible=true;stuInfo=item" v-for="(item,index) in groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent" :key="index" is-link>
          <div slot="title" class="aic jcsb fs14">
            <div class="aic">{{item.studentName}} <span v-if="item.cadreType === 'T02'" class="class-leader-badge">班</span><span v-if="item.identityType === 'I02'" class="group-leader-badge">组</span></div>
            <div v-if="item.studentNumber" class="fs15 grey6">学号: {{item.studentNumber}}</div>
          </div>
        </van-cell>
        <div v-if="(!groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent || !groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent.length) && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前无数据~</div>
        </div>
      </div>
    </div>
    <div v-else class="class-detail-wrap__body">
      <div class="mgb10">
        <van-cell class='fs16' title="家长分组信息" />
        <van-swipe-cell v-for="(item,index) in groupList" :key="index">
          <van-cell class='fs14' v-if="item.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0" :title="item.tchClassSubGroupStudent.tchClassSubGroup.subgroupName" @click="$router.push({name:'groupDetail',params:{curIndex:index,groupList,classId:$route.query.classId,isClassParent:$route.query.isClassParent}})" is-link />
          <template slot="right">
            <van-button square type="danger" text="删除" @click="delClassGroup(item)" />
          </template>
        </van-swipe-cell>
        <div v-if="groupList.filter(v => v.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0).length === 0 && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%;" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前没有分组信息,快去分小组吧!</div>
        </div>
      </div>
      <div>
        <van-cell class="fs14" title="未分组" />
        <van-cell class='pre-cell fs14' v-if="groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent&&item.parentAccountNo"  v-for="(item,index) in groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent" :key="index" >
          <div slot="title" class="aic jcsb fs14">
            <div class="aic">{{item.parentName?item.parentName:item.parentAccountNo}} <span class="fs14" style="color:#999;"> —— {{item.studentName}}</span></div>
          </div>
        </van-cell>
        <div v-if="(!groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent || !groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent.length) && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前无数据~</div>
        </div>
      </div>
      <div>
        <van-cell class="fs16 un-connect">
          <template slot="title">
            <span class="custom-title">未关联家长的学生</span>
            <van-icon name="question" color="#FFA800" @click="showTips=true" />
          </template>
        </van-cell>
        <van-cell class='pre-cell fs14' v-if="groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent&&!item.parentAccountNo"  v-for="(item,index) in groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent" :key="index" is-link>
          <div slot="title" class="aic jcsb fs14">
            <div class="aic"><span style='color:red'>未关联 </span> <span class="fs14" style="color:#999;"> —— {{item.studentName}}</span></div>

          </div>
        </van-cell>
        <div v-if="(!groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent || !groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent.length) && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前无数据~</div>
        </div>
      </div>
    </div>

    <div class="class-detail-wrap__footer">
      <van-button type="info" class="btn" id="add" @click="$router.push({name:'changeScore',params:{groupList,classId:$route.query.classId,className:$route.query.className,isClassParent:$route.query.isClassParent}})">加分/减分</van-button>
      <van-button type="info" class="btn" id="sub" @click="$router.push({name:'addGroup',params:{groupList,classId:$route.query.classId,isClassParent:$route.query.isClassParent}})">新建小组
      </van-button>
    </div>

    <van-popup v-model="teacherGroupShow" get-container=".top-nav" class="teacher-group-pop">
      <div v-if='!isClassParent' class="teacher-group-pop-wrap">
        <div class="teacher-group-pop-wrap__item" v-if="item.accountNo != $store.getters.getUserInfo.accountNo && item.subjectType !== localStorage.currentSubjectType" v-for="(item,index) in classTeacherList" :key="index" @click="handleClosePop(item)">
          {{item.subjectType|getSubjectName}}-{{item.teacherName}}
        </div>
      </div>
      <div v-else class="teacher-group-pop-wrap">
        <div class="teacher-group-pop-wrap__item" v-if="item.accountNo != $store.getters.getUserInfo.accountNo && item.subjectType !== 'S20'" v-for="(item,index) in classTeacherList" :key="index" @click="handleClosePop(item)">
          {{item.subjectType|getSubjectName}}-{{item.teacherName}}
        </div>
      </div>
    </van-popup>

    <setting-dialog @success="$toast('设置成功');getSubGroupStudent()" :classId="$route.query.classId" :visible.sync="visible" :stuInfo="stuInfo" :monitorInfo="monitor" :groupLeaderInfo="groupLeader"></setting-dialog>

    <van-popup class="tips" v-model="showTips" :round="true">
      <div class="title">
        <h4>未关联家长的学生</h4>
        <span @click="showTips = false">×</span>
      </div>
      <div class="content">
        <p>1. 未关联是指当前家长账号没有绑定学生的账号；</p>
        <p>2. 老师无法给未关联学生的家长账号进行加减分和分小组的操作；</p>
        <p>3. 请班主任务必提醒家长关联自己孩子的账号。</p>
      </div>
    </van-popup>
  </section>
</template>

<script>
import { getSubGroupStudent, getClassTeacher, getSubjectType, getSubGroupParent, deleteClassSubGroupForce } from '@/api/index'
import settingDialog from '../myClass/components/settingDialog'
import { getSubjectName } from '@/utils/filter'
import { mapMutations, mapGetters, mapState } from 'vuex'

export default {
  name: "fClassDetail",
  components: { settingDialog },
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
      groupList: [{ tchClassSubGroupStudent: { tchClassSubGroup: {}, tchSubGroupStudent: [] } }],
      classTeacherList: [],
      visible: false,
      stuInfo: {},
      showTips: false,
      groupList2: [],
      isClassParent: this.$route.query.isClassParent
    }
  },
  created() {
    if (!this.isClassParent) {
      this.getClassTeacher()
    }
  },
  activated() {
    this.$store.commit('setVanLoading', true)
    if (this.isClassParent) {
      Promise.all([this.getSubGroupParent()]).then(res => {
        this.$store.commit('setVanLoading', false)
      })
    } else {
      Promise.all([this.getSubGroupStudent()]).then(res => {
        this.$store.commit('setVanLoading', false)
      })
    }

  },
  beforeRouteLeave(to, from, next) {
    if (this.visible) {
      this.visible = false
      next(false)
    } else if (this.showTips) {
      this.showTips = false
      next(false)
    } else {
      next();
    }
  },
  methods: {
    delClassGroup(item) {
      this.$dialog.confirm({
        message: `确定删除${item.tchClassSubGroupStudent.tchClassSubGroup.subgroupName}分组吗？`
      }).then(() => {
        this.deleteClassSubGroupForce(item)
      })
    },
    async deleteClassSubGroupForce(item) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "subGroupId": item.tchClassSubGroupStudent.tchClassSubGroup.subgroupId,
        "classId": this.$route.query.classId,
        "subjectType": this.isClassParent ? 'S20' : localStorage.currentSubjectType,
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await deleteClassSubGroupForce(params).then(res => {
        if (res.flag) {
          this.$toast('删除成功')
          this.$store.commit('setVanLoading', true)
          if (this.isClassParent) {
            Promise.all([this.getSubGroupParent()]).then(res => {
              this.$store.commit('setVanLoading', false)
            })
          } else {
            Promise.all([this.getSubGroupStudent()]).then(res => {
              this.$store.commit('setVanLoading', false)
            })
          }
        }
      })
    },
    async getSubGroupParent() {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "classId": this.$route.query.classId,
        "subjectType": 'S20',
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      await getSubGroupParent(params).then(res => {
        if (res.flag && res.data.length) {
          this.groupList = []
          res.data.forEach(ele => {
            ele.tchSubGroupStudent = ele.tchSubGroupParent
            this.groupList.push({ 'tchClassSubGroupStudent': ele })
          })
        }
      })
    },
    goBack() {
      this.common.goBack(this)
    },
    copyGroup() {
      const arr = this.classTeacherList.filter(item => item.accountNo != this.$store.getters.getUserInfo.accountNo && item.subjectType !== localStorage.currentSubjectType)
      if (arr.length) {
        this.teacherGroupShow = true
      } else {
        this.$toast('没有其他老师分组')
      }
    },
    copyGroupParent() {
      let classMap = JSON.parse(localStorage.getItem("classMap"))
      const arr =classMap[this.$route.query.classId].teacherInfoList.filter(item =>item.subjectType !== 'S20')
      if (arr.length) {
        this.$router.push(`/copyGroup?classId=${this.$route.query.classId}&accountNo=${this.$store.getters.getUserInfo.accountNo}&subjectType=${arr[0].subjectType}&title=${arr[0].subjectName}&isClassParent=${this.isClassParent}`)
      } else {
        this.$toast('没有您的学生分组数据')
      }
    },
    handleClosePop(item) {
      this.teacherGroupShow = false
      const title = `${getSubjectName(item.subjectType)}-${item.teacherName}`
      this.$router.push(`/copyGroup?classId=${this.$route.query.classId}&accountNo=${item.accountNo}&subjectType=${item.subjectType}&title=${title}&isClassParent=${this.isClassParent}`)
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
@deep: ~">>>";
.class-detail-wrap {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  @{deep}.van-nav-bar__right {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      display: flex;
      flex-direction: column;
      width: 50px;
      font-size: 10px;
      line-height: 12px;
      color: #39f0dd;
    }
  }

  .un-connect {
    .van-cell__title {
      display: flex;
      align-items: center;
    }
  }

  @{deep} .van-popup.tips {
    width: 308px;
    height: 255px;

    .title {
      height: 58px;
      position: relative;

      h4 {
        font-size: 18px;
        color: #010101;
        font-weight: 700;
        text-align: center;
        line-height: 58px;
      }

      span {
        text-align: center;
        position: absolute;
        display: block;
        right: 20px;
        top: 15px;
        width: 22px;
        height: 22px;
        line-height: 18px;
        font-size: 20px;
        border-radius: 22px;
        border: 1px solid #ccc;
        color: #ccc;
      }
    }

    .content {
      padding: 0 20px;

      p {
        font-size: 15px;
        line-height: 26px;
        color: #000;
      }
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
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
    .pre-cell {
      padding-left: 25px;
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

  .teacher-group-pop {
    border-radius: 10px;
    top: 50px;
    left: 83%;
    position: absolute;
    max-height: inherit;
    // top: inherit;
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
      content: " ";
      position: absolute;
      top: -9px;
      left: 71%;
      transform: translateX(-50%);
    }
  }
}
</style>
