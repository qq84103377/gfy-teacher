<template>
  <section class="discuss-list">
    <div class="discuss-list__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && list.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/resource/discuss_empty.png" alt />
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="list.length>0?'没有更多了':'当前没有讨论，快去创建吧！'" @load="onLoad" :offset='80'>
          <list-item @clickTo="goto(item)" class="mgt10" style="background: #fff;" @del="modifyTeachCourseRes(item,index)" v-for="(item,index) in list" :key="index" :itemTitle="item.discussName" :can-slide="true">
            <div slot="badge"><i class="iconGFY" :class="{'icon-send': item.stateName}"></i></div>
            <div slot="cover" class="cover"><i class="iconGFY icon-chat"></i></div>
            <div slot="desc">
              <div class="desc-top">
                <i class="iconGFY" :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                <i class="iconGFY" :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
              </div>
              <div class="desc-bottom">
                <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                <div>
                  <van-icon name="clock-o" />
                  {{item.createDate}}
                </div>
              </div>
            </div>
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="edit(item)">
                <i class="iconGFY icon-edit-orange"></i>
                <span>编辑</span>
              </div>
              <div @click="sendTask(item)">
                <i class="iconGFY icon-plane"></i>
                <span>发任务</span>
              </div>
            </div>
          </list-item>
        </van-list>
      </van-pull-refresh>

    </div>
    <div class="discuss-list__footer">
      <van-button type="info" class="btn" @click="isAdd=true;popShow=true">新建论题</van-button>
    </div>

    <van-popup v-model="popShow" position="bottom" :style="{height: '93%'}">
      <div class="save-pop">
        <div class="save-pop__title">{{isAdd?'新建论题':'编辑'}}
          <van-icon name="close" @click="popShow = false" class="close"></van-icon>
        </div>
        <div style="flex: 1;overflow-y: auto">
          <van-cell class="save-pop__cell">
            <div slot="title" class="align aic">
              <div class="fs15"><span class="red">*</span>主题:</div>
              <input class="pdlt10" style="flex: 1" v-model="form.name" type="text" maxlength="128" placeholder="请输入主题,字数在128字内">
              <span class="red">{{128 - form.name.length}}</span>
              <van-icon v-show="form.name.length" @click="form.name = ''" class="clear" name="clear" />
            </div>
          </van-cell>
          <van-cell class="save-pop__cell">
            <div slot="title" class="align">
              <div class="aic jcsb">
                <div class="fs15"><span class="red">*</span>内容:</div>
                <div class="red fs10">{{1024 - form.desc.length}}</div>
              </div>
              <textarea v-model="form.desc" maxlength="1024" rows="4" placeholder="请输入描述，字数在1024字内"></textarea>
            </div>
          </van-cell>
          <van-cell class="save-pop__cell">
            <div slot="title">
              <div class="aic" @click="getPic">
                <div class="fs15">图片:</div>
                <div class="pdlt10 fz10 grey9" style="flex:1">轻触此可添加多张图片</div>
                <van-icon @click="" class="add" name="add" />
              </div>
              <draggable class="img-group" v-model="imgList" :options="{handle:'.img-group-item'}">
                <div class="img-group-item" v-for="(item,index) in imgList" :key="index">
                  <img @click="previewImg(index)" :src="item.url" alt="">
                  <van-icon @click="imgList.splice(index, 1)" class="del" name="clear" />
                </div>
              </draggable>
              <van-checkbox style="margin-left: 0;" v-model="form.check" @click="">
                <i slot="icon" slot-scope="props" :class="['iconGFY','icon-check',{'normal':!props.checked}]"></i>
                学生发帖后才能查看评论
              </van-checkbox>
            </div>

          </van-cell>
        </div>
        <div class="save-pop__footer">
          <van-button :loading="form.btnLoading" loading-text="提交" type="info" class="btn" @click="submit">提交
          </van-button>
        </div>
      </div>
    </van-popup>

