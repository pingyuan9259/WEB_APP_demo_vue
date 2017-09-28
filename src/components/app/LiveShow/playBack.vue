<template>
	<div class="play-back-page">
    <!-- 直播间的header -->
    <div class="live_header">
      <div class="logo">
        <img src="//o4a7cbihz.qnssl.com/picture/1250d1e3-6b26-4b28-8360-11356335bee9" alt="返回首页">
      </div>
    </div>
    <div id="video-box">
    </div>
  </div>
</template>
<script>
  import AES from '../../../libs/DES'
  import { AES_KEY } from '../../../config/'
  import CheckCourseIsBuy from '../../../api/pay/CheckCourseIsBuy'
  import { mapState } from 'vuex'
  import sensorsdata from '../../../utils/sensorsdata'

  let $ = window.$
  let backPlayer
  let w = document.documentElement.clientWidth
  let h = document.documentElement.clientHeight - 90
  // 获取url上的参数
  const GetQueryString = (name) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }

  export default {
    data () {
      return {
        playbackUrl: '',
        schedulesIndex: null
      }
    },
    computed: mapState({
      courseInfo: state => state.course.courseInfo
    }),
    created () {
      this.playbackUrl = AES.outAes(window.localStorage.getItem('pburl'), AES_KEY)
      let courseId = GetQueryString('courseId')
      this.schedulesIndex = +GetQueryString('index') + 1
      this.$store.dispatch('getCourseInfo', courseId)
      this.checkCourse(courseId)
    },
    mounted () {
      window.onresize = function () {
        w = document.documentElement.clientWidth
        h = document.documentElement.clientHeight - 90
        // 控制播放器自适应
        window.qcplayer.el.style.width = w + 'px'
        window.qcplayer.el.style.height = h + 'px'
        $('video').css('width', w)
        $('video').css('height', h)
      }
      // 神策数据上报
      sensorsdata.track()
      window.onload = function () {
        // 在页面加载完毕或者也不用加载完毕,定义一个初始时间
        var start = new Date()
        // 在页面关闭前,调用sa的track方法
        window.onunload = function () {
          var end = new Date()
          // 如果用户一直不关闭页面，可能出现超大值，可以根据业务需要处理，例如设置一个上限
          var duration = (end.getTime() - start.getTime()) / 1000
          // 定义一个记录页面停留时间的事件pageView,并且保存需要的属性(停留时间和当前页面的地址)
          sensorsdata.saStayed('pageclose', duration)
        }
      }
    },
    watch: {
      courseInfo (val) {
        let saTitle = `${val.name}第${this.schedulesIndex + 1}节web回放`
        sensorsdata.saEvent(saTitle)
      }
    },
    methods: {
      playerInit () {
        let options = {
          mp4: this.playbackUrl,
          autoplay: true,
          width: w,
          height: h,
          flash: false
        }

        backPlayer = new window.TcPlayer('video-box', options)
        window.qcplayer = backPlayer
      },
      async checkCourse (courseId) {
        try {
          // 判断是否购买
          let isBuy = await CheckCourseIsBuy(courseId)
          if (isBuy) {
            this.playerInit()
          } else {
            this.$store.dispatch('boxyTip', { message: '您尚未购买此课程' })
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
<style lang="scss">
  .live_header {
    width: 100%;
    background-color: #fff;
    height: 90px;
    line-height: 90px;
    text-align: left;
    position: relative;

    .logo {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -25px;
      margin-top: -25px;
      display: inline-block;
      width: 50px;
      height: 50px;
      transition: all .2s ease-out;
      img {
        width: 50px;
        height: 50px;
      }
    }

    .logo:hover {
      transform: scale(1.05);
    }
  }
</style>
