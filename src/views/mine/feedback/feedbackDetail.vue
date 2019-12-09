<template>
  <div class="feedbackDetail">
    <div class="maxBox">
      <div ref="contentWrap" class="list" @click="previewImg">
        <div class="badge" v-if="$route.query.status == 'S07'">解决</div>
        <div class="list-t">
          <p>编号:{{info[0].objectId}}</p>
          <p class="appraiseDate">{{info[0].appraiseDate}}</p>
        </div>
        <div class="list-b">
          <div class="list-b__desc">
            <span>{{$route.query.title}}</span>
          </div>
          <div v-html="info[0].appraiseContent" class="appraiseContent"></div>
        </div>
        <div class="ask-info" v-for="(item,index) in info" v-if="index>0" :key="index">
          <div class="ask-info-t">
            <span>{{item.appraiseAccountNo == accountNo?'追问:':'工作人员回复:'}}</span>
            <span class="appraiseDate">{{item.appraiseDate}}</span>
          </div>
          <div v-html="item.appraiseContent" class="appraiseContent"></div>
        </div>
        <div v-if="showAsk" class="ask-agin">
          <van-cell-group>
            <van-field v-model="desc" type="textarea" placeholder="请输入您遇到的问题或建议（请填写10个字以上的问题描述以便我们提供更好的帮助）！" rows="5" autosize />
          </van-cell-group>
          <div class="askbox">
            <div class="uploadbox" v-for="(item,index) in imgList" :key="index">
              <div class="preview">
                <img style="width: 100%;height: 100%;" :src="item.url" />
                <span @click="del(index)">x</span>
              </div>
            </div>
            <div class="upload" v-if="imgList.length < 9" @click="fileSelect">
              <span>+</span>
              <span v-if="imgList.length > 0">{{imgList.length}}/9</span>
              <span v-else>添加图片</span>
            </div>
            <input type="file" id="fileSelect" accept="image/*" style="display: none;" />
          </div>
        </div>
        <div class="comment" v-if="score">
          <span>你的评价:</span>
          <div style="display: flex;">
            <div class="icon-flower actived" v-for="(item,index) in score" :key="index"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="askbtn" v-if="!score">
      <div v-if="!(['S07','S08','S09'].includes($route.query.status))" @click="handleAsk" style="color: #39F0DD;background: #fff;">{{showAsk?'取消':'继续提问'}}
      </div>
      <div v-if="!(['S07','S08','S09'].includes($route.query.status))" @click="handleSubmit">{{showAsk?'提交':'结束提问'}}
      </div>
      <div v-else @click="appraiseDialog=true">立即评价</div>
    </div>
    <van-dialog class="appraise-dialog" v-model="appraiseDialog" title confirmButtonText="提交" confirmButtonColor="#39F0DD" show-cancel-button @confirm="updateFeedback">
      <div class="title">
        <div style="flex: 1;text-align: center;">评价</div>
      </div>
      <div class="body">
        <div class="ques" style="display:flex;">
          <div>问题：</div>
          <van-radio-group class="radiogroup" style="display:flex;margin-left: 0;" v-model="appraiseData.problemSolved">
            <van-radio name="I01" checked-color="#56c3fe">
              已解决
              <img slot="icon" slot-scope="props" :src="props.checked ? activeIcon : inactiveIcon">
            </van-radio>&nbsp; &nbsp;
            <van-radio name="I02" checked-color="#56c3fe">
              未解决
              <img slot="icon" slot-scope="props" :src="props.checked ? activeIcon : inactiveIcon"></van-radio>
          </van-radio-group>
        </div>
        <div class="comment">
          <span>评价:</span>
          <div v-for="item in 5" :key="item" class="icon-flower" :class="{actived: appraiseData.evaluationScore >= item}" @click="handleRate(item)"></div>
        </div>
      </div>
    </van-dialog>
    <van-action-sheet v-model="showActionSheet" :actions="actions" cancel-text="取消" @select="handleSelect" @cancel="showActionSheet=false" />
  </div>
