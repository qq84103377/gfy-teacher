<template>
  <section class="video-select">
    <slot></slot>
    <van-action-sheet get-container="#app" v-model="show" :actions="actions" @select="onSelect"/>
    <input id="videoInput" @change="videoChange" type="file" accept="video/*" style="display: none">
  </section>
</template>

<script>
  import {generateTimeReqestNumber, randomString} from "@/utils/filter";
  import * as uploadApi from "@/api/upload";

  export default {
    props: ['visible'],
    data() {
      return {
        actions: [
          {name: '录像'},
          {name: '选择视频'},
        ],
        oSSObject: null
      }
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set() {
          this.$emit('update:visible', false)
        }
      },
    },
    created() {
      this.getOSSKey();
    },
    methods: {
      getOSSKey() {
        this.$store.commit('setVanLoading', true)
        let json = {
          requestJson: JSON.stringify({
            interUser: "runLfb",
            interPwd: "25d55ad283aa400af464c76d713c07ad",
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            belongSchoolId: this.$store.getters.schoolId,
            docTypeCd: "T02",
            sysTypeCd: "T01"
          })
        };
        console.log('getOSSKey json', json);
        uploadApi.stsAuthCoverAccessUrl(json).then(data => {
          console.log('stsAuthCoverAccessUrl', data.data[0]);
          this.$store.commit('setVanLoading', false)
          var obj = data.data[0].tokenInfo;
          this.oSSObject = {
            host: obj.host,
            policyBase64: obj.policy,
            accessid: obj.accessid,
            signature: obj.signature,
            expire: parseInt(obj.expire),
            key: obj.dir + "/",
            size: obj.sizelimit
          };
        });
      },
      videoChange(e) {
        let file = e.target.files[0]
        this.uploadVideo(file, '.mp4',file.name)
      },
      onSelect(item) {
        if (item.name === '录像') {
          this.takeVideo()
        } else {
          //选文件
          if (device.platform === 'Android') {
            document.getElementById('videoInput').click()
          } else {
            this.multipleVideo()
          }
        }
        this.show = false
      },
      multipleVideo() {
        var args = {
          'selectMode': 102, //101=picker image and video , 100=image , 102=video
          'maxSelectCount': 40, //default 40 (Optional)
          'maxSelectSize': 188743680, //188743680=180M (Optional)
        };
        let _this = this
        MediaPicker.getMedias(args, function (medias) {
          console.log(JSON.stringify(medias));
          //medias [{mediaType: "image", path:'/storage/emulated/0/DCIM/Camera/2017.jpg', uri:"android retrun uri,ios retrun URL" size: 21993}]
          // window.resolveLocalFileSystemURL(`file:///${device.platform == "iOS"?'private':''}${medias[0].path}`, fileEntry => {
          //   fileEntry.file(file => {
          //     console.log(file.size,'MediaPicker选择的文件大小');
          //   })
          // })
          const arr = medias[0].path.split('/')
          _this.transcoding(medias[0].path,arr[arr.length-1])
        }, function (e) {
          console.log(e)
        })
      },
      takeVideo() {
        navigator.device.capture.captureVideo(this.takeVideoSuccess, err => {
          console.log(JSON.stringify(err));
        }, {duration: 600});
      },
      takeVideoSuccess(mediaFiles) {
        this.$store.commit('setVanLoading', true)
        console.log(JSON.stringify(mediaFiles[0]));
        let _this = this
        if (device.platform === 'Android') {
          // cordova-plugin-media-capture安卓录视频需要获取权限(在config.xml配置了也没用),否则报错
          var permissions = cordova.plugins.permissions
          permissions.checkPermission(
            permissions.WRITE_EXTERNAL_STORAGE,
            function (s) {
              //hasPermission 验证是否成功
              if (!s.hasPermission) {
                console.log('没有权限');
                //没有权限
                //app申请写入权限
                permissions.requestPermission(
                  permissions.WRITE_EXTERNAL_STORAGE,
                  function (s) {
                    if (s.hasPermission) {
                      console.log('申请成功');
                      //申请成功
                      _this.handleAndroidVideo(mediaFiles[0])
                    } else {
                      console.log('申请失败');
                      _this.$toast('写入权限失败')
                    }
                  },
                  function (error) {
                    _this.$store.commit('setVanLoading', false)
                  }
                )
              } else {
                console.log('有权限');
                //拥有权限
                _this.handleAndroidVideo(mediaFiles[0])
              }
            },
            function (error) {
              _this.$store.commit('setVanLoading', false)
            }
          )
        } else {
          this.transcoding(mediaFiles[0].fullPath,mediaFiles[0].name)
        }

      },
      handleAndroidVideo(mediaFiles){
        window.resolveLocalFileSystemURL(mediaFiles.fullPath, fileEntry => {
          fileEntry.file(file => {
            var reader = new FileReader()
            reader.onloadend = (e) => {
              let arr = e.target.result.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              let curFile = new Blob([u8arr], {type: mime});
              this.uploadVideo(curFile, '.mp4',mediaFiles.name)
            }
            reader.readAsDataURL(file)
          }, err1 => {
            console.log('fileEntry.file失败');
            this.$store.commit('setVanLoading', false)
            console.log(JSON.stringify(err1));
          })
        }, err => {
          console.log('resolveLocalFileSystemURL失败');
          this.$store.commit('setVanLoading', false)
          console.log(JSON.stringify(err));
        })
      },
      transcoding(curfile,fileName) {
        let ts = new Date().getTime()
        VideoEditor.transcodeVideo(
          result => {
            let haoshi = new Date().getTime() - ts
            console.log(haoshi, '转码耗时ms');
            console.log(JSON.stringify(result), '转码成功');
            window.resolveLocalFileSystemURL(`file:///${device.platform == "iOS" ? 'private' : ''}${result}`, fileEntry => {
              fileEntry.file(file => {
                console.log('转码后大小');
                console.log(file.size);
                var reader = new FileReader()
                reader.onloadend = (e) => {
                  let arr = e.target.result.split(","),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                  while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                  }
                  let curFile = new Blob([u8arr], {type: mime});
                  //转码后的fileName要将原本.mov改成.mp4
                  this.uploadVideo(curFile, '.mp4',`${fileName.split('.')[0]}.mp4`)
                }
                reader.readAsDataURL(file)
              }, err1 => {
                console.log('fileEntry.file失败');
                console.log(JSON.stringify(err1));
                this.$store.commit('setVanLoading', false)
              })
            }, err => {
              console.log('resolveLocalFileSystemURL失败');
              console.log(JSON.stringify(err));
              this.$store.commit('setVanLoading', false)
            })
          }, // success cb
          error => {
            console.log('转码失败');
            console.log(JSON.stringify(error));
            this.$store.commit('setVanLoading', false)
          }, // error cb
          {
            fileUri: curfile, // the path to the video on the device
            outputFileName: 'transVideo_' + new Date().getTime(), // the file name for the transcoded video
            outputFileType: VideoEditorOptions.OutputFileType.MPEG4, // android is always mp4
            optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES, // ios only
            saveToLibrary: true, // optional, defaults to true
            deleteInputFile: false, // optional (android only), defaults to false
            maintainAspectRatio: true, // optional (ios only), defaults to true
            width: 640, // optional, see note below on width and height
            height: 640, // optional, see notes below on width and height
            videoBitrate: 1000000, // optional, bitrate in bits, defaults to 1 megabit (1000000)
            fps: 24, // optional (android only), defaults to 24
            audioChannels: 2, // optional (ios only), number of audio channels, defaults to 2
            audioSampleRate: 44100, // optional (ios only), sample rate for the audio, defaults to 44100
            audioBitrate: 128000, // optional (ios only), audio bitrate for the video in bits, defaults to 128 kilobits (128000)
            progress: function (info) {
              // console.log(info);
            } // info will be a number from 0 to 100
          }
        );
      },
      uploadVideo(curFile, suffix,fileName) {
        console.log("开始上传")
        console.log(this.oSSObject)
        this.$store.commit('setVanLoading', true)
        var filetime = generateTimeReqestNumber();
        let randomStr = randomString(5);
        let formData = new FormData();
        const url = this.oSSObject.key + this.$store.getters.getUserInfo.accountNo + '_' +
          filetime + '_' +
          randomStr + suffix
        console.log(url,'上传路径');
        formData.append("key", url
        );
        formData.append('policy', this.oSSObject.policyBase64)
        formData.append('OSSAccessKeyId', this.oSSObject.accessid)
        formData.append('signature', this.oSSObject.signature)
        formData.append('file', curFile)
        formData.append('success_action_status', '200')
        return uploadApi.doUpLoad(this.oSSObject.host, formData)
          .then(data => {
            this.$store.commit('setVanLoading', false)
            this.$emit('uploadCb', this.oSSObject.host + '/' + url,fileName)
          }).catch(err => {
            this.$store.commit('setVanLoading', false)
          })
      },
    }
  }
</script>

<style lang="less" scoped>

</style>
