<template>
  <section class="task-stat-wrap">
    <van-cell title="资源类型" style="background: #f5f5f5;color: #999"/>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="学生任务统计" name="1">
        <div class="van-hairline--bottom">
          <div class="echart-label">各类任务数分布情况:</div>
          <div id="myChart1" ref="myChart1" class="pie-chart"></div>
        </div>
        <div class="mgt10 van-hairline--bottom">
          <div class="echart-label">
            <div class="aic jcsb"><span>任务完成情况分布:</span>
              <div class="tag">人数</div>
            </div>
          </div>
          <div id="myChart2" ref="myChart2" class="histogram-chart"></div>
        </div>
        <div class="mgt10">
          <div class="echart-label">学生任务完成情况</div>
          <div class="fs10 grey9 mgt5 aic jcsb">
            <span>（需要查看更加详细的数据，请登录PC端）</span>
            <i @click="exportExcel" class="iconGFY icon-download-blue"></i>
          </div>
          <div v-if="stuStatInfo.statAccountList.length">
            <div class="stat-table">
              <div class="col">
                <div style="font-weight: bold;">姓名</div>
                <div v-for="(item,index) in stuStatInfo.statAccountList" :key="index">
                  {{item.account_no|getStudentName(item.class_id)}}
                </div>
              </div>
              <div class="row-wrap">
                <div class="row" style="font-weight: bold;">
                  <div style="flex: 0 0 33.3%">总任务数</div>
                  <div style="flex: 0 0 33.3%">完成总任务数</div>
                  <div style="flex: 0 0 33.3%">完成微课程任务数</div>
                  <div style="flex: 0 0 33.3%">完成素材任务数</div>
                  <div style="flex: 0 0 33.3%">完成试卷任务数</div>
                  <div style="flex: 0 0 33.3%">完成讨论任务数</div>
                  <div style="flex: 0 0 33.3%" v-if="filterParams.subjectType === 'S03'">完成口语任务数</div>
                  <div style="flex: 0 0 33.3%">做题正确率</div>
                  <div style="flex: 0 0 33.3%">任务完成率</div>
                </div>
                <div class="row" v-for="(item,index) in stuStatInfo.statAccountList" :key="index">
                  <div style="flex: 0 0 33.3%">{{item.total_count}}</div>
                  <div style="flex: 0 0 33.3%">{{item.total_finish}}</div>
                  <div style="flex: 0 0 33.3%">{{item.tv_count}}</div>
                  <div style="flex: 0 0 33.3%">{{item.T04_count}}</div>
                  <div style="flex: 0 0 33.3%">{{item.paper_count}}</div>
                  <div style="flex: 0 0 33.3%">{{item.discuss_count}}</div>
                  <div style="flex: 0 0 33.3%" v-if="filterParams.subjectType === 'S03'">{{item.T13_count}}</div>
                  <div style="flex: 0 0 33.3%">{{item.accuracy || 0}}</div>
                  <div style="flex: 0 0 33.3%">{{item.finish_precent}}</div>
                </div>
              </div>
            </div>
            <div class="tip">可在表格内滑动，查看学生更多任务情况</div>
          </div>
          <div v-if="!stuStatInfo.statAccountList.length" class="empty-page">
            <img style="width: 70%;" src="../../assets/img/empty-2.png" alt/>
            <div class="grey9 fs12">当前没有数据~</div>
          </div>
        </div>

      </van-collapse-item>
      <van-collapse-item title="教师统计" name="2">
        <div>
          <div class="stat-table">
            <div class="col bg">
              <div style="font-weight: bold;">姓名</div>
              <div :class="{active:item.active}" v-for="(item,index) in tchStatInfo" :key="index">{{item.teacherName}}
              </div>
            </div>
            <div class="row-wrap blank-right">
              <div class="row" style="font-weight: bold;">
                <div>已结束课程</div>
                <div>课前任务数</div>
                <div>学生课前完成率</div>
                <div>随堂任务数</div>
                <div>已结束任务</div>
                <div>学生任务完成率</div>
              </div>
              <div class="row" v-for="(item,index) in tchStatInfo" :key="index">
                <div>{{item.courseNum}}</div>
                <div>{{item.outsideClassNum}}</div>
                <div>{{item.outsideClassPrecent}}</div>
                <div>{{item.insideClassNum}}</div>
                <div>{{item.taskNum}}</div>
                <div>{{item.finish_precent}}</div>
              </div>
            </div>
            <div class="col bg fixed-right">
              <div style="font-weight: bold;">课堂次数</div>
              <div @click="selectClassCount(item)" :class="{active:item.active}" v-for="(item,index) in tchStatInfo"
                   :key="index">{{item.classroomCount}}
              </div>
            </div>
          </div>
          <div class="tip">
            <div>1.可在表格白色区域内左右滑动查看更多信息</div>
            <div>2.点击学生课堂次数查看展开课堂情况</div>
          </div>
        </div>
        <div v-if="showClassDetail" class="van-hairline--top mgt10 pdt10">
          <div class="echart-label">课堂情况</div>
          <div class="stat-table narrow">
            <div class="col bg">
              <div style="font-weight: bold;">序号</div>
              <div v-for="index in classDetailList.length" :key="index">{{index}}</div>
            </div>
            <div class="row-wrap blank-right">
              <div class="row" style="font-weight: bold;">
                <div>课程名</div>
                <div>班级</div>
                <div>上课时间</div>
                <div>下课时间</div>
                <div>上课时长</div>
              </div>
              <div class="row" v-for="(item,index) in classDetailList" :key="index">
                <div>{{item.courseName}}</div>
                <div>{{item.className}}</div>
                <div>{{item.beginDate|formatTime}}</div>
                <div>{{item.endDate|formatTime}}</div>
                <div>{{item.duration|formathms}}</div>
              </div>
            </div>
            <div class="col bg fixed-right">
              <div style="font-weight: bold;">交互次数</div>
              <div @click="selectMutual(item)" :class="{active:item.active}" v-for="(item,index) in classDetailList"
                   :key="index">{{item.detailCount}}
              </div>
            </div>
          </div>
          <div class="tip">
            <div>1.可在表格白色区域内左右滑动查看更多信息</div>
            <div>2.点击交互次数查看交互功能和详情</div>
          </div>

        </div>
        <div class="van-hairline--top mgt10 pdt10" v-show="showMutual">
          <div class="echart-label">交互功能</div>
          <div style="text-align: center;">交互情况统计</div>
          <div id="myChart3" ref="myChart3" class="histogram-chart"></div>

        </div>
        <div class="van-hairline--top mgt10 pdt10" v-show="showMutual">
          <div class="echart-label">交互详情</div>
          <div class="stat-table">
            <!--    <div class="row-wrap">-->
            <div class="row" style="font-weight: bold;">
              <div style="flex: 0 0 22%;background: #E0FFFC;">操作类型</div>
              <div style="flex: 0 0 39%">时间</div>
              <div style="flex: 0 0 39%">备注</div>
            </div>
            <div class="row" v-for="(item,index) in mutualInfoList" :key="index">
              <div class="mh44" style="flex: 0 0 22%;background: #E0FFFC;height: auto;">
                {{item.operateType|mutualType}}
              </div>
              <div class="mh44" style="flex: 0 0 39%;height: auto;">{{item.operateDate|formatTime}}</div>
              <div class="mh44" style="flex: 0 0 39%;height: auto;">{{item.remark}}</div>
            </div>
            <!--    </div>-->
          </div>

        </div>
      </van-collapse-item>
      <van-collapse-item v-if="handleShowItem()" title="班级统计" name="3">
        <div class="stat-table">
          <div class="row-wrap" style="margin-left: 0;border-left: 1px solid #eee;">
            <div class="row" style="font-weight: bold;">
              <div style="flex: 0 0 25%">班级</div>
              <div style="flex: 0 0 25%">已结束课程</div>
              <div style="flex: 0 0 25%">已结束任务数</div>
              <div style="flex: 0 0 25%">已完成任务数</div>
              <div style="flex: 0 0 25%">学生任务完成率</div>
              <div style="flex: 0 0 25%">课前任务数</div>
              <div style="flex: 0 0 25%">学生课前完成率</div>
              <div style="flex: 0 0 25%">随堂任务数</div>
            </div>
            <div class="row" v-for="(item,index) in classStatList" :key="index">
              <div style="flex: 0 0 25%;line-height: 1">{{item.className}}</div>
              <div style="flex: 0 0 25%">{{item.course_count}}</div>
              <div style="flex: 0 0 25%">{{item.task_count}}</div>
              <div style="flex: 0 0 25%">{{item.task_finish}}</div>
              <div style="flex: 0 0 25%">{{item.finish_precent}}</div>
              <div style="flex: 0 0 25%">{{item.outsideClassNum}}</div>
              <div style="flex: 0 0 25%">{{item.outsideClassPrecent}}</div>
              <div style="flex: 0 0 25%">{{item.insideClassNum}}</div>
            </div>
          </div>
        </div>
        <div class="tip">可在表格内滑动，查看学生更多任务情况</div>

      </van-collapse-item>
      <van-collapse-item title="个人统计" name="4">
        <div class="stat-table">
          <div class="row-wrap" style="margin-left: 0;border-left: 1px solid #eee;">
            <div class="row" style="font-weight: bold;">
              <div style="flex: 0 0 25%">班级</div>
              <div style="flex: 0 0 25%">已结束课程</div>
              <div style="flex: 0 0 25%">课前任务数</div>
              <div style="flex: 0 0 25%">学生课前完成率</div>
              <div style="flex: 0 0 25%">随堂任务数</div>
              <div style="flex: 0 0 25%">已结束任务数</div>
              <!--              <div style="flex: 0 0 25%">已完成任务数</div>-->
              <div style="flex: 0 0 25%">学生任务完成率</div>
            </div>
            <div class="row" v-for="(item,index) in personStatList" :key="index">
              <div style="flex: 0 0 25%;line-height: 1">{{item.className}}</div>
              <div style="flex: 0 0 25%">{{item.course_count}}</div>
              <div style="flex: 0 0 25%">{{item.outsideClassNum}}</div>
              <div style="flex: 0 0 25%">{{item.outsideClassPrecent}}</div>
              <div style="flex: 0 0 25%">{{item.insideClassNum}}</div>
              <div style="flex: 0 0 25%">{{item.task_count}}</div>
              <!--              <div style="flex: 0 0 25%">{{item.task_finish}}</div>-->
              <div style="flex: 0 0 25%">{{item.finish_precent}}</div>
            </div>
          </div>
        </div>
        <div class="tip">可在表格内滑动，查看学生更多任务情况</div>
      </van-collapse-item>
    </van-collapse>
  </section>
