<template>
    <section class="discuss-detail">
      <div class="fs15 mgb20" style="font-weight: bold;">{{$route.query.data.discussName}}</div>
      <div class="html-img" @click="previewImg" v-html="$route.query.data.discussContent"></div>
    </section>
</template>

<script>
  import { ImagePreview } from "vant";
  export default {
        name: "discussDetail",
      methods: {
        previewImg($event) {
          if ($event.target.nodeName == "IMG") {
            console.log($event.target.src);
            ImagePreview({
              images: [$event.target.src],
              // startPosition: 1,
              onClose() {
                // do something
                console.log("close");
              }
            });
          }
        },
      }
    }
</script>

<style lang="less" scoped>
  .discuss-detail {
    padding: 10px;
    img{
      width: 100%;
      height: 185px;
      margin-bottom: 10px;
    }
  }
</style>
