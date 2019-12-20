<template>
  <section class="res-centre-wrap">
    <van-nav-bar
      :left-arrow="canBack"
      @click-left="goBack"
      title="资源中心">
    </van-nav-bar>
    <div class="res-centre-wrap__tab">
      <div class="van-hairline--right" @click="toggleTab(0)" :class="{active:!tabIndex}">平台资源</div>
      <div :class="{active:tabIndex}" @click="toggleTab(1)">私人资源</div>
    </div>
    <div class="res-centre-wrap__body">
      <div class="res-centre-wrap__body__title">筛选</div>
      <van-cell class="res-centre-wrap__body__cell" v-show="!tabIndex">
        <div slot="title" @click="areaFilterShow=true" class="aic jcsb">
          <div class="fs16">地区</div>
          <div class="fs15"><span class="blue mgr10">{{areaLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell">
        <div slot="title" @click="subjectFilterShow=true" class="aic jcsb">
          <div class="fs16">学科</div>
          <div class="fs15"><span class="blue mgr10">{{subjectLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell" v-show="!tabIndex">
        <div slot="title" @click="versionFilterShow=true" class="aic jcsb">
          <div class="fs16">教材</div>
          <div class="fs15"><span class="blue mgr10">{{versionLabel}}</span>
            <van-icon name="arrow"/>
          </div>
        </div>
      </van-cell>
      <van-cell class="res-centre-wrap__body__cell" v-show="!tabIndex">
        <div slot="title" @click="resCourseFilterShow=true" class="aic jcsb">
          <div style="flex: 0 0 15%" class="fs16">课程</div>
<!--          <div style="flex: 0 0 80%;justify-content: flex-end" class="fs15 aic">-->
<!--          </div>-->
          <div style="flex: 1;width: 50px;text-align: right" class="van-ellipsis"><span class="blue mgr10">{{courseLabel}}</span></div>
          <van-icon class="fs15" name="arrow"/>
        </div>
      </van-cell>
      <div class="res-centre-wrap__body__title">资源类型</div>
      <van-collapse class="res-centre-wrap__body__collapse" @change="handleChange" v-show="!tabIndex"
                    v-model="activeNames">
        <van-collapse-item title="微课" name="1">
          <div>
            <list-item class="mgt10" style="background: #fff;"
                       v-for="(item,index) in lessonList" :key="index"
                       :itemTitle="item.resCourseWareInfo.coursewareName"
                       @clickTo="goVideoPage(item)">
              <div slot="cover" class="cover" :style="{'background':item.resCourseWareInfo.imageUrl?'none':'#67E0A3'}">
                <img
                  v-if="item.resCourseWareInfo.imageUrl" :src="item.resCourseWareInfo.imageUrl" alt=""><i v-else
                                                                                                          class="iconGFY icon-video"></i>
              </div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.resCourseWareInfo.shareType === 'S01','icon-school':item.resCourseWareInfo.shareType === 'S02','icon-share':item.resCourseWareInfo.shareType === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.resCourseWareInfo.qualityType === 'Q01','icon-boutique':item.resCourseWareInfo.qualityType === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.userName}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="collect(item,item.resCourseWareInfo.coursewareId,item.resCourseWareInfo.statusCd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collectId}]"></i>
                  <span>{{item.collectId?'取消':''}}收藏</span>
                </div>
                <div
                  @click="showAddPop(item.resCourseWareInfo.coursewareName,item.resCourseWareInfo.coursewareId,'R01','lessonList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item,'lesson')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
        </van-collapse-item>
        <van-collapse-item title="素材" name="2">
          <div>
            <list-item @clickTo="goto(item)" class="mgt10" style="background: #fff;"
                       v-for="(item,index) in materialList" :key="index"
                       :itemTitle="item.resCourseWareInfo.coursewareName">
              <div slot="cover" class="cover"><i class="iconGFY" :class="handleIcon(item.resCourseWareInfo)"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.resCourseWareInfo.shareType === 'S01','icon-school':item.resCourseWareInfo.shareType === 'S02','icon-share':item.resCourseWareInfo.shareType === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.resCourseWareInfo.qualityType === 'Q01','icon-boutique':item.resCourseWareInfo.qualityType === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.userName}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="collect(item,item.resCourseWareInfo.coursewareId,item.resCourseWareInfo.statusCd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collectId}]"></i>
                  <span>{{item.collectId?'取消':''}}收藏</span>
                </div>
                <div
                  @click="showAddPop(item.resCourseWareInfo.coursewareName,item.resCourseWareInfo.coursewareId,'R01','materialList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="download(item.resCourseWareInfo.srcUrl,item.resCourseWareInfo.coursewareName)">
                  <i class="iconGFY icon-download-orange"></i>
                  <span>下载</span>
                </div>
                <div @click="sendTask(item,'material')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
        </van-collapse-item>
        <van-collapse-item title="试卷" name="3">
          <div>
            <list-item @clickTo="viewDetail(item)" class="mgt10"
                       style="background: #fff;" v-for="(item,index) in examList" :key="index"
                       :itemTitle="item.testPaperName">
              <div slot="cover" class="cover"><i class="iconGFY icon-exam-100"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.shareType === 'S01','icon-school':item.shareType === 'S02','icon-share':item.shareType === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.qualityType === 'Q01','icon-boutique':item.qualityType === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div style="white-space: nowrap"><i class="iconGFY icon-difficult"></i>{{item.testPaperDegree==='D01'?'容易':item.testPaperDegree==='D02'?'中等':'困难'}}
                  </div>
                  <div><i class="iconGFY icon-zhu"></i>{{item.subjectiveItemNum || 0}}</div>
                  <div><i class="iconGFY icon-ke"></i>{{item.objectiveItemNum || 0}}</div>
                  <div><i class="iconGFY icon-download"></i>{{item.downCount || 0}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.useCount || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collectCount || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div @click="collect(item,item.testPaperId,item.statusCd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collectId}]"></i>
                  <span>{{item.collectId?'取消':''}}收藏</span>
                </div>
                <div
                  @click="showAddPop(item.testPaperName,item.testPaperId,'R02','examList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item,'exam')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
        </van-collapse-item>
      </van-collapse>

      <van-collapse class="res-centre-wrap__body__collapse" v-show="tabIndex" @change="handlePrivateChange"
                    v-model="activeNames1">
        <van-collapse-item title="微课" name="1">
          <div>
            <list-item class="mgt10" style="background: #fff;"
                       v-for="(item,index) in priLessonList" :key="index"
                       :itemTitle="item.courseware_name"
                       @clickTo="goVideoPage(item)">
              <div slot="cover" class="cover" :style="{'background':item.image_url?'none':'#67E0A3'}">
                <img v-if="item.image_url" :src="item.image_url" alt=""><i v-else class="iconGFY icon-video"></i>
              </div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.share_type === 'S01','icon-school':item.share_type === 'S02','icon-share':item.share_type === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.quality_type === 'Q01','icon-boutique':item.quality_type === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.use_count || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collect_count || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div v-if="item.collect_type === 'C01'"
                     @click="priListKey='priLessonList';collect(item,item.courseware_id,item.status_cd,index)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collect_id}]"></i>
                  <span>取消收藏</span>
                </div>
                <div
                  @click="showAddPop(item.courseware_name,item.courseware_id,'R01','priLessonList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item,'lesson')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
        </van-collapse-item>
        <van-collapse-item title="素材" name="2">
          <div>
            <list-item @clickTo="goto(item)" class="mgt10" style="background: #fff;"
                       v-for="(item,index) in priMaterialList" :key="index"
                       :itemTitle="item.courseware_name">
              <div slot="cover" class="cover"><i class="iconGFY" :class="handleIcon(item)"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.share_type === 'S01','icon-school':item.share_type === 'S02','icon-share':item.share_type === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.quality_type === 'Q01','icon-boutique':item.quality_type === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div><i class="iconGFY icon-feather"></i>{{item.belongAccountName}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.use_count || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collect_count || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div v-if="item.collect_type === 'C01'"
                     @click="priListKey='priMaterialList';collect(item,item.courseware_id,item.status_cd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collect_id}]"></i>
                  <span>取消收藏</span>
                </div>
                <div
                  @click="showAddPop(item.courseware_name,item.courseware_id,'R01','priMaterialList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="download(item.src_url,item,courseware_name)">
                  <i class="iconGFY icon-download-orange"></i>
                  <span>下载</span>
                </div>
                <div @click="sendTask(item,'material')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
        </van-collapse-item>
        <van-collapse-item title="试卷" name="3">
          <div>
            <list-item @clickTo="viewDetail(item)" class="mgt10"
                       :can-slide="item.belong_account_no == $store.getters.getUserInfo.accountNo" @del="delTestPaper(item,index)"
                       style="background: #fff;" v-for="(item,index) in priExamList" :key="index"
                       :itemTitle="item.test_paper_name">
              <div slot="cover" class="cover"><i class="iconGFY icon-exam-100"></i></div>
              <div slot="desc">
                <div class="desc-top">
                  <i class="iconGFY"
                     :class="{'icon-personal':item.share_type === 'S01','icon-school':item.share_type === 'S02','icon-share':item.share_type === 'S03'}"></i>
                  <i class="iconGFY"
                     :class="{'icon-choice':item.quality_type === 'Q01','icon-boutique':item.quality_type === 'Q02'}"></i>
                </div>
                <div class="desc-bottom">
                  <div style="white-space: nowrap"><i class="iconGFY icon-difficult"></i>{{item.test_paper_degree==='D01'?'容易':item.test_paper_degree==='D02'?'中等':'困难'}}
                  </div>
                  <div><i class="iconGFY icon-zhu"></i>{{item.subjective_item_num || 0}}</div>
                  <div><i class="iconGFY icon-ke"></i>{{item.objective_item_num || 0}}</div>
                  <div><i class="iconGFY icon-download"></i>{{item.down_count || 0}}</div>
                  <div><i class="iconGFY icon-points"></i>{{item.use_count || 0}}</div>
                  <div><i class="iconGFY icon-star"></i>{{item.collect_count || 0}}</div>
                </div>
              </div>
              <div slot="btn" class="btn-group van-hairline--top">
                <div v-if="item.collect_type === 'C01'"
                     @click="priListKey='priExamList';collect(item,item.test_paper_id,item.status_cd)">
                  <i :class="['iconGFY','icon-collect', {'icon-collect-yellow':item.collect_id}]"></i>
                  <span>取消收藏</span>
                </div>
                <div
                  @click="showAddPop(item.test_paper_name,item.test_paper_id,'R02','priExamList')">
                  <i class="iconGFY icon-circle-plus-yellow"></i>
                  <span>添加</span>
                </div>
                <div @click="sendTask(item,'exam')">
                  <i class="iconGFY icon-plane"></i>
                  <span>发任务</span>
                </div>
              </div>
              <div slot="remark" class="remark" v-if="item.record">
                <div class="mgr10"><i class="iconGFY icon-lamp"></i>已添加至:</div>
                <div>
                  <div v-for="(r,ri) in item.record" :key="ri">{{r}}</div>
                </div>
              </div>
            </list-item>
          </div>
        </van-collapse-item>
      </van-collapse>
      <van-cell is-link @click="viewQuestion">
        <div slot="title" class="fs16">试题</div>
      </van-cell>
    </div>



    <subject-filter :label.sync="subjectLabel" :visible.sync="subjectFilterShow"></subject-filter>
    <version-filter :gradeTerm.sync="gradeTerm" :label.sync="versionLabel"
                    :visible.sync="versionFilterShow"></version-filter>
    <area-filter :label.sync="areaLabel" :visible.sync="areaFilterShow" @filter="v => areaCode = v"></area-filter>
    <res-course-filter :label.sync="courseLabel" :visible.sync="resCourseFilterShow"
                       @filter="handleFilter"></res-course-filter>
    <add-course-pop @success="saveRecord" :isSendTask="isSendTask" :resourceType="resourceType" :resourceId="resourceId"
                    :resName="resName"
                    :listKey="listKey" :list="courseList" :gradeTerm="gradeTerm"
                    :visible.sync="addCourseShow"></add-course-pop>
  </section>
</template>

<script>
  import listItem from '../../components/list-item'
  import subjectFilter from './component/subjectFilter'
  import versionFilter from './component/versionFilter'
  import areaFilter from './component/areaFilter'
  import resCourseFilter from './component/resCourseFilter'
  import addCoursePop from './component/addCoursePop'
  import {
    getResCourseWareInfo,
    delCollectInfo,
    createCollectInfo,
    getClassTeachCourseInfo,
    getSysCourseTestPaperList,
    getCollectInfoDetailV2,
    delTestPaper,
  } from '@/api/index'
  import {getGradeName, getSubjectName, toHump} from "../../utils/filter";
  import {teachApi, pubApi} from '@/api/parent-GFY'
  import eventBus from "@/utils/eventBus";

  export default {
    name: "index",
    props: ['canBack'],
    components: {listItem, subjectFilter, versionFilter, areaFilter, resCourseFilter, addCoursePop},
    data() {
      return {
        arr: [{}, {}],
        tabIndex: 0,
        activeNames: [],
        activeNames1: [],
        subjectFilterShow: false,
        versionFilterShow: false,
        areaFilterShow: false,
        resCourseFilterShow: false,
        addCourseShow: false,
        subjectLabel: '',
        versionLabel: '',
        areaLabel: '',
        courseLabel: '',
        filter: {
          area: '',
          subject: '',
          res: '',
          course: ''
        },
        courseId: '',
        areaCode: '',
        gradeTerm: '', //年级学期
        lessonList: [],
        materialList: [],
        examList: [],
        priLessonList: [],
        priMaterialList: [],
        priExamList: [],
        courseList: [],
        resName: '',
        resourceId: '',
        resourceType: '',
        listKey: '', // 平台资源点击添加时属于哪个列表
        priListKey: '', // 私人资源点击添加时属于哪个列表
        isSendTask: false,
        accessUrl: '',
      }
    },
    watch: {
      subjectFilterShow(v) {
        if(this.canBack) return
        eventBus.$emit('hideNav',!v)
      },
      versionFilterShow(v) {
        if(this.canBack) return
        eventBus.$emit('hideNav',!v)
      },
      areaFilterShow(v) {
        if(this.canBack) return
        eventBus.$emit('hideNav',!v)
      },
      resCourseFilterShow(v) {
        if(this.canBack) return
        eventBus.$emit('hideNav',!v)
      },
      addCourseShow(v) {
        if(this.canBack) return
        eventBus.$emit('hideNav',!v)
      },
      subjectLabel() {
        // if (this.tabIndex) {
          //私人资源
          this.activeNames1.forEach(v => {
            if (v == 1) {
              // 微课
              this.getCollectInfoDetailV2('C03')
            } else if (v == '2') {
              //素材
              this.getCollectInfoDetailV2('C04')
            } else if (v == '3') {
              //试卷
              this.getCollectInfoDetailV2('C02')
            }
          })
        // }
      },
      courseId() {
        if (this.courseId) {
          for (let i = 1; i < 4; i++) {
            if(!this.activeNames.includes(i)) {
              if(i == 1) {
                this.lessonList = []
              }else if (i == 2) {
                this.materialList = []
              }else if (i == 3) {
                this.examList = []
              }
            }

          }
          this.activeNames.forEach(v => {
            if (v == 1) {
              // 微课
              this.getResCourseWareInfo('C01')
            } else if (v == '2') {
              //素材
              this.getResCourseWareInfo('C02')
            } else if (v == '3') {
              //试卷
              this.getSysCourseTestPaperList()
            }
          })
        } else {
          this.lessonList = []
          this.materialList = []
          this.examList = []
        }
        this.courseList = []
      },
    },
    created() {
      this.$store.commit('setErrorBookQuestionCourse',[])
      if(this.$route.path === '/resCentre') {
        this.$store.commit('setTchCourseInfo',{})
      }
    },
    methods: {
       goBack(){
          this.common.goBack(this)
        },
      async download(srcUrl,name) {
        let url = srcUrl;
        if (url.indexOf("pubquanlang") > -1) {
          this.accessUrl = url;
        } else {
          let json = {
            requestJson: JSON.stringify({
              interUser: "runLfb",
              interPwd: "25d55ad283aa400af464c76d713c07ad",
              "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
              "belongSchoolId": this.$store.getters.schoolId,
              url: url,
              sysTypeCd: "S03"
            })
          };
          await pubApi.checkUrlPermission(json).then(data => {
            console.log(data, "checkUrlPermission");
            if (data.flag) {
              this.accessUrl = data.data[0].accessUrl;
            }
          });
        }
        this.downLoadToOpen(srcUrl,name);
      },
      downLoadToOpen(srcUrl,name) {

        var _this = this;
        // 文件后缀
        var type = srcUrl
          .substring(srcUrl.lastIndexOf(".") + 1)
          .toLowerCase();
        var fileName = name + "." + type;
        var url = _this.accessUrl; //课件路径
        var targetPath = cordova.file.dataDirectory + "Download/gaofenyun/" + fileName; //要下载的目标路径及文件名
        var trustHosts = true;
        // 初始化FileTransfer对象
        var fileTransfer = new FileTransfer();
        // 下载进度
        fileTransfer.onprogress = function(progressEvent) {
          if (progressEvent.lengthComputable) {
            let downloadProgress =
              ((progressEvent.loaded / progressEvent.total).toFixed(2) * 100).toFixed(2);
            console.log(downloadProgress, progressEvent);
            _this.$toast.loading({
              mask: true,
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              message: "文件下载中..." + downloadProgress + "%"
            });
          } else {
            _this.$toast.clear();
            _this.$toast('下载完成');
          }
        };
        // 调用download方法
        fileTransfer.download(
          url, //url网络下载路径
          targetPath, //url本地存储路径
          function(entry) {
            console.log("download complete: " + entry.toURL());
            entry.file(data => {
              _this.$toast.clear();
              _this.$toast('下载完成');
              console.log("showOpenWithDialog data", data);
              // showOpenWithDialog使用手机上安装的程序打开下载的文件
              cordova.plugins.fileOpener2.showOpenWithDialog(
                targetPath,
                data.type,
                function onSuccess(data) {
                  console.log("成功预览:" + targetPath);
                },
                function onError(error) {
                  console.log(
                    "出错！请在" +
                    cordova.file.externalDataDirectory +
                    "目录下查看"
                  );
                }
              );
            });
          },
          function(error) {
            _this.$toast.clear();
            _this.$toast.fail("下载失败");
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
          }
        );
      },
      delTestPaper(item, index) {
        let obj = {
          'interUser': 'runLfb',
          'interPwd': '25d55ad283aa400af464c76d713c07ad',
          'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
          'belongSchoolId': this.$store.getters.schoolId,
          "testPaperInfo": {"testPaperId": item.test_paper_id}
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        delTestPaper(params).then(res => {
          if (res.flag) {
            this.priExamList.splice(index, 1)
            this.$toast('删除成功')
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleYearSecion() {
        const year = this.subjectLabel.substr(0, 2)
        if (year === '小学') {
          return 'Y01'
        } else if (year === '初中') {
          return 'Y02'
        } else {
          return 'Y03'
        }
      },
      getCollectInfoDetailV2(objectTypeCd) {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          subjectType: localStorage.currentSubjectType,
          yearSection: this.handleYearSecion(),
          "pageSize": "9999",
          "currentPage": 1,
          "orderByType": "T01",
          "resCollectInfo": {
            objectTypeCd,
            "objectId": null,
            "collectType": "",
            "accountNo": this.$store.getters.getUserInfo.accountNo,
            "statusCd": "S01"
          },
          "filterParam": {
            "titleDegree": "",
            "belongType": "",
            "belongAreaCode": "",
            "keyWord": "",
            "createYear": "",
            "courseWareType": ""
          }
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getCollectInfoDetailV2(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            if (objectTypeCd === 'C02') {
              //试题
              this.priExamList = res.data || []
            } else if (objectTypeCd === 'C03') {
              //微课
              this.priLessonList = res.data || []
            } else if (objectTypeCd === 'C04') {
              //素材
              this.priMaterialList = res.data || []
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      toggleTab(value) {
        this.tabIndex = value
      },
      viewQuestion() {
        if(this.canBack) {
          //有左上角返回按钮的时候
          if(this.$route.query.from === 'examDetail') {
            if (this.tabIndex) {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&from=examDetail&year=${this.handleYearSecion()}&isRes=1&isPri=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            } else {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&from=examDetail&isRes=1&areaCode=&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            }
          }else if (this.$route.query.from === 'questionList') {
            this.$store.commit('setIsRevert',true)
            if (this.tabIndex) {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&from=questionList&year=${this.handleYearSecion()}&tchCourseId=${this.$route.query.tchCourseId}&sysCourseId=${this.$route.query.sysCourseId}&relationCourseId=${this.$route.query.relationCourseId}&isRes=1&isPri=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            } else {
              this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&tchCourseId=${this.$route.query.tchCourseId}&sysCourseId=${this.$route.query.sysCourseId}&relationCourseId=${this.$route.query.relationCourseId}&from=questionList&isRes=1&areaCode=&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
            }
            // this.$emit('viewRes',1)
            // this.isRevert = true
          }
        }else {
          if (this.tabIndex) {
            this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&year=${this.handleYearSecion()}&isRes=1&isPri=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
          } else {
            this.$router.push(`/questionList?subjectType=${localStorage.currentSubjectType}&isRes=1&areaCode=${this.areaCode}&courseId=${this.courseId}&courseName=${this.courseLabel}&classGrade=${this.gradeTerm.split('|')[0]}&termType=${this.gradeTerm.split('|')[1]}`)
          }
        }

      },
      viewDetail(item) {
        if (this.tabIndex) {
          //私人资源
          let humpObj = {}
          for (let k in item) {
            const humpKey = toHump(k)
            humpObj[humpKey] = item[k]
          }
          this.$store.commit('setResourceInfo', humpObj)
          this.$store.commit("setTaskClassInfo", '')
          this.$router.push({
            path: `/examDetail`, query: {
              flag: 1,
              "sysCourseId": this.courseId,
              type: 0,
              testPaperId:humpObj.testPaperId,
              subjectType: localStorage.currentSubjectType,
              classGrade: this.gradeTerm.split('|')[0],
              title: humpObj.testPaperName,
            }
          })
        } else {
          //平台资源
          this.$store.commit('setResourceInfo', item)
          this.$store.commit("setTaskClassInfo", '')
          this.$router.push({
            path: `/examDetail`, query: {
              flag: 1,
              "sysCourseId": this.courseId,
              type: 0,
              testPaperId:item.testPaperId,
              subjectType: localStorage.currentSubjectType,
              classGrade: this.gradeTerm.split('|')[0],
              title: item.testPaperName,
            }
          })
        }
      },
      goto(item) {
        if (this.tabIndex) {
          let humpObj = {}
          for (let k in item) {
            const humpKey = toHump(k)
            humpObj[humpKey] = item[k]
          }
          this.$router.push({path: '/materialDetail', query: {data: humpObj}})
        } else {
          this.$router.push({path: '/materialDetail', query: {data: item.resCourseWareInfo}})
        }
      },
      sendTask(obj, key) {
        if (this.tabIndex) {
          if (key === 'exam') {
            if (!obj.objective_item_num && !obj.subjective_item_num) {
              return this.$toast('该试卷不含试题')
            }
            let humpObj = {}
            for (let k in obj) {
              const humpKey = toHump(k)
              humpObj[humpKey] = obj[k]
            }
            this.$store.commit('setResourceInfo', humpObj)
            this.showAddPop(obj.test_paper_name, '', 'R02', key)
          } else {
            let humpObj = {}
            for (let k in obj) {
              const humpKey = toHump(k)
              humpObj[humpKey] = obj[k]
            }
            this.$store.commit('setResourceInfo', humpObj)
            this.showAddPop(obj.courseware_name, '', 'R01', key)
          }

        } else {
          if (key === 'exam') {
            if (!obj.objectiveItemNum && !obj.subjectiveItemNum) {
              return this.$toast('该试卷不含试题')
            }
            this.$store.commit('setResourceInfo', obj)
            this.showAddPop(obj.testPaperName, '', 'R02', key)
          } else {
            this.$store.commit('setResourceInfo', obj.resCourseWareInfo)
            this.showAddPop(obj.resCourseWareInfo.coursewareName, '', 'R01', key)
          }
        }
      },
      goVideoPage(item) {
        if (this.tabIndex ? !item.src_url : !item.resCourseWareInfo.srcUrl) return
        this.checkUrlPermission(item)
      },
      checkUrlPermission(item) {
        // 课件鉴权
        let permissionParams = {
          'interUser': 'runLfb',
          'interPwd': '25d55ad283aa400af464c76d713c07ad',
          'operateAccountNo': this.$store.getters.getUserInfo.accountNo,
          'belongSchoolId': this.$store.getters.schoolId,
          'url': this.tabIndex ? item.src_url : item.resCourseWareInfo.srcUrl,
          'sysTypeCd': 'S03'
        }
        this.$store.commit('setVanLoading', true)
        pubApi.checkUrlPermission({requestJson: JSON.stringify(permissionParams)}).then((respone) => {
          this.$store.commit('setVanLoading', false)
            let src_url,srcUrl
          if (respone.flag) {
            this.tabIndex ?src_url = respone.data[0].accessUrl
              : srcUrl = respone.data[0].accessUrl
          } else {
            this.tabIndex ? src_url = ''
              : srcUrl = ''
          }

          if (this.tabIndex ? !src_url : !srcUrl) {
            this.$toast('暂无资源')
            return
          }

          this.$router.push({
            name: 'videoPage',
            query: {
              src: this.tabIndex ? src_url : srcUrl,
              title: this.tabIndex ? item.courseware_name : item.resCourseWareInfo.coursewareName,
              isMp3: (this.tabIndex ? item.coursewareType : item.resCourseWareInfo.coursewareType) == "T06" ? true : false
            }
          })
        }).catch(() => {
          this.$store.commit('setVanLoading', false)
          this.$toast('资源错误')
        })
      },
      getSysCourseTestPaperList() {
        if (!this.courseId) return
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          sysCourseIdList: [this.courseId],
          "pageSize": "9999",
          "currentPage": 1,
          "orderByType": "T05"
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getSysCourseTestPaperList(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.examList = res.data || []
          } else {
            this.$toast(res.msg)
          }
        })
      },
      saveRecord(courseName) {
        if (this.tabIndex) {
          let item = {}
          if (this.priListKey === 'priExamList') {
            item = this[this.priListKey].find(v => this.resourceId === v.test_paper_id)
          } else {
            item = this[this.priListKey].find(v => this.resourceId === v.courseware_id)
          }
          if (item.record) {
            //有添加记录
            item.record.push(`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`)
          } else {
            this.$set(item, 'record', [`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`])
          }
        } else {
          let item = {}
          if (this.listKey === 'examList') {
            item = this[this.listKey].find(v => this.resourceId === v.testPaperId)
          } else {
            item = this[this.listKey].find(v => this.resourceId === v.resCourseWareInfo.coursewareId)
          }
          if (item.record) {
            //有添加记录
            item.record.push(`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`)
          } else {
            this.$set(item, 'record', [`${getGradeName(this.gradeTerm.split('|')[0])}${getSubjectName(localStorage.getItem("currentSubjectType"))}《${courseName}》`])
          }
        }
      },
      showAddPop(name, id, resourceType, key) {
        if (!id) {
          this.isSendTask = true
        } else {
          this.isSendTask = false
        }
        this.addCourseShow = true
        this.resName = name
        this.resourceId = id
        this.resourceType = resourceType
        if (this.tabIndex) {
          this.priListKey = key
        }
        this.listKey = key
        if (!this.courseList.length) {
          this.getClassTeachCourseInfo()
        }
      },
      getClassTeachCourseInfo() {
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          "operateRoleType": "A02",
          "accountNo": this.$store.getters.getUserInfo.accountNo,
          "subjectType": localStorage.getItem("currentSubjectType"),
          classGrade: this.gradeTerm.split('|')[0],
          termType: this.gradeTerm.split('|')[1],
          "pageSize": "999",
          "courseType": "C01",
          "currentPage": 1,
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getClassTeachCourseInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            this.courseList = res.data || []
          }
        })
      },
      handleIcon(item) {
        const type = item.src_url || item.srcUrl
        let t = type.substring(type.lastIndexOf('.') + 1).toLowerCase()
        if (t == 'ppt' || t == 'pptx') {
          t = 'icon-ppt'
        } else if (t == 'doc' || t == 'docx') {
          t = 'icon-doc'
        } else if (t == 'xls' || t == 'xlsx') {
          t = 'icon-xls'
        } else if (t == 'zip' || t == 'rar' || t == '7z') {
          // t = 'icon'
        } else if (t == 'pdf') {
          t = 'icon-pdf'
        } else if (t == 'jpg' || t == 'png' || t == 'jpeg' || t == 'gif') {
          t = 'icon-img'
        } else if (t == 'mp4' || t == 'mp3') {
          t = 'icon-video'
        } else {
          // t = 'unkown'
        }
        return t
      },
      collect(item, objectId, statusCd, index) {
        this.$store.commit('setVanLoading', true)
        if (this.tabIndex ? item.collect_id : item.collectId) {
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "resCollectInfo": {
              "collectId": this.tabIndex ? item.collect_id : item.collectId,
              "objectTypeCd": "C03",
              objectId,
              "collectType": "C01",
              "accountNo": this.$store.getters.getUserInfo.accountNo,
              statusCd,
            },
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          delCollectInfo(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if (res.flag) {
              this.$toast('取消收藏')
              this.tabIndex ?
                this[this.priListKey].splice(index, 1)
                : item.collectId = 0
            } else {
              this.$toast(res.msg)
            }
          })
        } else {
          //私人资源不能收藏
          let obj = {
            "interUser": "runLfb",
            "interPwd": "25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "resCollectInfo": {
              "objectTypeCd": "C03",
              objectId,
              "collectType": "C01",
              "accountNo": this.$store.getters.getUserInfo.accountNo,
              statusCd,
              "subjectType": localStorage.currentSubjectType
            },
            "sysTypeCd": "S02"
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          createCollectInfo(params).then(res => {
            this.$store.commit('setVanLoading', false)
            if (res.flag) {
              this.$toast('收藏成功')
              item.collectId = res.resCollectInfo.collectId
            } else {
              this.$toast(res.msg)
            }
          })
        }
      },
      handlePrivateChange(activeArr) {
        if (activeArr.length > this.activeNames1.length) {
          //有展开
          let value = '' //展开的index
          activeArr.forEach(v => {
            if (this.activeNames1.indexOf(v) === -1) {
              value = v
            }
          })
          if (value == '1') {
            // 微课
            if (!this.priLessonList.length) {
              this.getCollectInfoDetailV2('C03')
            }
          } else if (value == '2') {
            //素材
            if (!this.priMaterialList.length) {
              this.getCollectInfoDetailV2('C04')
            }
          } else if (value == '3') {
            //试卷
            if (!this.priExamList.length) {
              this.getCollectInfoDetailV2('C02')
            }
          }
        }
      },
      handleChange(activeArr) {
        if (activeArr.length > this.activeNames.length) {
          //有展开
          let value = '' //展开的index
          activeArr.forEach(v => {
            if (this.activeNames.indexOf(v) === -1) {
              value = v
            }
          })
          if (value == '1') {
            // 微课
            if (!this.lessonList.length) {
              this.getResCourseWareInfo('C01')
            }
          } else if (value == '2') {
            //素材
            if (!this.materialList.length) {
              this.getResCourseWareInfo('C02')
            }
          } else if (value == '3') {
            //试卷
            if (!this.examList.length) {
              this.getSysCourseTestPaperList()
            }
          }
        }
      },
      getResCourseWareInfo(queryType) {
        if (!this.courseId) return
        this.$store.commit('setVanLoading', true)
        let obj = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
          "belongSchoolId": this.$store.getters.schoolId,
          queryType, //C01 微课 C02 素材
          "sysCourseIdList": [this.courseId],
          "areaCode": this.areaCode,
          "orderByType": "T05",
          "pageSize": "9999",
          "currentPage": 1,
          "filterParam": {"shareType": "", "courseWareType": ""}
        }
        let params = {
          requestJson: JSON.stringify(obj)
        }
        getResCourseWareInfo(params).then(res => {
          this.$store.commit('setVanLoading', false)
          if (res.flag) {
            if (queryType === 'C01') {
              this.lessonList = res.resCourseWareOrderInfoList || []
            } else {
              this.materialList = res.resCourseWareOrderInfoList || []
            }
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleFilter(id) {
        this.courseId = id
      },
    }
  }
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  .res-centre-wrap {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;

    .add-pop {
      /*max-height: 93%;*/
      height: 93%;
      overflow-y: hidden;
    }

    .add-pop-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: hidden;

      .radio-normal {
        border: 1px solid #999;
        border-radius: 50%;
        background: none;
      }

      &__title {
        flex: 0 0 50px;
        display: flex;
        align-items: center;
        font-size: 18px;
        padding: 0 10px;
        justify-content: space-between;

        span {
          flex: 1;
          text-align: center;
        }

        i {
          flex: 0 0 22px;
          font-size: 22px;
          color: #999;
          margin-left: 15px;
        }
      }

      &__body {
        flex: 1;
        overflow-y: auto;

        &__radio-group {
          padding: 10px;

          .radio-group {
            padding-left: 53px;
            margin-top: 15px;

            i {
              vertical-align: middle;
            }
          }
        }
      }

      &__footer {
        flex: 0 0 50px;
        padding: 5px 10px;

        .btn {
          width: 100%;
          border-radius: 22px;
          font-size: 18px;
        }
      }
    }

    &__tab {
      display: flex;
      background: #fff;
      flex: 0 0 44px;

      > div {
        font-weight: bold;
        flex: 1;
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        color: #333;

        &.active {
          color: @blue;
        }
      }
    }

    &__body {
      flex: 1;
      overflow-y: auto;

      &__title {
        line-height: 44px;
        padding: 0 15px;
        font-size: 16px;
        color: #999;
      }

      &__collapse {
        @{deep} .van-cell__title {
          font-size: 16px;

        }

        @{deep} .van-collapse-item__content {
          background: none;
          padding: 0;
        }

        .list-item:last-child {
          margin-bottom: 10px;
        }
      }

      .remark {
        display: flex;
        font-size: 12px;
        color: #666;
        padding-bottom: 10px;

        .icon-lamp {
          margin-right: 5px;
        }
      }

      .cover {
        background: #FCA361;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;

        img {
          border-radius: 5px;
          width: 100%;
          height: 100%;
        }
      }

      .desc-top {
        display: flex;
        margin-bottom: 10px;


        .iconGFY {
          margin-right: 5px;
        }
      }

      .desc-bottom {
        display: flex;
        font-size: 12px;
        color: #666;

        .iconGFY {
          margin-right: 3px;
        }

        > div {
          margin-right: 18px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
