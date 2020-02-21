<template>
  <div class="info">
    <div class="edit-info">
      <div class="edit-info__body">
        <van-cell-group>
          <van-cell is-link class="edit-info__body-avatar" title="头像" @click="fileSelect()">
            <template slot="default">
              <div class="avatar-box">
                <img
                  v-if="$store.getters.getUserInfo&&$store.getters.getUserInfo.iconUrl"
                  :src="iconUrl"
                  alt
                />
                <img v-else src="@/assets/img/icon-qq.png" alt/>
                <input type="file" id="fileSelect" accept="image/*" style="display: none;"/>
              </div>
            </template>
          </van-cell>
          <van-cell title="性别" is-link :value="gender" @click="showGenderPicker = true"/>
          <van-cell title="学校" is-link :value="schoolName" @click="showschoolSheet = true"></van-cell>
          <van-cell title="学科" is-link :value="subjectName" @click="showsubjectSheet = true"></van-cell>
          <van-cell title="职务" is-link :value="postName" @click="showpostSheet = true"></van-cell>
          <van-cell title="班级" class="classInfo" is-link @click="showclassSheet = true">
            <template slot="default">
              <div>
                <p>{{className.name}}</p>
                <span>班级人数：{{className.stuNum}}</span>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 头像上传方式-->
      <van-action-sheet
        v-model="showActionSheet"
        :actions="actions"
        cancel-text="取消"
        @select="handleSelect"
        @cancel="showActionSheet=false"
      />
      <!-- 选择性别-->
      <!--      <van-popup v-model="showGenderPicker" position="bottom">-->
      <!--        <van-picker-->
      <!--          show-toolbar-->
      <!--          :columns="genderColumns"-->
      <!--          :default-index="genderIndex"-->
      <!--          @cancel="showGenderPicker = false"-->
      <!--          @confirm="onGenderConfirm"-->
      <!--        />-->
      <!--      </van-popup>-->
      <van-action-sheet
        v-model="showGenderPicker"
        :actions="genderColumns"
        cancel-text="取消"
        @select="onGenderConfirm"
        @cancel="showGenderPicker=false"
      />
      <!-- 学校列表-->
      <van-action-sheet
        v-model="showschoolSheet"
        :actions="schoolList"
        cancel-text="关闭"
        @cancel="showschoolSheet=false"
      />
      <!-- 学科列表-->
      <van-action-sheet
        v-model="showsubjectSheet"
        :actions="subjectList"
        cancel-text="关闭"
        @cancel="showsubjectSheet=false"
      />
      <!-- 职务列表-->
      <van-action-sheet
        v-model="showpostSheet"
        cancel-text="关闭"
        @cancel="showpostSheet=false"
      >
        <div class="classItem" v-for="item in postList" v-if="item">
          {{item | getPostName}}
        </div>
      </van-action-sheet>

      <!-- 班级列表-->
      <van-action-sheet
        v-model="showclassSheet"
        cancel-text="关闭"
        @cancel="showclassSheet=false"
      >

        <template v-for="item in classList" v-if="item">
          <div class="classItem" v-for="v in item.classList">
            <p>{{item.schoolName}}{{v.gradeName}}{{v.className}}</p>
            <span>班级人数：{{v.studentInfo?v.studentInfo.length:0}}</span>
          </div>
        </template>

      </van-action-sheet>
      <cropper @finish="finish" :visible.sync="cropperData.visible" :img="cropperData.img"></cropper>
    </div>
  </div>
</template>

