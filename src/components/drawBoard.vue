<template>
  <div style="width: 100%;height: 100%;">
    <div class="wrapper" id="test">
      <canvas class="offCanvas"></canvas>
      <canvas ref="canvas" class="canvas"
      ></canvas>
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
  import  'alloyfinger/transformjs/transform'
  import AlloyPaper from 'alloyfinger/asset/alloy_paper.js'

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
        strokeColor: '#000',  //笔触颜色
        ctx: '',
        rubberSize: 25,  //橡皮擦大小
        imgArray: [],  //储存背景图和涂鸦图
        rectX: 0,
        rectY: 0,
        rectW: 0,
        rectH: 0,
      }
    },
    props: ['imgUrl','isPen','isRubber','text'],  //isPen 判断是否画笔  //isRubber  判断是否橡皮擦  //text 评语
    watch: {
      imgUrl() {
        // $('.clearButton').trigger('click')
        this.clearScreen()
        this.drawImg(this.imgUrl); // 画图
        animatePanel('.bg-panel', '-130px', '.control-button', '60px');
      },
      text(v) {
        this.ctx.font = '18px bold Adobe Heiti Std R'
        this.ctx.clearRect(this.rectX,this.rectY,this.rectW,this.rectH)
        this.ctx.fillStyle = '#ccc'
        this.rectX = this.canvas.width/2 - this.ctx.measureText(v).width/2 - 20
        this.rectY = (this.canvas.height - 70)
        this.rectW = this.ctx.measureText(v).width + 40
        this.rectH = 50
        this.ctx.fillRect(this.rectX,this.rectY,this.rectW,this.rectH)
        this.ctx.fillStyle = 'red'
        this.ctx.textAlign = "center"
        this.ctx.fillText(v,this.canvas.width/2,this.canvas.height - 40)
      }
    },
    methods: {
      clearScreen() {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清除涂鸦画布内容
          this.offCtx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清除背景图画布内容
      },
      drawImg(changeValue) {
        let a = this.$refs['canvas'].width
        let b = this.$refs['canvas'].height
        this.offCtx.clearRect(0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height); // 先清除画布
        let changeImg = new Image();
        changeImg.src = changeValue;
        changeImg.onload = () => {
          this.offCtx.drawImage(changeImg, 0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height);
        };
      },
      exit() {
        this.$emit('exit')
      },
      handleTouchstart(event) {
        this.point = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
        this.lastCoordinate = this.windowToCanvas(this.point.x, this.point.y);
        this.lastTimestamp = new Date().getTime();
      },
      handleTouchmove(event) {
        this.point = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
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
        } else if(this.isRubber) { // 擦掉
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(curCoordinate.x, curCoordinate.y, this.rubberSize / 2, 0, Math.PI * 2);
          this.ctx.clip();
          this.ctx.clearRect(curCoordinate.x - this.rubberSize / 2, curCoordinate.y - this.rubberSize / 2, this.rubberSize, this.rubberSize); // 清除涂鸦画布内容
          this.ctx.restore();
        }
      },
      handleTouchend(event) {
        let imageSrc = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'); // 画布转换为图片地址
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
        let bbox = this.canvas.getBoundingClientRect();
        return {x: x - bbox.left, y: y - bbox.top};
      },
      // 计算两点之间的距离函数
      calcDistance(lastCoordinate, curCoordinate) {
        let distance = Math.sqrt(Math.pow(curCoordinate.x - lastCoordinate.x, 2) + Math.pow(curCoordinate.y - lastCoordinate.y, 2));
        return distance;
      },
      // 根据不同速度计算线的宽度函数
      caleLineWidth(s, t, brushWidth) {
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
        context.beginPath();
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);

        context.lineWidth = lineWidth;
        context.lineCap = 'round'; // 线与线交合不会产生空隙
        context.lineJoin = 'round';
        context.strokeStyle = strokeColor; // 默认笔触黑色

        context.stroke();
      },
      save() {
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
      compositeGraph(imgArray) {
        // 下载后的文件名
        let filename = 'canvas_' + (new Date()).getTime() + '.png';

        let compositeCanvas = document.createElement('canvas');
        compositeCanvas.width = this.canvas.width;
        compositeCanvas.height = this.canvas.height;
        let compositeCtx = compositeCanvas.getContext('2d');
        document.getElementsByClassName('offImgs')[0].innerHTML = ''
        // $('.offImgs').empty()
        imgArray.forEach(v => {
          let img = new Image()
          img.src = v
          document.getElementsByClassName('offImgs')[0].appendChild(img)
        })
        // $.each(imgArray, function (index, val) {
        //   $('.offImgs').append('<img src="' + val + '" />'); // 增加img元素用于获取合成
        // });
        let _this = this
        for (let i = 0; i < document.querySelectorAll('.offImgs img').length; i++) {
          const item = document.querySelectorAll('.offImgs img')[i];
          item.onload = function () {
            compositeCtx.drawImage(item, 0, 0); // 循环绘制图片到离屏画布
            if (i >= document.querySelectorAll('.offImgs img').length - 1) {
              let compositeImg = compositeCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
              _this.$emit('exit', compositeImg)
            }
          };
        }
        // $.each($('.offImgs img'), function (index, val) {
        //   val.onload = function () {
        //     compositeCtx.drawImage(val, 0, 0); // 循环绘制图片到离屏画布
        //     if (index >= $('.offImgs img').length - 1) {
        //       let compositeImg = compositeCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        //       _this.$emit('exit', compositeImg)
        //     }
        //   };
        // });
      },
      transRotate(x,y,_angle) {
        const { sin, cos, PI } = Math
        let arc = PI * _angle / 180
        const  width = window.document.body.offsetWidth
        const height =window.document.body.offsetHeight
        // let xr = (x - 300) * cos(-arc) - (y - 150) * sin(-arc) + 300 + 150    // X原点+屏幕高/2    270度
        // let xy = (x - 300) * sin(-arc) + (y - 150) * cos(-arc) + 150  + 150    // Y原点+屏幕高/2   270度
        const  origenX = this.canvas.width / 2
        const origenY = this.canvas.height / 2
        let xr = (x - origenX*this.scale) * cos(-arc) - (y - origenY*this.scale ) * sin(-arc) + origenX*this.scale     // X原点    180度/0度
        let xy = (x - origenX*this.scale) * sin(-arc) + (y - origenY*this.scale ) * cos(-arc) + origenY*this.scale      // Y原点   180度/0度
        // const origenX = this.canvas.width / 2
        // const origenY = this.canvas.height / 2
        // let xr = (x - origenX) * cos(-arc) - (y - origenY) * sin(-arc) + origenX     // X原点-屏幕高/2    90度
        // let xy = (x - origenX) * sin(-arc) + (y - origenY) * cos(-arc) + origenY    // Y原点-屏幕高/2   90度
        console.log(this.canvas.width,this.canvas.height);
        return { x: xr, y: xy }
        // return {x,y}
      },
      figure() {
        // let swordEle = document.getElementsByClassName('canvas')[0]
        let swordEle = document.getElementById('test')
        let _this = this
        var Stage = AlloyPaper.Stage, Bitmap = AlloyPaper.Bitmap,Loader=AlloyPaper.Loader;

        Transform(swordEle)
        let bwidth, bheight, swidth, sheight;
        var initScale = 1;
        swordEle.scaleX = swordEle.scaleY = _this.scale
        swordEle.rotateZ = _this.rotate
        var af = new AlloyFinger(swordEle, {
            touchStart: function (event) {
              if(!_this.isPen&&!_this.isRubber) return
              _this.point = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
              _this.lastCoordinate = _this.windowToCanvas(_this.point.x, _this.point.y);
              _this.lastTimestamp = new Date().getTime();
              console.log('touchStart')
            },
            touchMove: function (event) {
              // swordEle.style.translateX += evt.deltaX;
              // swordEle.style.translateY += evt.deltaY;
              // evt.preventDefault();
              if(!_this.isPen&&!_this.isRubber) return
              _this.point = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
              // console.log(this.point.x,this.point.y);
              let curCoordinate = _this.windowToCanvas(_this.point.x, _this.point.y);
              if (_this.isPen) { // 涂鸦
                let curTimestamp = new Date().getTime();
                let s = _this.calcDistance(_this.lastCoordinate, curCoordinate); // 计算两点之间的距离
                let t = curTimestamp - _this.lastTimestamp; // 计算两点之间的时间差
                let curLineWidth = _this.caleLineWidth(s, t, _this.sizeWidth);
                _this.drawLine(_this.ctx, _this.transRotate(_this.lastCoordinate.x,_this.lastCoordinate.y,_this.rotate).x  /_this.scale, _this.transRotate(_this.lastCoordinate.x,_this.lastCoordinate.y,_this.rotate).y/_this.scale, _this.transRotate(curCoordinate.x,curCoordinate.y,_this.rotate).x/_this.scale, _this.transRotate(curCoordinate.x,curCoordinate.y,_this.rotate).y/_this.scale, curLineWidth, _this.strokeColor);
                // _this.drawLine(_this.ctx, _this.lastCoordinate.x /_this.scale, _this.lastCoordinate.y/_this.scale, curCoordinate.x/_this.scale, curCoordinate.y/_this.scale, curLineWidth, _this.strokeColor);

                _this.lastCoordinate = curCoordinate; // 现在坐标替换前一个坐标
                _this.lastTimestamp = curTimestamp;
                _this.lastLineWidth = curLineWidth;
              } else if(_this.isRubber) { // 擦掉
                _this.ctx.save();
                _this.ctx.beginPath();
                _this.ctx.arc(curCoordinate.x, curCoordinate.y, _this.rubberSize / 2, 0, Math.PI * 2);
                _this.ctx.clip();
                _this.ctx.clearRect(curCoordinate.x - _this.rubberSize / 2, curCoordinate.y - _this.rubberSize / 2, _this.rubberSize, _this.rubberSize); // 清除涂鸦画布内容
                _this.ctx.restore();
              }
            },
            touchEnd: function () {
              // let strArr = swordEle.style.transform.split(',')
              // _this.rotateX = strArr[0].split('matrix3d(')[1]
              // _this.rotateY = strArr[5]
              // console.log(_this.rotateX,_this.rotateY)
            },
            touchCancel: function () {
            },
            multipointStart: function () {
              initScale = swordEle.scaleX;
            },
            multipointEnd: function () {
            },
            tap: function () {
            },
            doubleTap: function () {
            },
            longTap: function () {
            },
            singleTap: function () {
            },
            rotate: function (evt) {
              if(_this.isPen||_this.isRubber) return
              // swordEle.rotateZ += evt.angle;
            },
            pinch(evt) {
              if(_this.isPen||_this.isRubber) return
              swordEle.scaleX = swordEle.scaleY = initScale * evt.scale;
              _this.scale = swordEle.scaleX
            },
            pressMove: function (evt) {
              if(_this.isPen||_this.isRubber) return
              let widthDiff = bwidth - swidth;
              let heightDiff = bheight - sheight;
              // if (((evt.deltaX>0)&&(swordEle.translateX >= widthDiff))||((evt.deltaY>0)&&(swordEle.translateY >= heightDiff))||((swordEle.translateX<0)&&((evt.deltaX<0)))||((swordEle.translateY<0)&&((evt.deltaY<0)))) {
              // } else {
                swordEle.translateX += evt.deltaX;
                swordEle.translateY += evt.deltaY;
              // }
            },
            swipe: function (evt) {
            }
          });
      }

    },
    mounted() {
      let _this = this
      this.offCanvas = document.getElementsByClassName('offCanvas')[0] //$('.offCanvas')[0]; // 用于更换背景图
      this.offCtx = this.offCanvas.getContext('2d');
      this.canvas = document.getElementsByClassName('canvas')[0] //$('.canvas')[0]; // 用于涂鸦
      this.ctx = this.canvas.getContext('2d');
      this.clearScreen()
      this.drawImg(this.imgUrl); // 画图
      // let lastLineWidth = -1; // 用于线光滑过度
      // let sizeWidth = 30; // 中笔触计算值
      // let strokeColor = '#000'; // 笔触颜色默认黑色
      // let imgSrc = null; // 背景图片地址
      // let imgArray = []; // 存储背景图和涂鸦图
      // let rubberSize = 25; // 存储橡皮檫大小
      // let isPen = true; // 用于判断涂鸦还是擦除
      // let footerHeight = $('.footer').height(); // 获取底部高度
      //
      this.offCanvas.width = window.document.body.offsetWidth
      this.offCanvas.height = window.document.body.offsetHeight
      this.canvas.width = window.document.body.offsetWidth
      this.canvas.height = window.document.body.offsetHeight
      this.figure()



      window.addEventListener('resize', () => {
        this.offCanvas.width = window.document.body.offsetWidth
        this.offCanvas.height = window.document.body.offsetHeight
        // offCanvas.height = $(window).height() - footerHeight;
        this.canvas.width = window.document.body.offsetWidth
        this.canvas.height = window.document.body.offsetHeight
        console.log(this.canvas.width);
        console.log(this.canvas.height);
        // canvas.height = $(window).height() - footerHeight;
        this.clearScreen()
        this.drawImg(this.imgUrl); // 画图
      })

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
      document.getElementsByClassName('wrapper')[0].addEventListener('touchmove',(event) => {
        event.preventDefault();

      })
      // $('.wrapper').on('touchmove', function (event) {
      //   event.preventDefault();
      // });
    }
  }
</script>

<style scoped>
  @import "../utils/canvas/base.css";
  @import "../utils/canvas/handWriting.css";
</style>
