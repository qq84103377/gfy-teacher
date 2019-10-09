<template>
  <section class="mine-wrap">
    <div class="mine-wrap__header">
      <div class="mine-wrap__header-info">我的</div>
      <div class="mine-wrap__header-grid">
        <div class="mine-wrap__header-grid-in">
          <div class="avatar" @click="fileSelect()">
            <div>
              <img :src="iconUrl" alt="">
            </div>
          </div>
          <div class="userinfo">
            <div class="userinfo-top">
              <span>{{userName}}</span>
              <van-tag color="#F7DB3F" v-for="item in tagList">{{item}}</van-tag>
            </div>
            <div class="userinfo-bottom">
              <span v-for="item in schoolList">{{item}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mine-wrap__body">
      <div class="mine-wrap__body-grid">
        <div class="mine-wrap__body-grid-top">
          <div>
            <span>{{taskNum}}</span>
            <div>任务数</div>
          </div>
          <div>
            <span>{{courseNum}}</span>
            <div>课程数</div>
          </div>
          <div @click="$router.push('/myLangCoin')">
            <span>{{langCoin}}</span>
            <div>郎币数</div>
          </div>
          <div  @click="$router.push('/myLevel')">
            <span>{{level}}</span>
            <div>等级</div>
          </div>
        </div>
      </div>
      <div class="mine-wrap__body-menu">
        <van-grid :column-num="3">
          <van-grid-item
            v-for="item in gridData"
            :key="item.text"
            :icon="item.icon"
            :text="item.text"
            @click="jumpTo(item.url)"
          />
        </van-grid>
      </div>
    </div>
    <van-action-sheet
      v-model="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      @select="handleSelect"
      @cancel="showActionSheet=false"
    />
    <cropper @finish="finish" :visible.sync="cropperData.visible" :img="cropperData.img"></cropper>

  </section>
</template>

<script>
  import {getMySchoolInfo, getUserCurriculum, getUserCounterSummary} from '@/api/mine';
  import {generateTimeReqestNumber, randomString} from "@/utils/filter";
  import cropper from "../../components/cropper";

  export default {
    data() {
      return {
        gridData: [
          {
            text: "个人信息",
            icon: require("../../assets/img/myself-icon-2.png"),
            url: "/userInfo"
          },
          {
            text: "积分商城",
            icon: require("../../assets/img/myself-icon-3.png"),
            url: "/shop"
          },
          {
            text: "使用帮助",
            icon: require("../../assets/img/myself-icon-4.png"),
            url: "/help"

          },
          {
            text: "我的等级",
            icon: require("../../assets/img/myself-icon-5.png"),
            url: "/myLevel"

          },
          {
            text: "我的提醒",
            icon: require("../../assets/img/myself-icon-6.png"),
            url: "/myNotice"

          },
          {
            text: "个人设置",
            icon: require("../../assets/img/myself-icon-7.png"),
            url: "/setting"

          },
          {
            text: "为您服务",
            icon: require("../../assets/img/myself-icon-8.png"),
            url: "/service"

          },
          {
            text: "意见反馈",
            icon: require("../../assets/img/myself-icon-9.png"),
            url: "/feedback"
          },
          {
            text: "退出登录",
            icon: require("../../assets/img/myself-icon-10.png"),
            url: "loginOut"
          },
        ],
        langCoin: 0,  //郎币
        level: 0,     //等级
        taskNum: 0,   //任务数
        courseNum: 0, //课程数
        schoolList: [],//校区列表
        tagList: [],   //老师标签列表
        userName: "",
        iconUrl: "http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/crm_file/information/201909/20190912043018_aZGfS_Default-Avatar-blue.png",
        cropperData: {
          visible: false,
          img: ""
        },
        actions: [{name: "从相册选取"}, {name: "拍照"}],
        showActionSheet: false,
        blob: null,
        avatar:""
      };
    },
    components: {
      cropper
    },
    computed: {
      isApp() {
        return "cordova" in window;
      }
    },
    methods: {
      jumpTo(url) {
        if (url == 'loginOut') {
          this.loginOut();
        } else {
          this.$router.push(url)
        }
      },

      // 退出登录
      loginOut() {
        this.$dialog
          .confirm({
            title: "",
            message: "确定退出登录吗？",
            cancelButtonText: "确定",
            confirmButtonText: "取消",
            confirmButtonColor:'#39F0DD'
          })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
            localStorage.clear();
            this.$forceUpdate();
            this.$router.replace("/login");
          });
      },

      //获取学校信息
      getMySchoolInfo() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          userType: this.$store.getters.getUserInfo.roleType,
          accountNo: this.$store.getters.getUserInfo.accountNo
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getMySchoolInfo(params).then(res => {
          console.log('getMySchoolInfo', res)
          if (res.flag && res.data.length > 0) {
            let schoolList = res.data[0].schoolList;
            let length = schoolList.length;
            this.schoolList = schoolList.map(item => {
              return item.schoolName
            })
            // 获取老师科目列表，去重后
            for (let i = 0; i < length; i++) {
              let gradeList = schoolList[i].classGradeList;
              let gradeLen = gradeList.length;
              for (let j = 0; j < gradeLen; j++) {
                let subjectList = gradeList[j].subjectList;
                let arr = subjectList.map(item => {
                  return item.subjectName;
                })
                this.tagList = Array.from(new Set([...this.tagList, ...arr]));
              }
            }
          }
        })
      },

      //获取完成课程数和任务数
      getUserCurriculum() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          belongSchoolId: this.$store.getters.schoolId,
          roleType: this.$store.getters.getUserInfo.roleType,
          accountNo: this.$store.getters.getUserInfo.accountNo,
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          counterTypeList: [
            {counterType: 'C01'},
            {counterType: 'C02'}
          ]
        }
        // C01：课程数，C02：任务数
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserCurriculum(params).then(res => {
          console.log('getUserCurriculum', res)
          if (res.flag && res.data.length > 0) {
            this.courseNum = res.data[0].counterValue;
            this.taskNum = res.data[1].counterValue;
          }
        })
      },

      // 获取郎币和等级
      getUserCounterSummary() {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          roleType: this.$store.getters.getUserInfo.roleType,
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          sysType: 'S01'
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getUserCounterSummary(params).then(res => {
          console.log('getUserCounterSummary', res)
          if (res.flag && res.data.length > 0) {
            let counterDataArray = res.data[0].UserCounterSummary.userCounter;
            for (var i = 0; i < counterDataArray.length; i++) {
              if (counterDataArray[i].counterType == "U03") {
                // 等级
                this.level =
                  counterDataArray[i].counterValue == null
                    ? 0
                    : counterDataArray[i].counterValue;
              } else if (counterDataArray[i].counterType == "U10") {
                //郎币
                this.langCoin =
                  counterDataArray[i].counterValue == null
                    ? 0
                    : counterDataArray[i].counterValue;
              }
            }
          } else {
            this.level = 0;
            this.langCoin = 0;
          }
        })
      },

      // 点击头像上传图片
      fileSelect() {
        if ("cordova" in window) {
          this.showActionSheet = !this.showActionSheet;
        } else {

        }
      },
      // 选择上传图片方式  app端
      handleSelect(item, index) {
        // index 0 相册  1 拍照
        this.showActionSheet = false;
        // this.cropperData.visible = true
        navigator.camera.getPicture(
          imageData => {
            this.cropperData.img = "data:image/jpeg;base64," + imageData;
            this.cropperData.visible = true;
          },
          failMsg => {
            this.$toast.fail(failMsg);
          },
          {
            quality: 50, //像素质量[0,100]
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType:
              index == 1
                ? Camera.PictureSourceType.CAMERA
                : Camera.PictureSourceType.SAVEDPHOTOALBUM
            // sourceType : Camera.PictureSourceType.CAMERA,
          }
        );
      },

      finish(base64, blob) {
        this.avatar = base64;
        this.blob = blob;
      },
      async uploadIMG(curFile) {
        let formData = new FormData();
        let filetime = generateTimeReqestNumber();
        let randomStr = randomString(5);

        formData.append(
          "key",
          this.oSSObject.key +
          this.$store.getters.GET_LOGININFO.accountNo +
          filetime +
          randomStr +
          ".png"
        );
        formData.append("policy", this.oSSObject.policyBase64);
        formData.append("OSSAccessKeyId", this.oSSObject.accessid);
        formData.append("signature", this.oSSObject.signature);
        formData.append("file", curFile);
        formData.append("success_action_status", "200");
        console.log("formData", formData);
        doUpLoad(this.oSSObject.host, formData)
          .then(data => {
            console.log("doUpLoad", data);
            this.iconUrl =
              this.oSSObject.host +
              "/" +
              this.oSSObject.key +
              this.$store.getters.GET_LOGININFO.accountNo +
              filetime +
              randomStr +
              ".png";
            console.log(this.iconUrl);
          })
          .catch(err => {
            console.log("err", err);
          });
      },
      async getOSSKey() {
        let json = {
          requestJson: JSON.stringify({
            docTypeCd: "T01",
            sysTypeCd: "T07"
          })
        };
        await stsAuthCoverAccessUrl(json).then(data => {
          let obj = data.data[0].tokenInfo;
          let tmpSignatureObj = {
            host: obj.host,
            policyBase64: obj.policy,
            accessid: obj.accessid,
            signature: obj.signature,
            expire: parseInt(obj.expire),
            key: obj.dir + "/",
            size: obj.sizelimit
          };
          this.oSSObject = tmpSignatureObj;
        });
      },
    },

    created() {
      if (!this.$store.getters.getUserInfo) {
        return;
      }
      this.userName = this.$store.getters.getUserInfo.userName;
      this.iconUrl = this.$store.getters.getUserInfo.iconUrl;
      this.getMySchoolInfo();
      this.getUserCurriculum();
      this.getUserCounterSummary();
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .mine-wrap {
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

    &__header {
      height: 177px;
      background-size: 100%;
      position: relative;
      background: -webkit-linear-gradient(#95F9EE, #25DBF1); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#95F9EE, #25DBF1); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#95F9EE, #25DBF1); /* Firefox 3.6 - 15 */
      background: linear-gradient(#95F9EE, #25DBF1); /* 标准的语法 */

      &-info {
        padding-top: 13px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        font-weight: 500;
      }

      &-grid {
        padding: 0 10px;
        height: 135px;
        width: 100%;
        position: absolute;
        border-radius: 5px;
        /*bottom: -17px;*/
        top: 55px;
        left: 0;


        &-in {
          display: flex;
          background: #fff;
          height: 100%;
          /*box-shadow: 0px 2px 11px 2px rgba(0, 0, 0, 0.06);*/
          border-radius: 5px;


          .avatar {
            width: 86px;
            padding: 32px 17px;

            div {
              width: 69px;
              height: 69px;
              border-radius: 69px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .userinfo {
            flex: 1;
            padding: 32px 35px 32px 17px;

            &-top {
              margin-bottom: 5px;

              span {
                font-size: 16px;
                font-weight: 500;
              }

              @{deep} .van-tag {
                font-size: 12px;
                margin-left: 8px;
                border-radius: 10px;
              }
            }

            &-bottom {
              span {
                margin-right: 15px;
                font-size: 14px;
                font-weight: 500;
                color: #999999;
                line-height: 25px;
              }
            }
          }
        }
      }
    }

    &__body {
      /*margin-top: 26px;*/
      margin-bottom: 13px;
      position: absolute;
      top: 203px;

      &-grid {
        padding: 0 10px;
        height: 55px;
        width: 100%;
        border-radius: 5px;

        &-top {
          display: flex;
          justify-content: space-around;
          background: #fff;
          height: 100%;
          /*box-shadow: 0px 2px 11px 2px rgba(0, 0, 0, 0.06);*/
          border-radius: 5px;

          > div {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 14px;
          }
        }
      }

      &-menu {
        padding: 0 10px;
        width: 100%;
        margin-top: 10px;
        @{deep} .van-grid {
          border-radius: 5px;
          overflow: hidden;
        }
        @{deep} .van-icon__image {
          width: 26px;
          height: 26px;
        }

        @{deep} .van-grid-item__text {
          font-size: 14px;
        }
      }
    }
  }
</style>



