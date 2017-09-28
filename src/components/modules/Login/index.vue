<!-- 登录组件
     作者：刘政
     创建：2016... -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="login">
    <div v-show="isPc" class="QRCode_login">
      <div v-show="showLogin" class="QRCode_container">
        <div v-show="showQRCodeBox" class="QR_create">
          <div v-show="showLoadingQRCode" class="QRCode_box"><img src="../../../assets/loading.gif" alt="" /></div>
          <div v-show="showQRCode" id="qrcode" class="QR_code"></div>
          <p class="QR_p">扫描登录新生大学</p>
        </div>
        <div v-show="showRenovate" class="QR_renovate">
          <div><a @click="cancelLogin" >刷新</a></div>
          <p>校验二维码失败，请刷新</p>
        </div>
        <div class="massage">
          <div class="install">
            <div class="mobile_icon">
              <img src="../../../assets/xs_m.png" alt="">
            </div>
              <div class="install_title">
                <p class="massage_p">打开手机新生大学</p>
                <p class="massage_s">
                  手机上
                  <a
                    @click="downloadApp()"
                    class="massage_a"
                    target="_blank">安装</a>
                  并登录新生大学
                </p>
              </div>
            </div>
          <i class="adown_tip"></i>
          <div class="sweep">
            <div class="sweep_icon">
              <img src="../../../assets/xs_s.png" alt="">
            </div>
            <div class="sweep_title">
              <p class="massage_p">进入「扫一扫」</p>
              <p class="massage_s">从"我的"进入扫一扫，扫码登录Web新生大学</p>
            </div>
          </div>
        </div>
        <a class="tab_btn hint--top hint--always" aria-label="验证码登录"  @click="tabLoginStyle"></a>
      </div>
        <!--扫描成功-->
      <div v-show="showScanSuccess" class="login_success">
        <div class="user">
          <img id="avatar" src="../../../assets/user_avatar.png" alt="头像">
        </div>
        <div v-if="loginedSuccess">
          <p class="success_massage1">正在进入...</p>
        </div>
        <div v-else>
          <p class="success_massage1">扫描成功</p>
          <p class="success_massage2">请在手机上点击确认已登陆</p>
        </div>
        <button class="success_btn" @click="cancelLogin">返 回</button>
      </div>
    </div>
    <div class="phone_login">
      <div class="phone_box">
        <div class="txt_box">
          <p>手机号：</p>
          <input class="phone_num" type="text" placeholder="输入手机号" />
        </div>
        <div class="txt_box">
          <p>验证码：</p>
          <div>
            <input class="identify_code" type="text" placeholder="输入验证码" />
            <a class="indentify_btn"  @click="getCode">获取验证码</a>
          </div>
        </div>
        <!-- <a class="phonic_tip"  @click="Voice">未收到短信？获取语音验证码</a> -->
        <a class="login_btn"  @click="SignIn">登 录</a>
      </div>
      <a v-show="isPc"  class="tab_btn hint--top hint--always" aria-label="扫码登录"  @click="tabLoginStyle"></a>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { PREFIX_OLD } from '../../../config'
  import { imgFilter } from '../../../utils/enhance'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        showLogin: true,          // 登录模块
        showScanSuccess: false,   // 登录成功模块
        showQRCodeBox: true,      // 创建二维码成功后显示的状态
        showRenovate: false,      // 创建二维码失败后显示的状态
        showLoadingQRCode: true,  // 二维码加载之前状态
        showQRCode: false,        // 二维码显示
        LoginStatus: false,       // 切换二维码和手机号码登录状态
        IdentifyStatus: false,    // 验证码发送状态
        loginedSuccess: false
      }
    },

    created () {
      let { dispatch } = this.$store
      dispatch('getDeviceId')
      dispatch('getQrCode')
    },

    computed: mapState({
      qr: state => state.login.qr,
      identifyingCode: state => state.login.identifyingCode,
      qrStatus: state => state.login.qrStatus,
      checkSubmitLogin: state => state.login.checkSubmitLogin,
      checkSublimeStatus: state => state.login.checkSublimeStatus,
      deviceId: state => state.login.deviceId,
      isLogin: state => state.login.isLogin,
      isPc: state => state.global.isPc
    }),

    mounted () {
      if (!this.isPc) {
        this.tabLoginStyle()
      }
    },

    watch: {
      isLogin (val) {
        if (!val) {
          this.cancelLogin()
        }
      },

      deviceId () {
        this.$store.dispatch('getQrCode')
      },

      qrStatus () {
        if (this.qrStatus) {
          this.showQRCodeBox = true
          this.showRenovate = false
        } else {
          this.showQRCodeBox = false
          this.showRenovate = true
        }
      },

      qr () {
        let qrCodeEle = $('#qrcode')[0]
        if (!qrCodeEle) {
          return
        }
        $('#qrcode').html('')
        /* eslint-disable no-new */
        new window.QRCode(qrCodeEle, {
          text: 'http:' + PREFIX_OLD + '/v3/r?qr=' + this.qr,
          width: 196,
          height: 196,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.H
        })
        this.showLoadingQRCode = false
        this.showQRCode = true
        this.$store.dispatch('checkClientSubmitLogin')
      },

      checkSublimeStatus () {
        let data = this.checkSubmitLogin
        switch (data.code) {
          case 100:   // 等待扫码时轮询超时，需重新发起轮询
            this.$store.dispatch('checkClientSubmitLogin')
            break
          case 101:   // 移动端扫码成功，需重新发起轮训等待移动端确认登录
            this.showLogin = false
            this.showScanSuccess = true
            this.showLoadingQRCode = true
            this.showQRCode = false
            $('#qrcode').html('')
            let avatar = data.data.avatar
            if (avatar) {
              $('#avatar').attr('src', imgFilter(avatar))
            }
            this.$store.dispatch('checkClientSubmitLogin')
            break
          case 200:   // 等待确认轮训超时，需重新发起轮询
            this.$store.dispatch('checkClientSubmitLogin')
            break
          case 201:   // 移动端确认登录
            this.$store.dispatch('saveUserInfo', data.data)
            this.loginedSuccess = true

            // 防止跳转失败
            // 只在登录页面有效，在登录弹框无效
            setTimeout(() => {
              if (window.location.href.indexOf('login') > -1) {
                window.location.reload()
              }
            }, 2000)
            break
          case 204:   // 移动端取消登录，需重新创建二维码
            this.showLogin = true
            this.showScanSuccess = false
            this.$store.dispatch('getQrCode')
            break
        }
      }
    },

    methods: {
      async downloadApp () {
        this.$store.dispatch('eventEmitter', { event: 'hiddeLogin' })
        await this.$router.push('/')
        this.$store.dispatch('eventEmitter', { event: 'downloadApp' })
      },

      cancelLogin () {
        this.showLogin = true
        this.showScanSuccess = false
        this.showRenovate = false
        this.showQRCodeBox = true
        this.$store.dispatch('getQrCode')
      },

      tabLoginStyle () {
        if (!this.LoginStatus) {
          $('.QRCode_login').css({'opacity': '0', 'zIndex': '-1'})
          $('.phone_login').css({'opacity': '1', 'zIndex': '1'})
          $('.tab_btn').css('backgroundPosition', '0 0')
        } else {
          $('.phone_login').css({'opacity': '0', 'zIndex': '-1'})
          $('.QRCode_login').css({'opacity': '1', 'zIndex': '1'})
          $('.tab_btn').css('backgroundPosition', '-40px -40px')
        }
        this.LoginStatus = !this.LoginStatus
      },

      getCode () {
        if (!this.IdentifyStatus) {
          let phone = $('.phone_num').val()

          if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
            this.$store.dispatch('boxyTip', { message: '手机号码有误，请重填' })
            return false
          }

          let status = this._checkIdentifyStatus()
          this.$store.dispatch('getIdentifyingCode', {
            phone,
            status
          })
        }
      },

      _checkIdentifyStatus () {
        this.IdentifyStatus = true
        let i = 60
        let timer = setInterval(() => {
          $('.indentify_btn').html(i + '秒后重新获取')
          $('.indentify_btn').css('opacity', '.55')
          $('.indentify_btn').css('fontSize', '13px')
          i--
          // if (i === 45) {
          //   $('.phonic_tip').css('display', 'block')
          // }
          if (i === 0) {
            clearInterval(timer)
            this.IdentifyStatus = false
            $('.indentify_btn').css('opacity', '1')
            $('.indentify_btn').html('获取验证码')
          }
        }, 1000)
      },

      SignIn () {
        let phone = $('.phone_num').val()
        let code = $('.identify_code').val()

        if (!phone || !code) {
          this.$store.dispatch('boxyTip', { message: '请输入手机号或验证码' })
          return false
        } else if (!this.identifyingCode) {
          this.$store.dispatch('boxyTip', { message: '您输入的验证码有误' })
          return false
        }

        let data = { code: code,
          phone: phone,
          key: this.identifyingCode,
          device_id: this.deviceId,
          country_code: 'CN'
        }

        let self = this
        this.$store.dispatch('phoneLogin', {
          data: data,
          signIn () {
            let data = self.checkSubmitLogin
            self.$store.dispatch('saveUserInfo', data.result)
            $('.login_btn').text('正在进入...')
          }
        })
      },

      Voice () {
        let phone = $('.phone_num').val()
        $('.phonic_tip').css('display', 'none')
        this.$store.dispatch('getVoice', phone)
      }
    }
  }
</script>
