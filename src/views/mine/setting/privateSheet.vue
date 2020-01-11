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
}
</style>