<!--    <van-action-sheet v-model="showActionSheet" :actions="actions" cancel-text="取消" @select="handleSelect" @cancel="showActionSheet=false" />-->
  </section>
</template>

<script>
import listItem from '../../components/list-item'
import draggable from 'vuedraggable'
import { teachApi } from '@/api/parent-GFY'
import { modifyTeachCourseRes, addDiscussInfo, addTeachCourseRes, modifyDiscussInfo } from '@/api/index'
import { generateTimeReqestNumber, randomString } from "@/utils/filter";
import * as uploadApi from "@/api/upload";
import { ImagePreview } from "vant";
import uploadMixin from '@/utils/uploadMixin';

export default {
  name: "discussList",
  mixins: [uploadMixin],
  components: { listItem, draggable },
  data() {
    return {
      disItem: {},
      actions: [{ name: "从相册选取" }, { name: "拍照" }],
      showActionSheet: false,
      popShow: false,
      isAdd: false,
      form: {
        name: '',
        desc: '',
        check: true,
        btnLoading: false
      },
      photoList: [],
      imgList: [],
      list: [],
      listLoading: false,
      refLoading: false,
      finished: false,
      currentPage: 0,
      total: 0,
      curFile: null,
      oSSObject: null,
      scrollTop: 0,
    }
  },
  created() {
    this.getOSSKey();
  },
  watch: {
    popShow(v) {
      if (!v) {
        this.form = {
          name: '',
          desc: '',
          check: true,
          btnLoading: false
        }
        this.imgList = []
        this.photoList = []
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.popShow) {
      this.popShow=false
      next(false)
    } else {
    this.scrollTop = this.$refs["body"].scrollTop;
    next();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$nextTick(() => {
        // vm.$refs["body"].scrollTo(0, vm.scrollTop);
        vm.$refs["body"].scrollTop = vm.scrollTop
      });
    });
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
        images: this.imgList.map(v => v.url),
        startPosition,
        onClose() {
          // do something
          console.log("close");
        }
      });
    },
    goto(item) {
      this.$router.push({ path: `/discussDetail`, query: { data: item } })
    },
    showSheet() {
      if (this.imgList.length >= 9) {
        this.$toast('只能上传9张图片!')
        return
      }
      this.showActionSheet = !this.showActionSheet
    },
    edit(item) {
      this.isAdd = false;
      this.popShow = true;
      this.disItem = item
      this.form.name = item.discussName
      this.form.check = item.checkFlag === 'C02'
      let el = document.createElement('div')
      el.innerHTML = item.discussContent
      for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].innerHTML && (el.childNodes[i].innerHTML.indexOf('<img') > -1)) {
          //图片

        } else {
          //文字
          this.form.desc += (el.childNodes[i].nodeValue || el.childNodes[i].innerHTML)

        }
      }
      console.log(el.childNodes);
      const dom = el.querySelectorAll('img')

      for (let i = 0; i < dom.length; i++) {
        this.imgList.push({
          url: dom[i].src
        })
      }
    },
    modifyDiscussInfo() {
      this.form.btnLoading = true
      let str = ''
      this.imgList.forEach(v => {
        str += `<img style="width: 100%;height: 180px;margin-bottom: 10px;" src="${v.url}" />`
      })
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "count": 1,
        "discussInfoList": [
          {
            "discussId": this.disItem.discussId,
            "discussName": this.form.name,
            "discussContent": `${this.form.desc}${str}`,
            "shareType": "S02",
            "checkFlag": this.form.check ? "C02" : "C01",
            "belongSchoolId": this.$store.getters.schoolId,
            "belongAccountNo": this.$store.getters.getUserInfo.accountNo,
            "statusCd": "S01",
            "approveAccountNo": this.$store.getters.getUserInfo.accountNo
          }
        ]
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      modifyDiscussInfo(params)
        .then(res => {
          this.form.btnLoading = false
          if (res.flag) {
            this.popShow = false
            this.$toast('编辑成功')
            // this.$refs['body'].scrollTo(0, 0)
            this.$refs['body'].scrollTop = 0
            this.onRefresh()
          } else {
            this.$toast(res.msg)
          }
        })
    },
    addTeachCourseRes(resourceId) {
      this.form.btnLoading = true
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": "A02",
        "tchCourseId": this.$route.query.tchCourseId,
        "sysCourseId": this.$route.query.sysCourseId,
        "relationSeqId": this.$route.query.relationCourseId,
        "resourceType": "R04",
        resourceId,
        "statusCd": "S04"
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      addTeachCourseRes(params)
        .then(res => {
          this.form.btnLoading = false
          if (res.flag) {
            this.popShow = false
            this.$toast('新建成功')
            // this.$refs['body'].scrollTo(0, 0)
            this.$refs['body'].scrollTop = 0
            this.onRefresh()
          } else {
            this.$toast(res.msg)
          }
        })
    },
    addDiscussInfo() {
      this.form.btnLoading = true
      let str = ''
      this.imgList.forEach(v => {
        str += `<img style="width: 100%;height: 180px;margin-bottom: 10px;" src="${v.url}" />`
      })
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": 'A02',
        "count": 1,
        "discussInfoList": [
          {
            "seqId": "",
            "discussName": this.form.name,//标题
            "discussContent": `${this.form.desc}${str}`,
            "shareType": "S02",
            "checkFlag": this.form.check ? "C02" : "C01",//学生是否需要发帖查看评论，C01:直接可见，C02 ：发帖后才可见评论
            "belongSchoolId": this.$store.getters.schoolId,
            "belongAccountNo": this.$store.getters.getUserInfo.accountNo,
            "statusCd": "S01",//状态
            "approveAccountNo": this.$store.getters.getUserInfo.accountNo //审核账号
          }
        ]
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      addDiscussInfo(params).then(res => {
        this.form.btnLoading = false
        if (res.flag) {
          this.addTeachCourseRes(res.discussInfoList[0].discussId)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    submit() {
      if (!this.form.name) {
        return this.$toast('请输入主题')
      }
      if (!this.form.desc) {
        return this.$toast('请输入简介')
      }
      if (this.isAdd) {
        this.addDiscussInfo()
      } else {
        this.modifyDiscussInfo()
      }
    },
    getOSSKey() {
      let json = {
        requestJson: JSON.stringify({
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: this.$store.getters.schoolId,
          docTypeCd: "T09",
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
        this.oSSObject = tmpSignatureObj;
      });
    },
    handleSelect(item, index) {
      // index 0 相册  1 拍照
      this.showActionSheet = false;
      // this.cropperData.visible = true
      navigator.camera.getPicture(
        imageData => {
          let imgBase = "data:image/jpeg;base64," + imageData;
          try {
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
    uploadIMG(curFile) {
      console.log("开始上传")
      console.log(this.oSSObject)
      var filetime = generateTimeReqestNumber();
      let randomStr = randomString(5);
      let formData = new FormData();
      formData.append("key", this.oSSObject.key + this.$store.getters.getUserInfo.accountNo +
        filetime +
        randomStr + ".jpeg"
      );
      console.log(123);
      formData.append('policy', this.oSSObject.policyBase64)
      formData.append('OSSAccessKeyId', this.oSSObject.accessid)
      formData.append('signature', this.oSSObject.signature)
      formData.append('file', curFile)
      formData.append('success_action_status', '200')
      return uploadApi.doUpLoad(this.oSSObject.host, formData).then(data => {
        console.log('doUpLoad', data);
        var imgUrl =
          this.oSSObject.host +
          "/" +
          this.oSSObject.key + this.$store.getters.getUserInfo.accountNo +
          filetime +
          randomStr + ".jpeg";
        var imgObj = {
          url: imgUrl
        };
        this.imgList.push(imgObj);
      });
    },
    modifyTeachCourseRes(item, index) {
      let obj = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": 'A02',
        "tchCourseId": this.$route.query.tchCourseId,
        "sysCourseId": this.$route.query.sysCourseId,
        "relationSeqId": this.$route.query.relationCourseId,
        "resourceType": 'R04',
        "resourceId": item.discussId,
        "statusCd": 'S03'
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      modifyTeachCourseRes(params).then(res => {
        if (res.flag) {
          this.list.splice(index, 1)
          this.$toast('删除成功')
        } else {
          this.$toast(res.msg)
        }
      })
    },
    async onLoad() {
      this.currentPage++
      if (this.currentPage > this.total && this.currentPage > 1) {
        return
      }
      this.getList()
    },
    async onRefresh() {

      // this.listLoading = false
      this.finished = false
      this.currentPage = 0
      this.onLoad()
    },
    getList() {
      const page = this.currentPage
      let obj = {
        "interUser": "runLfb",
        "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
        "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
        "belongSchoolId": this.$store.getters.schoolId,
        "operateRoleType": "A02",
        "accountNo": this.$store.getters.getUserInfo.accountNo,
        "tchCourseId": this.$route.query.tchCourseId,
        "sysCourseId": this.$route.query.sysCourseId,
        "relationSeqId": this.$route.query.relationCourseId,
        "resourceType": 'R04',
        "pageSize": "10",
        "currentPage": page
      }
      let params = {
        requestJson: JSON.stringify(obj)
      }
      teachApi.getTeachCourseResDetail(params).then(res => {
        this.listLoading = false
        this.refLoading = false
        this.total = res.total
        if (res.flag && res.data && res.data[0] && res.data[0].discussInfo && res.data[0].discussInfo.length) {
          this.list = page === 1 ? res.data[0].discussInfo : this.list.concat(res.data[0].discussInfo)
          if (page >= res.total) {
            this.finished = true
          }
        } else {
          this.list = page === 1 ? [] : this.list.concat([])
          this.finished = true
        }
      })
    },
    sendTask(obj) {
      console.log("发任务：", obj.discussName)
      this.$store.commit('setResourceInfo', obj)
      this.$store.commit("setTaskClassInfo", '')
      this.$router.push(`/addTask?type=discuss&_t=new`)
    },
  }
}
</script>

<style lang="less" scoped>
.discuss-list {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  &__body {
    flex: 1;
    overflow-y: auto;

    .cover {
      background: #f691f3;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }

    .desc-top {
      display: flex;
      margin-bottom: 10px;

      .iconGFY {
        margin-right: 5px;
      }
    }

    .desc-bottom {
      display: flex;
      font-size: 12px;
      color: #666;

      .iconGFY {
        margin-right: 3px;
      }

      > div {
        white-space: nowrap;
        margin-right: 18px;
        display: flex;
        align-items: center;
      }
    }
  }

  &__footer {
    background: #fff;
    flex: 0 0 55px;
    padding: 5px 10px;

    .btn {
      width: 100%;
      border-radius: 22px;
      font-size: 18px;
    }
  }

  .save-pop {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__footer {
      flex: 0 0 50px;
      padding: 5px 10px;

      .btn {
        width: 100%;
        border-radius: 22px;
        font-size: 16px;
      }
    }

    &__title {
      font-size: 18px;
      font-weight: bold;
      line-height: 47px;
      flex: 0 0 47px;
      text-align: center;
      position: relative;

      .close {
        font-size: 22px;
        color: #999;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &__cell {
      .align {
        margin-left: -7px;
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

          .del {
            position: absolute;
            top: -5px;
            right: -5px;
            color: #000;
          }

          &__input {
            display: flex;
            background: #f5f6fa;
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
            background: #f5f6fa;
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

      .add {
        font-size: 22px;
        color: @blue;
      }

      .clear {
        margin-left: 10px;
        font-size: 15px;
        color: @blue;
      }

      textarea {
        width: 100%;
        color: #999;
        padding: 10px;
        border-radius: 5px;
        margin-top: 15px;
        background: #f5f6fa;
      }

      .normal {
        background: none;
        border: 1px solid #999;
        border-radius: 1.5px;
      }
    }
  }
}
.null-tips {
  margin-top: 50px;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 100%;
}
</style>
