<template>
  <div class="service">
    <div v-html="content">
    </div>
  </div>

</template>

<script>
import { getContent } from '@/api/index'

export default {
  name: 'serviceSheet',
  data() {
    return {
      content: '',
      contentUrl: 'https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/work/202001/teacherUserServiceInfo.html'
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
.service {
  max-height: 100%;
}
</style>
