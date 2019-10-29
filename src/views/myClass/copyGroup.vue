<template>
  <section class="copy-group-wrap">
    <van-nav-bar
      :title="$route.query.title"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="copy-group-wrap__body">
      <div class="mgb10">
        <van-cell class="fs16" title="学生分组"/>
        <van-collapse v-model="activeNames">
          <van-collapse-item v-if="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0" v-for="(g,gi) in groupList" :key="gi" :title="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName" :name="gi">
            <van-cell v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si">
              <div slot="title" class="aic jcsb fs16">
                <div class="aic">{{s.studentName}} <span v-if="s.cadreType === 'T02'" class="class-leader-badge">班</span><span v-if="s.identityType === 'I02'" class="group-leader-badge">组</span></div>
                <div v-if="s.studentNumber" class="fs15 grey6">学号: {{s.studentNumber}}</div>
              </div>
            </van-cell>
          </van-collapse-item>
        </van-collapse>
        <div v-if="groupList.filter(v => v.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0).length === 0 && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%;" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前没有分组!</div>
        </div>
      </div>
      <div>
        <van-cell class="fs16" title="未分组学生"/>
        <van-cell v-for="(item,index) in groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent" :key="index" :title="item.studentName">
          <div slot="title" class="aic jcsb fs16">
            <div class="aic">{{item.studentName}} <span v-if="item.cadreType === 'T02'" class="class-leader-badge">班</span><span v-if="item.identityType === 'I02'" class="group-leader-badge">组</span></div>
            <div v-if="item.studentNumber" class="fs15 grey6">学号: {{item.studentNumber}}</div>
          </div>
        </van-cell>
        <div v-if="groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent.length === 0 && !vanLoading" class="empty-page pdt10" style="background: #fff;margin-top: 0;">
          <img style="width: 70%;" src="../../assets/img/empty-1.png" alt />
          <div class="pd10">当前没有学生!</div>
        </div>
      </div>
    </div>
    <div class="copy-group-wrap__footer">
      <van-button type="info" class="btn" id="add" @click="$router.back()">取消</van-button>
      <van-button type="info" class="btn" id="sub" :loading="btnLoading" loading-text="确认复制" @click="copyGroupByTeacherInfo">确认复制</van-button>
    </div>
  </section>
</template>

<script>
  import {copyGroupByTeacherInfo, getSubGroupStudent} from '@/api/index'
  import { mapMutations, mapGetters, mapState } from 'vuex'

  export default {
    name: "copyGroup",
    data() {
      return {
        activeNames: [],
        btnLoading: false,
        groupList: [{tchClassSubGroupStudent:{tchClassSubGroup:{},tchSubGroupStudent:[]}}],
      }
    },
    created() {
      this.getSubGroupStudent()
    },
    computed: {
      ...mapState({
        vanLoading: state => state.setting.vanLoading
      }),
    },
    methods: {
      getSubGroupStudent() {
        this.$store.commit('setVanLoading',true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "accountNo": this.$route.query.accountNo,
          "classId": this.$route.query.classId,
          "subjectType": this.$route.query.subjectType
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
      copyGroupByTeacherInfo() {
        this.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "classId": this.$route.query.classId,
          "toTercherNo": this.$store.getters.getUserInfo.accountNo,
          fromTercherNo: this.$route.query.accountNo,
          toSubjectType: localStorage.currentSubjectType,
          fromSubjectType: this.$route.query.subjectType
        };
        let params ={
          requestJson: JSON.stringify(obj)
        }
        copyGroupByTeacherInfo(params).then(res => {
          this.btnLoading = false
          if(res.flag) {
            this.$toast('复制成功')
            this.$router.back()
          }else {
            this.$toast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .copy-group-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;
      .class-leader-badge,.group-leader-badge {
        width: 17px;
        line-height: 17px;
        border-radius: 50%;
        margin-left: 6px;
        color: #fff;
        font-size: 10px;
        background: #F06839;
        text-align: center;
      }
      .group-leader-badge {
        background: #F0AD39;
      }
      @{deep} .van-collapse-item__content {
        padding: 0;
        padding-left: 5px;
      }
      @{deep} .van-collapse-item__title {
        font-size: 16px;
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
