<template>
  <div class="updatePassword">
    <form action="">
      <van-cell-group>
        <van-field
          class="telInput"
          v-model="mobileNo"
          type="tel"
          disabled="true"
          placeholder="请输入原手机号"
        />
        <van-field v-model="vailcode" center clearable  placeholder="请输入6位验证码">
          <van-button
            class="btn-vailcode"
            v-if="!timer"
            size="small"
            slot="button"
            type="info"
            :loading="codeBtnLoading"
            loading-text="获取验证码"
            @click="getVailCode"
          >获取验证码
          </van-button>
          <van-button
            class="btn-vailcode"
            v-else
            :disabled="disabled"
            size="small"
            slot="button"
            type="info"
            @click="getVailCode"
          >{{second}}秒后重新获取
          </van-button>
        </van-field>
        <div class="form-cell">
          <van-field
            v-model="newPassword"
            type="password"
            @input.native="checkPwd"
            placeholder="请输入新的登录密码"
          />
          <span class="error" v-show="isUnAvailable">长度在6~16位</span>
        </div>
        <div class="form-cell">
          <van-field
            v-model="comfirmPwd"
            type="password"
            @input.native="checkPwd2"
            placeholder="请再次输入新的登录密码"
          />
          <span class="error" v-show="isDifferent">*两次密码不一致</span>
        </div>
      </van-cell-group>
    </form>
    <div class="tips">
      收不到验证码？请点击<span @click="$router.push('/service')">为您服务</span>咨询
    </div>
    <div class="pd10">
      <van-button type="info" size="large" @click="updatePassword()">确定修改</van-button>
    </div>
  </div>
</template>

<script>
  import {hex_md5} from "@/utils/md5";
  import {resetPassword} from "@/api/mine";
  import {getVailCode} from "@/api/login";


  export default {
    data() {
      return {
        isDifferent: false,
        isUnAvailable: false,
        newPassword: "",
        comfirmPwd: "",
        timer: null,
        phoneNo: "",
        vailcode: "",
        second: 60,
        codeBtnLoading: false,
        mobileNo: ''
      };
    },
    methods: {
      // 获取验证码
      getVailCode() {
        if (this.timer) return;
        if (!this.phoneNo) {
          this.$toast("请输入手机号!");
          return;
        }
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(this.phoneNo)) {
          this.$toast("请输入合法手机号!");
          return;
        }
        this.codeBtnLoading = true;
        let params = {
          phoneNo: this.phoneNo
        };
        getVailCode(params).then(res => {
          this.codeBtnLoading = false;
          console.log(res);
          if (res.flag === true) {
            this.$toast("请查收验证码！");
            this.disabled = true;
            if (!this.timer) {
              this.timer = setInterval(() => {
                if (this.second > 0 && this.second <= 180) {
                  this.second--;
                } else {
                  clearInterval(this.timer);
                  this.second = 180;
                  this.timer = null;
                  this.disabled = false;
                }
              }, 1000);
            }
          } else {
            this.$toast("请稍后获取！");
          }
        });
      },
      checkPwd() {
        this.isUnAvailable = false;
        if (
          (this.newPassword.length < 6 && this.newPassword.length !== 0) ||
          this.newPassword.length > 16
        ) {
          this.isUnAvailable = true;
        } else {
          if (this.comfirmPwd && this.comfirmPwd !== this.newPassword) {
            this.isDifferent = true;
          } else {
            this.isDifferent = false;
          }
        }
      },
      checkPwd2() {
        this.isDifferent = false;
        if (this.comfirmPwd && this.comfirmPwd !== this.newPassword) {
          this.isDifferent = true;
        } else {
          this.isDifferent = false;
        }
      },
      updatePassword() {
        console.log("this.isDifferent", this.isDifferent);
        console.log("this.isUnAvailable", this.isUnAvailable);
        if (this.newPassword) {
          if (this.isUnAvailable) {
            this.$toast.fail("输入6-16位新密码");
            return;
          }
          if (this.isDifferent) {
            this.$toast.fail("两次密码不一致");
            return;
          }
        } else {
          this.$toast.fail("请输入新密码");
          return;
        }

        let obj = {
          interUser: "runLfb",
          interPwd: hex_md5(1234578),
          phoneNo: this.phoneNo,
          accountNo: this.$store.getters.getUserInfo.accountNo,
          validateCode: this.vailcode,
          password: hex_md5(this.newPassword)
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }

        resetPassword(params).then(res => {
          console.log(res);
          if (res.flag) {
            this.$toast.success("修改成功！请重新登录");
            this.$store.commit("setUserInfo", {});
            this.$store.commit("seThirdInfo", {});
            this.$store.commit("SET_clear");
            this.$store.commit("setUserClear");
            localStorage.clear();
            this.$router.replace("/login");
          } else {
            this.$toast.fail(res.msg);
          }
        });
      },
    },
    mounted() {
      if (!this.$store.getters.getUserInfo) {
        return;
      }
      this.phoneNo = this.$store.getters.getUserInfo.phoneNo;
      this.mobileNo = this.phoneNo.substr(0, 3) + '****' + this.phoneNo.substr(this.phoneNo.length - 4);
    },
  };
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .updatePassword {
    background-color: #fff;
    .telInput{
      @{deep} .van-field__control{
        color: #333333;
      }
    }
    @{deep} .van-button {
      border-radius: 5px;
    }

    .form-cell {
      position: relative;

      span {
        position: absolute;
        top: 30px;
        left: 100px;
        font-size: 12px;

        &.error {
          color: #ff3737;
        }
      }
    }

    .tips {
      padding: 10px;
      text-align: right;
      color: #666666;
      font-size: 12px;

      span {
        color: #39F0DD;
      }
    }
  }
</style>
