/* 写作写文章页面的数据处理方法库
 * 作者：平原
 * 创建：2017-8-14 */

import Store from '../../../vuex/store'
// import _ from 'lodash'

export default {
  // 将草稿信息作为编辑器初始化信息
  initEditorData (articleDetails, channelList) {
    let data = {
      title: articleDetails.title,
      content: articleDetails.content || ''
    }

    // 内容需要通过预先置入的<pry>来判断之前编辑的是富文本还是markdown
    // 初始化数据要将<pry>标签去除
    let html = articleDetails.html
    let type = 'html'
    let hideMask = html.substr(html.indexOf('<pry'), html.indexOf('</pry>', -1) + 6)
    if (hideMask.indexOf('mkdn') > -1) {
      type = 'mkdn'
    }
    data.type = type
    data.html = html.replace(hideMask, '')

    // 获取频道信息
    for (let i in channelList) {
      let _i = channelList[i]
      if (_i.bbsId === articleDetails.bbsId) {
        data.bbsId = _i.bbsId
        data.bbsAvatar = _i.bbsAvatar
        data.bbsName = _i.bbsName || '请选择频道'
        break
      }
    }

    // 获取封面url
    // 因为使用ElementUI图片上传，所以格式要与其匹配
    let coverUrl = ''
    data.cover = []
    try {
      coverUrl = articleDetails.imageContents[0].mediaContent
    } catch (err) {}
    if (coverUrl) {
      data.cover.push({ url: coverUrl })
    }

    return data
  },

  // 提交验证
  checkEditorData (type, hasUpload, editorData, initEditorData) {
    // 避免上传图片、音频时提交
    if (hasUpload) return false

    // 预览
    if (type === 'preview') {
      if (!editorData.title) {
        Store.dispatch('boxyTip', { message: '请输入文章标题' })
        return false
      }
      if (!editorData.html) {
        Store.dispatch('boxyTip', { message: '请输入文章正文' })
        return false
      }
    }

    // 检查文章是否被编辑
    if (type === 'modified') {
      // 如果编辑器数据和初始化时候的不一致，代表已经修改
      let isEqual = true
      for (let i in editorData) {
        if (i === 'type') continue
        if (editorData[i] !== initEditorData[i]) {
          isEqual = false
          break
        }
      }
      // console.log(editorData, initEditorData, isEqual)
      if (isEqual) return false
    }

    // 保存草稿
    if (type === 'save') {
      // 草稿要求有标题，不然用着用着会出现好多没有标题的草稿
      if (!editorData.title) {
        Store.dispatch('boxyTip', { message: '请输入文章标题' })
        return false
      }
    }

    // 发布
    if (type === 'publish') {
      if (!editorData.title) {
        Store.dispatch('boxyTip', { message: '请输入文章标题' })
        return false
      }
      if (!editorData.html || editorData.html === '<p><br></p>') {
        Store.dispatch('boxyTip', { message: '请输入文章正文' })
        return false
      }
      if (!editorData.cover.length) {
        Store.dispatch('boxyTip', { message: '请选择文章封面' })
        return false
      }
      if (!editorData.bbsId) {
        Store.dispatch('boxyTip', { message: '请选择频道' })
        return false
      }
    }

    return true
  }
}
