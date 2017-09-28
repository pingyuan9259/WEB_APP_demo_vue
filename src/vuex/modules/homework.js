/* 作业相关状态机
 * 作者：平原
 * 2017-5-31 */

import { arrToObjByKey, formatTime } from '../../utils/enhance'

// apis
import CreateHomework from '../../api/homework/CreateHomework'
import DeleteHomework from '../../api/homework/DeleteHomework'
import DeleteReply from '../../api/homework/DeleteReply'
import GetHomeworkList from '../../api/homework/GetHomeworkList'
import GetHomeworkDetails from '../../api/homework/GetHomeworkDetails'
import GetReplysList from '../../api/homework/GetReplysList'
import LikeHomework from '../../api/homework/LikeHomework'
import ReplyHomework from '../../api/homework/ReplyHomework'
import GetUsersInfo from '../../api/common/GetUsersInfo'

const state = {
  homeworkList: [
    {
      postId: '',
      title: '',
      content: '',
      createdTime: '',
      replyNum: ''
    }
  ],

  homeworkComments: [
    {
      postId: '',
      replyId: '',
      pid: '',
      avatar: '',
      fromName: '',
      fromUserId: '',
      content: '',
      createdTime: '',
      isLike: '',
      likeNum: '',
      replyNum: '',
      labels: [],
      replyList: [{
        replyId: '',
        fromUserId: '',
        fromName: '',
        content: '',
        toUserId: '',
        toName: '',
        labels: [],
        audioUrl: '',
        imageContents: [{
          mediaContent: '',
          mediaId: '',
          mediaType: 9
        }]
      }],
      audioUrl: '',
      imageContents: [{
        mediaContent: '',
        mediaId: '',
        mediaType: 9
      }]
    }
  ],

  homeworkDetails: {
    title: '',
    content: ''
  }
}

const mutations = {
  GET_HOMEWORK_LIST (state, { posts, data }) {
    // 定义业务所需要的数组对象
    // 最终将接口中所需要的属性按照state.comments初始化的形式
    // 集中添加到该数组对象中
    let _homeworkList = []

    for (let i in posts) {
      let _i = posts[i]
      let _ = {
        postId: _i.id,
        title: _i.title,
        userId: _i.userId,
        content: _i.content,
        createdTime: formatTime(_i.createdAt / 1000),
        replyNum: _i.replyNum
      }

      _homeworkList.push(_)
    }

    // 如果当前页不是1，则代表是滚动加载，数组需要追加
    if (data.page === 1) {
      state.homeworkList = Object.assign([], _homeworkList)
    } else {
      state.homeworkList = state.homeworkList.concat(_homeworkList)
    }
  },

  GET_HOMEWORK_COMMENTS (state, { replys, usersInfo, data }) {
    // 作用同上
    let homeworkComments = []

    for (let i in replys) {
      let _i = replys[i]
      let _ = {
        postId: _i.postId,
        replyId: _i.replyId,
        pid: _i.pid,
        avatar: usersInfo[_i.fromUserId].avatar,
        fromName: usersInfo[_i.fromUserId].fullname,
        labels: usersInfo[_i.fromUserId].labels, // 获取用户标签
        fromUserId: _i.fromUserId,
        // eslint-disable-next-line
        content: _i.content ? _i.content.replace(/\n/g, '<br>') : '',
        createdTime: formatTime(_i.createdAt / 1000),
        isLike: _i.likeOrNot,
        likeNum: _i.likeNum,
        replyNum: _i.replyNum,
        replyList: [],
        audioUrl: _i.audioContents[0] ? _i.audioContents[0].mediaContent : '',
        imageContents: []
      }

      // 循环插入帖子列表中的图片
      for (let k in _i.imageContents) {
        let _k = _i.imageContents[k]
        let ___ = {
          mediaContent: _k.mediaContent,
          mediaId: _k.mediaId,
          mediaType: _k.mediaType
        }
        _.imageContents.push(___)
      }

      // 循环插入帖子列表中的回复列表
      for (let j in _i.children) {
        let _j = _i.children[j]
        let __ = {
          replyId: _j.replyId,
          fromUserId: usersInfo[_j.fromUserId].id,
          fromName: usersInfo[_j.fromUserId].fullname,
          labels: usersInfo[_j.fromUserId].labels, // 获取用户标签
          // eslint-disable-next-line
          content: _j.content ? _j.content.replace(/\n/g, '<br>') : '',
          toUserId: usersInfo[_j.toUserId].id,
          toName: usersInfo[_j.toUserId].fullname,
          audioUrl: _j.audioContents[0] ? _j.audioContents[0].mediaContent : '',
          imageContents: []
        }

        // 循环插入回复列表中的图片
        for (let l in _j.imageContents) {
          let _l = _j.imageContents[l]
          let ___ = {
            mediaContent: _l.mediaContent,
            mediaId: _l.mediaId,
            mediaType: _l.mediaType
          }
          __.imageContents.push(___)
        }

        _.replyList.push(__)
      }

      homeworkComments.push(_)
    }

    // 如果当前页不是1，则代表是滚动加载，数组需要追加
    if (data.page === 1) {
      state.homeworkComments = Object.assign([], homeworkComments)
    } else {
      state.homeworkComments = state.homeworkComments.concat(homeworkComments)
    }
  },

  GET_HOMEWORK_DETAILS (state, homeworkDetails) {
    if (homeworkDetails.content) {
      // eslint-disable-next-line
      homeworkDetails._content = homeworkDetails.content.replace(/\n/g, '<br>')
    }
    state.homeworkDetails = Object.assign({}, homeworkDetails)
  },

  // 以下update开头的mutations为操作成功以后更新视图状态
  UPDATE_REPLY_HOMEWORK (state, data) {
    let mediaContents = []
    for (let i in data.imagesUrl) {
      mediaContents.push({ mediaContent: data.imagesUrl[i] })
    }

    state.homeworkComments[data.index].replyList.push({
      replyId: data.replyId,
      // eslint-disable-next-line
      content: data.message ? data.message.replace(/\n/g, '<br>') : '',
      toUserId: data.toUserId,
      toName: data.toName,
      fromUserId: data.userId,
      fromName: data.name,
      labels: data.labels,
      imageContents: mediaContents
    })
  },

  UPDATE_LIKE_HOMEWORK (state, { index, isLike }) {
    let _ = state.homeworkComments[index]
    _.isLike = !isLike
    _.likeNum = isLike ? --_.likeNum : ++_.likeNum
  },

  UPDATE_DELETE_COMMENTS (state, index) {
    state.homeworkComments.splice(index, 1)
  },

  UPDATE_DEL_HW_REPLY (state, { index, rIndex }) {
    state.homeworkComments[index].replyList.splice(rIndex, 1)
  }
}

