<template>
  <section class="copy-group-wrap">
    <van-nav-bar
      :title="$route.query.title"
      @click-left="$router.back()"
      left-arrow>
    </van-nav-bar>
    <div class="copy-group-wrap__body">
      <div class="mgb10">
        <van-cell title="学生分组"/>
        <van-collapse v-model="activeNames">
          <van-collapse-item v-if="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupId>0" v-for="(g,gi) in groupList" :key="gi" :title="g.tchClassSubGroupStudent.tchClassSubGroup.subgroupName" :name="gi">
            <van-cell :title="s.studentName" v-for="(s,si) in g.tchClassSubGroupStudent.tchSubGroupStudent" :key="si"/>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div>
        <van-cell title="未分组学生"/>
        <van-cell v-for="(item,index) in groupList[groupList.length - 1].tchClassSubGroupStudent.tchSubGroupStudent" :key="index" :title="item.studentName"/>
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

      @{deep} .van-collapse-item__content {
        padding: 0;
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
