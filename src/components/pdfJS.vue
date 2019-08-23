<template>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="handleReachBottom">
        <div ref="ctn" id="aa"></div>
      </van-list>
</template>
<style scoped>
  .scorllBox >>> .ivu-scroll-loader-wrapper {
    padding: 0;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  .cover {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    width: 100%; /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
    height: 100%;
    filter: alpha(opacity=70); /*设置透明度为60%*/
    opacity: 0.7; /*非IE浏览器下设置透明度为60%*/
    display: none;
    z-Index: 999;
  }

  .modal {
    width: 80%;
    height: auto;
    max-height: 80%;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    display: none;
    cursor: pointer;
    z-Index: 9999;
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .header11 {
    width: 100%;
    text-align: left;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    line-height: 50px;
  }

  .can {
    display: none;
    max-width: 100%;
    height: auto;
    width: 100%;
    /*height: 100%;*/
  }

  .back {
    background-color: rgba(0, 0, 0, 0.788);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    text-align: center;
    /*padding: 20px;*/
    z-index: 100;
    overflow: scroll;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 200;
    color: #fff;
    cursor: pointer;
  }

  .foot {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .lightbox {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    z-index: 7;
    opacity: 0.3;
    display: block;
    background-color: rgb(0, 0, 0);
  }

  .pop {
    position: absolute;
    left: 50%;
    width: 894px;
    margin-left: -447px;
    z-index: 9;
    overflow-x: scroll;
  }
</style>

<script>
  import PDFJS from 'pdfjs-dist'

  export default {
    data () {
      return {
        loadScrollTips: false,
        loadingText: '上滑加载更多信息',
        tableHeight: 500,
        pageCount: 0,
        curPage: 0,
        pageSize: 5,
        showMask: false,
        item: this.$store.getters.GET_COLLECTIONOBJECT,
        pdfDoc: null,
        //可以打印发现是一个对象，里面有页数信息等
        pageNum: 1,
        pageRendering: false,
        pageNumPending: null,
        scale: 1,
        pdfObject: {
          title: '',
          url: '',
        },
        finished: false,
        loading: false,
      }
    },

    props: {
      url: {
        type: String
      },
    },
    mounted () {
      this.tableHeight = window.screen.height - 50
    },
    created () {
      console.log('我创建了', this.url)
      this.showPDF(this.url)

    },
    methods: {
      handleReachBottom () {
        debugger
        if(!this.pdfDoc) return
        if (this.curPage === 0 || (this.curPage * this.pageSize) < this.pageCount) {
          this.curPage++
          return new Promise(resolve => {
            this.load()
            resolve()
          })

        } else {
          this.finished = true
          this.loading = false
          this.loadScrollTips = false
          return false
        }
      },

      goBack () {
        this.$router.go(-1)
      },

      showPDF (url) {
        this.$store.commit('setVanLoading', true)
        let _this = this
        PDFJS.getDocument(url).then(function (pdf) {
          _this.pdfDoc = pdf
          _this.pageCount = _this.pdfDoc.numPages
          if (_this.pageCount <= _this.pageSize) {
            _this.loadScrollTips = true
          }
          _this.load()
        })
      },

      load () {
        this.$store.commit('setVanLoading', true)
        //设置5页一加载
        if (this.pageCount <= this.pageSize) {

          console.log('pageCount1', this.pageCount)
          //此处要分页处理 不然渲染速度过于缓慢
          for (var ii = 1; ii <= this.pdfDoc.numPages; ii++) {
            var x = document.createElement('CANVAS')
            x.id = 'the-canvas' + ii
            this.$refs['ctn'].append(x)
            this.renderPage(ii)
          }

        } else {
          var index = this.curPage * 5 + 1
          var end = (this.curPage * 5 + 5) >= this.pageCount ? this.pageCount : (this.curPage * 5 + 5)
          //此处要分页处理 不然渲染速度过于缓慢
          for (var i = index; i <= end; i++) {
            console.log('pageCount12', i)
            var x = document.createElement('CANVAS')
            x.id = 'the-canvas' + i
            this.$refs['ctn'].append(x)
            this.renderPage(i)
          }
        }
        this.loading = false
        this.$store.commit('setVanLoading', false)
      },

      renderPage (num) {
        this.pageRendering = true
        let _this = this
        this.pdfDoc.getPage(num).then(function (page) {
          var viewport = page.getViewport(_this.scale)
          let canvas = document.getElementById('the-canvas' + num)
          canvas.width = viewport.width
          canvas.height = viewport.height
          if (_this.scale > 1) {

          } else {
            canvas.style.maxWidth = '100%'
          }

          var renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          }
          var renderTask = page.render(renderContext) // Wait for rendering to finish

//          renderTask.promise.then(function() {
//            _this.pageRendering = false;
//            if (_this.pageNumPending !== null) {
//              // New page rendering is pending
//              this.renderPage(_this.pageNumPending);
//              _this.pageNumPending = null
//            }
//          })
        })
      },
      queueRenderPage (num) {
        if (this.pageRendering) {
          this.pageNumPending = num
        } else {
          this.renderPage(num)
        }
      },
      onPrevPage () {
        if (this.pageNum <= 1) {
          return
        }
        this.pageNum--
        this.queueRenderPage(this.pageNum)
      },
      onNextPage () {
        if (this.pageNum >= this.pdfDoc.numPages) {
          return
        }
        this.pageNum++
        this.queueRenderPage(this.pageNum)
      },

    },
  }
</script>