const actions = {
  // 获取作业列表
  async getHomeworkList ({ commit }, data) {
    try {
      let res = await GetHomeworkList(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)
      let posts = res.result.rows
      commit('GET_HOMEWORK_LIST', { posts, data })

      // loadStatus用于滚动加载的状态判断
      let loadStatus = {
        loaded: true,
        allLoaded: posts.length < data.limit
      }
      return loadStatus
    } catch (err) {
      console.log(err)
    }
  },

  // 获取作业回复列表
  async getReplysList ({ commit }, data) {
    try {
      let res = await GetReplysList(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)
      let replys = res.result.rows

      // 需要GetUsersInfo获取用户信息
      // 将每个贴子的userId收集
      let userIds = []
      for (let i in replys) {
        let _i = replys[i]
        userIds.push(_i.fromUserId)
        userIds.push(_i.toUserId)
        for (let j in _i.children) {
          let _j = _i.children[j]
          userIds.push(_j.fromUserId)
          userIds.push(_j.toUserId)
        }
      }

      // 获得用户信息并以id规约为对象
      let _res = await GetUsersInfo(userIds)
      if (_res.code === 0) return commit('REQUEST_FAIL', _res)
      let usersInfo = _res.result
      usersInfo = arrToObjByKey('id', usersInfo)

      commit('LOADING_SHOW', { id: 'commentsList', isShow: false })
      commit('GET_HOMEWORK_COMMENTS', { replys, usersInfo, data })

      // loadStatus用于滚动加载的状态判断
      let loadStatus = {
        loaded: true,
        allLoaded: replys.length < data.limit
      }
      return loadStatus
    } catch (err) {
      console.log(err)
    }
  },

  // 获取作业贴子详情
  async getHomeworkDetails ({ commit }, postId) {
    try {
      let res = await GetHomeworkDetails(postId)
      if (res.code === 0) return commit('REQUEST_FAIL', res)
      let homeworkDetails = res.result

      commit('GET_HOMEWORK_DETAILS', homeworkDetails)
    } catch (err) {
      console.log(err)
    }
  },

  // 留作业
  async createHomework ({ commit }, data) {
    try {
      let res = await CreateHomework(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '发布成功' })
      return true
    } catch (err) {
      console.log(err)
    }
  },

  // 写作业或者回复别人的作业
  async replyHomework ({ commit }, data) {
    try {
      let res = await ReplyHomework(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)
      // 获取用户标签
      let userIds = []
      userIds.push(res.result.fromUserId)
      let replyUserInfo = await GetUsersInfo(userIds)
      data.labels = replyUserInfo.result[0].labels

      commit('BOXY_SHOW', { type: 'tip', message: '发布成功' })
      data.replyId = res.result.replyId
      commit('UPDATE_REPLY_HOMEWORK', data)
      return true
    } catch (err) {
      console.log(err)
    }
  },

  // 点赞
  async likeHomework ({ commit }, { replyId, isLike, index }) {
    try {
      // 如果目前没点赞，则type=1(点赞)
      let likeType = 1
      if (isLike) likeType = 2
      let res = await LikeHomework({ replyId, likeType })
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('UPDATE_LIKE_HOMEWORK', { index, isLike })
    } catch (err) {
      console.log(err)
    }
  },

  // 删除老师留的作业（删除贴子）
  async deleteHomework ({ commit }, { postId }) {
    try {
      let res = await DeleteHomework(postId)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '删除成功' })
    } catch (err) {
      console.log(err)
    }
  },

  // 删除做的作业（删除一级回复）
  async deleteHomeworkReply ({ commit }, { postId, replyId, index }) {
    try {
      let res = await DeleteReply(replyId)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '删除成功' })
      commit('UPDATE_DELETE_COMMENTS', index)
    } catch (err) {
      console.log(err)
    }
  },

  // 删除comments回复（删除二级回复）
  async deleteHomeworkCommentsReply ({ commit }, { replyId, index, rIndex }) {
    try {
      let res = await DeleteReply(replyId)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '删除成功' })
      commit('UPDATE_DEL_HW_REPLY', { index, rIndex })
    } catch (err) {
      console.log(err)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
