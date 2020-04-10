<template>
  <section class="material-list-wrap">
    <div class="material-list-wrap__tab">
      <div @click="changeTab(item)" :class="{active:item.active}" v-for="(item,index) in tabList" :key="index">{{item.name}}</div>
    </div>
    <div class="material-list-wrap__body" ref="body">
      <van-pull-refresh v-model="refLoading" @refresh="onRefresh">
        <div v-if="!listLoading && list.length==0" style="text-align: center;color: #999999">
          <img class="null-tips" src="../../assets/img/resource/material_empty.png" alt />
        </div>
        <van-list v-model="listLoading" :finished="finished" :finished-text="list.length>0?'没有更多了':'当前没有素材，快去上传吧！'" @load="onLoad" :offset='80'>
          <list-item ref='listItem' @clickTo="goto(item)" class="mgt10" style="background: #fff;" @del="modifyTeachCourseRes(item,index)" @clickDel='clickDel(index)' v-for="(item,index) in list" :key="index" :itemTitle="item.coursewareName" :can-slide="true">
            <div slot="badge"><i class="iconGFY" :class="{'icon-send': item.stateName}"></i></div>
            <div slot="cover" class="cover"><i class="iconGFY" :class="handleIcon(item)"></i></div>
            <div slot="desc">
              <div class="desc-top">
                <i class="iconGFY" :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                <i class="iconGFY" :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
              </div>
              <div class="desc-bottom">
                <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                <div><i class="iconGFY icon-download"></i>{{item.downCount||0}}</div>
                <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
              </div>
            </div>
            <div slot="btn" class="btn-group van-hairline--top">
              <div @click="modifyTeachCourseRes(item,index,1)">
                <van-icon :name="item.statusCd=='S02'?'closed-eye':'eye'" class="eye"></van-icon>
                <span>{{item.statusCd=='S02'?'不':''}}可见</span>
              </div>
              <div @click="download(item)">
                <i class="iconGFY icon-download-orange"></i>
                <span>下载</span>
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
    <div class="material-list-wrap__footer">
      <van-button type="info" :class="['btn']" @click="gotoUpload">上传课件</van-button>
      <van-button type="info" class="btn" @click="$router.push({path:'uploadImg',query:{tchCourseId:$route.query.tchCourseId,sysCourseId:$route.query.sysCourseId,relationCourseId:$route.query.relationCourseId,subjectType:$route.query.subjectType,classId:$route.query.classId,tchClassCourseInfo:$route.query.tchClassCourseInfo,isfEducation:$route.query.isfEducation}})">上传图片</van-button>
    </div>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import { teachApi, pubApi } from '@/api/parent-GFY'
  import { modifyTeachCourseRes, updateCourseWareCount } from '@/api/index'
  import store from '../../store/store'
  export default {
    name: "materialList",
    components: { listItem },
    data() {
      return {
        list: [],
        listLoading: false,
        refLoading: false,
        finished: false,
        currentPage: 0,
        total: 0,
        accessUrl: '',
        clickIndex:0,
        isfEducation: this.$route.query.isfEducation,
        tabList: [
          {name:'全部',value:'',active:true},
          {name:'共享',value:'S03',active:false},
          {name:'校内',value:'S02',active:false},
          {name:'个人',value:'S01',active:false},
        ],
      }
    },
    computed: {
      isIOS() {
        if('cordova' in window) {
          var platform = device.platform;
          return platform === 'iOS'
        }else {
          return true
        }
      },
      shareType() {
        return this.tabList.find(v => v.active).value
      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.$refs['listItem']&&this.$refs['listItem'][this.clickIndex]&&this.$refs['listItem'][this.clickIndex].showDialog) {
        this.$refs['listItem'][this.clickIndex].close()
        next(false)
      }else{
        this.scrollTop = this.$refs["body"].scrollTop
        next()
      }
    },
    beforeRouteEnter(to, from, next) {
      localStorage.removeItem('materialDetail')
      if ((from.path === '/uploadWare' || from.path === '/uploadImg') && store.getters.getIsAddWare) {
        // 从上传页面返回 并且已经添加了课件 则需要刷新列表(只能通过这种方式刷新,如果通过activated钩子函数刷新会出错)
        next(vm => {
          vm.listLoading = false
          vm.refLoading = false
          vm.finished = false
          vm.currentPage = 0
          vm.total = 0
          vm.$store.commit('setIsAddWare', false)
          vm.onLoad()
          vm.$nextTick(() => {
            // vm.$refs["body"].scrollTo(0, vm.scrollTop);
            vm.$refs["body"].scrollTop = vm.scrollTop
          });
        })
      } else {
        next(vm => {
          vm.$nextTick(() => {
            // vm.$refs["body"].scrollTo(0, vm.scrollTop);
            vm.$refs["body"].scrollTop = vm.scrollTop
          });
        })
      }
    },
    methods: {
      changeTab(item) {
        if(item.active) return
        this.$store.commit('setVanLoading', true)
        this.tabList.forEach(v => {
          v.active = false
        })
        item.active = true
        this.onRefresh()
      },
      gotoUpload() {
        // if(this.isIOS) {
          this.$router.push({path:'uploadWare',query:{tchCourseId:this.$route.query.tchCourseId,sysCourseId:this.$route.query.sysCourseId,relationCourseId:this.$route.query.relationCourseId,subjectType:this.$route.query.subjectType,classId:this.$route.query.classId,tchClassCourseInfo:this.$route.query.tchClassCourseInfo,isfEducation:this.isfEducation}})
        // }else {
          // return this.$toast('暂不支持课件上传')
        // }
      },
      clickDel(index){
        this.clickIndex=index
      },
      updateCourseWareCount(item) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          courseWareId: item.coursewareId,
          "countType":"C02",
          "sysTypeCd":"S02"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        updateCourseWareCount(params).then(res => {
          if(res.flag) {
            item.downCount++
          }
        })
      },
      async download(item) {
        let url = item.srcUrl;
        if (url.indexOf("pubquanlang") > -1) {
          this.accessUrl = url;
        } else {
          let json = {
            requestJson: JSON.stringify({
              interUser: "runLfb",
              interPwd: "25d55ad283aa400af464c76d713c07ad",
              "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
              "belongSchoolId": this.$store.getters.schoolId,
              url: url,
              sysTypeCd: "S03"
            })
          };
          await pubApi.checkUrlPermission(json).then(data => {
            console.log(data, "checkUrlPermission");
            if (data.flag) {
              this.accessUrl = data.data[0].accessUrl;
            }
          });
        }
        this.updateCourseWareCount(item)
        this.downLoadToOpen(item);
      },
      downLoadToOpen(item) {

        var _this = this;
        // 文件后缀
        var type = item.srcUrl
          .substring(item.srcUrl.lastIndexOf(".") + 1)
          .toLowerCase();
        var fileName = item.coursewareName + "." + type;
        var url = _this.accessUrl; //课件路径
        var targetPath = cordova.file.dataDirectory + "Download/gaofenyun/" + fileName; //要下载的目标路径及文件名
        var trustHosts = true;

        console.log("url:" + url);
        console.log("targetPah:" + targetPath);
        console.log("trustHost:" + trustHosts);

        // 初始化FileTransfer对象
        var fileTransfer = new FileTransfer();
        // 下载进度
        fileTransfer.onprogress = function (progressEvent) {
          if (progressEvent.lengthComputable) {
            let downloadProgress =
              ((progressEvent.loaded / progressEvent.total).toFixed(2) * 100).toFixed(2);
            console.log(downloadProgress, progressEvent);
            _this.$toast.loading({
              mask: true,
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              message: "文件下载中..." + downloadProgress + "%"
            });
          } else {
            _this.$toast.clear();
            _this.$toast('下载完成');
          }
        };
        // 调用download方法
        fileTransfer.download(
          url, //url网络下载路径
          targetPath, //url本地存储路径
          function (entry) {
            console.log("download complete: " + entry.toURL());
            entry.file(data => {
              _this.$toast.clear();
              _this.$toast('下载完成');
              console.log("showOpenWithDialog data", data);
              // showOpenWithDialog使用手机上安装的程序打开下载的文件
              cordova.plugins.fileOpener2.showOpenWithDialog(
                targetPath,
                data.type,
                function onSuccess(data) {
                  console.log("成功预览:" + targetPath);
                },
                function onError(error) {
                  console.log(
                    "出错！请在" +
                    cordova.file.externalDataDirectory +
                    "目录下查看"
                  );
                }
              );
            });
          },
          function (error) {
            _this.$toast.clear();
            _this.$toast.fail("下载失败");
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
          }
        );
      },
      handleIcon(item) {
        var t = item.srcUrl.substring(item.srcUrl.lastIndexOf('.') + 1).toLowerCase()
        if (t == 'ppt' || t == 'pptx') {
          t = 'icon-ppt'
        } else if (t == 'doc' || t == 'docx') {
          t = 'icon-doc'
        } else if (t == 'xls' || t == 'xlsx') {
          t = 'icon-xls'
        } else if (t == 'zip' || t == 'rar' || t == '7z') {
          // t = 'icon'
        } else if (t == 'pdf') {
          t = 'icon-pdf'
        } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
          t = 'icon-img'
        } else if (t == 'mp4') {
          t = 'icon-video'
        } else if (t == 'mp3') {
          t = 'icon-audio'
        } else {
          // t = 'unkown'
        }
        return t
      },
      goto(item) {
        localStorage.setItem('materialDetail',JSON.stringify(item))
        // this.$router.push({ path: '/materialDetail', query: { data: item } })
        this.$router.push({ path: '/materialDetail'})
      },
      modifyTeachCourseRes(item, index, type) {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": 'A02',
          "tchCourseId": this.$route.query.tchCourseId,
          "sysCourseId": this.$route.query.sysCourseId,
          "relationSeqId": this.$route.query.relationCourseId,
          "resourceType": 'R01',
          "resourceId": item.coursewareId,
          "statusCd": type ? (item.statusCd == 'S02' ? 'S01' : 'S02') : 'S03'
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        modifyTeachCourseRes(params).then(res => {
          if (res.flag) {
            if (type) {
              item.statusCd = item.statusCd == 'S02' ? 'S01' : 'S02'
            } else {
              this.list.splice(index, 1)
              this.$toast('删除成功')
            }
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
          "resourceType": 'R01',
          "shareType": this.shareType,
          "sourceName": "",
          "pageSize": "10",
          "coursewareClassify": 'C03',
          "currentPage": page
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        teachApi.getTeachCourseResDetail(params).then(res => {
          this.$store.commit('setVanLoading', false)
          this.listLoading = false
          this.refLoading = false
          this.total = res.total
          if (res.flag && res.data && res.data[0] && res.data[0].courseware && res.data[0].courseware.length) {
            this.list = page === 1 ? res.data[0].courseware : this.list.concat(res.data[0].courseware)
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
        console.log("发任务：", obj.coursewareName)
        this.$store.commit('setResourceInfo', obj)
        this.$store.commit("setTaskClassInfo", '')
        this.$router.push(`/addTask?type=material&_t=new${this.isfEducation?'&isfEducation=true':''}`)
      },
    }
  }
</script>

<style lang="less" scoped>
  .material-list-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__tab {
      background: #fff;
      flex: 0 0 44px;
      display: flex;
      align-items: center;

      > div {
        flex: 1;
        color: #333;
        font-size: 16px;
        text-align: center;
        line-height: 44px;
        border-left: 1px solid #eee;

        &.active {
          color: @blue;
        }
        &:first-child{
          border: none;
        }
      }
    }
    &__body {
      flex: 1;
      overflow-y: auto;
      .cover {
        background: #f3d233;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        img {
          width: 100%;
          height: 100%;
        }
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
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
      .eye {
        color: #f89451;
      }
    }
    &__footer {
      flex: 0 0 55px;
      padding: 5px 10px;
      display: flex;
      .btn {
        flex: 1;
        border-radius: 22px;
        font-size: 16px;
        margin-right: 23px;
        &.disabled{
          background: #ccc;
          border: 1px solid #ccc;
        }
        &:last-child {
          margin-right: 0;
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
