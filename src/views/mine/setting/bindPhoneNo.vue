<template>
  <div class="updateTel">
    <van-cell-group>
      <!-- <van-field class="telInput" v-model="mobileNo" type="tel" disabled="true" placeholder="请输入手机号" /> -->
      <van-field
        v-model="phoneNo"
        type="tel"
        placeholder="请输入手机号"
      />
      <van-field v-model="vailcode" center clearable placeholder="请输入6位验证码">
        <!-- <van-button slot="button" size="small" type="info">发送验证码</van-button> -->
        <van-button class="btn-vailcode" v-if="!timer" size="small" slot="button" type="info" :loading="codeBtnLoading" loading-text="获取验证码" @click="getVailCode">获取验证码
        </van-button>
        <van-button class="btn-vailcode" v-else :disabled="disabled" size="small" slot="button" type="info" @click="getVailCode">{{second}}秒后重新获取
        </van-button>
      </van-field>
      <!-- <van-field
        v-model="newTel"
        type="tel"
        placeholder="请输入新手机号"
      /> -->
    </van-cell-group>

    <div class="confirm">
      <van-button type="info" size="large" @click="verifyCode()">绑定</van-button>
    </div>
    <div class="tips">
      收不到验证码？请点击<span @click="$router.push('/service')">为您服务</span>咨询
    </div>
  </div>
</template>

<script>
import { getVailCode, bindMobile } from "@/api/login";
import { replacementPhone } from "@/api/mine";
import { hex_md5 } from "@/utils/md5";
import { userApi } from "@/api/parent-GFY";


export default {
  data() {
    return {
      phoneNo: "",
      timer: null,
      mobile: "",
      newTel: "",
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
    // 确认验证码是否正确
    verifyCode() {
      let json = {
        validateCode: this.vailcode,
        phoneNo: this.phoneNo
      };
      userApi.checkPhoneValidateCode(json).then(respone => {
        console.log("respone", respone);
        if (!respone.flag) {
          this.$toast.fail(respone.msg);
          return;
        } else {
          //验证码通过
          // this.$toast.success("验证通过");
          this.bindMobile()
          // this.confirmChange();
        }
      });
    },
    bindMobile() {
      let json = {
        'interUser': 'runLfb',
        'interPwd': '25d55ad283aa400af464c76d713c07ad',
        'phoneNo': this.phoneNo,
        'validateCode': this.vailcode,
        'accountNo': this.$store.getters.getUserInfo.accountNo
      };

      let params = {
        requestJson: JSON.stringify(json),
      }

      bindMobile(params).then(res => {

        console.log(res);
        if (res.flag) {
          if (res.code == '10112') {
            this.isChoose = true
            this.accountList = res.data
            return
          }
          this.$toast('绑定成功！')
          this.$store.commit('setUserInfo', res.data[0])

          this.$router.back()
        } else {
          this.$toast(res.msg)
          console.log(res.msg);
        }
      })
    },
    // 确定更换手机号
    confirmChange() {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(this.newTel)) {
        this.$toast("新手机号格式不正确!");
        return;
      }
      let obj = {
        interUser: "runLfb",
        interPwd: hex_md5(1234578),
        newPhoneNo: this.newTel,
        sysType: "S01",
        accountNo: this.$store.getters.getUserInfo.accountNo
      };

      replacementPhone(obj).then(res => {
        if (res.flag) {
          this.$toast.success("更换手机号成功");
          this.phoneNo = this.newTel;
          this.mobileNo = this.phoneNo.substr(0, 3) + '****' + this.phoneNo.substr(this.phoneNo.length - 4);
          this.$store.commit("setUserInfo", res.data[0].usrInfo);
          setTimeout(() => {
            this.$router.replace('/setting')
          }, 1000)
        } else {
          this.$toast.fail(res.msg);
        }
      });
    },
  },
  created: function () {
    // if (!this.$store.getters.getUserInfo) {
    //   return;
    // }
    // this.phoneNo = this.$store.getters.getUserInfo.phoneNo;
    // this.mobileNo = this.phoneNo.substr(0, 3) + '****' + this.phoneNo.substr(this.phoneNo.length - 4);

  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.updateTel {
  .telInput {
    @{deep} .van-field__control {
      color: #333333;
    }
  }

  @{deep} .van-button {
    border-radius: 5px;
  }

  background-color: #fff;

  .confirm {
    padding: 70px 20px 0px 20px;
  }

  .tips {
    padding: 20px;
    text-align: right;
    color: #666666;
    font-size: 12px;

    span {
      color: #39f0dd;
    }
  }
}
</style>
