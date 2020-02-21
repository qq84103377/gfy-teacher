<template>
  <div class="upgrade">
    <van-popup v-model="showUpgrade" :close-on-click-overlay="!force">
      <div class="upgrade-body">
        <div class="close" v-show="!force">x</div>
        <div class="top">
          <h3>版本更新啦</h3>
          <p>v{{serverVersion}}版本</p>
        </div>
        <div class="content">
          <h2>更新内容</h2>
          <p v-html="uploadDetail"></p>
        </div>
        <div class="bottom">
          <van-button type="info" size="large" @click="downLoad()">立即更新</van-button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="progress" :close-on-click-overlay="false">
      <div class="upgrade-body">
        <div class="top">
          <h3>新版本下载中</h3>
        </div>
        <div class="content down">
          <van-progress :percentage="percent" />
        </div>
        <div class="bottom">
          <p>新版本正在努力下载，请稍后...</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getLatestModuleVerion } from "@/api/index";
import eventBus from "@/utils/eventBus";

export default {
  data() {
    return {
      showUpgrade: false,
      progress: false,
      serverVersion: "1.1.2", //服务器版本号
      version: "", //当前版本号
      percent: 0,
      uploadDetail: "", //更新内容
      releasePath: "", //安装包路径
      force: false //是否为强制更新
    };
  },
  methods: {
    //下载安装包
    upgradeForAndroid() {
      var packageName = "app-release-parent.apk";
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
      var _this = this;
      console.log("设备类型：" + platformType);
      var appName = "应用名字";
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
      if (platformType == "Android") {
        param["moduleType"] = "T09";
      } else if (platformType == "iOS") {
        param["moduleType"] = "T10";
      }
      function compareVersion(curV,reqV) {
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
      getLatestModuleVerion({ requestJson: JSON.stringify(param) })
        .then(
          response => {
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
                let flag = compareVersion(version,serverVersion);
                // let flag = compareVersion(version,'1.0.2');
                if (!flag) {
                  _this.uploadDetail =
                      response.data[0].versionRecord.uploadDetail;
                  _this.showUpgrade = true; //显示升级弹框
                  if (platformType == "Android") {
                    // 升级内容

                  } else if (platformType == "iOS") {
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
      let platform = device.platform
      if (platform == "Android") {
        console.log("Android升级")
        this.progress = true;
        this.upgradeForAndroid()
      } else if (platform == "iOS") {
        console.log("iOS升级")
        //"itms-apps://apps.apple.com/cn/app/全朗e家/id1492778121"
        if (that.releasePath){
          that.$toast.fail("下载地址为空！");
        }
        let ref = cordova.InAppBrowser.open(that.releasePath, '_blank', 'location=yes')
        setTimeout(function () {
          ref.close()
        }, 100)
      }
    }
  },
  mounted() {
    var _this = this;
    document.addEventListener(
      "deviceready",
      function () {
        if (window.navigator.onLine == true) {
          cordova.getAppVersion.getVersionNumber().then(function (version) {
            console.log(version);
            // 版本号获取
            _this.version = version;
          });

          eventBus.$on('checkUpgrade',() => {
            var platform = device.platform;
            _this.checkUpgrade(platform);
          })
        }
      },
      false
    );
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@keyframes run {
  0% {
    top: 0px;
  }
  50% {
    top: 5px;
  }
  100% {
    top: 0px;
  }
}
.upgrade {
  @{deep} .van-popup {
    overflow-y: initial;
    border-radius: 5px;
  }
  &-body {
    width: 318px;
    position: relative;
    padding-bottom: 18px;
    .close {
      position: absolute;
      width: 25px;
      height: 25px;
      background-color: #d3d3d3;
      color: #fff;
      border-radius: 25px;
      top: -35px;
      right: 0px;
      text-align: center;
    }
    .top {
      padding: 35px;
      width: 100%;
      height: 118px;
      background: url("../assets/img/renovate-bg.png");
      background-size: contain;
      color: #fff;
      h3 {
        font-size: 25px;
      }
      p {
        font-size: 14px;
        padding-top: 10px;
      }
    }
    .content {
      padding: 16px;
      p {
        font-size: 14px;
        color: #333;
        margin: 10px 0;
      }
      @{deep} .van-progress {
        height: 15px;
        border-radius: 8px 0 0 8px;
        background-color: #f5f5f5;
        margin-right: 20px;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          right: -25px;
          width: 25px;
          height: 15px;
          background-color: #f5f5f5;
          border-radius: 0 8px 8px 0;
        }
        .van-progress__portion {
          .van-progress__pivot {
            height: 15px;
            border-radius: 0 8px 8px 0;
            &::before {
              content: "";
              position: absolute;
              top: 2px;
              right: -20px;
              width: 15px;
              height: 10px;
              background: url("../assets/img/renovate-speed-of-progress-icon.png");
              background-size: contain;
              animation: run 2s linear infinite;
            }
          }
        }
      }
    }
    .bottom {
      padding: 0 18px;
      @{deep} .van-button {
        height: 40px;
        line-height: 40px;
      }
      p {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
