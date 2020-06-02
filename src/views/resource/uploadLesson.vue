<template>
  <section class="upload-lesson">
    <div class="upload-lesson__body">
      <van-cell class="upload-lesson__body__cell">
        <div slot="title" class="upload-lesson__body__cell-ctn mgl5">
          <div><span class="red">*</span>名称:</div>
          <input v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
          <span class="red">{{64 - form.name.length}}</span>
          <van-icon v-show="form.name.length" @click="form.name = ''" class="close" name="clear"/>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title">
          <div class="jcsb">
            <div>简介:</div>
            <span class="red">{{200 - form.desc.length}}</span>
          </div>
          <textarea maxlength="200" v-model="form.desc" type="text" placeholder="请输入描述,字数在200字内"/>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title" class="upload-lesson__body__cell-ctn mgl5">
          <div><span class="red">*</span>音视频:</div>
          <div class="pdlt10" style="flex:1">{{wareName}}</div>
          <!-- <van-icon @click="fileSelect" class="add" name="add"/>
          <input type="file" id="fileSelect" accept="video/*" style="display: none;"> -->
          <!--          <van-uploader-->
          <!--            accept="video/*,audio/*" :before-read="read">-->
          <!--            <van-icon @click="" class="add" name="add"/>-->
          <!--          </van-uploader>-->
          <video-select @uploadCb="getUrl" :visible.sync="uploadSelect">
            <van-icon @click="uploadSelect = true" class="add" name="add"/>
          </video-select>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title">
          <div class="jcsb" @click="showSheet">
            <div>封面图:</div>
            <span style="flex: 1" class="pdlt10 grey9">轻触此添加封面图</span>
            <van-icon @click="" class="add" name="add"/>
          </div>
          <div class="img-group">
            <div class="img-wrap" v-for="(item,index) in imgList" :key="index">
              <img @click="previewImg(index)" :src="item.url" alt="">
              <van-icon style="border-radius: 50%;background: #fff;" @click="imgList.splice(index, 1)" name="clear"/>
            </div>
          </div>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell">
        <div slot="title" class="aic">
          <span class="mgr10">共享:</span>
          <van-radio-group style="display: flex;" v-model="form.share">
            <van-radio name="S01" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              仅自己
            </van-radio>
            <van-radio name="S02" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              校内
            </van-radio>
            <van-radio name="S03"><i slot="icon" slot-scope="props"
                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              公开
            </van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <van-cell class="upload-lesson__body__cell" v-if='!isfEducation'>
        <div slot="title" class="aic">
          <span class="mgr10">课中:</span>
          <van-radio-group style="display: flex;" v-model="form.relate">
            <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              仅资源
            </van-radio>
            <van-radio name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                 :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
              关联到课中
            </van-radio>
          </van-radio-group>
        </div>
      </van-cell>
      <div class="fs10 red pd10">
        <div>注:</div>
        <div>1.请上传MP4、WMV、AVI格式的视频文件,使用格式工厂迸行转换,转换吗成AVG(H264),比特率为500KB/s的MP4格式。</div>
        <div>2..上传WMV、AVI格式的文件时后台会対文件迸行装換，请稍后回来再刷新页面査看文件</div>
      </div>
    </div>
    <div class="upload-lesson__footer">
      <van-button :loading="form.btnLoading" loading-text="提交" type="info" class="submit" @click="submit">提交
      </van-button>
    </div>

    <van-action-sheet
      v-model="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      @select="handleSelect"
      @cancel="showActionSheet=false"
    />
  </section>
</template>

