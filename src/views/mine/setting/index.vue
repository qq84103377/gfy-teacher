<template>
  <div class="account">
    <div class="account-body">
      <van-cell-group>
        <!-- <van-cell class="account-safety" title="绑定手机号" is-link to="bindPhoneNo"></van-cell> -->
        <van-cell class="account-safety" title="手机号" :value="$store.getters.getUserInfo.phoneNo" is-link :to="$store.getters.getUserInfo.phoneNo?'modifyPhoneNo':'setPhoneNo'"></van-cell>
        <!-- <van-cell v-else class="account-safety" title="手机号" :value="$store.getters.getUserInfo.phoneNo" is-link to="bindPhoneNo"></van-cell> -->
        <van-cell title="修改密码" is-link to="/modifyPassword" />
        <van-cell title="清除缓存" @click="clearCache()" is-link />
        <van-cell v-if="isApp" title="版本更新" is-link @click="checkVersion()">
          <template slot="default">
            <span>{{version}}/</span>
            <span v-show="hasNew" class="red">{{tips}}</span>
            <span v-show="!hasNew">{{tips}}</span>
          </template>
        </van-cell>
        <van-cell title="用户协议" is-link to="/serviceSheet"></van-cell>
        <van-cell title="隐私政策" is-link to="/privateSheet"></van-cell>
      </van-cell-group>
    </div>
    <div class="account-footer">
      高分云V{{version}}
    </div>
    <div class="upgrade">
      <van-dialog v-model="showUpgrade" @confirm="downLoad()" title="高分云教师APP更新啦" show-cancel-button confirmButtonText="立即更新" confirmButtonColor="#39F0DD" cancelButtonText="下次再说">
        <div class="upgrade-body">
          <div class="top">
            <p>检测到新版本v{{serverVersion}}</p>
          </div>
          <div class="content">
            <p>{{uploadDetail}}</p>
            <!--<p>2.首页搜索升级首页搜索升级</p>-->
          </div>
        </div>
      </van-dialog>

      <van-popup v-model="progress" :close-on-click-overlay="false">
        <div class="upgrade-progress">
          <div class="top">
            <h3>正在更新...({{percent}}%)</h3>
          </div>
          <div class="content down">
            <van-progress :percentage="percent" :show-pivot="false" />
          </div>
          <div class="bottom">
            <p>{{loaded}}M/{{total}}M</p>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>


<script>
import { sysModuleVersionApi } from "@/api/parent-GFY";