<script>
  import {stsAuthCoverAccessUrl, doUpLoad} from "@/api/upload";
  import {getMySchoolInfo, updateUserInfo} from "@/api/mine";
  import cropper from "../../components/cropper";
  import {generateTimeReqestNumber, randomString} from "@/utils/filter";

  export default {
    name: "userInfo",
    components: {
      cropper
    },

    data() {
      return {
        avatar: "", //头像url
        actions: [{name: "从相册选取"}, {name: "拍照"}],
        iconUrl: "",
        oSSObject: null,
        blob: null,
        showActionSheet: false,
        genderColumns: [{name: "男"}, {name: "女"}],
        gender: "女",
        sexTypeCd: "S02",
        showGenderPicker: false,
        genderIndex: 0,
        cropperData: {
          visible: false,
          img: ""
        },
        showsubjectSheet: false,
        showschoolSheet: false,
        showclassSheet: false,
        showpostSheet: false,
        subjectList: [],
        schoolList: [],
        classList: [],
        postList: [],
        schoolName: '',
        subjectName: '',
        postName: '',
        className: {
          name: "",
          stuNum: 0
        },
      };
    },
      beforeRouteLeave(to, from, next) {
      if (this.showActionSheet) {
        this.showActionSheet = false
        next(false)
      } else if(this.showsubjectSheet){
        this.showsubjectSheet = false
        next(false)
      } else if(this.showschoolSheet){
        this.showschoolSheet = false
        next(false)
      } else if(this.showclassSheet){
        this.showclassSheet = false
        next(false)
      } else if(this.showpostSheet){
        this.showpostSheet = false
        next(false)
      } else if(this.showGenderPicker){
        this.showGenderPicker = false
        next(false)
      }else{
      next();
      }
    },
    methods: {
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
          // console.log('getMySchoolInfo', res)
          if (res.flag && res.data.length > 0) {
            let schoolList = res.data[0].schoolList;
            let length = schoolList.length;
            this.schoolList = schoolList.map(item => {
              return {name: item.schoolName}
            })
            this.schoolName = this.schoolList[0] ? this.schoolList[0].name : '';

            // 获取老师科目列表，去重后
            for (let i = 0; i < length; i++) {
              // 职务
              this.postList = Array.from(new Set([...this.postList, schoolList[i].postType]));
              this.postName = this.$options.filters.getPostName(this.postList[0]);
              let gradeList = schoolList[i].classGradeList;
              let gradeLen = gradeList.length;
              for (let j = 0; j < gradeLen; j++) {
                let subjectList = gradeList[j].subjectList;
                let arr = subjectList.map(item => {
                  return item.subjectName;
                })
                this.subjectList = Array.from(new Set([...this.subjectList, ...arr]));
                // let subjectLen = subjectList.length;
                // for (let k = 0; k < subjectLen; k++) {
                //   this.classList = [...this.classList, {
                //     classGradeName: gradeList[j].classGradeName,
                //     classList: subjectList[k].classList
                //   }]
                // }
                // console.log('classListclassList', this.classList)
              }
            }
            // 获取班级列表
            let mySchoolInfo = res.data[0].mySchoolInfo;
            this.classList = mySchoolInfo.map(item => {
              if (item.myClassInfo) {
                console.log('schoolName', item.schoolName, item.myClassInfo)
                return {schoolName: item.schoolName, classList: item.myClassInfo}
              } else {
                return null
              }
            })
            // console.log('classListclassList', this.classList)
            if (this.classList && this.classList.length > 0) {
              let shoolName = this.classList[0].schoolName;
              shoolName += this.classList[0].classList[0].gradeName;
              shoolName += this.classList[0].classList[0].className;
              this.className.name = shoolName;
              if (this.classList[0].classList[0].studentInfo) {
                this.className.stuNum = this.classList[0].classList[0].studentInfo.length;
              } else {
                this.className.stuNum = 0;
              }
            }
            this.subjectList = this.subjectList.map(item => {
              return {name: item}
            })
            this.subjectName = this.subjectList[0] ? this.subjectList[0].name : '';

          }
        })
      },
      // 修改性别
      onGenderConfirm(value) {
        this.showGenderPicker = false;
        // 若没改变值不掉接口
        if (this.gender == value.name) {
          return;
        }
        if (value.name == '男') {
          this.sexTypeCd = 'S01';
        } else if (value.name == '女') {
          this.sexTypeCd = 'S02';
        }
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          sexTypeCd: this.sexTypeCd,
        }

        updateUserInfo(obj).then(res => {
          console.log('updateUserInfo', res)
          if (res.flag) {
            this.$toast('修改性别成功');
            this.$store.commit('setUserInfo', res.data[0].usrInfo);
            this.initUserInfo();
          } else {
            this.$toast(res.msg);
          }
        })
      },
      fileSelect() {
        if ("cordova" in window) {
          this.showActionSheet = !this.showActionSheet;
        } else {
          if (this.oSSObject == null) {
            this.getOSSKey();
          }
          this.myPhoto("fileSelect").then(obj => {
            console.log("fileSelect", obj.curFile);
            this.cropperData.img = obj.base64;
            this.cropperData.visible = true;
            // this.uploadIMG(obj.curFile);

          });
        }
      },
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
      finish(base64, blob) {
        this.avatar = base64;
        this.blob = blob;
        this.uploadIMG(this.blob);
      },
      async uploadIMG(curFile) {
        console.log("oSSObject", this.oSSObject);
        let formData = new FormData();
        let filetime = generateTimeReqestNumber();
        let randomStr = randomString(5);

        formData.append(
          "key",
          this.oSSObject.key +
          this.$store.getters.getUserInfo.accountNo + '_' +
          filetime + '_' +
          randomStr +
          ".png"
        );
        formData.append("policy", this.oSSObject.policyBase64);
        formData.append("OSSAccessKeyId", this.oSSObject.accessid);
        formData.append("signature", this.oSSObject.signature);
        formData.append("file", curFile);
        formData.append("success_action_status", "200");
        console.log("file size", curFile.size);
        if (curFile.size > this.oSSObject.size * 1024) {
          this.$toast.fail("请选择小于" + this.oSSObject.size / 1024 + "M的图片");
          return;
        }
        console.log("formData", formData);
        await doUpLoad(this.oSSObject.host, formData)
          .then(data => {
            console.log("doUpLoad", data);
            this.iconUrl =
              this.oSSObject.host +
              "/" +
              this.oSSObject.key +
              this.$store.getters.getUserInfo.accountNo + '_' +
              filetime + '_' +
              randomStr +
              ".png";
            console.log(this.iconUrl);
            this.updateIconUrl(this.iconUrl);
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
          console.log(data, "dadadadadad");
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
      initUserInfo() {
        //当前登录者信息从本地中获取
        if (localStorage.getItem("userInfo")) {
          this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
          console.log("this.userInfo", this.userInfo);
          this.sexTypeCd = this.userInfo.sexTypeCd;
          this.iconUrl = this.userInfo.iconUrl;
          this.gender = this.sexTypeCd == "S02" ? "女" : "男";
          // this.genderIndex = this.gender == "女" ? 1 : 0;
        }
      },
      myPhoto(id) {
        let fileInputs = document.getElementById(id);
        fileInputs.click();
        var p = new Promise((resolve, reject) => {
          fileInputs.onchange = function (e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            let file = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let baseData = "";
            reader.onload = $e => {
              file["base64"] = $e.target.result;
              baseData = $e.target.result;
              var obj = {
                curFile: file,
                base64: baseData
              };
              resolve(obj);
            };
          };
        });
        return p;
      },
      updateIconUrl(iconUrl) {
        let obj = {
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          accountNo: this.$store.getters.getUserInfo.accountNo,
          iconUrl: iconUrl
        }

        updateUserInfo(obj).then(res => {
          console.log('updateUserInfo', res)
          if (res.flag) {
            this.$toast('修改头像成功');
            this.$store.commit('setUserInfo', res.data[0].usrInfo);
            this.initUserInfo();
          } else {
            this.$toast(res.msg);
          }
        })
      }
    },
    filters: {
      getPostName(val) {
        switch (val) {
          case 'P01':
            return "校长"
          case 'P02':
            return "副校长"
          case 'P03':
            return "教导主任"
          case 'P04':
            return "教务主任"
          case 'P05':
            return "备课组长"
          case 'P06':
            return "年级组长"
          case 'P07':
            return "教研组长"
          case 'P11':
            return "任课老师"
          case 'P12':
            return "教研员"
        }
      }
    },
    created: function () {
      this.initUserInfo();
      this.getMySchoolInfo();
      this.getOSSKey();
    }
  };
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .info {
    background: #f5f5f5;

    .edit-info {
      &__body {
        padding-top: 10px;

        @{deep} [class*=van-hairline]:after {
          border: none;
        }

        &-avatar {
          position: relative;
          height: 75px;
          line-height: 55px;

          @{deep} .van-cell__value {
            overflow: unset;
            position: unset;
          }

          @{deep} .van-cell__right-icon {
            line-height: 55px;
          }

          .avatar-box {
            width: 50px;
            height: 50px;
            border-radius: 50px;
            overflow: hidden;
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            .center;

            img {
              width: 50px;
            }
          }
        }

        @{deep} .van-cell__value {
          color: #666;
          font-size: 12px;
        }

        @{deep} .van-cell__title {
          font-size: 14px;
        }


        @{deep} .classInfo {
          align-items: center;

          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

        }
      }

      .classItem {
        height: 60px;
        text-align: center;
        border-bottom: 1px solid #F5F6FA;
        .column-center;

        p {
          font-size: 16px;
          color: #000;
        }

        span {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  body @{deep} .van-toast {
    min-height: 40px !important;
  }

</style>
