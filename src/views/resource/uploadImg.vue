<template>
  <section class="upload-img">
    <div class="upload-img__body">
      <van-cell>
        <div slot="title" class="upload-img__body__cell">
          <div class="aic">
            <div class="fs15"><span class="red">*</span>图片:</div>
<!--            <div class="pdlt10 fz10 grey9" @click="showSheet" style="flex:1">轻触此可添加多张图片(点击图片名可改名)</div>-->
<!--            <van-icon @click="showSheet" class="add" name="add"/>-->
            <div class="pdlt10 fz10 grey9" @click="getPic" style="flex:1">轻触此可添加多张图片(点击图片名可改名)</div>
            <van-icon @click="getPic" class="add" name="add"/>

            <!--            <input-->
            <!--              type="file"-->
            <!--              id="fileSelect"-->
            <!--              accept="image/*"-->
            <!--              capture="camera"-->
            <!--              style="display: none;"-->
            <!--            />-->
          </div>
          <draggable class="img-group" v-model="imgList" :options="{handle:'.img-group-item'}">
            <div class="img-group-item" v-for="(item,index) in imgList" :key="index">
              <img @click="previewImg(index)" :src="item.src" alt="">
              <div class="img-group-item__name" v-if="!item.edit" @click="changeName(item)">{{item.name}}</div>
              <div class="img-group-item__input" v-if="item.edit"><input @blur="$set(item,'edit',false)" maxlength="64"
                                                                         v-model="item.name" v-focus="item.edit"
                                                                         type="text"><span class="red">{{64 - item.name.length}}</span>
              </div>
              <van-icon style="border-radius: 50%;background: #fff;" @click="imgList.splice(index, 1)" class="clear" name="clear"/>
            </div>
          </draggable>
        </div>
      </van-cell>
      <van-cell class="upload-img__body__cell">
        <div slot="title" class="aic">
          <span class="mgr10"><span class="red">*</span>共享:</span>
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
      <van-cell class="upload-img__body__cell">
        <div slot="title" class="aic">
          <span class="mgr10"><span class="red">*</span>课中:</span>
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
    </div>
    <div class="upload-img__footer">
      <van-button :loading="form.btnLoading" loading-text="提交" type="info" class="btn" @click="submit">提交</van-button>
    </div>

<!--    <van-action-sheet-->
<!--      v-model="showActionSheet"-->
<!--      :actions="actions"-->
<!--      cancel-text="取消"-->
<!--      @select="handleSelect"-->
<!--      @cancel="showActionSheet=false"-->
<!--    />-->
  </section>
</template>

