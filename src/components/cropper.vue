<template>
  <div v-if="visible" class="cropper-wrap">
    <VueCropper
      class="cropper-wrap__content"
      ref="cropper"
      :img="img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :info="false"
      :full="option.full"
      :canMove="option.canMove"
      :canMoveBox="option.canMoveBox"
      :fixedBox="option.fixedBox"
      :original="option.original"
      :autoCrop="option.autoCrop"
      :fixed="option.fixed"
      :fixedNumber="option.fixedNumber"
      @realTime="realTime"
    ></VueCropper>
    <div class="cropper-wrap__footer van-hairline--top">
      <span @click="$emit('update:visible',false)">取消</span>
      <span @click="finish">完成</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'cropper',
    props: ['visible', 'img'],
    data () {
      return {
        option: {
          img: require('../assets/img/icon-qq.png'),//裁切图片的地址
          outputSize: 0.6,//裁剪生成图片的质量 0.1-1
          full: false,//是否输出原图比例的截图
          outputType: 'png',//裁剪生成图片的格式
          canMove: true,//图片是否允许滚轮缩放
          // fixedBox: true,//固定截图框大小 不允许改变
          original: false,//上传图片按照原始比例渲染
          canMoveBox: true,//截图框能否拖动
          // autoCropWidth: 50,
          // autoCropHeight: 50,
          autoCrop:true,//是否默认生成截图框
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },
        previews: {},
        imgUrl: ''
      }
    },
    methods: {
      realTime (data) {
        this.previews = data
      },
      finish () {
        let base64 = ''
        this.$refs.cropper.getCropData((data) => {
          // 裁切生成的base64图片
          base64 = data
        })
        this.$refs.cropper.getCropBlob((data) => {
          this.$emit('finish', base64, data)
          this.$emit('update:visible', false)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .cropper-wrap{
    z-index: 99;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #000;
    &__content{
      height: 300px;
      margin-top: 150px;
    }
    &__footer{
      color: #fff;
      padding: 0 12px;
      position: fixed;
      bottom: 0;
      left: 0;
      height: 48px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
