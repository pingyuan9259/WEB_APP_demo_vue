<!-- 个人信息页面
     作者：平原
     创建：2017-6-15 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="my_profile_page">
    <banners banners-type="myProfile"></banners>
    <div class="my_profile">
      <h2>个人信息</h2>
      <div class="user_name">
        <span class="key">新生号</span>
        <span
          :class="{ 'active': userDetail.username }"
          class="value">
          {{ userDetail.username || '你一定来到了假的新生大学' }}
        </span>
      </div>
      <div class="full_name">
        <span class="key">姓名</span>
        <span
          :class="{ 'active': userDetail.fullname }"
          class="value">
          {{ userDetail.fullname || '无名氏' }}
        </span>
      </div>
      <div class="phone">
        <span class="key">手机号码</span>
        <span
          :class="{ 'active': userDetail.phone }"
          class="value">
          {{ userDetail.phone || '一个失联的人' }}
        </span>
      </div>
      <div class="city">
        <span class="key">居住地</span>
        <span
          :class="{ 'active': userDetail.city }"
          class="value">
          {{ userDetail.city || '一个无家可归的人'}}
        </span>
      </div>
      <div class="industry">
        <span class="key">职业</span>
        <span
          :class="{ 'active': userDetail.industry }"
          class="value">
          {{ userDetail.industry || '一个没有职业的人' }}
        </span>
      </div>
      <div class="introduction">
        <span class="key">签名</span>
        <span
          :class="{ 'active': userDetail.introduce }"
          class="value">
          {{ userDetail.introduce || '你签名呢' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import Banners from '../../modules/Banners/'
  import { USER_INFO_KEY } from '../../../config'
  import Storage from '../../../utils/storage'
  import sensorsdata from '../../../utils/sensorsdata'

  export default {
    data () {
      return {
        userDetail: Storage.get(USER_INFO_KEY)
      }
    },

    mounted () {
      // 神策数据上报
      sensorsdata.track()
      let saTitle = 'web端个人信息页'
      sensorsdata.saEvent(saTitle)
    },

    components: {
      Banners
    }
  }
</script>