export default {
  name: "index",
  data() {
    return {
      version: "",
      showUpgrade: false,
      progress: false,
      serverVersion: "1.1.2", //服务器版本号
      percent: 30,
      loaded: 0,
      total: 0,
      uploadDetail: "1.首页搜索升级，首页搜索升级首页搜索升级", //更新内容
      releasePath: "", //安装包路径
      force: false,//是否为强制更新
      tips: '已是最新版本',
      hasNew: false,
      checkDone: false,
    }
  },
  computed: {
    isApp() {
      return "cordova" in window;
    }
  },
  mounted() {
    try{MobclickAgent.onEvent('clickMineSetting')}catch(e){console.log(e)}
    this.getVersion()
  },
  methods: {
    clearCache() {
      try{MobclickAgent.onEvent('mineSettingClearCache')}catch(e){console.log(e)}
      cordova.exec(null, null, "ClearCache", "clearCacheInfo", null);
    },
    getVersion() {
      var _this = this
      document.addEventListener('deviceready', function () {
        cordova.getAppVersion.getVersionNumber().then(function (version) {
          console.log(version)
          // 版本号获取
          _this.version = version
        })
        // var platform = device.platform;
        // console.log("deviceready", device.platform);
        // _this.checkUpgrade(platform);
      }, false)
    },
    checkVersion() {
      try{MobclickAgent.onEvent('mineSettingUpgrade')}catch(e){console.log(e)}
      if (this.checkDone) {
        if (!this.hasNew) {
          // 没有新版本
          this.$toast.fail("当前已是最新版本哦");
          return;
        }
        this.showUpgrade = true; //显示升级弹框
      } else {
        let platform = device.platform;
        console.log(platform);
        this.checkUpgrade(platform);
      }
    },
    //下载安装包
    upgradeForAndroid() {
      var packageName = "app-release.apk";
      var _this = this;
      var url = _this.releasePath; //apk所在的服务器路径
      var targetPath =
        cordova.file.externalCacheDirectory +
        "Download/gaofenyun/" +
        packageName; //要下载的目标路径及文件名
      var trustHosts = true;

      console.log("url:" + url);
      console.log("targetPah:" + targetPath);
      console.log("trustHost:" + trustHosts);

      // 初始化FileTransfer对象
      var fileTransfer = new FileTransfer();
      fileTransfer.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
          _this.loaded = (progressEvent.loaded / 1024 / 1024).toFixed(2);
          _this.total = (progressEvent.total / 1024 / 1024).toFixed(2);
          console.log('下载进度：', _this.loaded + '/' + _this.total);
          let downloadProgress =
            (progressEvent.loaded / progressEvent.total) * 100;
          _this.percent = Math.floor(downloadProgress);
        }
      };
      // 调用download方法
      fileTransfer.download(
        url, //uri网络下载路径
        targetPath, //url本地存储路径
        function (entry) {
          console.log("download complete: " + entry.toURL());
          cordova.plugins.fileOpener2.open(
            targetPath,
            "application/vnd.android.package-archive",
            {
              error: function (e) {
                console.log(
                  "Error status: " + e.status + " - Error message: " + e.message
                );
                _this.$toast.fail("打开下载文件失败");
              },
              success: function () {
                console.log("open successfully");
              }
            }
          );
        },
        function (error) {
          _this.$toast.fail("下载失败");
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("upload error code" + error.code);
        }
      );
    },

    /*
     * 检测升级方法
     */
    checkUpgrade(platformType) {
      this.$store.commit('setVanLoading', true)
      var _this = this;
      console.log("设备类型：" + platformType);
      var appName = "教师app";
      var appType = platformType;
      /**
       * 从服务器获取应用的版本信息，和本地应用版本对比
       * @param appName 应用名称
       * @param appType 应用类型
       */
      var param = {
        interUser: "control_app",
        interPwd: "E10ADC3949BA59ABBE56E057F20F883E",
        moduleType: "T09",
        schoolId: this.$store.getters.schoolId,
        classId: Object.keys(JSON.parse(localStorage.classMap))[0]
      };
      //Domain_Module_Type  模块类型
      if (platformType == "Android") {
        param["moduleType"] = "T09";
      } else if (platformType == "iOS") {
        param["moduleType"] = "T10";
      }

      sysModuleVersionApi
        .getLatestModuleVerion({ requestJson: JSON.stringify(param) })
        .then(
          response => {
            this.$store.commit('setVanLoading', false)
            _this.checkDone = true
            if (response != null && response.flag) {
              _this.releasePath = response.data[0].versionRecord.downloadUrl;
              var serverVersion = response.data[0].versionRecord.versionCode;
              var forcedUpgrade = response.data[0].versionRecord.forcedUpgrade;
              _this.force = forcedUpgrade == "I01" ? true : false;
              _this.serverVersion = serverVersion;

              //获取本地App版本;
              cordova.getAppVersion.getVersionNumber().then(function (version) {
                console.log("本地版本：" + version);
                console.log("服务器版本：" + serverVersion);
                let flag = _this.compareVersion(version, serverVersion);
                if (!flag) {
                  _this.uploadDetail =
                    response.data[0].versionRecord.uploadDetail;
                  // _this.showUpgrade = true; //显示升级弹框
                  _this.tips = serverVersion;
                  _this.hasNew = true;
                  _this.showUpgrade = true; //显示升级弹框
                  if (platformType == "Android") {
                    // 升级内容

                  } else if (platformType == "iOS") {
                    console.log("---Ios升级中,请稍后---");
                    // let winRef = window.open('https://apps.apple.com/cn/app/全朗e家/id1470358138');
                    // winRef.location = 'itms-apps://apps.apple.com/cn/app/全朗e家/id1470358138';
                    // _this.$dialog.confirm({
                    //   title: response.data[0].versionRecord.uploadTitle,
                    //   message: response.data[0].versionRecord.uploadDetail
                    // }).then(() => {
                    //   console.log("---Ios升级中,请稍后---");
                    //   cordova.plugins.externalExtension.openURL(releasePath);
                    //
                    // }).catch(() => {
                    //   // on cancel
                    //   //_this.$toast.fail("取消升级");
                    // });
                  }
                } else {
                  _this.$toast.fail("当前已是最新版本哦");
                }
              });
            }
          },
          errMsg => {
            console.log("获取版本失败：", errMsg);
            _this.$toast.fail("获取版本失败");
          }
        );

      document.addEventListener(
        "offline",
        function () {
          console.log("网络异常，不能连接到服务器！");

          _this.$toast.fail("网络异常，不能连接到服务器！");
        },
        false
      );
    },
    downLoad() {
      console.log("开始升级");
      this.showUpgrade = false;
      let that = this
      let platform = device.platform;
      if (platform == "Android") {
        console.log("Android升级");
        this.progress = true;
        this.upgradeForAndroid();
      } else if (platform == "iOS") {
        console.log("iOS升级");
        if (that.releasePath) {
          that.$toast.fail("下载地址为空！");
        }
        let ref = cordova.InAppBrowser.open(that.releasePath, '_blank', 'location=yes')
        setTimeout(function () {
          ref.close()
        }, 100)
        // cordova.plugins.fileOpener2.openURL("itms-apps://apps.apple.com/cn/app/全朗e家/id1470358138", {
        //   error() {
        //     console.log('打开失败')
        //   },
        //   success: function() {
        //     console.log('打开成功')
        //   }
        //
        // });
      }

      // var timer = setInterval(() => {
      //   this.percent += 5;
      //   if (this.percent >= 100) {
      //     clearInterval(timer);
      //   }
      // }, 500);
    },
    compareVersion(curV, reqV) {
      if (curV && reqV) {
        //将两个版本号拆成数字
        let arr1 = curV.split('.'),
          arr2 = reqV.split('.');
        console.log(arr1)
        console.log(arr2)
        let minLength = Math.min(arr1.length, arr2.length),
          position = 0,
          diff = 0;
        //依次比较版本号每一位大小，当对比得出结果后跳出循环
        while (position < minLength) {
          diff = parseInt(arr1[position]) - parseInt(arr2[position]);
          if (diff != 0) {
            break;
          }
          position++;
        }
        diff = (diff != 0) ? diff : (arr1.length - arr2.length);
        //若curV大于reqV，则返回true
        return diff >= 0;
      } else {
        //输入为空
        console.log("版本号不能为空");
        return false;
      }
    }
  },
}
</script>