<script>
  import {generateTimeReqestNumber, randomString} from "@/utils/filter";
  import * as uploadApi from "@/api/upload";
  import {addCourseWare, createCourseSummitInfo, addImportTask, addTeachCourseRes} from '@/api/index'
  import {ImagePreview} from "vant";
  import videoSelect from '../../components/videoSelect'

  export default {
    name: "uploadLesson",
    components: {videoSelect},
    data() {
      return {
        uploadSelect: false,
        form: {
          share: 'S02',
          relate: '2',
          name: '',
          desc: '',
          btnLoading: false
        },
        actions: [{name: "从相册选取"}, {name: "拍照"}],
        showActionSheet: false,
        photoList: [],
        curFile: null,
        wareFile: null,
        wareName: null,
        wareUrl: '',
        wareSize: '',
        oSSObject: null,
        wareOSSObject: null,
        imgList: [],
        isfEducation: this.$route.query.isfEducation,
      }
    },
    mounted() {
      // this.getOSSKey(1);
      this.getOSSKey();
    },
    methods: {
      getUrl(url,name){
        this.wareName = name
        this.wareUrl = url
      },
      read(file, detail) {
        console.log(file.name, 'file.name');
        console.log(file.type, 'file.type');
        console.log(file, 'file');
        console.log(file.size, 'file.size');

        if (['.mp3', '.mp4', '.wmv', '.avi'].includes(file.name.substr(file.name.lastIndexOf('.')))) {
          if (file.size > 0) {
            this.wareFile = file;
            this.form.name = file.name.split('.')[0]
            this.wareSize = file.size
            this.uploadWare(file);
          } else {
            this.$toast('文件大小为0')
          }

        } else {
          this.$toast('请上传MP3、MP4、WMV、AVI格式的音视频文件')
        }
      },
      previewImg(startPosition) {
        ImagePreview({
          images: this.imgList.map(v => v.url),
          className: 'img-preview-init',
          startPosition,
          onClose() {
            // do something
            console.log("close");
          }
        });
      },
      createCourseSummitInfo(resourceId) {
        this.form.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "accountType": "A02",
          "belongSchoolId": this.$store.getters.schoolId,
          "dataUrl": this.wareUrl,
          // "dataUrl": 'http://quanlang.oss-cn-shenzhen.aliyuncs.com/video/201909/12134_1569724019_sdyBZ.mp4',
          "dataType": "D03",
          "resourceType": "R01",
          "resourceClass": "C01",
          resourceId,
          "majorLevel": "M01",
          "tchCourseId": this.$route.query.tchCourseId,
          "classId": this.$route.query.classId,
          "subjectType": this.$route.query.subjectType
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        return createCourseSummitInfo(params)
      },
      fileSelect() {
        this.myPhoto("fileSelect").then((obj) => {
          console.log(obj.curFile.name, 'file.name');
          console.log(obj.curFile.type, 'file.type');
          console.log(obj.curFile, 'file');
          console.log(obj.curFile.size, 'file.size');

          const fileType = obj.curFile.name.substr(obj.curFile.name.lastIndexOf('.'))
          console.log(fileType, 'ttttttttttttttttttttttttt');
          if (['.mov'].includes(fileType.toLowerCase())) return this.$toast('请上传MP4、WMV、AVI格式的视频文件')
          this.wareFile = obj.curFile;
          this.form.name = obj.curFile.name.split('.')[0]
          this.wareSize = obj.curFile.size
          this.uploadWare(obj.curFile);

        })
      },
      myPhoto(id) {
        let fileInputs = document.getElementById(id);
        fileInputs.click();
        var p = new Promise(function (resolve, reject) {
          fileInputs.addEventListener("change", function (e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            let file = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              // file["base64"] = e.target.result;
              // file["ind"] = imgUploadList.length;
              // if (imgUploadList.indexOf(file) > -1) {
              //   return;
              // } else {
              //   imgUploadList.push(file);
              // }
            };
            console.log("file1111", file);
            var obj = {
              "curFile": file,
              // "list":imgUploadList
            }
            resolve(obj);
          });
        });
        return p;
      },

      submit() {
        if (!this.form.name) {
          this.$toast('请输入名称')
          return
        }
        if (!this.wareUrl) {
          this.$toast('请添加音视频')
          return
        }
        this.form.btnLoading = true
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "subjectType": this.$route.query.subjectType,
          courseWareList: [{
            knowledgePointId: this.$route.query.sysCourseId,
            coursewareName: this.form.name,
            "coursewareClassify": "C01",
            "coursewareType": "T01",
            "srcUrl": this.wareUrl,
            "dstUrl": this.wareUrl,
            // "srcUrl": 'http://quanlang.oss-cn-shenzhen.aliyuncs.com/video/201909/12134_1569724019_sdyBZ.mp4',
            // "dstUrl": 'http://quanlang.oss-cn-shenzhen.aliyuncs.com/video/201909/12134_1569724019_sdyBZ.mp4',
            "belongSchoolId": this.$store.getters.schoolId,
            "belongAreaCode": this.$store.getters.getUserInfo.areaCode,
            "belongAccountNo": this.$store.getters.getUserInfo.accountNo,
            "source": "S04",
            "isShow": "S01",
            "statusCd": "S01",
            "shareType": this.form.share,
            "isDownload": "I01",
            "size": this.wareSize,
            // "size": 1036474,
            "imageUrl": this.imgList.length ? this.imgList[0].url : '',
            remark: this.form.desc
          }]
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addCourseWare(params).then(async res => {
          this.form.btnLoading = false
          if (res.flag) {
            this.addImportTask(res.coursewareIdList[0])
            if (this.form.relate === '3') {
              // 关联课中
              this.form.btnLoading = true
              Promise.all([this.addTeachCourseRes(res.coursewareIdList[0]), this.createCourseSummitInfo(res.coursewareIdList[0])]).then(respone => {
                this.form.btnLoading = false
                if (respone.every(v => v.flag)) {
                  this.$toast('添加成功')
                  this.$store.commit('setIsAddWare', true)
                  this.$router.back()
                } else {
                  this.$toast(respone.find(v => !v.flag).msg)
                }
              }).catch(err => {
                throw Error(err)
              })
            } else {
              //仅资源
              this.form.btnLoading = true
              let data = await this.addTeachCourseRes(res.coursewareIdList[0])
              this.form.btnLoading = false
              if (data.flag) {
                this.$toast('添加成功')
                this.$store.commit('setIsAddWare', true)
                this.$router.back()
              } else {
                this.$toast(data.msg)
              }
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      addTeachCourseRes(resourceId) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "tchCourseId": this.$route.query.tchCourseId,
          sysCourseId: this.$route.query.sysCourseId,
          relationSeqId: this.$route.query.relationCourseId,
          "resourceType": "R01",
          resourceId,
          "statusCd": "S04"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        return addTeachCourseRes(params)
      },
      addImportTask(resourceId) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo + '',
          "belongAccountNo": this.$store.getters.getUserInfo.accountNo + '',
          "belongSchoolId": this.$store.getters.schoolId + '',
          "belongAreaCode": this.$store.getters.getUserInfo.areaCode,
          taskType: 'T04',
          fileName: this.wareUrl.split(this.wareOSSObject.key)[1],
          // fileName: '12134_1569724019_sdyBZ.mp4',
          "belongType": "B02",
          "belongId": "0",
          fileKey: this.wareUrl.split(this.wareOSSObject.host)[1],
          // fileKey: '/video/201909/12134_1569724019_sdyBZ.mp4',
          "sourceUrl": this.wareUrl,
          "dstUrl": this.wareUrl,
          // "sourceUrl": 'http://quanlang.oss-cn-shenzhen.aliyuncs.com/video/201909/12134_1569724019_sdyBZ.mp4',
          // "dstUrl": 'http://quanlang.oss-cn-shenzhen.aliyuncs.com/video/201909/12134_1569724019_sdyBZ.mp4',
          "shareType": this.form.share,
          resourceId: resourceId + '',
          "resourceType": "R01"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        return addImportTask(params)
      },
      getOSSKey(type) {
        let json = {
          requestJson: JSON.stringify({
            interUser: "runLfb",
            interPwd: "25d55ad283aa400af464c76d713c07ad",
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            belongSchoolId: this.$store.getters.schoolId,
            docTypeCd: type ? "T02" : "T09",
            sysTypeCd: "T01"
          })
        };
        this.$store.commit('setVanLoading', true)
        console.log('getOSSKey json', json);
        uploadApi.stsAuthCoverAccessUrl(json).then(data => {
          console.log('stsAuthCoverAccessUrl', data.data[0]);
          this.$store.commit('setVanLoading', false)
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
          if (type) {
            this.wareOSSObject = tmpSignatureObj
            console.log(this.wareOSSObject, '=3=3=3=3=3');
          } else {
            this.oSSObject = tmpSignatureObj;
          }
        });
      },
      showSheet() {
        if (this.imgList.length) {
          this.$toast('只能上传一张图片!')
          return
        }
        this.showActionSheet = !this.showActionSheet
      },
      uploadWare(curFile) {
        this.$store.commit('setVanLoading', true)
        console.log("开始上传")
        var filetime = generateTimeReqestNumber();
        let randomStr = randomString(5);
        let formData = new FormData();
        formData.append("key", this.wareOSSObject.key + this.$store.getters.getUserInfo.accountNo + '_' +
          filetime + '_' +
          randomStr + '.' + curFile.type.split('/')[1]
        );
        console.log(this.wareOSSObject.key + this.$store.getters.getUserInfo.accountNo +
          filetime +
          randomStr + '.' + curFile.type.split('/')[1], '路径');
        formData.append('policy', this.wareOSSObject.policyBase64)
        formData.append('OSSAccessKeyId', this.wareOSSObject.accessid)
        formData.append('signature', this.wareOSSObject.signature)
        formData.append('file', curFile)
        formData.append('success_action_status', '200')
        try {
          MobclickAgent.onEvent('uploadLessonSubmit')
        } catch (e) {
          console.log(e)
        }
        uploadApi.doUpLoad(this.wareOSSObject.host, formData).then(data => {
          console.log('doUpLoad', data);
          this.$store.commit('setVanLoading', false)
          this.wareName = curFile.name
          this.wareUrl =
            this.wareOSSObject.host +
            "/" +
            this.wareOSSObject.key + this.$store.getters.getUserInfo.accountNo + '_' +
            filetime + '_' +
            randomStr + '.' + curFile.type.split('/')[1]
        }).catch(err => {
          this.$store.commit('setVanLoading', false)
        })
      },
      uploadIMG(curFile) {
        console.log("开始上传")
        console.log(this.oSSObject)
        this.$store.commit('setVanLoading', true)
        var filetime = generateTimeReqestNumber();
        let randomStr = randomString(5);
        let formData = new FormData();
        formData.append("key", this.oSSObject.key + this.$store.getters.getUserInfo.accountNo + '_' +
          filetime + '_' +
          randomStr + ".jpeg"
        );
        console.log(123);
        formData.append('policy', this.oSSObject.policyBase64)
        formData.append('OSSAccessKeyId', this.oSSObject.accessid)
        formData.append('signature', this.oSSObject.signature)
        formData.append('file', curFile)
        formData.append('success_action_status', '200')
        uploadApi.doUpLoad(this.oSSObject.host, formData).then(data => {
          this.$store.commit('setVanLoading', false)
          console.log('doUpLoad', data);
          var imgUrl =
            this.oSSObject.host +
            "/" +
            this.oSSObject.key + this.$store.getters.getUserInfo.accountNo + '_' +
            filetime + '_' +
            randomStr + ".jpeg";
          var imgObj = {
            url: imgUrl
          };
          this.imgList.push(imgObj);
        }).catch(err => {
          this.$store.commit('setVanLoading', false)
        })
      },
      handleSelect(item, index) {
        // index 0 相册  1 拍照
        this.showActionSheet = false;
        // this.cropperData.visible = true
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
              console.log(e)
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
                : Camera.PictureSourceType.SAVEDPHOTOALBUM,
            // sourceType : Camera.PictureSourceType.CAMERA,
            mediaType: 0  //圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
          }
        );
      },
    }
  }
</script>

<style lang="less" scoped>
  .upload-lesson {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    .mgl5 {
      margin-left: -7px;
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      &__cell {
        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }

        &-ctn {
          display: flex;
          align-items: center;

          input {
            flex: 1;
            padding: 0 10px;
          }
        }

        .img-group {
          display: flex;
          flex-wrap: wrap;
          margin-top: 18px;

          .img-wrap {
            position: relative;
            flex: 0 0 107px;
            height: 70px;
            margin-right: 10px;
            margin-bottom: 10px;

            img {
              width: 100%;
              height: 100%;
            }

            i {
              position: absolute;
              right: -6px;
              top: -6px;
              width: 15px;
              height: 15px;
              font-size: 15px;
              color: #000;

            }
          }
        }

        .close, .add {
          color: @blue;
          margin-left: 10px;
        }

        .add {
          font-size: 22px;
        }

        textarea {
          background: #F5F6FA;
          border-radius: 5px;
          height: 105px;
          width: 100%;
          margin-top: 15px;
          padding: 10px;
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      padding: 5px 10px;

      .submit {
        border-radius: 22px;
        width: 100%;
        font-size: 16px;
      }
    }
  }
</style>
