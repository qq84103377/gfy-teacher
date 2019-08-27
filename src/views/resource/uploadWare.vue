<template>
    <section class="upload-ware">
      <div class="upload-ware__body">
        <van-cell class="upload-ware__body__cell">
          <div slot="title" class=" aic">
            <div><span class="red">*</span>名称:</div>
            <input class="pdlt10" style="flex: 1" v-model="form.name" type="text" maxlength="64" placeholder="请输入名称,字数在64字内">
            <span class="red">{{64 - form.name.length}}</span>
            <van-icon v-show="form.name.length" @click="form.name = ''" class="close" name="clear"/>
          </div>
        </van-cell>
        <van-cell class="upload-ware__body__cell">
          <div slot="title">
            <div class="jcsb">
              <div>简介:</div>
              <span class="red">{{200 - form.desc.length}}</span>
            </div>
            <textarea maxlength="200" v-model="form.desc" type="text" placeholder="请输入描述,字数在200字内"/>
          </div>
        </van-cell>
        <van-cell class="upload-ware__body__cell">
        <div slot="title" class="aic">
          <div><span class="red">*</span>课件:</div>
          <div class="pdlt10" style="flex:1">轻触此添加office或pdf</div>
          <van-icon @click="" class="add" name="add"/>
        </div>
      </van-cell>
        <van-cell class="upload-ware__body__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>共享:</span>
            <van-radio-group style="display: flex;" v-model="form.share">
              <van-radio name="S01" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                仅自己
              </van-radio>
              <van-radio name="S02" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                校内
              </van-radio>
              <van-radio name="S03"><i slot="icon" slot-scope="props"
                                     :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                公开
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-cell class="upload-ware__body__cell">
          <div slot="title" class="aic">
            <span class="mgr10"><span class="red">*</span>课中:</span>
            <van-radio-group style="display: flex;" v-model="form.relate">
              <van-radio name="2" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                仅资源
              </van-radio>
              <van-radio name="3" class="mgr10"><i slot="icon" slot-scope="props"
                                                   :class="['iconGFY','icon-radio-active',{'radio-normal':!props.checked}]"></i>
                关联到课中
              </van-radio>
            </van-radio-group>
          </div>
        </van-cell>
      </div>
      <div class="upload-ware__footer">
        <van-button type="info" class="btn" @click="submit">提交</van-button>
      </div>
    </section>
</template>

<script>
  import {generateTimeReqestNumber, randomString} from "@/utils/filter";
  import * as uploadApi from "@/api/upload";
  import {addCourseWare, addTeachCourseRes} from '@/api/index'
    export default {
        name: "uploadWare",
      data() {
          return {
            form: {
              name: '',
              desc: '',
              share: 'S02',
              relate: '2'
            },
            wareUrl: '',
            wareSize: '',
            oSSObject: null,
          }
      },
      created() {
          this.getOSSKey()
      },
      methods: {
        getOSSKey() {
          let json = {
            requestJson: JSON.stringify({
              interUser: "runLfb",
              interPwd: "25d55ad283aa400af464c76d713c07ad",
              operateAccountNo: this.$store.getters.getUserInfo.accountNo,
              belongSchoolId: this.$store.getters.schoolId,
              docTypeCd: "T02",
              sysTypeCd: "T01"
            })
          };
          this.$store.commit('setVanLoading',true)
          console.log('getOSSKey json', json);
          uploadApi.stsAuthCoverAccessUrl(json).then(data => {
            console.log('stsAuthCoverAccessUrl', data.data[0]);
            this.$store.commit('setVanLoading',false)
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
        submit() {
          if (!this.form.name) {
            this.$toast('请输入名称')
            return
          }
          if (!this.wareUrl) {
            this.$toast('请添加课件')
            return
          }
          let obj = {
            "interUser": "runLfb",
            "interPwd": "7829b380bd1a1c4636ab735c6c7428bc",
            "operateAccountNo": this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId": this.$store.getters.schoolId,
            "subjectType": 'S01',
            courseWareList: [{
              knowledgePointId: this.$route.query.sysCourseId,
              coursewareName: this.form.name,
              "coursewareClassify": "C03",
              "coursewareType": "T02",
              "srcUrl": this.wareUrl,
              "dstUrl": this.wareUrl,
              // "srcUrl": 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/document/201908/12134_1566809854_Jn5Ar.doc',
              // "dstUrl": 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/document/201908/12134_1566809854_Jn5Ar.doc',
              "belongSchoolId": this.$store.getters.schoolId,
              "belongAreaCode": this.$store.getters.getUserInfo.areaCode,
              "belongAccountNo": this.$store.getters.getUserInfo.accountNo,
              "source": "S04",
              "isShow": "S01",
              "statusCd": "S01",
              "shareType": this.form.share,
              "isDownload": "I01",
              "size": this.wareSize,
              // "size": 929324,
              remark: this.form.desc
            }]
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          addCourseWare(params).then(res => {
            if (res.flag) {
              if(this.form.relate === '3') {
                // 关联课中
                this.addTeachCourseRes(res.coursewareIdList[0])
              }else {
                //仅资源
                this.$toast('添加成功')
                this.$store.commit('setIsAddWare',true)
                this.$router.back()
              }


            } else {
              this.$toast(res.msg)
            }
          })
        },
        addTeachCourseRes(resourceId) {
          let obj = {
            "interUser":"runLfb",
            "interPwd":"25d55ad283aa400af464c76d713c07ad",
            "operateAccountNo":this.$store.getters.getUserInfo.accountNo,
            "belongSchoolId":this.$store.getters.schoolId,
            "operateRoleType":"A02",
            "tchCourseId":this.$route.query.tchCourseId,
            "sysCourseId":this.$route.query.sysCourseId,
            "relationSeqId":this.$route.query.relationCourseId,
            "resourceType":"R01",
            resourceId,
            "statusCd":"S04",
          }
          let params = {
            requestJson: JSON.stringify(obj)
          }
          addTeachCourseRes(params).then(res => {
            if(res.flag) {
              this.$toast('添加成功')
              this.$store.commit('setIsAddWare',true)
              this.$router.back()
            }else {
              this.$toast(res.msg)
            }
          })
        },

      }
    }
</script>

<style lang="less" scoped>
  .upload-ware {
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    &__body {
      flex: 1;
      overflow-y: auto;
      &__cell {
        .radio-normal {
          border: 1px solid #999;
          border-radius: 50%;
          background: none;
        }
        .close, .add {
          color: @blue;
          margin-left: 10px;
        }
        .add {
          font-size: 22px;
        }
        .jcsb {
          padding-left: 8px;
        }
        textarea {
          background: #F5F6FA;
          border-radius: 5px;
          height: 105px;
          width: 100%;
          margin-top: 15px;
          padding: 10px;
        }
      }
    }
    &__footer {
      background: #fff;
      flex: 0 0 55px;
      padding: 5px 10px;
      .btn{
        font-size: 16px;
        border-radius: 22px;
        width: 100%;
      }
    }
  }
</style>
