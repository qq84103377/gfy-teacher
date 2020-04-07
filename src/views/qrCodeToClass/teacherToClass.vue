<template>
  <div class="join-class">
    <div v-if="!isSuccess" class="teacher-join">
      <van-sticky>
        <van-nav-bar title="加入班级" left-arrow @click-left="$router.back()">
        </van-nav-bar>
      </van-sticky>
      <div class="class-info">
        <h3>{{schoolName}}</h3>
        <p>{{classGrade|getGradeName}}</p>
      </div>
      <div class="formContainer">
        <van-cell-group>
          <van-cell title="用 户 名:" :value="this.$store.getters.getUserInfo.loginName"/>
          <van-cell title="老师名称:" :value="this.$store.getters.getUserInfo.userName"></van-cell>
          <van-cell title="任教科目:" class="dropdown" is-link arrow-direction="down">
            <template slot="default">
              <van-dropdown-menu>
                <van-dropdown-item @change="selectSubject" v-model="subjectType" :options="subjectList"/>
              </van-dropdown-menu>
            </template>
          </van-cell>
          <van-cell title="教材版本:" class="dropdown" is-link arrow-direction="down">
            <template slot="default">
              <van-dropdown-menu>
                <van-dropdown-item v-model="version" :options="versionList"/>
              </van-dropdown-menu>
            </template>
          </van-cell>
          <van-cell v-if="qrCodeType == 'Q01'" title="班　　级:">
            <template slot="default">
              <div class="checkbox">
                <div class="left">
                  <van-checkbox-group v-model="classResult" checked-color="#39F0DD">
                    <van-checkbox v-for="item in classList" :key="item.classId" :name="item.classId" shape="square">
                      {{item.className}}
                    </van-checkbox>
                  </van-checkbox-group>
                </div>
                <div class="right">
                  <van-checkbox-group v-model="postResult" checked-color="#39F0DD">
                    <van-checkbox v-for="item in classList" :key="item.classId" :name="item.classId" shape="square">
                      是否班主任
                    </van-checkbox>
                  </van-checkbox-group>
                </div>
              </div>
            </template>
          </van-cell>
          <van-cell v-else title="班　　级:">
            <template slot="default">
              <div class="leftClassName">
                {{className}}
              </div>
              <div class="rightCheck">
                <van-checkbox shape="square" v-model="checked" checked-color="#39F0DD">
                  是否班主任
                </van-checkbox>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      <div class="bottomBtn">
        <van-button round type="info" size="large" @click="confirmInfo()">确定</van-button>
      </div>
      <van-dialog v-model="tips" title="请确认信息是否无误再加入班级"
                  show-cancel-button
                  confirmButtonColor="#39F0DD"
                  @confirm="confirmJoinClass"
      >
        <div class="container">
          <div>学校：{{schoolName}}</div>
          <div>年级：{{classGrade|getGradeName}}</div>
          <div>学科：{{subjectTypeName}}</div>
          <div class="submitInfo">
            <div>
              班级：
            </div>
            <div class="right">
            <span v-for="(item,index) in selectedClass" :key="item.classId">
              {{item.className}}{{item.teacherType=='T01' ? '(班主任)' : '(任课老师)'}}{{index==selectedClass.length-1 ? '' : '、'}}
            </span>
            </div>
          </div>
        </div>
      </van-dialog>
    </div>
    <div v-else class="qrCodeSwipper">
      <van-sticky>
        <van-nav-bar title="" left-arrow @click-left="isSuccess=false">
        </van-nav-bar>
      </van-sticky>
      <div class="title">
        加入班级成功
      </div>
      <div>
        <van-swipe indicator-color="#13D8CD">
          <van-swipe-item v-for="item in qrCodeList" :key="item.classId">
            <div class="qrCodeBox">
              <div :id="'qrCode'+item.qrCodeId">
              </div>
              <h5>
                {{schoolName}}{{item.className}} 学生二维码
              </h5>
              <p>
                二维码的有效时间截止到{{item.expDate | formatDate}}
              </p>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="qrCodeTips">
        <p>*班主任可分享二维码让学生扫描后加入班级群</p>
        <p>*长按保存二维码</p>
        <P>*多个班级左右滑动切换班级二维码</P>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getQrcodeInfo,
    teacherAddToClass,
    studentAddToClass,
    getClassByGrade,
    getVersionBySubjectType
  } from '@/api/joinClass'
  import {getList} from '@/api/login'
  import {getYearSection} from "@/utils/filter";
  import QRCode from "qrcodejs2"
  import format from "@/api/date";


  export default {
    name: "teacherToClass",
    data() {
      return {
        subjectType: '0',
        version: '0',
        subjectTypeName:'',
        classResult: [],
        postResult: [],
        classList: [],
        versionList: [
          {text: '请选择', value: '0'}
        ],
        subjectList: [
          {text: '请选择', value: '0'}
        ],
        tips: false,
        schoolName: '',
        classGrade: '',
        selectedClass: [],
        isSuccess: false,
        qrCodeList: [],
        qrCodeType: '',  //二维码类型  Q01:年级二维码，Q02：班级二维码
        className: '',   //班级二维码情况下，班级名称
        classId: '',     //班级二维码情况下，班级ID
        checked: false,  //在班级二维码情况下，是否勾选这个班的  班主任
      }
    },
    methods: {
      // 点确定按钮，弹出详情信息展示框
      confirmInfo() {
        this.selectedClass = [];
        if (this.subjectType == '0') {
          this.$toast.fail('请选择科目！');
          return;
        }

        if (this.version == '00') {
          this.$toast.fail('该科目未配置教材版本，请重新选择科目！');
          return;
        }

        if (this.qrCodeType == 'Q01') {
          // 年级二维码
          if (this.classResult.length == 0) {
            this.$toast.fail('请选择班级！');
            return;
          } else {
            for (var i = 0; i < this.classList.length; i++) {
              if (this.classResult.includes(this.classList[i].classId)) {
                if (this.postResult.includes(this.classList[i].classId)) {
                  //teacherType   T01：班主任  T02：任课老师
                  this.classList[i]['teacherType'] = 'T01';
                } else {
                  this.classList[i]['teacherType'] = 'T02';
                }
                this.selectedClass.push(this.classList[i]);
              }
            }
          }
        } else {
          this.selectedClass = [{
            teacherType: this.checked ? 'T01' : 'T02',
            classId: this.classId,
            className: this.className
          }]
        }

        this.tips = true;

      },

      // 确认加入班级
      confirmJoinClass() {
        let classTeacherList = this.selectedClass.map(item => {
          return {
            classId: item.classId,
            teacherType: item.teacherType
          }
        });
        let json = {
          interUser: 'runLfb',
          interPwd: '25d55ad283aa400af464c76d713c07ad',
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: '24',
          classTeacherList: classTeacherList,
          schoolId: this.schoolId,
          subjectType: this.subjectType,
          textBookId: this.version,
          createCodeType: 'C01',
        }

        let params = {
          requestJson: JSON.stringify(json)
        }

        teacherAddToClass(params).then(res => {
          if (res.data) {
            let qrCodeInfos = res.data.qrCodeInfos;
            // 存在二维码信息，是班主任，跳到二维码
            if (qrCodeInfos && qrCodeInfos.length > 0) {
              this.qrCodeList = [];
              // 构成生成二维码轮播图所需数据
              for (var i = 0; i < qrCodeInfos.length; i++) {
                for (var j = 0; j < this.selectedClass.length; j++) {
                  if (qrCodeInfos[i].classId == this.selectedClass[j].classId) {
                    let tempObj = {
                      classId: qrCodeInfos[i].classId,
                      className: this.selectedClass[j].className,
                      qrCodeId: qrCodeInfos[i].qrCodeId,
                      expDate: qrCodeInfos[i].expDate
                    }
                    this.qrCodeList.push(tempObj)
                  }
                }
              }
              console.log('process.env.VUE_APP_HOST', process.env.VUE_APP_HOST)
              this.isSuccess = true;
              for (let i = 0; i < this.qrCodeList.length; i++) {
                this.$nextTick(function () {
                  let url = `${process.env.VUE_APP_HOST}/#/qrCode?id=${this.qrCodeList[i].qrCodeId}`;
                  let elementId = `qrCode${this.qrCodeList[i].qrCodeId}`;
                  this.renderQrcode(elementId, url);

                  // 把canvas转为img格式
                  let MyCanvas = document.querySelectorAll(`#${elementId} canvas`)[0];
                  let img = this.convertCanvasToImage(MyCanvas);

                  // 清空原有canvas  将img插入二维码容器
                  document.querySelectorAll(`#${elementId}`)[0].innerHTML = '';
                  document.querySelectorAll(`#${elementId}`)[0].appendChild(img);
                })
              }
            } else {
              // 不是班主任，跳到成功页面
              let tempObj = {
                type: 'F04',
                msg: '加入班级成功'
              }
              window.localStorage.setItem('statusType', JSON.stringify(tempObj));
              this.$router.push('/statusPage')
            }
          } else {
            // 加入失败
            let tempObj = {
              type: 'F02',
              msg: res.msg
            }
            window.localStorage.setItem('statusType', JSON.stringify(tempObj));
            this.$router.push('/statusPage')
          }
        })
      },

      // 查询二维码的信息
      getQrcodeInfo() {
        let json = {
          'interUser': 'runLfb',
          'interPwd': '25d55ad283aa400af464c76d713c07ad',
          operateAccountNo: this.$store.getters.getUserInfo.accountNo,
          belongSchoolId: '24',
          qrCodeId: '1001',
        }

        let params = {
          requestJson: JSON.stringify(json)
        }
        getQrcodeInfo(params).then(res => {
          if (res.data) {
            if (res.data) {
              this.schoolName = res.data.schoolInfo.schoolName;
              this.classGrade = res.data.qrCodeInfo.classGrade;
            }
          }
        })
      },

      // 选择科目
      selectSubject(val) {
        console.log('selectSubject', val);
        if (val == '0') {
          return;
        }
        this.subjectTypeName = this.subjectList.filter(item=>{
          return item.value == val
        })[0].text;

        this.getVersionList(val)
      },
      // 获取学科列表
      getSubjectList() {
        const json = {
          requestJson: JSON.stringify({
            interUser: "123",
            interPwd: "123",
            dictCode: "Domain_Subject_Type"
          })
        };
        getList(json).then(res => {
          if (res.flag) {
            this.subjectList = res.data[0].sysDictInfoList.filter(item => {
              return item.dictKey !== 'S00' && item.dictKey !== 'S99'
            }).map(function (item) {
              return {
                text: item.dictValue,
                value: item.dictKey
              };
            });
            var temp = {
              text: "请选择",
              value: "0"
            };
            this.subjectList.unshift(temp);
            this.subjectType = this.subjectList[0].value;
          }
        });
      },

      // 根据学科获取教材版本
      getVersionList(subjectType) {
        const json = {
          requestJson: JSON.stringify({
            interUser: "123",
            interPwd: "123",
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            subjectType: subjectType,
            yearSection: getYearSection(this.classGrade)
          })
        };
        getVersionBySubjectType(json).then(res => {
          if (res.flag) {
            if (res.data && res.data.length > 0) {
              this.versionList = res.data.map(function (item) {
                return {
                  text: item.textBookName,
                  value: item.textBookId
                };
              });
              this.version = this.versionList[0].value;
            } else {
              this.versionList = [
                {text: '未配置教材版本', value: '00'}
              ]
              this.version = this.versionList[0].value;
            }

          } else {
            this.$toast.fail(res.msg);
          }
        });
      },

      // 查询班级
      getClassByGrade() {
        const json = {
          requestJson: JSON.stringify({
            interUser: "123",
            interPwd: "123",
            operateAccountNo: this.$store.getters.getUserInfo.accountNo,
            belongSchoolId: this.$store.getters.schoolId,
            classGrade: this.classGrade,
            schoolId: this.schoolId,
            statusCd: 'S01'
          })
        };
        getClassByGrade(json).then(res => {
          console.log(res)
          this.classList = res.data;
        })
      },

      //  生成二维码
      renderQrcode(elementId, url) {
        let qrcode = new QRCode(elementId, {
          width: 220,
          height: 220,        // 高度
          text: url,         // 二维码内容
          // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f',   // 背景色
          // foreground: '#ff0'    // 前景色
        })
      },

      // 把canvas转换为图片
      convertCanvasToImage(canvas) {
        var image = new Image();
        // 指定格式 PNG
        image.src = canvas.toDataURL("image/png"); // canvas.toDataURL 返回的是一串Base64编码的URL
        return image;
      }
    },
    filters: {
      formatDate(value) {
        if (value) {
          let date = new Date(value);
          return format.formatDate(date, "yyyy-MM-dd hh:mm");
        } else {
          return '--'
        }
      },
    },
    mounted() {
      this.getSubjectList();
      let schoolInfo = JSON.parse(window.localStorage.getItem('schoolInfo'));
      this.schoolName = schoolInfo.schoolName;
      this.classGrade = schoolInfo.classGrade;
      this.schoolId = schoolInfo.schoolId;
      this.qrCodeType = schoolInfo.qrCodeType;
      if (this.qrCodeType == 'Q02') {
        this.className = schoolInfo.className;
        this.classId = schoolInfo.classId;
      } else {
        this.getClassByGrade()
      }
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~">>>";
  .join-class {
    background-color: #F7F6FD;

    .teacher-join {
      .class-info {
        padding: 25px 0;
        color: #000;
        text-align: center;

        h3 {
          font-size: 23px;
          margin-bottom: 15px;
        }

        p {
          font-size: 15px;
        }

      }

      .formContainer {
        margin-bottom: 70px;

        @{deep} .van-cell {
          .van-cell__value {
            flex: 3;

            .checkbox {
              display: flex;
              justify-content: space-between;

              .left {
                flex: 1;
                overflow: hidden;
              }

              .right {
                padding-left: 20px;
              }


              .van-checkbox {
                margin-bottom: 10px;
                height: 40px;

                .van-checkbox__label {
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
              }
            }

            .leftClassName {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .rightCheck {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }


          }

          &.dropdown {
            padding-top: 0;
            padding-bottom: 0;

            .van-cell__title {
              display: flex;
              align-items: center;
            }

            .van-cell__value {
              padding-right: 0;

              .van-dropdown-menu {
                /*padding-right: 20px;*/

                .van-dropdown-item__content {
                  padding-top: 10px;

                  .van-cell__value {
                    flex: 1;
                  }

                  .van-cell__title {
                    flex: 3;
                  }
                }

                .van-dropdown-menu__item {
                  z-index: 9;
                  justify-content: flex-end;

                  .van-dropdown-menu__title {
                    padding-right: 0;
                    color: #969799;

                    .van-ellipsis {
                      padding-right: 20px;
                      /*color: #333;*/
                    }

                    &:after {
                      display: none !important;
                    }
                  }
                }

                &:after {
                  border: none !important;
                }

              }
            }

            i {
              position: absolute;
              right: 15px;
              top: 50%;
              transform: translateY(-50%);
            }

          }
        }

      }

      .bottomBtn {
        width: 100%;
        padding: 10px 10px;
        position: fixed;
        bottom: 0;
        background-color: #F7F6FB;
      }

      @{deep} .van-dialog {
        .van-dialog__content {
          .container {
            padding: 20px;

            div {
              margin-bottom: 20px;

              &.submitInfo {
                display: flex;
                justify-content: space-between;

                .right {
                  flex: 1;
                }
              }
            }
          }
        }
      }
    }

    .qrCodeSwipper {
      .title {
        text-align: center;
        font-size: 24px;
        color: #000;
        padding: 25px 0;
      }

      @{deep} .van-swipe {
        width: 300px;
        margin: 0 auto;

        .qrCodeBox {
          text-align: center;
          background-color: #fff;
          padding: 30px 0;
          margin-bottom: 30px;

          img {
            width: 220px;
            height: 220px;
            margin: 0 auto;
            z-index: 999 !important;
            pointer-events: all;
          }

          h5 {
            font-size: 18px;
            color: #333;
            margin-top: 15px;
            margin-bottom: 10px;
          }

          p {
            color: #999;
            font-size: 12px;
          }
        }

        .van-swipe__indicator {
          background-color: #ddd;
        }
      }

      .qrCodeTips {
        width: 300px;
        margin: 10px auto;

        p {
          font-size: 12px;
          color: #666;
          line-height: 22px;
        }
      }

    }
  }

</style>
