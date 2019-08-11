<template>
  <van-popup
    v-model="visible"
    position="bottom">
    <div class="share-bar">
      <div class="black fs14 title">分享至:</div>
      <div style="display: flex;justify-content: space-around">
        <div v-for="(item,index) in menu" :key="index" class="share-item" @click="share(item)">
          <i class="mgb5" :class="handleClass(item)"></i>
          <div>{{item.name}}</div>
        </div>
      </div>
      <div class="footer van-hairline--top" @click="visible = false">取消</div>
    </div>
  </van-popup>
</template>

<script>
  export default {
    name: 'shareBar',
    props: ['show', 'title', 'pic', 'link', 'type'], // type: 'art'资讯分享 'psy'心理测试分享
    computed: {
      visible: {
        get () {
          return this.show
        },
        set () {
          this.$emit('update:show', false)
        }
      }
    },
    data () {
      return {
        menu: [
          {
            type: 'wx',
            name: '微信'
          },
          {
            type: 'timeline',
            name: '朋友圈'
          },
          {
            type: 'qq',
            name: 'QQ'
          },
          {
            type: 'qzone',
            name: 'QQ空间'
          },
          {
            type: 'copy-link',
            name: '复制链接'
          },
        ]
      }
    },
    methods: {
      handleClass (item) {
        return `iconGFY icon-${item.type}`
      },
      handleDesc () {
        let descArr = [
          '家长圈APP,每个家长都在用的APP',
          '这里有你想要的资讯',
          '快来看,这有实用的干货',
          '看看有哪些你喜欢的资讯',
          '你也来看看这条大家都在关注的资讯吧'
        ]
        if ( this.type == 'art') {
          return descArr[Math.floor(Math.random() * 5)]
        } else if (this.type == 'psy') {
          return '我做了一个测试，你也来试试吧'
        } else {
          return ''
        }
      },
      share (item) {
        let _this = this
        if (item.type === 'wx' || item.type === 'timeline') {
          Wechat.share({
            message: {
              title: _this.title,
              description: _this.handleDesc(),
              thumb: _this.pic || 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/feedback/information/201907/icon-48-mdpi.png',
              // mediaTagName: "TEST-TAG-001",
              // messageExt: "这是第三方带的测试字段",
              // messageAction: "<action>dotalist</action>",
              media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: _this.link
              }
            },
            scene: item.type === 'wx' ? Wechat.Scene.SESSION : Wechat.Scene.Timeline   // share to Timeline 1 1
          }, () => {
            this.visible = false
          }, (reason) => {
            this.$toast.error(reason)
          })
        } else {
          var args = {}
          args.client = QQSDK.ClientType.QQ//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
          args.scene = item.type === 'qq' ? QQSDK.Scene.QQ : QQSDK.Scene.QQZone//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
          args.url = this.link
          args.title = this.title
          args.description = this.handleDesc()
          args.image = this.pic || 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/feedback/information/201907/icon-48-mdpi.png'
          QQSDK.shareNews(() => {
            this.$toast.success('分享成功')
            this.visible = false
          }, (failReason) => {
            this.$toast.error('取消分享')
          }, args)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .share-bar {
    .title {
      margin: 10px;
    }

    .share-item {
      flex: 1;
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
      text-align: center;
      white-space: nowrap;
    }

    .footer {
      line-height: 40px;
      font-size: 16px;
      color: #666;
      text-align: center;
    }
  }
</style>