</template>

<script>
  import {
    statCourseByTeacher,
    statByTeacher,
    getClassroomInfoByTeacher,
    getClassroomDetailInfo,
    statByClass,
    statByPersonal
  } from '@/api/index'
  import echarts from "echarts";
  import {mutualType, getStudentName} from '@/utils/filter'
  import Blob from '@/utils/excel/Blob'
  import {export_json_to_excel} from '@/utils/excel/Export2Excel'

  export default {
    name: "taskStat",
    data() {
      return {
        activeNames: ['1'],
        gradeSubjectList: JSON.parse(JSON.stringify(this.$parent.gradeSubjectList)),
        stuStatInfo: {taskTypeCount: [], finishStat: {}, statAccountList: []},
        tchStatInfo: [],
        classDetailList: [],
        showClassDetail: false,
        showMutual: false,
        mutualInfoList: [],
        classStatList: [],
        personStatList: [],
      }
    },
    computed: {
      filterParams() {
        return {
          classGrade: this.gradeSubjectList[this.$parent.gradeIndex].classGrade,
          subjectType: this.gradeSubjectList[this.$parent.gradeIndex].subjectType,
          classId: this.$parent.classIndex || ''
        }
      }
    },
    watch: {
      filterParams: {
        handler() {
          this.init()
        },
        deep: true
      }
    },
    created() {

    },
    mounted() {
      this.init()
    },
    methods: {
      //读取文件
      readFile(fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function () {
            // alert(this.result);
          };
          reader.readAsText(file);
        }, () => {

        });
      },
      //创建并写入文件
      createAndWriteFile(dataObj) {
        //持久化数据保存
        // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
        //
        //   console.log('打开的文件系统: ' + fs.name);
        //   fs.root.getFile("学生任务完成情况.xlsx", {create: true, exclusive: false},
        //     (fileEntry) => {
        //
        //       console.log("是否是个文件？" + fileEntry.isFile.toString());
        //       //写入文件
        //       this.writeFile(fileEntry, dataObj);
        //
        //     }, this.onErrorCreateFile);
        //
        // }, this.onErrorLoadFs);
        var that = this
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
          console.log('打开的文件系统: ' + fs.name);
          fs.root.getDirectory('gaofenyun', {create: true}, function (dirEntry) {
            dirEntry.getDirectory('counter', {create: true}, function (subDirEntry) {
              subDirEntry.getFile("学生任务完成情况.xlsx", {create: true, exclusive: false}, function (fileEntry) {
                fileEntry.name == '学生任务完成情况.xlsx';
                fileEntry.fullPath == 'gaofenyun/counter/学生任务完成情况.xlsx';
                //文件内容
                //写入文件
                console.log(fileEntry)
                that.writeFile(fileEntry, dataObj);
              }, that.onErrorCreateFile);
            }, that.onErrorGetDir);
          }, that.onErrorGetDir);
        }, that.onErrorLoadFs);
      },

      //将内容数据写入到文件中
      writeFile(fileEntry, dataObj) {
        let _this = this
        //创建一个写入对象
        fileEntry.createWriter(function (fileWriter) {

          //文件写入成功
          fileWriter.onwriteend = function () {
            _this.$store.commit('setVanLoading',false)
            console.log("Successful file write...");
            console.log(fileEntry);
            console.log(fileEntry.nativeURL,'fileEntry.toInternalURL()');
            cordova.plugins.fileOpener2.showOpenWithDialog(
                fileEntry.nativeURL,
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                function onSuccess(data) {
                  console.log("成功预览:" );
                },
                function onError(error) {
                  // console.log(
                  //   "出错！请在" +
                  //   cordova.file.externalDataDirectory +
                  //   "目录下查看"
                  // );
                  _this.$toast(`请在${fileEntry.toInternalURL()}目录下查看`)
                }
            );
          };

          //文件写入失败
          fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
            this.$store.commit('setVanLoading',false)
            console.log("Failed file read: " + e.toString());
            this.$toast("文件写入失败！")
          };

          //写入文件
          fileWriter.write(dataObj);
        });


        // fileEntry.createWriter((fileWriter) => {
        //
        //   //文件写入成功
        //   fileWriter.onwriteend = () => {
        //     this.$store.commit('setVanLoading',false)
        //     console.log("Successful file read...");
        //     console.log(fileEntry.toInternalURL(),'fileEntry.toInternalURL()');
        //     cordova.plugins.fileOpener2.showOpenWithDialog(
        //       fileEntry.toInternalURL(),
        //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        //       function onSuccess(data) {
        //         console.log("成功预览:" );
        //       },
        //       function onError(error) {
        //         // console.log(
        //         //   "出错！请在" +
        //         //   cordova.file.externalDataDirectory +
        //         //   "目录下查看"
        //         // );
        //         _this.$toast(`请在${fileEntry.toInternalURL()}目录下查看`)
        //       }
        //     );
        //   };
        //
        //   //文件写入失败
        //   fileWriter.onerror = (e) => {
        //     this.$store.commit('setVanLoading',false)
        //     console.log("Failed file read: " + e.toString());
        //     this.$toast("文件写入失败！")
        //   };
        //
        //   //写入文件
        //   fileWriter.write(dataObj);
        // });
      },

      //文件创建失败回调
      onErrorCreateFile(error) {
        this.$store.commit('setVanLoading',false)
        console.log("文件创建失败！")
        this.$toast("文件创建失败！")
      },

      //FileSystem加载失败回调
      onErrorLoadFs(error) {
        this.$store.commit('setVanLoading',false)
        console.log("文件系统加载失败！")
        this.$toast("文件系统加载失败！")
      },
      onErrorGetDir(error){
        this.$store.commit('setVanLoading',false)
        console.log("目录创建失败！")
        this.$toast("目录创建失败！")
      },


      exportExcel() {
        this.$store.commit('setVanLoading',true)
        require.ensure([], () => {
          let tHeader = ['姓名', '总任务数', '完成总任务数', '完成微课程任务数', '完成素材任务数', '完成试卷任务数', '完成讨论任务数', '做题正确率', '任务完成率'];
          let filterVal = ['stuName', 'total_count', 'total_finish', 'tv_count', 'T04_count', 'paper_count', 'discuss_count', 'accuracy', 'finish_precent'];
          if (this.filterParams.subjectType === 'S03') {
            tHeader.splice(-2, 0, '完成口语任务数')
            filterVal.splice(-2, 0, 'T13_count')
          }
          // 上面设置Excel的表格第一行的标题
          // 上面的index、nickName、name是tableData里对象的属性
          const list = this.stuStatInfo.statAccountList.map(v => {
            return {...v, accuracy: v.accuracy || 0, stuName: getStudentName(v.account_no, v.class_id)}
          })
          const data = this.formatJson(filterVal, list);
          const blob = export_json_to_excel(tHeader, data, '学生任务完成情况');
          this.createAndWriteFile(blob)
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      handleShowItem() {
        if (this.$parent.classIndex > 0 && this.filterParams.subjectType) {
          const item = JSON.parse(localStorage.classMap)[this.$parent.classIndex].teacherInfoList.find(v => v.subjectType === this.filterParams.subjectType)
          if (item) {
            return item.teacherType === 'T01'
          } else {
            return true
          }
        } else {
          return true
        }
      },
      statByPersonal() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          startDate: this.$parent.filterTime.start,
          endDate: this.$parent.filterTime.end,
          pageSize: '999',
          currentPage: '1',
          ...this.filterParams,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        statByPersonal(params).then(res => {
          if (res.flag) {
            this.personStatList = res.data.length ? res.data[0].classCoureStat : []
          } else {
            this.$toast(res.msg)
          }
        })
      },
      statByClass() {
        if (!this.handleShowItem()) return
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          classId: this.filterParams.classId,
          classGrade: this.filterParams.classGrade,
          startDate: this.$parent.filterTime.start,
          endDate: this.$parent.filterTime.end,
          pageSize: '999',
          currentPage: '1',
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        statByClass(params).then(res => {
          if (res.flag) {
            this.classStatList = res.data.length ? res.data[0].classCoureStat : []
          } else {
            this.$toast(res.msg)
          }
        })
      },
      getClassroomDetailInfo(appClassroomId) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          appClassroomId
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassroomDetailInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.mutualInfoList = res.data || []
            this.drawMutualHistogram()
          } else {
            this.$toast(res.msg)
          }
        })
      },
      selectMutual(item) {
        if (item.detailCount <= 0) return this.$toast('此课堂无交互详情')
        if (item.active) return
        this.showMutual = true
        this.classDetailList.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        this.getClassroomDetailInfo(item.appClassroomId)
      },
      selectClassCount(item) {
        if (item.classroomCount <= 0) return this.$toast('此老师未上课,暂无详情')
        if (item.active) return
        this.showClassDetail = true
        this.showMutual = false
        this.tchStatInfo.forEach(v => {
          this.$set(v, 'active', false)
        })
        this.$set(item, 'active', true)
        this.getClassroomInfoByTeacher(item.teacherNo)
      },
      getClassroomInfoByTeacher(accountNo) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectTypeList: this.filterParams.subjectType,
          beginDate: this.$parent.filterTime.start,
          endDate: this.$parent.filterTime.end,
          pageSize: '999',
          currentPage: 1,
          accountNo,
          classIdList: this.filterParams.classId,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassroomInfoByTeacher(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.classDetailList = res.data || []
          } else {
            this.$toast(res.msg)
          }
        })
      },
      statByTeacher() {
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectType: this.filterParams.subjectType,
          classGrade: this.filterParams.classGrade,
          startDate: this.$parent.filterTime.start,
          endDate: this.$parent.filterTime.end,
          pageSize: '999',
          currentPage: 1,
          classIds: this.filterParams.classId,
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        statByTeacher(params).then(res => {
          if (res.flag) {
            this.tchStatInfo = res.data
            //获取教师统计数据后,要将查看过的教师详情收起
            this.showClassDetail = false
            this.showMutual = false
          } else {
            this.$toast(res.msg)
          }
        })
      },
      async init() {
        this.statByTeacher()
        this.statByClass()
        this.statByPersonal()
        await this.statCourseByTeacher()
        this.drawPie()
        this.drawHistogram()
      },
      drawMutualHistogram() {
        var myChart = echarts.init(document.getElementById('myChart3'));
        // 指定图表的配置项和数据
        let arr = []
        this.mutualInfoList.forEach(v => {
          const index = arr.findIndex(item => item.operateType === v.operateType)
          if (index > -1) {
            arr[index].count++
          } else {
            arr.push({name: mutualType(v.operateType), count: 1, operateType: v.operateType})
          }
        })
        var paperOption = {
          calculable: true,
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 30
            }
          ],
          grid: {
            top: '15%',
            left: '0%',
            right: '4%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            data: arr.map(v => v.name),
            axisLabel: {
              // fontSize: 6,
              interval: 0
            },
          },
          yAxis: {},
          series: [
            {
              name: '次数',
              type: 'bar',
              data: arr.map(v => v.count),
              itemStyle: {
                normal: {
                  color: '#FEB524'
                },
              }
            }
          ],
        };
        myChart.setOption(paperOption, true);
      },
      drawHistogram() {
        var myChart = echarts.init(document.getElementById('myChart2'));
        // 指定图表的配置项和数据
        var paperOption = {
          calculable: true,
          grid: {
            top: '15%',
            left: '0%',
            right: '4%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            data: ['0-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            axisLabel: {
              // fontSize: 6,
              interval: 0
            },
          },
          yAxis: {},
          series: [
            {
              name: '人数',
              type: 'bar',
              data: [this.stuStatInfo.finishStat['finish_0_50'] || 0, this.stuStatInfo.finishStat['finish_50_60'] || 0, this.stuStatInfo.finishStat['finish_60_70'] || 0, this.stuStatInfo.finishStat['finish_70_80'] || 0, this.stuStatInfo.finishStat['finish_80_90'] || 0, this.stuStatInfo.finishStat['finish_90_100'] || 0],
              itemStyle: {
                normal: {
                  color: '#FEB524'
                },
              }
            }
          ],
        };
        myChart.setOption(paperOption, true);
      },
      drawPie() {
        let myChart = echarts.init(this.$refs.myChart1);
        // 绘制图表
        var _option = {
          calculable: true,
          color: ['#B3E850', '#67E0A3', '#F792F3', '#FCA361', '#FBDD31', '#74F8E1', '#f00', '#2736F7'],
          series: [
            {
              name: '文言文全章复习与巩固',
              type: 'pie',
              radius: [0, 53],
              label: {
                emphasis: {
                  show: true
                },
                position: 'outside',
                formatter: `{b}`,
                align: 'left'
              },
              labelLine: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#ccc',
                }
              },
              data: this.stuStatInfo.taskTypeCount.length ? this.stuStatInfo.taskTypeCount.map(v => {
                return {value: v.taskTypeCount, name: v.taskTypeName}
              }) : [{value: 0, name: '无数据'}]
            }
          ],
          // toolbox: {
          // 	show: true,
          // 	feature: {
          // 		mark: {show: true},
          // 		dataView: {show: true, readOnly: false},
          // 		magicType: {
          // 			show: true,
          // 			type: ['pie', 'funnel']
          // 		},
          // 		restore: {show: true},
          // 		saveAsImage: {show: true}
          // 	}
          // }
        };
        myChart.setOption(_option, true)
      },
      async statCourseByTeacher() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectTypeNot: 'S20',
          startDate: this.$parent.filterTime.start,
          endDate: this.$parent.filterTime.end,
          ...this.filterParams
        };
        let params = {
          requestJson: JSON.stringify(obj)
        }
        await statCourseByTeacher(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag && res.data[0]) {
            this.stuStatInfo = res.data[0]
          } else {
            this.$toast(res.msg)
            this.stuStatInfo = {taskTypeCount: [], finishStat: {}, statAccountList: []}
          }

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .task-stat-wrap {
    .echart-label {
      font-size: 15px;
      color: #333;
      font-weight: bold;
      line-height: 22px;

      &:after {
        width: 30px;
        height: 2px;
        background: @blue;
        display: block;
        content: ' ';
      }

      .tag {
        font-size: 10px;

        &:before {
          background: #FEB524;
          vertical-align: middle;
          content: ' ';
          width: 20px;
          height: 10px;
          margin-right: 2px;
          display: inline-block;
        }
      }
    }

    .pie-chart {
      width: 100%;
      height: 200px;
    }

    .histogram-chart {
      width: 100%;
      height: 300px;
    }

    .stat-table {
      margin-top: 15px;
      font-size: 12px;
      border-top: 1.5px solid @blue;
      width: 100%;
      /*overflow-x: auto;*/
      position: relative;

      .row-wrap {
        overflow-x: auto;
        margin-left: 81px;

        &.blank-right {
          margin-right: 81px;
        }
      }

      .row, .col {
        display: flex;
        flex-wrap: nowrap;

        > div {
          padding: 0 10px;
          color: #333;
          flex: 0 0 50%;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          text-align: center;
          background: #fff;
        }

      }

      .col {
        display: block;
        border-left: 1px solid #eee;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;

        > div {
          width: 80px;

          &.active {
            color: #16AAB7;
          }
        }

        &.bg {
          > div {
            background: #E0FFFC;
          }
        }

        &.fixed-right {
          right: 0;
          left: auto;
        }
      }

      &.narrow {
        .row-wrap {
          margin: 0 35px;
        }

        .col {
          > div {
            width: 35px;
            padding: 0;
          }
        }

        .row {
          > div {
            flex: 0 0 50%;
            padding: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
          }
        }
      }
    }

    .tip {
      margin-top: 10px;
      display: inline-block;
      font-size: 10px;
      color: #999;
      background: #F5F6FA;
      border-radius: 2px;
      padding: 4px 7px;
    }
  }
</style>
