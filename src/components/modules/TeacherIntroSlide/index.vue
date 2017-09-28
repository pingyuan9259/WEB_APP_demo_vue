<!-- 首页老师介绍组件
     作者：平原
     创建：2017-6-28-->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="teacher_intro_slide">
    <span class="icon-double-quotation"></span>
    <ul class="intro_list">
      <li class="intro_item"
        :key="index"
        :style="teacherIntroStyle(index)"
        v-for="(item, index) in teacherIntrosArray">
        <div class="intro_desc">
          <img :src="item.content">
          <h5>{{ item.teacherName }}</h5>
          <span>{{ item.industry }}</span>
          <p>{{ item.text }}</p>
        </div>
      </li>
    </ul>

    <div class="teacher_intro_ctrl">
      <div class="intro_switch">
        <span class="prev icon-arrow-left" @click="switchTeacherInfo('prev')"></span>
        <span class="next icon-arrow-right" @click="switchTeacherInfo('next')"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        curTeacherIntroIndex: 0,
        atLeftIndex: 0,
        atRightIndex: 1,
        teacherIntroLength: 0,
        teacherIntrosArray: [
          {
            content: 'https://o4a7cbihz.qnssl.com/cover/97a2b2fb-5691-4e02-ba75-be873ebaaca9',
            teacherName: '李笑来',
            industry: '天使投资人',
            text: '能够识别哪些是能改变的，哪些是不能改变的很重要，因为只有这样我们才能对他们有正确的反应，进而让我们 80% 的生命内容变得有意义起来'
          },
          {
            content: 'https://o4a7cbihz.qnssl.com/cover/97a2b2fb-5691-4e02-ba75-be873ebaaca9',
            teacherName: '这里上演了真假李笑来',
            industry: '天使投资人',
            text: '能够识别哪些是能改变的，哪些是不能改变的很重要，因为只有这样我们才能对他们有正确的反应，进而让我们 80% 的生命内容变得有意义起来'
          },
          {
            content: 'https://o4a7cbihz.qnssl.com/cover/97a2b2fb-5691-4e02-ba75-be873ebaaca9',
            teacherName: '你们是李笑来，那我是谁',
            industry: '天使投资人',
            text: '能够识别哪些是能改变的，哪些是不能改变的很重要，因为只有这样我们才能对他们有正确的反应，进而让我们 80% 的生命内容变得有意义起来'
          },
          {
            content: 'https://o4a7cbihz.qnssl.com/cover/97a2b2fb-5691-4e02-ba75-be873ebaaca9',
            teacherName: '我才是李笑来',
            industry: '天使投资人',
            text: '能够识别哪些是能改变的，哪些是不能改变的很重要，因为只有这样我们才能对他们有正确的反应，进而让我们 80% 的生命内容变得有意义起来'
          },
          {
            content: 'https://o4a7cbihz.qnssl.com/cover/97a2b2fb-5691-4e02-ba75-be873ebaaca9',
            teacherName: '我也是李笑来',
            industry: '天使投资人',
            text: '能够识别哪些是能改变的，哪些是不能改变的很重要，因为只有这样我们才能对他们有正确的反应，进而让我们 80% 的生命内容变得有意义起来'
          }
        ]
      }
    },

    created () {
      this.teacherIntroLength = this.teacherIntrosArray.length
      this.atLeftIndex = this.teacherIntroLength - 1
    },

    methods: {
      switchTeacherInfo (type) {
        let len = this.teacherIntroLength - 1
        switch (type) {
          case 'next':
            if (this.curTeacherIntroIndex === 0) {
              this.atLeftIndex --
              this.atRightIndex --
              this.curTeacherIntroIndex = this.teacherIntroLength - 1
            } else {
              this.atLeftIndex === 0 ? this.atLeftIndex = len : this.atLeftIndex --
              this.atRightIndex === 0 ? this.atRightIndex = len : this.atRightIndex --
              this.curTeacherIntroIndex --
            }
            break
          case 'prev':
            if (this.curTeacherIntroIndex < len) {
              this.atLeftIndex === len ? this.atLeftIndex = 0 : this.atLeftIndex ++
              this.atRightIndex === len ? this.atRightIndex = 0 : this.atRightIndex ++
              this.curTeacherIntroIndex ++
            } else {
              this.curTeacherIntroIndex = 0
              this.atRightIndex ++
              this.atLeftIndex ++
            }
            break
        }
      },

      teacherIntroStyle (index) {
        let left = ''
        let opacity = ''
        let zIndex = ''
        let transform = 'scale(0.74)'
        if (index === this.curTeacherIntroIndex) {
          left = '50%'
          opacity = '1'
          zIndex = '99'
          transform = 'scale(1)'
        } else if (index === this.atLeftIndex) {
          left = '63%'
          opacity = '0.5'
          zIndex = '9'
        } else if (index === this.atRightIndex) {
          left = '37%'
          opacity = '0.5'
          zIndex = '9'
        } else {
          opacity = '0'
        }
        return {
          left: left,
          zIndex: zIndex,
          opacity: opacity,
          transform: transform,
          transition: 'all .6s ease-in-out'
        }
      }
    }
  }
</script>
