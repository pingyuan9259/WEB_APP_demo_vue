<!-- 课时编辑对话框组件
     作者：平原
     2017-7-21
     注释2#，代表不是由vue事件绑定或生命周期直接调用的方法，即二级方法 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="schedule_editor">
    <div class="editor">
      <div class="option">
        <h3>添加课程</h3>
        <a  class="submit btn_solid_small" @click="confirmEditor()">确 认</a>
        <a  class="cancel btn_hollow_small" @click="closeEditor()">返 回</a>
        <a  class="delete btn_hollow_small" v-if="editorType !== 'add'" @click="deleteSchedule()">删 除</a>
      </div>
      <div class="title">
        <span>课程名称：</span>
        <input type="text" v-model="newScheduleTitle" placeholder="填写名称">
      </div>
      <div class="date">
        <span>上课时间：</span>
        <el-date-picker
          v-model="dateModel.date"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          @change="getDate"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-time-select
          v-model="dateModel.start"
          placeholder="起始时间"
          @change="getStartTime"
          :picker-options="{
            start: '7:30',
            step: '00:15',
            end: '22:30',
            format: 'HH:mm:ss'
          }">
        </el-time-select>
        <el-time-select
          v-model="dateModel.end"
          placeholder="结束时间"
          @change="getEndTime"
          :picker-options="{
            start: '7:30',
            step: '00:15',
            end: '22:30',
            format: 'HH',
            minTime: dateModel.start
          }">
        </el-time-select>
        <div class="play_back">
            <span>回放地址：</span>
            <input type="text" v-model="playbackUrl" placeholder="填写回放地址"><br>
            <span>回放描述：</span>
            <input type="text" v-model="playbackDes" placeholder="填写回放描述">
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AES from '../../../libs/DES'
  import { AES_KEY } from '../../../config/'

  export default {
    data () {
      return {
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        dateModel: {
          date: '',
          start: '',
          end: ''
        },
        dateSelected: '',
        startSelected: '',
        endSelected: '',
        newScheduleStart: '',
        newScheduleEnd: '',
        newScheduleTitle: '',
        scheduleId: '',
        isNextShow: 0,
        playbackUrl: '',
        playbackDes: ''
      }
    },

    props: {
      courseId: {
        required: true,
        type: String
      },
      editorData: {
        type: Object
      },
      editorType: {
        required: true,
        type: String
      }
    },

    mounted () {
      if (this.editorType === 'update') {
        this.scheduleId = this.editorData.scheduleId
        this.newScheduleTitle = this.editorData.title
        this.dateModel.date = this.editorData.date
        this.dateModel.start = this.editorData.start
        this.dateModel.end = this.editorData.end
        this.isNextShow = this.editorData.isNextShow
        this.playbackUrl = this.editorData.playbackUrl
        this.playbackDes = this.editorData.playbackDes
      }
    },

    methods: {
      // el-date-picker、el-time-select组件change事件
      getDate (val) { this.dateSelected = val },
      getStartTime (val) { this.startSelected = val },
      getEndTime (val) { this.endSelected = val },

      // 点击课程表编辑框确定事件
      confirmEditor () {
        if (!this.newScheduleTitle) {
          this.$store.dispatch('boxyTip', { message: '请输入课程名称' })
          return
        } else if (!this.dateSelected) {
          this.$store.dispatch('boxyTip', { message: '请选择上课日期' })
          return
        } else if (!this.startSelected) {
          this.$store.dispatch('boxyTip', { message: '请选择上课时间' })
          return
        } else if (!this.endSelected) {
          this.$store.dispatch('boxyTip', { message: '请选择下课时间' })
          return
        }
        if (this.editorType === 'add') this.addSchedule()
        if (this.editorType === 'update') this.updateSchedule()
      },

      closeEditor (needInit) {
        this.$store.dispatch('eventEmitter', {
          event: 'closeScheduleEditor',
          data: { needInit: needInit }
        })
      },

      // 删除课表，调updateSchedule
      deleteSchedule () {
        let self = this
        this.$store.dispatch('boxyWarning', {
          message: '确定删除该课时？',
          confirm () {
            self.updateSchedule('delete')
          }
        })
      },

      // 2#: 添加课表
      async addSchedule () {
        if (this.playbackDes && this.playbackDes.length > 30) {
          this.$store.dispatch('boxyTip', { message: '回放描述最大长度为30字' })
          return
        }
        await this.$store.dispatch('addCourseSchedule', {
          productId: this.courseId,
          title: this.newScheduleTitle,
          description: '',
          beginAt: this.dateSelected + ' ' + this.startSelected + ':00',
          endAt: this.dateSelected + ' ' + this.endSelected + ':00',
          playbackUrl: this.playbackUrl && AES.inAes(this.playbackUrl, AES_KEY),
          playbackDes: this.playbackDes
        })
        this.closeEditor('needInit')
      },

      // 2#: 更新课表，删除课表
      async updateSchedule (isDelete) {
        if (!isDelete && this.playbackDes && this.playbackDes.length > 30) {
          this.$store.dispatch('boxyTip', { message: '回放描述最大长度为30字' })
          return
        }
        if (isDelete) isDelete = 0
        await this.$store.dispatch('updateCourseSchedule', {
          productId: this.courseId,
          id: this.scheduleId,
          title: this.newScheduleTitle,
          description: '',
          beginAt: this.dateSelected + ' ' + this.startSelected + ':00',
          endAt: this.dateSelected + ' ' + this.endSelected + ':00',
          status: isDelete, // status如果为0是删除，为空是更新
          isNextShow: this.isNextShow,
          playbackUrl: this.playbackUrl && AES.inAes(this.playbackUrl, AES_KEY),
          playbackDes: this.playbackDes
        })
        this.closeEditor('needInit')
      }
    }
  }
</script>
