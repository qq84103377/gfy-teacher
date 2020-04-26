<template>
  <div class="private">
      <div v-html="content">
      </div>
  </div>

</template>

<script>
import { getContent} from '@/api/index'

export default {
  name: 'privateSheet',
  data() {
    return {
      content:'',
      contentUrl:'https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/work/202001/userPrivateInfo.html'
    }
  },
  mounted() {
    try{MobclickAgent.onEvent('mineSettingPrivateSheet')}catch(e){console.log(e)}
    this.getContent()
  },
  methods: {
    getContent() {
      getContent(this.contentUrl).then(res => {
        this.content = res;
      })
    },
  },
}
</script>

<style lang='less' scoped>
@deep: ~">>>";
.private {
  max-height: 100%;
  @{deep}.content {
    padding: 20px;
    .tit {
      text-align: center;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      margin-bottom: 15px;
      color: rgba(51, 51, 51, 1);
      line-height: 36px;
      //   margin-bottom: 15px;
    }
    .point {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      text-justify: inter-ideograph;
      margin-top: 20px;
    }
    .point-con {
      font-size: 14px;
      font-family: Adobe Heiti Std;
      font-weight: normal;
      color: rgba(51, 51, 51, 1);
      line-height: 28px;
      text-align: justify;
    }
  }
}
</style>
