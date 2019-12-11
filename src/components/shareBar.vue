<template>
  <van-popup v-model="visible" position="bottom">
    <div class="share-bar">
      <div class="black fs14 title">分享至:</div>
      <div style="display: flex;justify-content: space-around">
        <div v-for="(item,index) in menu" :key="index" class="share-item" @click="share(item)">
          <i class="mgb5" :class="handleClass(item)" :data-clipboard-text="link"></i>
          <div>{{item.name}}</div>
        </div>
      </div>
      <div class="footer van-hairline--top" @click="visible = false">取消</div>
    </div>
  </van-popup>
</template>

<script>
import clipboardJs from 'clipboard'
export default {
  name: 'shareBar',
  props: ['show', 'title', 'pic', 'link', 'type', 'desc'],
  computed: {
    visible: {
      get() {
        return this.show
      },
      set() {
        this.$emit('update:show', false)
      }
    }
  },
  data() {
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
    handleClass(item) {
      return `iconGFY icon-${item.type}`
    },
    share(item) {
      let _this = this
      if (item.type === 'wx' || item.type === 'timeline') {
        Wechat.share({
          message: {
            title: _this.title,
            description: this.desc || '',
            thumb: _this.pic || 'https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/share_icon/teacher_share.png',
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
          this.$toast(reason)
        })
      } else if (item.type === 'copy-link') {
        let clipboard = new clipboardJs('.icon-copy-link');
        //成功回调
        clipboard.on('success', e => {
          e.clearSelection();
          this.$toast.success('复制成功')
          this.visible = false
        });
      } else {
        var args = {}
        args.client = QQSDK.ClientType.QQ//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        args.scene = item.type === 'qq' ? QQSDK.Scene.QQ : QQSDK.Scene.QQZone//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
        args.url = this.link
        args.title = this.title
        args.description = this.desc || ''
        args.image = this.pic || 'https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/share_icon/teacher_share.png'
        QQSDK.shareNews(() => {
          this.$toast.success('分享成功')
          this.visible = false
        }, (failReason) => {
          this.$toast('取消分享')
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
