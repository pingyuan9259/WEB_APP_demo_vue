<!-- 直播IM表情包
     作者：阎垚月
     创建：2017-6 -->

<style lang="scss">
  @import './index';
</style>

<template>
  <div class="module-emoji">
    <ul class="emoji-tab-list">
      <li class="emoji-item"
        :key="index"
        v-for="(tab, index) in emojiTabList"
       :class="{'active': curEmojiIndex === index }"
       @click="switchEmojiTab(tab, index)">{{ tab }}</li>
    </ul>
    <ul class="emoji-data-list">
      <li class="emoji-item"
        v-for="(item, index) in curEmojiList"
        v-html="item.html"
        :key="index" @click="chooseEmoji(item.word)"></li>
    </ul>
  </div>
</template>

<script>
  import Emoji from './emoji'
  import emojiData from './emoji-data'
  import collection from 'lodash/collection'

  export default {
    data () {
      return {
        word: {},
        // emojiImg: '//7xrnqf.dl1.z0.glb.clouddn.com/img/sheet_apple_64.png',
        emojiImg: 'https://o4a7cbihz.qnssl.com/cover/159cf455-61b9-4f07-8152-b86946d915ce',
        emoji: null,
        emojiDataGrouped: null,
        curEmojiIndex: 0,
        curEmojiList: [],
        emojiTabList: {
          People: '人物',
          Nature: '自然',
          Foods: '食物',
          Activity: '活动',
          Places: '地点',
          Objects: '物体',
          Symbols: '符号',
          Flags: '旗帜'
        }
      }
    },
    mounted () {
      this._init().switchEmojiTab(0, 'People')
    },
    methods: {
      _init () {
        this.emoji = new Emoji()
        this.emoji.use_sheet = true
        this.emoji.img_sets.apple.sheet = this.emojiImg
        this.emojiDataGrouped = collection.groupBy(emojiData, 'c')
        return this
      },

      switchEmojiTab (key, index) {
        this.curEmojiList = []
        this.curEmojiIndex = index
        collection.forEach(this.emojiDataGrouped[index], (value) => {
          let word = `:${value.s}:`
          this.curEmojiList.push({
            word: word,
            html: this.emoji.replace_colons(word)
          })
        })
      },

      chooseEmoji (word) {
        this.word = this.emoji.replace_colons_ex(word)
        this.$store.dispatch('getChatEmoji', this.word)
      }
    }
  }
</script>