<script>
  import draggable from 'vuedraggable'
  import {generateTimeReqestNumber, randomString} from "@/utils/filter";
  import * as uploadApi from "@/api/upload";
  import {addCourseWare, createCourseSummitInfo, createCourseSummitInfoList, addTeachCourseResList} from '@/api/index'
  import { ImagePreview } from "vant";
  import uploadMixin from '@/utils/uploadMixin';
  export default {
    name: "uploadImg",
    mixins: [uploadMixin],
    components: {
      draggable,
    },
    directives: {
      focus: {
        inserted: (el, {value}) => {
          // console.log(el,value);
          console.log(value);
          if (value) {
            //由于是饿了么的el-input，需要拿到父元素下面的input
            el.focus();
          }
        }
      }
    },
    data() {
      return {
        form: {
          share: 'S02',
          relate: '2',
          btnLoading: false
        },
        // showActionSheet: false,
        // actions: [{name: "从相册选取"}, {name: "拍照"}],
        photoList: [],
        curFile: null,
        oSSObject: null,
        imgList: [],
      }
    },
    mounted() {
      this.getOSSKey();
    },
    methods: {
      getPic() {
          ImagePicker.getPictures((result) => {
            if(this.imgList.length + result.images.length > 9) {
              return this.$toast('不能超过9张图片')
            }
            this.multipleUpload(result)
          }, (err) => {
            // alert(err);
          });
      },
      previewImg(startPosition) {
        ImagePreview({
          images: this.imgList.map(v => v.src),
          startPosition,
          onClose() {
            // do something
            console.log("close");
          }
        });
      },
      // showSheet() {
      //   if (this.imgList.length >= 9) {
      //     this.$toast('最多上传9张图片!')
      //     return
      //   }
      //   this.showActionSheet = !this.showActionSheet
      // },
      changeName(item) {
        this.$set(item, 'edit', true)
      },
      getOSSKey() {
        this.$store.commit('setVanLoading', true)
        let json = {
          requestJson: JSON.stringify({
            interUser: "runLfb",
            interPwd: "25d55ad283aa400af464c76d713c07ad",
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            belongSchoolId: this.$store.getters.schoolId,
            docTypeCd: "T10",
            sysTypeCd: "T01"
          })
        };
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
          this.oSSObject = tmpSignatureObj;
        });
      },
      uploadIMG(curFile) {
        console.log("开始上传")
        console.log(this.oSSObject)
        // this.$store.commit('setVanLoading', true)
        var filetime = generateTimeReqestNumber();
        let randomStr = randomString(5);
        let formData = new FormData();
        formData.append("key", this.oSSObject.key + this.$store.getters.getUserInfo.accountNo + '_' +
          filetime + '_' +
          randomStr + ".jpeg"
        );
        formData.append('policy', this.oSSObject.policyBase64)
        formData.append('OSSAccessKeyId', this.oSSObject.accessid)
        formData.append('signature', this.oSSObject.signature)
        formData.append('file', curFile)
        formData.append('success_action_status', '200')
        return uploadApi.doUpLoad(this.oSSObject.host, formData)
          .then(data => {
          // this.$store.commit('setVanLoading', false)
          console.log('doUpLoad', data);
          var imgUrl =
            this.oSSObject.host +
            "/" +
            this.oSSObject.key + this.$store.getters.getUserInfo.accountNo + '_' +
            filetime + '_' +
            randomStr + ".jpeg";
          var imgObj = {
            src: imgUrl,
            name: 'img' + (this.imgList.length + 1),
            size: curFile.size
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
      submit() {
        if (!this.imgList.length) {
          this.$toast('请添加图片')
          return
        }
        this.form.btnLoading = true
        let courseWareList = []
        this.imgList.forEach(v => {
          // let arr = [{name:'haha'}]
        // arr.forEach(v => {
          courseWareList.push({
            knowledgePointId: this.$route.query.sysCourseId,
            coursewareName: v.name,
            // coursewareName: 'BB鸡',
            "coursewareClassify": "C03",
            "coursewareType": "T02",
            "srcUrl": v.src,
            "dstUrl": v.src,
            // "srcUrl": 'http://quanlang.oss-cn-shenzhen.aliyuncs.com/document/201908/12134_1566809308_ZP82e.png',
            // "dstUrl": 'http://quanlang.oss-cn-shenzhen.aliyuncs.com/document/201908/12134_1566809308_ZP82e.png',
            "belongSchoolId": this.$store.getters.schoolId,
            "belongAreaCode": this.$store.getters.getUserInfo.areaCode,
            "belongAccountNo": this.$store.getters.getUserInfo.accountNo,
            "source": "S04",
            "isShow": "S01",
            "statusCd": "S01",
            "shareType": this.form.share,
            "isDownload": "I01",
            "size": v.size,
            // "size": 1139,
          })
        })
        let obj = {
          "interUser": "runLfb",
          "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "subjectType": this.$route.query.subjectType,
          courseWareList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        addCourseWare(params).then(async res => {
          this.form.btnLoading = false
          if (res.flag) {
            if (this.form.relate === '3') {
              // 关联课中
              this.form.btnLoading = true
              Promise.all([this.addTeachCourseResList(res.coursewareIdList), this.createCourseSummitInfoList(res.coursewareInfoList)]).then(respone => {
                this.form.btnLoading = false
                if(respone.every(v => v.flag)) {
                  this.$toast('添加成功')
                  this.$store.commit('setIsAddWare', true)
                  this.$router.back()
                }else {
                  this.$toast(respone.find(v => !v.flag).msg)
                }
              }).catch(err => {
                throw Error(err)
              })
            } else {
              //仅资源
              this.form.btnLoading = true
              let respone = await this.addTeachCourseResList(res.coursewareIdList)
              this.form.btnLoading = false
              if(respone.flag) {
                this.$toast('添加成功')
                this.$store.commit('setIsAddWare', true)
                this.$router.back()
              }else {
                this.$toast(respone.msg)
              }
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      addTeachCourseResList(coursewareIdList) {
        let list = []
        coursewareIdList.forEach(v => {
          list.push({
            "tchCourseId":this.$route.query.tchCourseId,
            "sysCourseId":this.$route.query.sysCourseId,
            "relationSeqId":this.$route.query.relationCourseId,
            "resourceType":"R01",
            "resourceId":v,
            "statusCd":"S04"
          })
        })
        let obj = {
          "interUser":"runLfb",
          "interPwd":"25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType":"A02",
          list,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
       return  addTeachCourseResList(params)
        //  .then(res => {
        //   debugger
        //   if (res.flag) {
        //     // this.$toast('添加成功')
        //     // this.$store.commit('setIsAddWare', true)
        //     // this.$router.back()
        //   } else {
        //     this.$toast(res.msg)
        //   }
        // })
      },
      createCourseSummitInfoList(coursewareIdList) {
        let tchClassTeachingDataList = []
        coursewareIdList.forEach((v,i) => {
          tchClassTeachingDataList.push( {
            "operateAccountNo":this.$store.getters.getUserInfo.accountNo,
            "accountNo":this.$store.getters.getUserInfo.accountNo,
            "accountType":"A02",
            "belongSchoolId":this.$store.getters.schoolId,
            "dataUrl":v.srcUrl,
            // "dataUrl":'http://quanlang.oss-cn-shenzhen.aliyuncs.com/document/201908/12134_1566809308_ZP82e.png',
            "dataType":"D01",
            "resourceType":"R01",
            "resourceClass":"C01",
            "resourceId":v.coursewareId,
            "majorLevel":"M01",
            "tchCourseId":this.$route.query.tchCourseId,
            "classId":this.$route.query.classId,
            "subjectType":this.$route.query.subjectType
          })
        })
        let obj = {
          "interUser":"runLfb",
          "interPwd":"25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          tchClassTeachingDataList
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
       return  createCourseSummitInfoList(params)
        //  .then(res => {
        //   if (res.flag) {
        //     // this.$toast('添加成功')
        //     // this.$store.commit('setIsAddWare', true)
        //     // this.$router.back()
        //   } else {
        //     this.$toast(res.msg)
        //   }
        // })
      },

    }
  }
</script>

<style lang="less" scoped>
  .upload-img {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    &__body {
      flex: 1;
      overflow-y: auto;

      &__cell {
        .add {
          font-size: 22px;
          color: @blue;
        }

        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }

        .img-group {
          display: flex;
          flex-wrap: wrap;
          margin-top: 15px;

          &-item {
            flex: 0 0 107px;
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;


            img {
              width: 100%;
              height: 70px;
            }

            .clear {
              position: absolute;
              top: -5px;
              right: -5px;
            }

            &__input {
              display: flex;
              background: #F5F6FA;
              width: 107px;
              align-items: center;

              input {
                width: 80%;
                padding: 3px 5px;
              }

              span {
                /*flex: 0 0 20%;*/
              }
            }

            &__name {
              background: #F5F6FA;
              padding: 3px 5px;
              text-align: center;
              width: 100%;
              word-break: break-all;
            }

            &:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
      }
    }

    &__footer {
      flex: 0 0 55px;
      background: #fff;
      padding: 5px 10px;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }
  }
</style>
