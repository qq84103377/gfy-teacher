import Fingerprint2 from 'fingerprintjs2'

let excludes = {
  fonts: true,
  fontsFlash: true,
  canvas: true,
  audio: true,
  enumerateDevices: true,
  /**
   {key: 'userAgent', getData: UserAgent},//用户代理
   {key: 'language', getData: languageKey},//语言种类
   {key: 'colorDepth', getData: colorDepthKey},
   //目标设备或缓冲器上的调色板的比特深度
   {key: 'deviceMemory', getData: deviceMemoryKey},//设备内存
   {key: 'pixelRatio', getData: pixelRatioKey},//设备像素比
   {key: 'hardwareConcurrency', getData: hardwareConcurrencyKey},
   //可用于运行在用户的计算机上的线程的逻辑处理器的数量。
   {key: 'screenResolution', getData: screenResolutionKey},
   //当前屏幕分辨率
   {key: 'availableScreenResolution', getData: availableScreenResolutionKey},//屏幕宽高（空白空间）
   {key: 'timezoneOffset', getData: timezoneOffset},
   //本地时间与 GMT 时间之间的时间差，以分钟为单位
   {key: 'timezone', getData: timezone},//时区
   {key: 'sessionStorage', getData: sessionStorageKey},//是否会话存储
   {key: 'localStorage', getData: localStorageKey},//是否具有本地存储   {key: 'indexedDb', getData: indexedDbKey},//是否具有索引DB
   {key: 'addBehavior', getData: addBehaviorKey},//IE是否指定AddBehavior
   {key: 'openDatabase', getData: openDatabaseKey},//是否有打开的DB
   {key: 'cpuClass', getData: cpuClassKey},//浏览器系统的CPU等级
   {key: 'platform', getData: platformKey},//运行浏览器的操作系统和(或)硬件平台
   {key: 'doNotTrack', getData: doNotTrackKey},//do-not-track设置
   {key: 'plugins', getData: pluginsComponent},//浏览器的插件信息
   {key: 'canvas', getData: canvasKey},//使用 Canvas 绘图
   {key: 'webgl', getData: webglKey},//WebGL指纹信息
   {key: 'webglVendorAndRenderer', getData: webglVendorAndRendererKey},//具有大量熵的WebGL指纹的子集
   {key: 'adBlock', getData: adBlockKey},//是否安装AdBlock
   {key: 'hasLiedLanguages', getData: hasLiedLanguagesKey},
   //用户是否篡改了语言
   {key: 'hasLiedResolution', getData: hasLiedResolutionKey},
   //用户是否篡改了屏幕分辨率
   {key: 'hasLiedOs', getData: hasLiedOsKey},
   //用户是否篡改了操作系统
   {key: 'hasLiedBrowser', getData: hasLiedBrowserKey},
   //用户是否篡改了浏览器
   {key: 'touchSupport', getData: touchSupportKey},//触摸屏检测和能力
   {key: 'fonts', getData: jsFontsKey, pauseBefore: true},
   //使用JS/CSS检测到的字体列表
   {key: 'fontsFlash', getData: flashFontsKey, pauseBefore: true},
   //已安装的Flash字体列表
   {key: 'audio', getData: audioKey},//音频处理
   {key: 'enumerateDevices', getData: enumerateDevicesKey}
   //可用的多媒体输入和输出设备的信息。
   */
}

export const getFinger = () => {
  return new Promise((resolve,reject) => {
    Fingerprint2.get({excludes},function(components) {
      const values = components.map(function(component,index) {
        if (index === 0) { //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
          return component.value.replace(/\bNetType\/\w+\b/, '')
        }
        return component.value
      })
      // 生成最终id murmur
      const murmur = Fingerprint2.x64hash128(values.join(''), 31)
      resolve(murmur)
    })
  })
}
