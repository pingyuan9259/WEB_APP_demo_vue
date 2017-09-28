<!-- 论坛音频组件
     作者：平原
     组件链：论坛组件 > 论坛音频组件
     创建：2017-6-30
     优化：2017-7-7 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div
    @click="audioControl()"
    :class="{ 'audio_active': playing }"
    class="audio_message">
    <audio
      :src="audioUrl"
      :id="'audio' + index">
      您的浏览器暂时不支持展示语音信息
    </audio>
    <span
      v-if="!playing"
      class="icon-play"></span>
    <span
      v-if="playing"
      class="icon-stop"></span>
    <span class="audio_time">{{ duration + ' s' }}</span>
    <span class="icon-wave"></span>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        playing: 0,
        audio: {},
        audioSet: [],
        duration: NaN,
        timer: null
      }
    },

    props: {
      audioUrl: {
        required: true,
        tyle: String
      },
      index: {
        required: true,
        tyle: Number
      }
    },

    computed: mapState({
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      eventEmitter (val) {
        let { event, data } = val
        if (event === 'stopAllAudios' && data !== this.index) {
          this.stopAudio()
        }
      }
    },

    mounted () {
      this.audio = document.getElementById('audio' + this.index)
      this.audioEvent('canplay', this.getDuration)
    },

    methods: {
      getDuration () {
        this.duration = parseInt(this.audio.duration)
      },

      audioEvent (event, callback) {
        this.audio.addEventListener(event, callback, false)
      },

      audioControl () {
        this.$store.dispatch('eventEmitter', { event: 'stopAllAudios', data: this.index })
        if (this.playing === 1) {
          this.stopAudio()
        } else {
          this.playAudio()
        }
      },

      stopAudio () {
        this.audio.pause()
        this.playing = 0
        this.audio.currentTime = 0.0
        this.duration = parseInt(this.audio.duration)
        clearInterval(this.timer)
      },

      playAudio () {
        this.audio.play()
        this.playing = 1
        this.timer = setInterval(() => {
          --this.duration
          if (this.duration < 0) {
            this.stopAudio()
          }
        }, 1000)
      }
    }
  }
</script>
