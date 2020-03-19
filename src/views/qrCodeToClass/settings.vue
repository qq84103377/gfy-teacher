<template>
  <div class="settings">
    <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft"/>

    <div class="form">
      <div class="form-cell" v-if="roleType == 'A03'">
        <label>
          <span class="requireTips">*</span>
          <span>学</span>
          <span>生</span>
          <span>姓</span>
          <span>名</span>
        </label>：
        <van-field class="custom-input" placeholder="请输入学生真实姓名" @blur="handleBlur" maxlength="6" @input="changeInput"
                   v-model.trim="username" clearable/>
        <span class="numTips">{{wordsNum}}</span>

      </div>
      <div class="form-cell" v-if="roleType == 'A02'">
        <label>
          <span class="requireTips">*</span>
          <span>老</span>
          <span>师</span>
          <span>姓</span>
          <span>名</span>
        </label>：
        <van-field class="custom-input" placeholder="请输入老师真实姓名" @blur="handleBlur" maxlength="6" @input="changeInput"
                   v-model.trim="username" clearable/>
        <span class="numTips">{{wordsNum}}</span>

      </div>
      <div class="form-cell">
        <label class="loginName">
          <span>用</span>
          <span>户</span>
          <span>名</span>
        </label>：
        <van-field class="custom-input" v-model.trim="loginName" :disabled="true" placeholder="请设置用户名"/>
      </div>
      <div class="form-cell">
        <label>
          <span><span class="requireTips">*</span>密</span>
          <span>码</span>
        </label>：
        <van-field class="custom-input" maxlength="16" @input.native="checkPwd" @input="getPswStrength()" v-model="setPwd" clearable
                   type="password"
                   placeholder="请设置密码（至少6位）"/>
        <span class="error" v-show="isUnAvailable">长度在6~16位</span>
        <div class="psw-strength">
          <span :class="{'active' : level===0||level===1}">低</span>
          <span :class="{'active' : level==2}">中</span>
          <span :class="{'active' : level==3}">高</span>
        </div>
      </div>
      <div class="form-cell">
        <label>
          <span class="requireTips">*</span>
          <span>确</span>
          <span>认</span>
          <span>密</span>
          <span>码</span>
        </label>：
        <van-field class="custom-input" maxlength="16" @input.native="checkPwd2" v-model="comfirmPwd" clearable type="password"
                   placeholder="请再次输入密码"/>
        <span class="error" v-show="isDifferent">*两次密码不一致</span>
      </div>
      <van-button class="btn-setting" type="info" :disabled="isComplete" @click.native="complete">完成</van-button>
      <p class="notice">注意事项：如登录名出现重名的情况，为了区分不同的账号，系统会自动在登录名后加上序号以作区分。</p>
    </div>

    <van-dialog v-model="showTips" title="提示信息" confirmButtonColor="#39f0dd">
      <div class="loginNameTips">
        <p>该登录名存在重名情况，系统自动在登录名后加上序号以作区分。
        </p>
        <p>请注意修改后的登录名为 <span>{{loginName}}</span></p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import {checkUserName, setUserBaseInfo} from "@/api/login";
  import {hex_md5} from "@/utils/md5";

  export default {
    name: "Settings",

    data() {
      return {
        username: "",   //真实姓名
        loginName: "",  //登录名
        setPwd: "",
        comfirmPwd: "",
        isDifferent: false,
        isComplete: true,
        isUnAvailable: false,
        roleType: '',
        accountPrefix: '',  //账号前缀
        num: 0,
        wordsNum: 6,
        level:'',  //密码等级  0,1：低；2：中；3：高
        showTips:false,//提示用户名重复的弹框
      };
    },
    created() {

    },
    methods: {
      onClickLeft() {
        this.$router.back();
      },
      // 姓名输入限制
      changeInput() {
        // 过滤掉除数字、字母、汉字以外的所有字符
        this.username = this.username.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, "");
        this.wordsNum = 6 - this.username.length;
      },
      // 判断密码强度
      getPswStrength() {
        /**  1.密码强度的规则：
         *    ①低：6位以下或仅含数字、字母、符号其中一种
         *    ②中：6位以上且仅含数字、字母、符号其中两种
         *    ③高: 6位以上且包含数字、字母、符号三种
         */
        this.level = 0;
        if (this.setPwd.length == 0){
          this.level = '';
        } else if (this.setPwd.length < 6) {
          this.level = 0;
        } else {
          // 判断是否有数字
          if (/\d/.test(this.setPwd)) {
            this.level++;
          }
          // 判断是否有字母
          if (/[a-zA-Z]/.test(this.setPwd)) {
            this.level++;
          }
          // 判断是否有特殊符号
          if (/[~!@#$%^&*()_+.]/.test(this.setPwd)) {
            this.level++
          }
        }
        console.log('密码等级：',this.level)
      },
      handleBlur() {
        this.num = 0;
        if (!this.username) {
          this.isComplete = true;
          return;
        } else {
          if (this.setPwd && !this.isDifferent && !this.isUnAvailable) {
            this.isComplete = false;
          } else {
            this.isComplete = true;
          }
        }
        this.checkName();
      },
      // 若用户名重复依次累加数字
      checkName(num) {
        num = num || '';

        this.loginName = this.accountPrefix + this.username + num;
        let params = {
          loginName: this.loginName
        };
        checkUserName(params).then(res => {
          if (!res.flag) {
            this.checkName(this.num++);
          } else {
            if (num !== ''){
              this.showTips = true;
            }
            return;
          }
        });
      },
      checkPwd() {
        this.isUnAvailable = false;
        if (
          (this.setPwd.length < 6 && this.setPwd.length !== 0) ||
          this.setPwd.length > 16
        ) {
          this.isUnAvailable = true;
        } else {
          if (this.comfirmPwd && this.comfirmPwd !== this.setPwd) {
            this.isDifferent = true;
          } else {
            this.isDifferent = false;
          }
        }

        if (this.loginName && this.setPwd && this.comfirmPwd) {
          if (
            this.isDifferent === false &&
            this.isUnAvailable === false
          ) {
            this.isComplete = false;
          } else {
            this.isComplete = true;
          }
        }
      },
      checkPwd2() {
        this.isDifferent = false;
        if (this.comfirmPwd && this.comfirmPwd !== this.setPwd) {
          this.isDifferent = true;
        } else {
          this.isDifferent = false;
        }
        if (this.loginName && this.setPwd && this.comfirmPwd) {
          if (!this.isDifferent && !this.isUnAvailable) {
            this.isComplete = false;
          } else {
            this.isComplete = true;
          }
        }
      },
      async complete() {
        if (this.username && this.setPwd && this.comfirmPwd) {
          if (!this.isDifferent && !this.isUnAvailable) {
            let json = {
              interUser: "runLfb",
              interPwd: "25d55ad283aa400af464c76d713c07ad",
              phoneNo: this.$store.getters.getUserInfo.phoneNo,
              sysType: "S06",
              passwordNo: hex_md5(this.setPwd),
              accountNo: this.$store.getters.getUserInfo.accountNo,
              loginName: this.loginName,
              userName: this.username,
            };

            let params = {
              requestJson: JSON.stringify(json)
            };
            setUserBaseInfo(params).then(res => {
              if (res.flag) {
                this.$toast("设置成功！");
                this.$store.commit("setUserInfo", res.data[0].usrInfo);
                setTimeout(() => {
                  if (this.roleType == 'A02') {
                    this.$router.replace('/teacherToClass')
                  } else if (this.roleType == 'A03') {
                    this.$router.replace('/studentToClass')
                  }
                }, 2000);
              } else {
                console.log(res.msg);
              }
            });
          }
        }
      },
    },
    mounted() {
      // this.roleType = this.$route.params.roleType;
      this.roleType = 'A02';
      let schoolInfo = JSON.parse(window.localStorage.getItem('schoolInfo'));
      this.accountPrefix = schoolInfo.accountPrefix;
    }
  };
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .settings {
    height: 100vh;
    position: relative;

    .form {
      width: 352px;
      height: 385px;
      background-color: #fff;
      padding: 30px 15px 15px 15px;
      border-radius: 20px;
      .column-align-center;
      justify-content: space-between;

      .form-cell {
        width: 100%;
        display: flex;
        position: relative;

        @{deep} .van-cell:not(:last-child)::after {
          left: 0;
        }

        label {
          width: 70px;
          height: 100%;
          text-align: right;
          font-weight: 400;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &.loginName {
            padding-left: 6px;
          }

          span {
            position: static;
            font-size: 16px;

            &.requireTips {
              color: #f00;
            }
          }
        }

        .custom-input {
          flex: 1;
        }

        .van-icon {
          position: absolute;
          right: 0;
          top: 5px;
          color: #ff3737;

          &.error {
            color: #ff3737;
          }

          &.correct {
            color: #43b75f;
          }
        }

        > span {
          position: absolute;
          top: 30px;
          left: 100px;
          font-size: 12px;

          &.error {
            color: #ff3737;
          }

          &.correct {
            color: #43b75f;
          }

          &.numTips {
            top: 5px;
            left: 290px;
            color: #ff3737;
          }
        }

        .psw-strength {
          position: absolute;
          top: 5px;
          left: 250px;
          font-size: 12px;

          span {
            border: 1px solid #ebedf0;
            padding: 2px;
            color: #ebedf0;

            &.active {
              color: #39f0dd;
              border-color: #39f0dd;
            }
          }
        }
      }

      .btn-setting {
        margin-left: 50%;
        transform: translateX(-50%);
        text-align: center;
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-size: 18px;
        margin-bottom: 80px;
      }

      .notice{
        font-size: 14px;
        color: #999;
      }
    }

    .van-dialog{
      .loginNameTips{
        padding: 10px;
        span{
          color: #ff3737;
          font-weight: 600;
        }
      }
    }
  }
</style>
