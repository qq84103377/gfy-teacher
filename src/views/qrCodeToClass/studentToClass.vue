<template>
  <div class="studentJoin">
    <van-sticky>
      <van-nav-bar title="加入班级" left-arrow @click-left="$router.back()">
      </van-nav-bar>
    </van-sticky>
    <div class="info">
      <h5> 请确认信息是否无误再加入班级 </h5>
      <div>学　　校：{{schoolName}}</div>
      <div>年　　级：{{classGrade|getGradeName}}</div>
      <div>班　　级：{{className}}</div>
      <div>用 户 名: {{this.$store.getters.getUserInfo.loginName}}</div>
      <div>学生姓名：{{this.$store.getters.getUserInfo.userName}}</div>
    </div>
    <div class="bottomBtn">
      <van-button round type="info" size="large" @click="confirmInfo()">确定</van-button>
    </div>
  </div>
</template>

<script>
  import {studentAddToClass} from '@/api/joinClass'

  export default {
    name: "studentToClass",
    data() {
      return {
        schoolName: '',
        classGrade: '',
        schoolId: '',
        className: '',
        classId: ''
      }
    },
    methods: {
      confirmInfo() {
        let json = {
          interUser: 'runLfb',
          interPwd: '25d55ad283aa400af464c76d713c07ad',
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: '24',
          operateType: 'A01',
          classId: this.classId,
          accountNo: this.$store.getters.getUserInfo.accountNo,
          statusCd: 'S01'
        }

        let params = {
          requestJson: JSON.stringify(json)
        }
        studentAddToClass(params).then(res => {
          if (res.flag) {
            let tempObj = {
              type:'F03',
              msg:'加入班级成功'
            }
            window.localStorage.setItem('statusType',JSON.stringify(tempObj));
            this.$router.push('/statusPage')
          } else {
            let tempObj = {
              type:'F02',
              msg:res.msg
            }
            window.localStorage.setItem('statusType',JSON.stringify(tempObj));
            this.$router.push('/statusPage')
          }
        })
      }
    },
    mounted() {
      let schoolInfo = JSON.parse(window.localStorage.getItem('schoolInfo'));
      this.schoolName = schoolInfo.schoolName;
      this.classGrade = schoolInfo.classGrade;
      this.schoolId = schoolInfo.schoolId;
      this.className = schoolInfo.className;
      this.classId = schoolInfo.classId;
    }
  }
</script>

<style scoped lang="less">
  .studentJoin {
    .info {
      color: #000;
      padding: 50px;

      h5 {
        font-size: 18px;
        text-align: center;
        margin-bottom: 50px;
      }

      div {
        font-size: 15px;
        margin-bottom: 22px;
      }
    }

    .bottomBtn {
      width: 100%;
      padding: 10px 10px;
      position: fixed;
      bottom: 0;
      background-color: #F7F6FB;
    }
  }

</style>
