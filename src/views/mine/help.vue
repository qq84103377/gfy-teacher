<template>
  <section class="help">
    <van-collapse v-model="activeName" accordion class="help-collapse">
      <van-collapse-item title="账号密码" name="1">
        <van-collapse v-model="activeName1" accordion>
          <van-collapse-item title="老师忘记密码怎么找回？" name="11">
            <div class="content">
              <p>1. 您好，请您在登录界面点击【忘记密码】按提示输入绑定的手机号码就可以找回密码。</p>
              <p>2.您好，请您联系该校的教研员，教研员会第一时间帮您重置。</p>
            </div>
          </van-collapse-item>
          <van-collapse-item title="如何修改头像？" name="15">
            <div class="content">
              您好，请登录账号后，点击右下角【我的】----点击头像----按系统提示修改即可。
            </div>
          </van-collapse-item>
          <van-collapse-item title="老师忘记登录账号怎么找回？" name="12">
            <div class="content">
              <p>1. 您好，您的登录账号为：学校+您的名字，如文华李明</p>
              <p>2.您好，请您联系该校的教研员，教研员会第一时间帮您查找登录账号。</p>
            </div>
          </van-collapse-item>
          <van-collapse-item title="怎样修改密码？" name="14">
            <div class="content">
              您好，请登录账号后，点击右下角【我的】----【设置】---【修改密码】按系统提示修改即可。
            </div>
          </van-collapse-item>
          <van-collapse-item title="怎样修改绑定的手机号码？" name="13">
            <div class="content">
              您好，请登录账号后，点击右下角【我的】----【设置】---【修改手机号码】按系统提示修改即可。
            </div>
          </van-collapse-item>
        </van-collapse>
      </van-collapse-item>
      <van-collapse-item title="功能使用" name="2">
        <van-cell class="fs14" v-for="item in usageData" :title="item.title" is-link :to="item.url"/>
      </van-collapse-item>
      <van-collapse-item title="朗币使用说明" name="3">
        <van-collapse v-model="activeName3" accordion>
          <van-collapse-item title="什么是朗币？" name="31">
           <div class="content">
             朗币是教师、学生在使用高分云平台郭恒中获得的虚拟奖励，可以用来在积分商城换取相应价值的礼品，不可转增、兑现。
           </div>
          </van-collapse-item>
          <van-collapse-item title="如何获得朗币？" name="32">
            <div class="content">
              <p>1、通过登录，每天的首次登录可以获得3个积分</p>
              <p>2、通过创建课程，每个课件获得3个积分</p>
              <p>3、通过创建任务，每个课程任务获得2个积分</p>
            </div>
          </van-collapse-item>
          <van-collapse-item title="朗币的有效期限？" name="33">
            <div class="content">
              在您账号的有效使用过程中，朗币一直有效。
            </div>
          </van-collapse-item>
          <van-collapse-item title="如何兑换礼品？" name="34">
            <div class="content">
              可以在高分云APP中的积分商城兑换礼品，会由教研员直接进行礼品的派送。朗币越多，可以换取的礼品价值也就越大。
            </div>
          </van-collapse-item>
        </van-collapse>
      </van-collapse-item>
    </van-collapse>
  </section>
</template>

<script>
  export default {
    name: "help",
    data() {
      return {
        activeName: ['1'],
        activeName1: ['11'],
        activeName3: ['31'],
        usageData:[
          {title:'课程——预习',url:'/preview'},
          {title:'课程——课中',url:'/inClass'},
          {title:'课程——资源',url:'/resource'},
          {title:'资源中心',url:''},
          {title:'教学统计',url:''},
          {title:'我的',url:'/mine'},
          {title:'错题本',url:''},
          {title:'我的课程',url:''},
          {title:'我的班级',url:''},
          {title:'智能补强',url:''}
        ]
      };
    }
  }
</script>

<style scoped lang="less">
  @deep: ~'>>>';
  .help {
    background-color: #F5F6FA;

    &-collapse {
      @{deep} .van-collapse-item__content {
        padding-top: 0;
        padding-bottom: 0;
        .van-cell:not(:last-child):after{
          border-bottom: none;
        }
      }
      @{deep} .van-collapse-item{
        .van-collapse-item__title{
          .van-cell__title{
            span{
              font-size: 16px;
            }
          }
        }
        .van-collapse-item__content{
          .van-collapse-item__title{
            .van-cell__title{
              span{
                font-size: 14px;
              }
            }
          }
        }
      }

      .van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after {
        border-width: 0;
      }

      .content {
        padding: 10px;
        background-color: #F5F6FA;
        margin-bottom: 15px;
        font-size: 12px;
        line-height: 24px;
        color: #666666;
      }
    }

  }

</style>
