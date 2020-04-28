<template>
  <div style="width: 100%;height: 100%;position: absolute;left: 0;top: 0" id="container">
    <div id="layout">
      <div class="wrapper" id="test">
        <canvas class="offCanvas"></canvas>
        <canvas ref="canvas" class="canvas"></canvas>
      </div>
    </div>

    <!--    <div class="footer">-->
    <!--      <div class="control-button">-->
    <!--        <div class="item colorButton"><img src="" alt=""><span>黑色</span></div>-->
    <!--        &lt;!&ndash;                <div class="item sizeButton"><img src="" alt=""><span>中笔</span></div>&ndash;&gt;-->
    <!--        &lt;!&ndash;                <div class="item bgButton"><img src="" alt=""><span>背景</span></div>&ndash;&gt;-->
    <!--        <div class="item rubberButton"><img src="" alt=""><span>擦掉</span></div>-->
    <!--        &lt;!&ndash;                <div class="item historyButton"><img src="" alt=""><span>历史</span></div>&ndash;&gt;-->
    <!--        <div class="item clearButton"><img src="" alt=""><span>清屏</span></div>-->
    <!--        <div class="item saveButton" @click="save"><img src="" alt=""><span>保存</span></div>-->
    <!--        <div class="item exitButton" @click="exit"><img src="" alt=""><span>退出</span></div>-->
    <!--      </div>-->
    <!--      <div class="pop-up colors-panel">-->
    <!--        <div class="title">笔触颜色<span class="closeBtn"></span></div>-->
    <!--        <div class="colors">-->
    <!--          <div class="lineColors">-->
    <!--            <div><span class="red" data-text="红色" data-color="#ff0000"></span></div>-->
    <!--            <div><span class="blue" data-text="蓝色" data-color="#0000ff"></span></div>-->
    <!--            <div><span class="green" data-text="绿色" data-color="#00ff00"></span></div>-->
    <!--            <div><span class="black" data-text="黑色" data-color="#000000"></span></div>-->
    <!--            <div><span class="orange" data-text="橙色" data-color="#ff6302"></span></div>-->
    <!--          </div>-->
    <!--          <div class="lineColors">-->
    <!--            <div><span class="red" data-text="红色" data-color="#ff0000"></span></div>-->
    <!--            <div><span class="blue" data-text="蓝色" data-color="#0000ff"></span></div>-->
    <!--            <div><span class="green" data-text="绿色" data-color="#00ff00"></span></div>-->
    <!--            <div><span class="black" data-text="黑色" data-color="#000000"></span></div>-->
    <!--            <div><span class="orange" data-text="橙色" data-color="#ff6302"></span></div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      &lt;!&ndash;            <div class="pop-up size-panel">&ndash;&gt;-->
    <!--      &lt;!&ndash;                <div class="title">笔触大小<span class="closeBtn"></span></div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                <div class="sizes">&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="lineSizes"><span data-lineWidth="10" data-text="大笔" class="big"></span></div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="lineSizes"><span data-lineWidth="30" data-text="中笔" class="middle"></span></div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="lineSizes"><span data-lineWidth="50" data-text="小笔" class="small"></span></div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;            </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;            <div class="pop-up bg-panel">&ndash;&gt;-->
    <!--      &lt;!&ndash;                <div class="title">推荐背景<span class="closeBtn"></span></div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                <div class="list">&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <img src="../assets/4.png" alt="" />&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <img src="" alt="" />&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <img src="" alt="" />&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <img src="" alt="" />&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <img src="" alt="" />&ndash;&gt;-->
    <!--      &lt;!&ndash;                </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;            </div>&ndash;&gt;-->
    <!--      &lt;!&ndash; 添加橡皮檫列表和历史记录列表样式 &ndash;&gt;-->
    <!--      <div class="pop-up rubber-panel">-->
    <!--        <div class="title">橡皮檫大小<span class="closeBtn"></span></div>-->
    <!--        <div class="rubbers">-->
    <!--          <div class="first">大小：</div>-->
    <!--          <div class="second"><input type="range" min="1" max="50" value="25" step="1" name="大小"/></div>-->
    <!--          <div class="last"><span class="rubberSize">25</span>像素</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      &lt;!&ndash;            <div class="pop-up history-panel">&ndash;&gt;-->
    <!--      &lt;!&ndash;      r          <div class="title">历史记录<span class="closeBtn"></span></div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                <div class="history">&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="lineBox"></div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;            </div>&ndash;&gt;-->
    <!--    </div>-->
    <div class="offImgs" style="display: none;"></div>
  </div>
</template>

<script>
import AlloyFinger from 'alloyfinger'
import 'alloyfinger/transformjs/transform'
import AlloyPaper from 'alloyfinger/asset/alloy_paper.js'
import * as uploadApi from "@/api/upload";
// import '../utils/canvas/jquery.min'
// import '../assets/handWriting'
// 底部操作栏和弹出框交互函数
function animatePanel(fName, fHeight, sName, sHeight) {
  // $(fName).slideUp(300);
  // $('.footer').animate({'bottom': fHeight}, 300);
  // let timer = setTimeout(function() {
  $(sName).slideDown(500);
  //     $('.footer').animate({'bottom': 0, 'height': sHeight}, 500);
  //     timer = null;
  // }, 0);
}

