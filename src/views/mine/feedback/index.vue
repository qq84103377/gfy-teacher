<template>
  <div class="feedback-wrap">
    <van-nav-bar class="feedback-wrap-header" left-arrow @click-left="$router.replace('/mine')">
      <div slot="title">意见反馈</div>
      <div slot="right">
        <router-link to="/feedbackList">
          <div class="record">反馈记录</div>
        </router-link>
      </div>
    </van-nav-bar>
    <div class="feedback-wrap-body" @click="previewImg">
      <van-row>
        <van-col span="1">
          <span style="color: red;">*</span>
        </van-col>
        <van-col span="23">
          <van-dropdown-menu>
            <van-dropdown-item v-model="obj.problemType" :options="typeList" @open='open' @close='close' ref="dropdown" />
          </van-dropdown-menu>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="1">
          <span style="color: red;">*</span>
        </van-col>
        <van-col span="23">
          <van-cell-group>
            <van-field v-model="obj.problemTitle" placeholder="请输入您遇到的问题"/>
          </van-cell-group>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="23" offset="1">
          <van-cell-group>
            <van-field
              v-model="obj.problem"
              type="textarea"
              placeholder="请输入您遇到的问题或建议（请填写10个字以上
的问题描述以便我们提供更好的帮助）！"
              rows="5"
              autosize
            />
          </van-cell-group>
        </van-col>
      </van-row>
      <div class="upload-box">
        <div class="pic-title">图片 <span>（选填，提供问题截图,最多可上传9张）</span></div>
        <div style="display: flex;flex-wrap: wrap">
          <div class="pre-container" v-for="(item,index) in imgList" :key="index">
            <div style="position: relative;width: 100%;height: 100%;">
              <img style="width: 100%;height: 100%;" :src="item.url"/>
              <span class="del" @click="del(index)">x</span>
            </div>
          </div>
          <div class="upl-container" v-if="imgList.length < 9" @click="fileSelect">
            <span>+</span>
            <span class="tips" v-if="imgList.length > 0">{{imgList.length}}/9</span>
            <span class="tips" v-else>添加图片</span>
          </div>
          <input
            type="file"
            id="fileSelect"
            accept="image/*"
            style="display: none;"
          />
        </div>
      </div>

    </div>
    <van-button
      type="info"
      :loading="btnLoading"
      size="large"
      @click="submit"
      loading-type="spinner"
    >提交
    </van-button>

    <van-action-sheet
      v-model="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      @select="handleSelect"
      @cancel="showActionSheet=false"
    />
  </div>
</template>