</template>
<style lang="less" scoped>
@deep: ~">>>";
.feedbackDetail {
  display: flex;
  flex-direction: column;

  .maxBox {
    overflow-y: scroll;
    flex: 1;
    display: flex;
    overflow-x: hidden;
    background-color: #eee;

    .list {
      position: relative;
      overflow-y: scroll;
      overflow-x: hidden;
      background: #fff;
      border-radius: 10px;
      text-align: left;
      margin: 10px;
      margin-bottom: 0;
      padding: 30px 7px;
      padding-bottom: 52px;
      width: 100%;

      @{deep} img {
        display: inline-block;
        width: 75px;
        height: 75px;
        margin: 0 10px 10px 0;
      }

      .badge {
        position: absolute;
        text-align: center;
        line-height: 96px;
        right: -28px;
        top: -28px;
        width: 56px;
        height: 56px;
        font-size: 10px;
        background: #24b969;
        color: #fff;
        transform: rotateZ(45deg);
      }

      .appraiseContent {
        font-size: 14px;
        color: #333;
        line-height: 28px;
      }

      .list-t {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #666666;
      }

      .list-b {
        padding-bottom: 20px;
        &__desc {
          border-bottom: 1px solid #f5f5f5;
          font-size: 16px;
          color: #333;
          font-weight: bold;
          line-height: 20px;
          padding: 15px 0;
          margin-bottom: 15px;
        }
      }

      /*工作人员回复*/

      .ask-info {
        border-top: 1px dashed #ccc;
        padding-bottom: 20px;

        .ask-info-t {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;

          span {
            font-size: 14px;
            color: #666666;
          }
        }
      }
      .ask-agin {
        border-top: 1px dashed #ccc;
        @{deep} .van-cell {
          background-color: #f5f6fa;
        }
      }

      .askbox {
        display: flex;
        flex-wrap: wrap;
        font-size: 10px;
        margin-top: 10px;

        .uploadbox {
          flex: 0 0 75px;
          height: 75px;
          margin: 0 10px 10px 0;

          .preview {
            position: relative;
            width: 100%;
            height: 100%;

            span {
              position: absolute;
              width: 16px;
              height: 16px;
              right: -8px;
              top: -8px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.5);
              color: #fff;
              text-align: center;
              line-height: 16px;
              font-size: 16px;
            }
          }
        }

        .upload {
          // width: 75px;
          flex: 0 0 75px;
          height: 75px;
          border: 1px solid #ccc;
          display: flex;
          flex-direction: column;
          color: #ccc;
          align-items: center;

          span {
            font-size: 12px;

            &:nth-of-type(1) {
              font-size: 40px;
            }
          }
        }
      }

      .comment {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        border-top: 1px dashed #ccc;
      }
    }
  }

  .askbtn {
    font-size: 16px;
    position: fixed;
    width: 100%;
    line-height: 48px;
    bottom: 0;
    z-index: 30;
    background: #fff;
    display: flex;

    div {
      text-align: center;
      background: #39f0dd;
      color: #fff;
      flex: 1;
    }
  }

  .appraise-dialog {
    .title {
      display: flex;
      justify-content: space-between;
      color: #010101;
      font-size: 18px;
      height: 30px;
      line-height: 30px;
    }

    .body {
      padding: 20px 10px;

      .ques {
        .radiogroup {
          margin-left: 50px;
          @{deep} .van-radio__icon {
            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }

      .comment {
        display: flex;
        margin-top: 30px;

        span {
          margin-right: 8px;
        }
      }
    }
  }
  .icon-flower {
    width: 20px;
    height: 20px;
    margin-right: 9px;
    background: url(../../../assets/img/flower.png) center center no-repeat;
    background-size: contain;

    &.actived {
      background: url(../../../assets/img/flower_actived.png) no-repeat;
      background-size: contain;
    }
  }
}
</style>
<script>
import { pubApi, feedbackApi } from "@/api/parent-GFY";
import * as uploadApi from "@/api/upload";
import { ImagePreview } from "vant";
import {
  generateTimeReqestNumber,
  randomString,
} from "@/utils/filter";

export default {
  data() {
    return {
      actions: [{ name: "从相册选取" }, { name: "拍照" }],
      showActionSheet: false,
      imgUploadList: [],
      btnLoading: false,
      appraiseData: { problemSolved: "I01", evaluationScore: 0 },
      appraiseDialog: false,
      desc: "",
      imgList: [],
      oSSObject: null,
      photoList: [],
      showAsk: false,
      title: "反馈详情",
      rt: {
        desc: null,
        path: null
      },
      info: [{}],
      imgUrl: "",
      activeIcon: require("../../../assets/img/icon-radio-active.png"),
      inactiveIcon: require("../../../assets/img/icon-radio-disable.png")
    };
  },
  watch: {
    showAsk(v) {
      if (v) {
        this.photoList = [];
        this.imgList = [];
        this.imgUploadList = [];
      }
    }
  },
  filters: {
    dealTxt: function (val) {
      if (val == null || val.length == 0) {
        return "暂无描述";
      } else {
        return val;
      }
    },
    dealTime(value) {
      var time = new Date(value);
      return (
        time.getFullYear() +
        "/" +
        (time.getMonth() + 1) +
        "/" +
        time.getDate() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        time.getSeconds()
      );
    }
  },
  computed: {
    accountNo() {
      return this.$store.getters.getUserInfo.accountNo;
    },
    score() {
      return Number(this.$route.query.evaluationScore || 0);
    }
  },
  components: {
    // Header
  },
  mounted() {
  },
  methods: {
    previewImg($event) {
      if ($event.target.nodeName == "IMG") {
        console.log($event.target.src);
        ImagePreview({
          images: [$event.target.src],
          // startPosition: 1,
          onClose() {
            // do something
            console.log("close");
          }
        });
      }
    },
    // 选择上传图片的方式
    handleSelect(item, index) {
      // index 0 相册  1 拍照
      this.showActionSheet = false;
      navigator.camera.getPicture(
        imageData => {
          let imgBase = "data:image/jpeg;base64," + imageData;
          console.log("imgBase", imgBase);
          try {
            // this.cropperData.visible = true;
            this.photoList = [...this.photoList, { base64: imgBase }];
            var arr = imgBase.split(","),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            this.curFile = new Blob([u8arr], { type: mime });
            // if (this.oSSObject == null) {
            //   this.getOSSKey();
            // }
            console.log("file");

            console.log(this.curFile);
            this.uploadIMG(this.curFile);
          } catch (e) {
            console.log(e);
          }
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

    del(ind) {
      this.imgList.splice(ind, 1);
    },
    handleRate(item) {
      this.appraiseData.evaluationScore = item;
    },
    handleAsk() {
      this.showAsk = !this.showAsk;
      if (this.showAsk) {
        this.$nextTick(() => {
          // this.$refs["contentWrap"].scrollTo(
          //   0,
          //   this.$refs["contentWrap"].scrollHeight
          // );
          this.$refs["contentWrap"].scrollTop = this.$refs["contentWrap"].scrollHeight
        });
      }
    },
    handleSubmit() {
      if (this.showAsk) {
        if (this.desc == "") return this.$toast.fail("请输入意见内容!");
        this.btnLoading = true;
        let img = "";
        this.imgList.forEach(v => {
          img += `<img src="${v.url}">`;
        });
        const params = {
          objectId: this.$route.query.objectId,
          appraiseContent: `<div style="font-size: 14px;margin: 10px 0;overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;word-break: break-all;">${this.desc}</div><div style="display: flex;flex-wrap: wrap;">${img}</div>`, //this.obj.problem + str,
          accountNo: this.accountNo,
          objectTypeCd: "A08"
        };
        pubApi.addAppraise(params).then(res => {
          this.btnLoading = false;
          if (res.flag) {
            const json = {
              requestJson: JSON.stringify({
                feedbackId: this.$route.query.objectId,
                feedbackStatus: "S03"
              })
            };
            pubApi.updateFeedback(json).then(ret => {
              if (ret.flag) {
                this.$toast.success("提交成功！");
                this.imgList = [];
                this.showAsk = false;
                this.desc = "";
                this.photoList = [];
                this.getDetail();
              } else {
                this.$toast.fail(ret.msg);
              }
            });
          } else {
            this.$toast.fail("提交失败！");
          }
        });
      } else {
        this.appraiseDialog = true;
      }
    },
    updateFeedback() {
      if (this.appraiseDialog && this.appraiseData.evaluationScore == 0) {
        this.$toast.fail("请选择评分");
        return;
      }
      const json = {
        requestJson: JSON.stringify({
          accountNo: this.accountNo,
          feedbackId: this.$route.query.objectId,
          feedbackStatus: "S07",
          ...this.appraiseData
        })
      };
      pubApi.updateFeedback(json).then(res => {
        this.btnLoading = false;
        if (res.flag) {
          this.$toast.success(this.appraiseDialog ? "评价成功!" : "结束提问!");
          this.appraiseDialog = !this.appraiseDialog;
          const { objectId, title } = this.$route.query;
          this.$router.replace({
            path: "/feedbackDetail",
            query: {
              objectId,
              title,
              status: "S07",
              evaluationScore: this.appraiseData.evaluationScore
            }
          });
        } else {
          this.$toast.fail(this.appraiseDialog ? "评价失败!" : "结束失败！");
        }
      });
    },
    uploadIMG(curFile) {
      var filetime = generateTimeReqestNumber();
      let randomStr = randomString(5);
      var formData = new FormData();
      console.log('oSSObject', this.oSSObject)
      formData.append(
        "key",
        this.oSSObject.key +
        this.$store.getters.getUserInfo.accountNo +
        filetime +
        randomStr
      );
      formData.append("policy", this.oSSObject.policyBase64);
      formData.append("OSSAccessKeyId", this.oSSObject.accessid);
      formData.append("signature", this.oSSObject.signature);
      formData.append("file", curFile);
      formData.append("success_action_status", "200");

      uploadApi.doUpLoad(this.oSSObject.host, formData).then(data => {
        var imgUrl =
          this.oSSObject.host +
          "/" +
          this.oSSObject.key +
          this.$store.getters.getUserInfo.accountNo +
          filetime +
          randomStr;
        var imgObj = {
          url: imgUrl
        };
        this.imgList.push(imgObj);
      });
    },
    getDetail() {
      const params = {
        objectId: this.$route.query.objectId,
        objectTypeCd: "A08",
        noPage: "true" //不分页
      };
      feedbackApi.getAppraise(params).then(res => {
        console.log('getAppraise', res)
        this.info = res.data[0].appraiseListInfo;
      });
    },
    fileSelect() {
      if ("cordova" in window) {
        this.showActionSheet = !this.showActionSheet;
      } else {
        if (this.oSSObject == null) {
          this.getOSSKey();
        }
        this.myPhoto("fileSelect").then(obj => {
          this.photoList = obj.list;
          this.curFile = obj.curFile;
          this.uploadIMG(obj.curFile);
        });
      }
    },
    getOSSKey() {
      let json = {
        requestJson: JSON.stringify({
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.accountNo,
          belongSchoolId: this.$store.getters.schoolId,
          docTypeCd: "T16",
          sysTypeCd: "T01"
        })
      };
      uploadApi.stsAuthCoverAccessUrl(json).then(data => {
        var obj = data.data[0].tokenInfo;
        var tmpSignatureObj = {
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
    myPhoto(id) {
      var imgUploadList = [];
      let fileInputs = document.getElementById(id);
      fileInputs.click();
      var p = new Promise((resolve, reject) => {
        fileInputs.onchange = function (e) {
          let files = e.target.files || e.dataTransfer.files;
          if (!files.length) return;
          let file = files[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = $e => {
            file["base64"] = $e.target.result;
            if (imgUploadList.indexOf(file) > -1) {
              return;
            } else {
              imgUploadList.push(file);
            }
          };
          var obj = {
            curFile: file,
            list: imgUploadList
          };
          resolve(obj);
        };
      });
      return p;
    }
  },
  created() {
    this.getDetail();
    this.getOSSKey();
  }
};
</script>