export default {
  name: "drawBoard",
  data() {
    return {
      rotate: 0,  // 手势旋转角度
      scale: 1,   //手势缩放大小
      offCtx: '',
      point: null, // 记录触碰坐标
      lastCoordinate: null, //记录前一个坐标
      lastTimestamp: 0, //前一个时间戳
      canvas: null,
      offCanvas: null,
      // isPen: false, //判断是涂鸦还是擦除
      lastLineWidth: -1,  //用于线光滑过度
      sizeWidth: 30,  //笔触宽度
      strokeColor: '#f00',  //笔触颜色
      ctx: '',
      rubberSize: 25,  //橡皮擦大小
      imgArray: [],  //储存背景图和涂鸦图
      rectX: 0,
      rectY: 0,
      rectW: 0,
      rectH: 0,
      swordEle: null,
      oSSObject: null,
      curFile: null,
      container: null,
      isPinch: false,
      timer: null,
      canvasHistory: [],
      rotateIndex: 0,
      lastLeft: 0,
      lastTop: 0,
      isIphone: false,
      drawFlag: false, //是否涂鸦过
      changeImg: null,
      imgOnload: false, //图片是否加载完成
      initTime: 0, //初始化次数为1的时候不赋值lastLeft&lastTop
    }
  },
  props: ['imgUrl', 'isPen', 'isRubber', 'text', 'stuIndex'],  //isPen 判断是否画笔  //isRubber  判断是否橡皮擦  //text 评语
  watch: {
    imgUrl() {
      // $('.clearButton').trigger('click')
      this.clearScreen()
      this.drawFlag = false
      this.canvasHistory = []
      this.rotateIndex = 0
      this.rotate = 0
      this.changeImg = null
      this.imgOnload = false
      //对于文字+图片和纯图片之间的切换 需要重新计算canvas高度,
      this.$nextTick(() => {
        document.getElementById('layout').className = ''
        this.offCanvas.height = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0)
        this.canvas.height = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0)
        this.drawImg(this.imgUrl); // 画图

        //移动过的图片进行复位
        this.scale = this.swordEle.scaleY = this.swordEle.scaleX = 1
        this.swordEle.rotateZ = 0
        this.swordEle.translateX = 0
        this.swordEle.translateY = 0
      })
      // animatePanel('.bg-panel', '-130px', '.control-button', '60px');
    },
    text(v) {
      // this.ctx.font = '18px bold Adobe Heiti Std R'
      // this.ctx.clearRect(this.rectX,this.rectY,this.rectW,this.rectH)
      // this.ctx.fillStyle = '#ccc'
      // this.rectX = this.canvas.width/2 - this.ctx.measureText(v).width/2 - 20
      // this.rectY = (this.canvas.height - 70)
      // this.rectW = this.ctx.measureText(v).width + 40
      // this.rectH = 50
      // this.ctx.fillRect(this.rectX,this.rectY,this.rectW,this.rectH)
      // this.ctx.fillStyle = 'red'
      // this.ctx.textAlign = "center"
      // this.ctx.fillText(v,this.canvas.width/2,this.canvas.height - 40)
    },
    // rotate(v) {
    //   console.log('现在是' + v);
    // }
  },
  computed: {
    isApp() {
      return 'cordova' in window
    },
  },

  methods: {
    clear() {
      console.log('clear()');
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    handleZoom(scale) {
      console.log('handleZoom()');
      this.scale = this.swordEle.scaleX = this.swordEle.scaleY = scale
    },
    clearScreen() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清除涂鸦画布内容
      this.offCtx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清除背景图画布内容
    },
    drawImg(changeValue) {
      let a = this.$refs['canvas'].width
      let b = this.$refs['canvas'].height
      this.offCtx.clearRect(0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height); // 先清除画布
      this.changeImg = new Image();
      // this.changeImg.setAttribute("crossOrigin", 'anonymous');
      // this.changeImg.src = changeValue + '&' + Math.random();
      // this.changeImg.src = 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/test_answer/202003/17493_1583462496_SoBss.png?x-oss-process=style/max_width_1000';
      this.changeImg.src = changeValue;
      this.changeImg.onload = () => {
        this.initTime++
        let scaleRange = 1   // 缩放显示比例

        //获取原图的宽高,若宽或高超过屏幕,则按比例缩放显示
        const maxWidth = window.document.body.offsetWidth
        const maxHeight = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0)
        let tempWidth, tempHeight
        if (this.changeImg.width / this.changeImg.height >= maxWidth / maxHeight) {
          if (this.changeImg.width > maxWidth) {
            tempWidth = maxWidth;
            // 按原图片的比例进行缩放
            tempHeight = (this.changeImg.height * maxWidth) / this.changeImg.width;
            //原图宽度超过屏幕宽度时,计算缩放比例
            scaleRange = maxWidth / this.changeImg.width
          } else {
            // 按原图片的大小进行缩放
            tempWidth = this.changeImg.width;
            tempHeight = this.changeImg.height;
          }
        } else {// 原图片的高度必然 > 宽度
          if (this.changeImg.height > maxHeight) {
            tempHeight = maxHeight;
            // 按原图片的比例进行缩放
            tempWidth = (this.changeImg.width * maxHeight) / this.changeImg.height;
            //原图高度超过屏幕高度时,计算缩放比例
            scaleRange = maxHeight / this.changeImg.height
          } else {
            // 按原图片的大小进行缩放
            tempWidth = this.changeImg.width;
            tempHeight = this.changeImg.height;
          }
        }

        //canvas按原图宽高进行设置,然后通过缩放比例显示
        this.offCanvas.width = this.changeImg.width
        this.offCanvas.style.width = this.changeImg.width + 'px'
        this.offCanvas.height = this.changeImg.height
        this.offCanvas.style.height = this.changeImg.height + 'px'
        this.canvas.width = this.changeImg.width
        this.canvas.style.width = this.changeImg.width + 'px'
        this.canvas.height = this.changeImg.height
        this.canvas.style.height = this.changeImg.height + 'px'
        document.getElementById('test').style.width = this.changeImg.width + 'px'
        document.getElementById('test').style.height = this.changeImg.height + 'px'

        this.offCtx.drawImage(this.changeImg, 0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height);
        this.imgOnload = true

        //*************************************************************************//
        //用来计算旋转后的描点位置
        this.rotate = 90
        this.swordEle.rotateZ = 90
        // let bbox = this.swordEle.getBoundingClientRect();
        let bbox = this.canvas.getBoundingClientRect();
        console.log(bbox, 'bbox')
        console.log(bbox.left, 'bbox.left')
        console.log(bbox.top, 'bbox.top')
        //初始化是会触发两次 所以在次数为2的时候拒绝赋值
        if (this.isApp && this.initTime !== 2) {
          this.lastLeft = bbox.left
          this.lastTop = bbox.top
        }  else if (!this.isApp) {
          this.lastLeft = bbox.left
          this.lastTop = bbox.top
        }
        this.rotate = 0
        this.swordEle.rotateZ = 0
        //*************************************************************************//

        //调整缩放比例
        this.swordEle.scaleX = this.swordEle.scaleY = this.scale = scaleRange
        //居中显示canvas
        document.getElementById('layout').className = 'center-box'
      };
      this.changeImg.onerror = () => {
        this.$toast('图片加载失败')
      };
    },
    exit() {
      console.log('exit()');
      this.$emit('exit')
    },
    handleTouchstart(event) {
      console.log('handleTouchstart');
      this.point = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
      this.lastCoordinate = this.windowToCanvas(this.point.x, this.point.y);
      this.lastTimestamp = new Date().getTime();
    },
    handleTouchmove(event) {
      console.log('handleTouchmove');
      this.point = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
      // console.log(this.point.x,this.point.y);
      let curCoordinate = this.windowToCanvas(this.point.x, this.point.y);
      if (this.isPen) { // 涂鸦
        let curTimestamp = new Date().getTime();
        let s = this.calcDistance(this.lastCoordinate, curCoordinate); // 计算两点之间的距离
        let t = curTimestamp - this.lastTimestamp; // 计算两点之间的时间差
        let curLineWidth = this.caleLineWidth(s, t, this.sizeWidth);

        this.drawLine(this.ctx, this.lastCoordinate.x, this.lastCoordinate.y, curCoordinate.x, curCoordinate.y, curLineWidth, this.strokeColor);

        this.lastCoordinate = curCoordinate; // 现在坐标替换前一个坐标
        this.lastTimestamp = curTimestamp;
        this.lastLineWidth = curLineWidth;
      } else if (this.isRubber) { // 擦掉
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(curCoordinate.x, curCoordinate.y, this.rubberSize / 2, 0, Math.PI * 2);
        this.ctx.clip();
        this.ctx.clearRect(curCoordinate.x - this.rubberSize / 2, curCoordinate.y - this.rubberSize / 2, this.rubberSize, this.rubberSize); // 清除涂鸦画布内容
        this.ctx.restore();
      }
    },
    handleTouchend(event) {
      console.log('handleTouchend');
      let imageSrc = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'); // 画布转换为图片地址
      console.log(imageSrc, 'imageSrc');

      return
      document.getElementsByClassName('lineBox')[0].appendChild('<img src="' + imageSrc + '" />')
      // $('.lineBox').append('<img src="' + imageSrc + '" />');
      let boxWidth = document.querySelectorAll('.lineBox img').length * 80  //    $('.lineBox img').length * 80; // 80为图片宽度（72）+间隔（8）
      document.getElementsByClassName('lineBox')[0].style.width = boxWidth + 'px'
      // $('.lineBox').css({ // 设置lineBox宽度
      //   width: boxWidth + 'px'
      // });
    },
    // 坐标转换
    windowToCanvas(x, y) {
      console.log('windowToCanvas()');
      let bbox = this.canvas.getBoundingClientRect();
      console.log(y, bbox.top, '================');
      // return { x: x - bbox.left, y: y - bbox.top };

      // return { x, y };

      if (!this.rotate || this.rotate == 0 || this.rotate == 180 || this.rotate == -180 || this.rotate == 360 || this.rotate == -360) {
        console.log("非旋转////");
        console.log(bbox, '/////bbox');
        console.log(x, y, '/////x y');
        console.log(bbox.left, bbox.top, '/////bboxx bboxy');
        console.log(x - bbox.left, y - bbox.top, '/////x-bboxx x-bboxy');
        return { x: x - bbox.left, y: y - bbox.top };
      } else {
        console.log("旋转////");
        console.log(bbox, '/////bbox');
        console.log(x, y, '/////x y');
        // console.log(bbox.left, bbox.top, '/////bbox.left, bbox.top');
        // console.log(x - bbox.left, y - bbox.top, '/////x-bbox.left, y-bbox.top');
        console.log(this.lastLeft, this.lastTop, 'this.lastLeft,this.lastTop');
        console.log(this.scale, 'this.scale');

        return { x: x - bbox.left + this.lastLeft * this.scale, y: y - bbox.top + this.lastTop * this.scale };

        // if (this.scale != 1) {
        // } else {
        //   return { x: x - bbox.left + this.lastLeft, y: y - bbox.top + this.lastTop };
        // }

        // return { x, y };
      }

    },
    // 计算两点之间的距离函数
    calcDistance(lastCoordinate, curCoordinate) {
      console.log('calcDistance()');
      let distance = Math.sqrt(Math.pow(curCoordinate.x - lastCoordinate.x, 2) + Math.pow(curCoordinate.y - lastCoordinate.y, 2));
      return distance;
    },
    // 根据不同速度计算线的宽度函数
    caleLineWidth(s, t, brushWidth) {
      console.log('caleLineWidth()');
      let v = s / t; // 获取速度
      // 声明最大最小速度和最大最小边界
      let maxVelocity = 10,
        minVelocity = 0.1,
        // maxLineWidth = Math.min(30, canvas.width / brushWidth), // 避免手机端线条太粗
        maxLineWidth = 1, // 避免手机端线条太粗
        minLineWidth = 1,
        resultLineWidth; // 用于返回的线宽度

      if (v <= minVelocity) {
        resultLineWidth = maxLineWidth;
      } else if (v >= maxVelocity) {
        resultLineWidth = minLineWidth;
      } else {
        resultLineWidth = maxLineWidth - (v - minVelocity) / (maxVelocity - minVelocity) * (maxLineWidth - minLineWidth);
      }
      if (this.lastLineWidth == -1) { // 开始时候
        return resultLineWidth;
      } else {
        return resultLineWidth * 2 / 3 + this.lastLineWidth * 1 / 3; // lastLineWidth占得比重越大越平滑
      }
    },
    // 绘制直线
    drawLine(context, x1, y1, x2, y2, /*optional*/ lineWidth, /*optional*/ strokeColor) {
      /**
       * 有过涂鸦就需要发请求提交,没有则不用
       */
      if (!this.drawFlag) this.drawFlag = true

      console.log('drawLine()');
      context.beginPath();
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      console.log(y2, 'yyyyyyyyyyyyyyy');
      // context.lineTo(0,132);
      // context.lineTo(100,500);

      context.lineWidth = lineWidth;
      context.lineCap = 'round'; // 线与线交合不会产生空隙
      context.lineJoin = 'round';
      context.strokeStyle = strokeColor; // 默认笔触黑色

      context.stroke();
    },
    save() {
      if (!this.imgOnload) return
      console.log('save()');
      this.$store.commit('setVanLoading', true)
      this.canvasHistory = []
      this.imgArray = []
      if (this.imgUrl) { // 存在背景图才执行
        this.imgArray.push(this.offCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
      }
      this.imgArray.push(this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
      this.compositeGraph(this.imgArray);
    },

    /**
     * [离屏合成图]
     * @param  {[type]} imgArray   [背景图画布和涂鸦画布的地址数组]
     */
    loadImg(compositeCtx, img) {
      return new Promise((resolve, reject) => {
        img.onload = function () {
          compositeCtx.drawImage(img, 0, 0); // 循环绘制图片到离屏画布
          resolve(img);
        }
        img.onerror = function (err) {
          reject(err)
        }
      })
    },
    async compositeGraph(imgArray) {
      let compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = this.canvas.width;
      compositeCanvas.height = this.canvas.height;
      let compositeCtx = compositeCanvas.getContext('2d');
      compositeCtx.fillStyle="#fff";
      compositeCtx.fillRect(0,0,compositeCanvas.width,compositeCanvas.height);
      document.getElementsByClassName('offImgs')[0].innerHTML = ''
      console.log(imgArray,'图片数组');
      let img = new Image()
      img.src = imgArray[0]
      img.onload = () => {
        compositeCtx.drawImage(img, 0, 0);
        console.log('原图渲染完成');
        let img2 = new Image()
        img2.src = imgArray[1]
        img2.onload = async () => {
          compositeCtx.drawImage(img2, 0, 0);
          console.log('涂鸦痕迹渲染完成');
          let compositeImg = compositeCanvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
          if(compositeImg === 'data:,') {
            console.log('canvas转base64失败');
            alert('canvas转base64失败')
            return
          }
          console.log(compositeImg.length,'合成图大小(未压缩)');
          if (compositeImg.length > 307200) {
            //大于300kb需要压缩
            compositeImg = compositeCanvas.toDataURL('image/jpeg', 0.95).replace('image/jpeg', 'image/octet-stream'); // 图片格式jpeg或webp可以选0-1质量区间
          }
          await this.getOSSKey()
          let arr = compositeImg.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          this.curFile = new Blob([u8arr], { type: mime });
          this.uploadIMG(this.curFile);
        }
        img2.onerror = (err) => {
          this.$store.commit('setVanLoading', false)
          console.log(err,'涂鸦痕迹加载错误');
        }
      }
      img.onerror = (err) => {
        this.$store.commit('setVanLoading', false)
        console.log(err,'原图加载错误');
      }

      return
      // imgArray.forEach(v => {
      //   let img = new Image()
      //   img.src = v
      //   document.getElementsByClassName('offImgs')[0].appendChild(img)
      // })
      // Promise.all([this.loadImg(compositeCtx, document.querySelectorAll('.offImgs img')[0]), this.loadImg(compositeCtx, document.querySelectorAll('.offImgs img')[1])]).then(async res => {
      //
      //   let compositeImg = compositeCanvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
      //   if (compositeImg.length > 307200) {
      //     //大于300kb需要压缩
      //     compositeImg = compositeCanvas.toDataURL('image/jpeg', 0.95).replace('image/jpeg', 'image/octet-stream'); // 图片格式jpeg或webp可以选0-1质量区间
      //   }
      //
      //   await this.getOSSKey()
      //
      //   let arr = compositeImg.split(","),
      //     mime = arr[0].match(/:(.*?);/)[1],
      //     bstr = atob(arr[1]),
      //     n = bstr.length,
      //     u8arr = new Uint8Array(n);
      //   while (n--) {
      //     u8arr[n] = bstr.charCodeAt(n);
      //   }
      //   this.curFile = new Blob([u8arr], { type: mime });
      //   this.uploadIMG(this.curFile);
      // })
    },
    uploadIMG(curFile) {
      console.log('uploadIMG()');
      this.$store.commit('setVanLoading', true)
      console.log("开始上传")
      console.log(this.imgUrl.substring(0, this.imgUrl.indexOf('?')).split(this.oSSObject.host + '/')[1], 'oSSObjectoSSObjectoSSObjectoSSObjectoSSObject')
      let formData = new FormData();
      formData.append("key", this.imgUrl.substring(0, this.imgUrl.indexOf('?')).split(this.oSSObject.host + '/')[1]);
      console.log(123);
      formData.append('policy', this.oSSObject.policyBase64)
      formData.append('OSSAccessKeyId', this.oSSObject.accessid)
      formData.append('signature', this.oSSObject.signature)
      formData.append('file', curFile)
      formData.append('success_action_status', '200')

      // this.$store.commit('setVanLoading', false)
      // this.$emit('submitCb')
      // return
      uploadApi.doUpLoad(this.oSSObject.host, formData).then(data => {
        this.$store.commit('setVanLoading', false)
        this.$emit('submitCb')
      });
    },
    transRotate(x, y, _angle) {
      console.log('transRotate()');
      const { sin, cos, PI } = Math
      console.log(_angle, '_angle');
      let arc = PI * _angle / 180
      console.log(arc, 'arc');
      const width = window.document.body.offsetWidth
      const height = window.document.body.offsetHeight
      // let xr = (x - 300) * cos(-arc) - (y - 150) * sin(-arc) + 300 + 150    // X原点+屏幕高/2    270度
      // let xy = (x - 300) * sin(-arc) + (y - 150) * cos(-arc) + 150  + 150    // Y原点+屏幕高/2   270度
      const origenX = this.canvas.width / 2
      const origenY = this.canvas.height / 2
      var xr = (x - origenX * this.scale) * cos(-arc) - (y - origenY * this.scale) * sin(-arc) + origenX * this.scale     // X原点    180度/0度
      var xy = (x - origenX * this.scale) * sin(-arc) + (y - origenY * this.scale) * cos(-arc) + origenY * this.scale      // Y原点   180度/0度

      return { x: xr, y: xy }
      // return {x,y}
    },
    upDo() {
      console.log("撤销");
      if (this.canvasHistory.length == 0) {
        this.$toast('不能再撤销了')
        return
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let canvasPic = new Image();
      this.canvasHistory.pop()
      canvasPic.src = this.canvasHistory[this.canvasHistory.length - 1]

      canvasPic.onload = () => {
        this.ctx.drawImage(canvasPic, 0, 0);
      }
      // canvasPic.addEventListener('load', () => {
      //   ctx.drawImage(canvasPic, 0, 0);
      // });
    },
    rotateLeft() {
      console.log("rotateLeft()");
      // if (this.rotateIndex) {
      //   this.rotateIndex = 0
      // }
      this.rotateIndex--
      if (this.rotateIndex == -5) {
        this.rotateIndex = -1
      }

      // var angle = 90 * this.rotateIndex

      // if (angle === -270) {
      //   angle = -90
      // }

      // this.rotate = angle
      // this.swordEle.rotateZ = 90 * this.rotateIndex


      this.rotate = 90 * this.rotateIndex
      this.swordEle.rotateZ = 90 * this.rotateIndex

      // if ((this.rotate == 90 || this.rotate == -270 || this.rotate == -90 || this.rotate == 270)) {
      //   let bbox = this.canvas.getBoundingClientRect();
      //   this.lastLeft = bbox.x/this.scale
      //   this.lastTop = bbox.y/this.scale
      //   console.log(this.lastLeft, this.lastTop, '旋转过后的this.lastLeft,this.lastTop');
      // }

      // if ((this.rotate == 90 || this.rotate == -270 || this.rotate == -90 || this.rotate == 270) && this.scale == 1) {
      //   let bbox = this.canvas.getBoundingClientRect();
      //   console.log(bbox, '旋转过后的bbox');
      //   this.lastLeft = bbox.x
      //   this.lastTop = bbox.y
      //   console.log(this.lastLeft, this.lastTop, '旋转过后的this.lastLeft,this.lastTop');
      // }


      // this.ctx.rotate(30 * Math.PI / 180);//把整个画布旋转30度
      // this.clearScreen()
      // var xpos = this.canvas.width / 2;
      // var ypos = this.canvas.height / 2;

      // let canvasPic = new Image();
      // if (this.canvasHistory.length) {
      //   canvasPic.src = this.canvasHistory[this.canvasHistory.length - 1]

      // } else {
      //   canvasPic.setAttribute("crossOrigin", 'anonymous');
      //   canvasPic.src = this.imgUrl + '&' + Math.random();
      //   // canvasPic.onload = () => {
      //   //   this.ctx.drawImage(canvasPic, xpos - canvasPic.width / 2, ypos - canvasPic.height / 2);
      //   // };
      // }
      // canvasPic.onload = () => {
      //   this.offCtx.drawImage(canvasPic, xpos - canvasPic.width / 2, ypos - canvasPic.height / 2);
      //   this.ctx.save();
      //   this.ctx.translate(xpos, ypos);
      //   this.rotateIndex++
      //   if (this.rotateIndex == 5) {
      //     this.rotateIndex = 1
      //   }
      //   this.ctx.rotate(90 * this.rotateIndex * Math.PI / 180);//旋转47度
      //   this.ctx.translate(-xpos, -ypos);
      //   this.ctx.drawImage(canvasPic, xpos - canvasPic.width / 2, ypos - canvasPic.height / 2);
      //   this.ctx.restore();
      // }


    },
    rotateRight() {
      console.log("rotateRight()");

      this.rotateIndex++
      if (this.rotateIndex == 5) {
        this.rotateIndex = 1
      }
      // this.ctx.save();
      // this.ctx.translate(0, this.canvas.height);
      // // this.ctx.rotate(90 * Math.PI / 180);

      // this.ctx.restore();

      this.rotate = 90 * this.rotateIndex
      this.swordEle.rotateZ = 90 * this.rotateIndex

      // if ((this.rotate == 90 || this.rotate == -270 || this.rotate == -90 || this.rotate == 270) && this.scale == 1) {
      //   let bbox = this.canvas.getBoundingClientRect();
      //   console.log(bbox, '旋转过后的bbox');
      //   this.lastLeft = bbox.x
      //   this.lastTop = bbox.y
      //   console.log(this.lastLeft, this.lastTop, '旋转过后的this.lastLeft,this.lastTop');
      // }



    },
    containerFigure() {
      // let swordEle = document.getElementsByClassName('canvas')[0]
      // this.swordEle = document.getElementById('test')
      this.container = document.getElementById('container')
      let _this = this
      var Stage = AlloyPaper.Stage, Bitmap = AlloyPaper.Bitmap, Loader = AlloyPaper.Loader;

      Transform(_this.container)
      let bwidth, bheight, swidth, sheight;
      var initScale = 1;
      _this.container.scaleX = _this.container.scaleY = _this.scale
      _this.container.rotateZ = _this.rotate
      var af = new AlloyFinger(_this.container, {
        swipe: function (evt) {
          if (_this.isPen || _this.isRubber) return
          if (_this.isPinch) return
          console.log("滑动 start");
          evt.stopPropagation();
          switch (evt.direction) {
            case 'Left':
              _this.$emit('changeImg', 'next')
              break;
            case 'Right':
              _this.$emit('changeImg')
              break;
            default: break;
          }
          console.log("滑动 end");
        }
      });
    },
    figure() {
      // let swordEle = document.getElementsByClassName('canvas')[0]
      this.swordEle = document.getElementById('test')

      // console.log("还原");

      // this.swordEle.rotateZ = 0
      // this.rotate = 0

      let _this = this
      var Stage = AlloyPaper.Stage, Bitmap = AlloyPaper.Bitmap, Loader = AlloyPaper.Loader;

      Transform(_this.swordEle)
      let bwidth, bheight, swidth, sheight;
      var initScale = 1;
      _this.swordEle.scaleX = _this.swordEle.scaleY = _this.scale
      _this.swordEle.rotateZ = _this.rotate
      var af = new AlloyFinger(_this.swordEle, {
        touchStart: function (event) {
          if (!_this.imgOnload) return;
          if (!_this.isPen && !_this.isRubber) return
          console.log('touchStart()');
          console.log(event, 'touchStart() event');
          _this.point = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
          _this.lastCoordinate = _this.windowToCanvas(_this.point.x, _this.point.y);
          _this.lastTimestamp = new Date().getTime();
        },
        touchMove: function (event) {
          // swordEle.style.translateX += evt.deltaX;
          // swordEle.style.translateY += evt.deltaY;
          // evt.preventDefault();
          if (!_this.imgOnload) return;
          if (!_this.isPen && !_this.isRubber) return
          console.log('touchMove()');
          _this.point = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
          console.log(_this.point.x, _this.point.y);
          let curCoordinate = _this.windowToCanvas(_this.point.x, _this.point.y);
          console.log(curCoordinate.x, curCoordinate.y);
          if (_this.isPen) { // 涂鸦
            let curTimestamp = new Date().getTime();
            let s = _this.calcDistance(_this.lastCoordinate, curCoordinate); // 计算两点之间的距离
            let t = curTimestamp - _this.lastTimestamp; // 计算两点之间的时间差
            let curLineWidth = _this.caleLineWidth(s, t, _this.sizeWidth);
            _this.drawLine(_this.ctx, _this.transRotate(_this.lastCoordinate.x, _this.lastCoordinate.y, _this.rotate).x / _this.scale, _this.transRotate(_this.lastCoordinate.x, _this.lastCoordinate.y, _this.rotate).y / _this.scale, _this.transRotate(curCoordinate.x, curCoordinate.y, _this.rotate).x / _this.scale, _this.transRotate(curCoordinate.x, curCoordinate.y, _this.rotate).y / _this.scale, curLineWidth, _this.strokeColor);
            // _this.drawLine(_this.ctx, _this.lastCoordinate.x /_this.scale, _this.lastCoordinate.y/_this.scale, curCoordinate.x/_this.scale, curCoordinate.y/_this.scale, curLineWidth, _this.strokeColor);

            _this.lastCoordinate = curCoordinate; // 现在坐标替换前一个坐标
            _this.lastTimestamp = curTimestamp;
            _this.lastLineWidth = curLineWidth;
          } else if (_this.isRubber) { // 擦掉
            console.log(curCoordinate.x, curCoordinate.y, 'curCoordinate.x, curCoordinate.y');
            const { sin, cos, PI } = Math
            let arc = PI * _this.rotate / 180
            console.log(arc, 'arc');

            const origenX = _this.canvas.width / 2
            const origenY = _this.canvas.height / 2

            var xr = (curCoordinate.x - origenX * _this.scale) * cos(-arc) - (curCoordinate.y - origenY * _this.scale) * sin(-arc) + origenX * _this.scale     // X原点    180度/0度
            var xy = (curCoordinate.x - origenX * _this.scale) * sin(-arc) + (curCoordinate.y - origenY * _this.scale) * cos(-arc) + origenY * _this.scale      // Y原点

            console.log(xr, xy, 'xr,xy');
            // return
            _this.ctx.save();
            _this.ctx.beginPath();
            _this.ctx.arc(xr / _this.scale, xy / _this.scale, _this.rubberSize / 2, 0, Math.PI * 2);
            _this.ctx.clip();
            _this.ctx.clearRect(xr / _this.scale - _this.rubberSize / 2, xy / _this.scale - _this.rubberSize / 2, _this.rubberSize, _this.rubberSize); // 清除涂鸦画布内容
            _this.ctx.restore();
          }
        },
        touchEnd: function () {
          console.log('touchEnd()');
          _this.canvasHistory.push(_this.canvas.toDataURL())
          _this.$forceUpdate()
          // let strArr = swordEle.style.transform.split(',')
          // _this.rotateX = strArr[0].split('matrix3d(')[1]
          // _this.rotateY = strArr[5]
          // console.log(_this.rotateX,_this.rotateY)
        },
        touchCancel: function () {
        },
        multipointStart: function () {
          initScale = _this.swordEle.scaleX;
        },
        multipointEnd: function () {
        },
        tap: function () {
          if (!_this.imgOnload) return;
          if (_this.isPen || _this.isRubber) return
          _this.$emit('tap')
        },
        doubleTap: function () {
        },
        longTap: function () {
        },
        singleTap: function () {
        },
        rotate: function (evt) {
          if (!_this.imgOnload) return;
          if (_this.isPen || _this.isRubber) return
          // swordEle.rotateZ += evt.angle;
        },
        pinch(evt) {
          console.log("捏合start");
          if (!_this.imgOnload) return;
          clearTimeout(_this.timer)
          _this.isPinch = true
          _this.timer = setTimeout(() => {
            _this.isPinch = false
          }, 1000);
          if (_this.isPen || _this.isRubber) return
          console.log(initScale, evt.scale, evt, 'evtevt');
          _this.swordEle.scaleX = _this.swordEle.scaleY = initScale * evt.zoom;
          _this.scale = _this.swordEle.scaleX

          // let bbox = _this.canvas.getBoundingClientRect();
          // _this.lastLeft = bbox.x
          // _this.lastTop = bbox.y
          console.log("捏合end");

        },
        pressMove: function (evt) {
          if (!_this.imgOnload) return;
          if (_this.isPen || _this.isRubber) return
          let widthDiff = bwidth - swidth;
          let heightDiff = bheight - sheight;
          // if (((evt.deltaX>0)&&(swordEle.translateX >= widthDiff))||((evt.deltaY>0)&&(swordEle.translateY >= heightDiff))||((swordEle.translateX<0)&&((evt.deltaX<0)))||((swordEle.translateY<0)&&((evt.deltaY<0)))) {
          // } else {
          _this.swordEle.translateX += evt.deltaX;
          _this.swordEle.translateY += evt.deltaY;
          // }
        },
        swipe: function (evt) {
          // evt.stopPropagation();
          // switch (evt.direction) {
          //   case 'Left':
          //     _this.$emit('changeImg', 'next')
          //     break;
          //   case 'Right':
          //     _this.$emit('changeImg')
          //     break;
          //   default: break;
          // }
        }
      });
    },
    async getOSSKey() {
      console.log('getOSSKey()');
      this.$store.commit('setVanLoading', true)
      let json = {
        requestJson: JSON.stringify({
          interUser: "runLfb",
          interPwd: "25d55ad283aa400af464c76d713c07ad",
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: this.$store.getters.schoolId,
          url: this.imgUrl.substring(0, this.imgUrl.indexOf('?'))
        })
      };
      console.log('getOSSKey json', json);
      await uploadApi.stsAuthReplaceAccessUrl(json).then(data => {
        console.log('stsAuthCoverAccessUrl', data.data[0]);
        var obj = data.data[0].tokenInfo;
        var tmpSignatureObj = {
          host: obj.host,
          policyBase64: obj.policy,
          accessid: obj.accessid,
          signature: obj.signature,
          expire: parseInt(obj.expire),
          key: obj.dir + "/",
          size: obj.sizelimit
        };
        this.oSSObject = tmpSignatureObj;
      });
    },
    handleResize() {
      console.log('handleResize()xxxxxx');
      // this.offCanvas.width = window.document.body.offsetWidth
      // this.offCanvas.height = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0)
      // // offCanvas.height = $(window).height() - footerHeight;
      // this.canvas.width = window.document.body.offsetWidth
      // this.canvas.height = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0)
      console.log(this.canvas.width);
      console.log(this.canvas.height);
      // canvas.height = $(window).height() - footerHeight;
      this.clearScreen()
      this.drawImg(this.imgUrl); // 画图

      // if (this.isApp) {
      // if (this.isIphone) {
      //   // var heightA = this.canvas.width
      //   // this.canvas.width = this.canvas.height
      //   // this.canvas.height = heightA
      //   // this.offCanvas.width = this.canvas.width
      //   // this.offCanvas.height = this.canvas.height
      //   // console.log(this.canvas.width);
      //   // console.log(this.canvas.height);
      // }
    }
  },
  mounted() {
    console.log('mounted()');
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      console.log('苹果设备');
      this.isIphone = true
    }
    window.addEventListener('resize', this.handleResize)
    this.figure()

    let _this = this
    this.offCanvas = document.getElementsByClassName('offCanvas')[0] //$('.offCanvas')[0]; // 用于更换背景图
    this.offCtx = this.offCanvas.getContext('2d');
    this.canvas = document.getElementsByClassName('canvas')[0] //$('.canvas')[0]; // 用于涂鸦
    this.ctx = this.canvas.getContext('2d');
    this.clearScreen()
    // this.drawImg(this.imgUrl); // 画图
    // let lastLineWidth = -1; // 用于线光滑过度
    // let sizeWidth = 30; // 中笔触计算值
    // let strokeColor = '#000'; // 笔触颜色默认黑色
    // let imgSrc = null; // 背景图片地址
    // let imgArray = []; // 存储背景图和涂鸦图
    // let rubberSize = 25; // 存储橡皮檫大小
    // let isPen = true; // 用于判断涂鸦还是擦除
    // let footerHeight = $('.footer').height(); // 获取底部高度
    //

    // this.offCanvas.width = window.document.body.offsetWidth
    // this.offCanvas.height = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0)
    // this.canvas.width = window.document.body.offsetWidth
    // this.canvas.height = window.document.body.offsetHeight - (this.$parent.$refs['text'] ? this.$parent.$refs['text'].offsetHeight : 0)

    // this.containerFigure()



    this.$store.commit('setVanLoading', true)
    setTimeout(() => {
      this.handleResize()
      this.$store.commit('setVanLoading', false)
    }, 1000);






    // 选择颜色
    // $('.lineColors span').click(function() {
    //     strokeColor = $(this).attr('data-color'); // 获取颜色值，用于替换笔触颜色
    //     let colorName = $(this).attr('data-text'); // 获取颜色文字，用于替换操作栏文字
    //     $('.colorButton span').html(colorName); // 替换操作栏文字
    //
    //     animatePanel('.colors-panel', '-130px', '.control-button', '60px'); // 收起颜色列表显示操作栏
    // });
    // 选择大小
    // $('.lineSizes span').click(function() {
    //     sizeWidth = $(this).attr('data-lineWidth'); // 获取大小值，用于计算笔触大小
    //     let sizeName = $(this).attr('data-text'); // 获取大小文字，用于替换操作栏文字
    //     $('.sizeButton span').html(sizeName); // 替换操作栏文字
    //
    //     animatePanel('.size-panel', '-130px', '.control-button', '60px'); // 收起大小列表显示操作栏
    // });
    // canvas触摸事件
    // $('.canvas').on('touchstart', function(event) {
    //     point = { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
    //     console.log(point);
    //     lastCoordinate = windowToCanvas(point.x, point.y);
    //     lastTimestamp = new Date().getTime();
    // });
    // $('.canvas').on('touchmove', function (event) {
    //   this.point = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
    //   let curCoordinate = this.windowToCanvas(this.point.x, this.point.y);
    //   if (isPen) { // 涂鸦
    //     let curTimestamp = new Date().getTime();
    //     let s = this.calcDistance(this.lastCoordinate, curCoordinate); // 计算两点之间的距离
    //     let t = curTimestamp - lastTimestamp; // 计算两点之间的时间差
    //     let curLineWidth = this.caleLineWidth(s, t, sizeWidth);
    //
    //     this.drawLine(this.ctx, lastCoordinate.x, lastCoordinate.y, curCoordinate.x, curCoordinate.y, curLineWidth, strokeColor);
    //
    //     this.lastCoordinate = curCoordinate; // 现在坐标替换前一个坐标
    //     this.lastTimestamp = curTimestamp;
    //     this.lastLineWidth = curLineWidth;
    //   } else { // 擦掉
    //     this.ctx.save();
    //     this.ctx.beginPath();
    //     this.ctx.arc(curCoordinate.x, curCoordinate.y, this.rubberSize / 2, 0, Math.PI * 2);
    //     this.ctx.clip();
    //     this.ctx.clearRect(curCoordinate.x - this.rubberSize / 2, curCoordinate.y - this.rubberSize / 2, this.rubberSize, this.rubberSize); // 清除涂鸦画布内容
    //     this.ctx.restore();
    //   }
    // });
    // $('.canvas').on('touchend', function () {
    //   let imageSrc = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'); // 画布转换为图片地址
    //   $('.lineBox').append('<img src="' + imageSrc + '" />');
    //   let boxWidth = $('.lineBox img').length * 80; // 80为图片宽度（72）+间隔（8）
    //   $('.lineBox').css({ // 设置lineBox宽度
    //     width: boxWidth + 'px'
    //   });
    // });


    // 选择背景
    // $('.bg-panel img').click(function() {
    //     imgSrc = $(this).attr('src'); // 获取图片src
    //     drawImg(imgSrc); // 画图
    //
    //     animatePanel('.bg-panel', '-130px', '.control-button', '60px');
    // });
    // 绘制图像到画布
    // function drawImg(changeValue) {
    //     offCtx.clearRect(0, 0, canvas.width, canvas.height); // 先清除画布
    //     let changeImg = new Image();
    //     changeImg.src = changeValue;
    //     changeImg.onload = function() {
    //         offCtx.drawImage(changeImg, 0, 0, canvas.width, canvas.height);
    //     };
    // }
    // 清屏
    // $('.clearButton').click(function () {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除涂鸦画布内容
    //   _this.offCtx.clearRect(0, 0, canvas.width, canvas.height); // 清除背景图画布内容
    // });
    // 保存涂鸦效果
    // $('.saveButton').click(function () {
    //   // toDataURL兼容大部分浏览器，缺点就是保存的文件没有后缀名
    //   imgArray = []
    //   if (_this.imgUrl) { // 存在背景图才执行
    //     imgArray.push(offCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
    //   }
    //   imgArray.push(canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
    //   console.log(imgArray);
    //   compositeGraph(imgArray);
    // });


    /**
     * 模拟鼠标点击事件进行保存
     * @param  {String} data     要保存到本地的图片数据
     * @param  {String} filename 文件名
     */
    // function saveFile(data, filename) {
    //   let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    //   saveLink.href = data;
    //   saveLink.download = filename; // download只兼容chrome和firefox，需要兼容全部浏览器，只能用服务器保存
    //
    //   let event = document.createEvent('MouseEvents');
    //   event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //   saveLink.dispatchEvent(event);
    // }

    // 点击颜色按钮弹出颜色列表
    // $('.colorButton').click(function () {
    //   animatePanel('.control-button', '-60px', '.colors-panel', '130px');
    //   isPen = true; // 点击颜色时候变为涂鸦状态
    // });
    // 点击颜色列表的关闭按钮
    // $('.colors-panel .closeBtn').click(function () {
    //   animatePanel('.colors-panel', '-130px', '.control-button', '60px');
    // });
    // 点击大小按钮弹出大小列表
    // $('.sizeButton').click(function () {
    //   animatePanel('.control-button', '-60px', '.size-panel', '130px');
    //   isPen = true; // 点击大小时候变为涂鸦状态
    // });
    // 点击大小列表的关闭按钮
    // $('.size-panel .closeBtn').click(function () {
    //   animatePanel('.size-panel', '-130px', '.control-button', '60px');
    // });
    // 点击背景按钮弹出背景列表
    // $('.bgButton').click(function () {
    //   animatePanel('.control-button', '-60px', '.bg-panel', '130px');
    // });
    // 点击背景列表的关闭按钮
    // $('.bg-panel .closeBtn').click(function () {
    //   animatePanel('.bg-panel', '-130px', '.control-button', '60px');
    // });
    // 点击擦掉按钮弹出橡皮檫大小列表
    // $('.rubberButton').click(function () {
    //   animatePanel('.control-button', '-60px', '.rubber-panel', '130px');
    //   isPen = false; // 点击擦掉时候变为橡皮檫状态
    // });
    // 点击橡皮檫大小列表的关闭按钮
    // $('.rubber-panel .closeBtn').click(function () {
    //   animatePanel('.rubber-panel', '-130px', '.control-button', '60px');
    // });
    // 拖动滑动条获取数值
    // $('.rubbers .second input').on('touchmove', function () {
    //   rubberSize = $(this)[0].value;
    //   $('.rubberSize').html(rubberSize);
    // });
    // 点击历史按钮弹出历史记录列表
    // $('.historyButton').click(function () {
    //   animatePanel('.control-button', '-60px', '.history-panel', '130px');
    // });
    // 点击历史记录列表的关闭按钮
    // $('.history-panel .closeBtn').click(function () {
    //   animatePanel('.history-panel', '-130px', '.control-button', '60px');
    // });
    // 点击历史记录图片绘制到画布
    // $('.lineBox').on('click', 'img', function () { // 事件委托
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   ctx.drawImage($(this)[0], 0, 0, canvas.width, canvas.height); // 绘制点击的图片到画布
    // });


    // 底部操作栏和弹出框交互函数
    // function animatePanel(fName, fHeight, sName, sHeight) {
    //     $(fName).slideUp(300);
    //     $('.footer').animate({'bottom': fHeight}, 300);
    //     let timer = setTimeout(function() {
    //         $(sName).slideDown(500);
    //         $('.footer').animate({'bottom': 0, 'height': sHeight}, 500);
    //         timer = null;
    //     }, 0);
    // }
    // // 阻止手机滑动时拖动页面
    document.getElementsByClassName('wrapper')[0].addEventListener('touchmove', (event) => {
      event.preventDefault();

    })
    // $('.wrapper').on('touchmove', function (event) {
    //   event.preventDefault();
    // });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="less" scoped>
@import "../utils/canvas/base.css";
@import "../utils/canvas/handWriting.css";
.center-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