<style lang="less" scoped>
  @deep: ~'>>>';
  .feedback-wrap {
    background-color: #F5F6FA;

    &-header {
      @{deep} .van-nav-bar__title {
        text-align: left;
        margin-left: 34px;
        font-size: 18px;
      }

      @{deep} .van-nav-bar__right {
        .record {
          display: inline-block;
          color: #666666;
        }
      }
    }

    &-body {
      padding: 10px;
      margin-bottom: 100px;
      background-color: #F5F6FA;

      @{deep} .van-row {
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
        padding-left: 5px;
        display: flex;
        align-items: center;

        .van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after {
          border: none;
        }
        .van-dropdown-menu__item{
          justify-content: flex-start;
          .van-dropdown-menu__title{
            padding-left: 16px;
            .van-ellipsis{
              color: #999999;
            }
          }
        }
      }
      .upload-box {
        text-align: left;
        margin-top: 0;
        margin-bottom: 10px;
        margin-left: 11px;

        .pic-title {
          font-size: 14px;
          color: #333;
          margin: 20px 0 14px;

          span {
            font-size: 12px;
            color: #999;
          }
        }

        .pre-container {
          flex: 0 0 75px;
          height: 75px;
          margin: 0 10px 10px 0;

          .del {
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

        .upl-container {
          flex: 0 0 75px;
          height: 75px;
          border: 1px solid #ccc;
          display: flex;
          flex-direction: column;
          color: #ccc;
          align-items: center;
          background-color: #fff;

          span {
            font-size: 40px;
          }

          .tips {
            font-size: 12px;
          }
        }
      }
    }
    @{deep} .van-button{
      position: fixed;
      bottom: 10px;
      width: 355px;
      margin: 0 10px;
      border-radius: 40px;
    }
  }


</style>
<script>
  import {feedbackApi,pubApi} from "@/api/parent-GFY";
  import {stsAuthCoverAccessUrl, doUpLoad} from "@/api/upload";
  import {ImagePreview} from "vant";
  import {generateTimeReqestNumber, randomString} from "@/utils/filter";

  export default {
    data() {
      return {
        actions: [{name: "从相册选取"}, {name: "拍照"}],
        showActionSheet: false,
        btnLoading: false,
        typeList: [],
        photoList: [],
        oSSObject: null,
        imgList: [],
        showMask: false,
        imgUrl: "",
        visible: false,
        isUpload: false,
        //上传图片列表
        uploadList: [],
        imgObj: null,
        curFile: null,
        title: "意见反馈",
        rt: {
          desc: "反馈记录",
          path: "/feedbackList",
          method: null
        },
        obj: {
          problem: "",
          problemTitle: "",
          telOrQQ: "",
          problemType: ""
        },
         showDrop:false
      };
    },
     beforeRouteLeave(to, from, next) {
      if (this.showActionSheet) {
        this.showActionSheet = false
        next(false)
      }else if (this.showDrop) {
        this.close()
        next(false)
      }else{  
      next();
      }
    },
    methods: {
      open(){
          this.showDrop=true
        },
        close(){
          this.$refs['dropdown'].toggle(false)
          this.showDrop=false
        },
      // 预览图片
      previewImg($event) {
        if ($event.target.nodeName == "IMG") {
          ImagePreview({
            images: [$event.target.src],
            // startPosition: 1,
            onClose() {
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
            try {
              this.photoList = [...this.photoList, {base64: imgBase}];
              var arr = imgBase.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              this.curFile = new Blob([u8arr], {type: mime});
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
            // this.$toast.fail(failMsg);
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
      fileSelect() {
        if ("cordova" in window) {
          this.showActionSheet = !this.showActionSheet;
        } else {
          if (this.oSSObject == null) {
            this.getOSSKey();
          }
          console.log("fileSelect", this.imgList);
          this.myPhoto("fileSelect").then(obj => {
            console.log("obj", obj);
            this.photoList = obj.list;
            this.curFile = obj.curFile;
            console.log("fileList", obj.list);
            console.log("file", obj.curFile);
            this.uploadIMG(obj.curFile);
          });
        }
      },
      getOSSKey() {
        let json = {
          requestJson: JSON.stringify({
            interUser: "runLfb",
            interPwd: "25d55ad283aa400af464c76d713c07ad",
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            belongSchoolId: this.$store.getters.schoolId,
            docTypeCd: "T16",
            sysTypeCd: "T01"
          })
        };
        console.log("getOSSKey json", json);
        stsAuthCoverAccessUrl(json).then(data => {
          console.log("stsAuthCoverAccessUrl", data.data[0]);
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
      uploadIMG(curFile) {
        console.log("开始上传");
        console.log(this.oSSObject);
        var filetime = generateTimeReqestNumber();
        let randomStr = randomString(5);
        let formData = new FormData();
        formData.append(
          "key",
          this.oSSObject.key +
          this.$store.getters.getUserInfo.accountNo +
          filetime +
          randomStr +
          ".jpeg"
        );
        formData.append("policy", this.oSSObject.policyBase64);
        formData.append("OSSAccessKeyId", this.oSSObject.accessid);
        formData.append("signature", this.oSSObject.signature);
        formData.append("file", curFile);
        formData.append("success_action_status", "200");
        // console.log(formData);
        doUpLoad(this.oSSObject.host, formData).then(data => {
          console.log("doUpLoad", data);
          var imgUrl =
            this.oSSObject.host +
            "/" +
            this.oSSObject.key +
            this.$store.getters.getUserInfo.accountNo +
            filetime +
            randomStr +
            ".jpeg";
          var imgObj = {
            url: imgUrl
          };
          this.imgList.push(imgObj);
          console.log("this.imgList", this.imgList);
        });
      },
      submit() {
        console.log("obj", this.obj);
        if (this.obj.problemType == "0") {
          this.$notify("请选择问题类型！");
          return;
        }
        if (this.obj.problemTitle.trim() == 0) {
          this.$notify("问题标题不能为空！");
          return;
        }
        var str = "";
        if (this.imgList.length > 0) {
          for (var i = 0; i < this.imgList.length; i++) {
            str += this.imgList[i].url + ",";
          }
        }
        var json = {
          requestJson: JSON.stringify({
            accountNo: this.$store.getters.getUserInfo.accountNo,
            ...this.obj,
            imgList: str,
            problemOrigin: "T07"
          })
        };
        console.log(json);
        this.btnLoading = true;
        pubApi.uploadFeedback(json).then(data => {
          if (data.flag) {
            this.$store.state.feedBackList = null;
            let img = "";
            this.imgList.forEach(v => {
              img += `<img style="width: 75px;height: 75px; margin: 0 10px 10px 0;" src="${v.url}">`;
            });
            const params = {
              objectId: data.data[0].feedbackId,
              appraiseContent: `<div style="font-size: 14px;margin: 10px 0;overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;word-break: break-all;">${this.obj.problem}</div><div style="display: flex;flex-wrap: wrap;">${img}</div>`, //this.obj.problem + str,
              accountNo: this.$store.getters.getUserInfo.accountNo,
              objectTypeCd: "A08"
            };
            pubApi.addAppraise(params).then(res => {
              this.btnLoading = false;
              if (res.flag) {
                this.$toast.success("提交成功！");
                this.obj.problem = "";
                this.obj.problemTitle = null;
                this.obj.telOrQQ = null;
                this.imgList = [];
                this.photoList = [];
                this.imgUrl = "";
                this.curFile = null;
                this.$router.push("/feedbackList");
              } else {
                this.$toast.fail("提交失败！");
                this.imgList = [];
                this.photoList = [];
                this.imgUrl = "";
                this.curFile = null;
              }
            });
          } else {
            this.btnLoading = false;
            this.$toast.fail("提交失败！");
            this.imgList = [];
            this.photoList = [];
            this.imgUrl = "";
            this.curFile = null;
          }
        });
      },
      myPhoto(id) {
        var imgUploadList = [];

        let fileInputs = document.getElementById(id);
        fileInputs.click();
        var p = new Promise(function (resolve, reject) {
          fileInputs.onchange = function (e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            let file = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              file["base64"] = e.target.result;
              file["ind"] = imgUploadList.length;
              if (imgUploadList.indexOf(file) > -1) {
                return;
              } else {
                imgUploadList.push(file);
              }
            };
            console.log("file1111", file);
            var obj = {
              curFile: file,
              list: imgUploadList
            };
            resolve(obj);
          };
        });
        return p;
      },
      getSysDictList() {
        const json = {
          requestJson: JSON.stringify({
            interUser: "123",
            interPwd: "123",
            dictCode: "Domain_FeedbackT03_Question_Type"
          })
        };
        feedbackApi.getSysDictList(json).then(res => {
          if (res.flag) {
            this.typeList = res.data[0].sysDictInfoList.map(function (item) {
              return {
                text: item.dictValue,
                value: item.dictKey
              };
            });
            var temp = {
              text: "请选择问题类型",
              value: "0"
            };
            this.typeList.unshift(temp);
            this.obj.problemType = this.typeList[0].value;
          }
        });
      }
    },
    created() {
      this.photoList = [];
      this.imgList = [];
      this.imgUrl = "";
      this.curFile = null;
      this.getSysDictList();
    },
    mounted() {
      this.getOSSKey();
    }
  };

</script>