<style scoped lang="less">
@deep: ~">>>";

.account {
  background-color: #f5f6fa;

  &-body {
    .red {
      color: red;
    }
  }

  &-footer {
    width: 100%;
    position: fixed;
    bottom: 20px;
    text-align: center;
    font-size: 15px;
    color: #666;
  }

  .upgrade {
    @{deep} .van-popup {
      overflow-y: initial;
      border-radius: 10px;
    }

    @{deep} .van-dialog__header {
      font-size: 18px;
      color: #010101;
      font-weight: 700;
    }

    &-body {
      width: 318px;
      position: relative;
      padding-bottom: 18px;

      .top {
        width: 100%;

        p {
          font-size: 15px;
          padding-top: 10px;
          color: #333;
          text-align: center;
        }
      }

      .content {
        padding: 30px 15px;

        p {
          font-size: 15px;
          color: #000;
          margin: 10px 0;
        }
      }
    }

    &-progress {
      width: 318px;
      position: relative;
      padding-bottom: 18px;

      .top {
        padding: 20px;

        h3 {
          font-size: 18px;
          color: #010101;
          font-weight: 700;
          text-align: center;
        }
      }

      .content {
        padding: 30px 15px;

        p {
          font-size: 15px;
          color: #000;
          margin: 10px 0;
        }

        @{deep} .van-progress {
          height: 10px;
          border-radius: 10px;
          background-color: #f5f6fa;
          border: 1px solid #eee;

          .van-progress__portion {
            background-color: #cccccc !important;

            .van-progress__pivot {
              height: 10px;
              border-radius: 10px;
              background-color: #cccccc !important;
            }
          }
        }
      }

      .bottom {
        padding: 0 18px;

        p {
          font-size: 14px;
          color: #666666;
          text-align: right;
        }
      }
    }
  }
}
</style>
