/* 发贴相关状态机
 * 作者：平原
 * 2017-6-6 */

import { arrToObjByKey, formatTime } from '../../utils/enhance'

// apis
import CreatePost from '../../api/post/CreatePost'
import DeletePost from '../../api/post/DeletePost'
import DeleteReply from '../../api/post/DeleteReply'
import GetPostsList from '../../api/post/GetPostsList'
import LikePost from '../../api/post/LikePost'
import ReplyPost from '../../api/post/ReplyPost'
import GetUsersInfo from '../../api/common/GetUsersInfo'

const state = {
  comments: [
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
        labels: []
      }],
      audioUrl: '',
      imageContents: [{
        mediaContent: '',
        mediaId: '',
        mediaType: 9
      }]
    }
  ]
}

const mutations = {
  GET_COMMENTS_LIST (state, { comments, usersInfo, data }) {
    // 定义业务所需要的数组对象
    // 最终将接口中所需要的属性按照state.comments初始化的形式
    // 集中添加到该数组对象中
    let _comments = []
    for (let i in comments) {
      let _i = comments[i]
      let _ = {
        postId: _i.id,
        pid: 0,
        avatar: usersInfo[_i.userId].avatar,
        fromName: usersInfo[_i.userId].fullname,
        labels: usersInfo[_i.userId].labels, // 获取用户标签
        fromUserId: _i.userId,
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
        let __ = {
          mediaContent: _k.mediaContent,
          mediaId: _k.mediaId,
          mediaType: _k.mediaType
        }
        _.imageContents.push(__)
      }

      // 循环插入帖子列表中的回复列表
      for (let j in _i.replyVoList) {
        let _j = _i.replyVoList[j]
        let __ = {
          replyId: _j.replyId,
          fromUserId: usersInfo[_j.fromUserId].id,
          fromName: usersInfo[_j.fromUserId].fullname,
          labels: usersInfo[_j.fromUserId].labels, // 获取用户标签
          // eslint-disable-next-line
          content: _j.content ? _j.content.replace(/\n/g, '<br>') : '',
          toUserId: usersInfo[_j.toUserId].id,
          toName: usersInfo[_j.toUserId].fullname
        }

        _.replyList.push(__)
      }

      _comments.push(_)
    }

    // 如果当前页不是1，则代表是滚动加载，数组需要追加
    if (data.page === 1) {
      state.comments = Object.assign([], _comments)
    } else {
      state.comments = state.comments.concat(_comments)
    }
  },

  // 以下update开头的mutations为操作成功以后更新视图状态
  UPDATE_REPLY_POST (state, data) {
    state.comments[data.index].replyList.push({
      replyId: data.replyId,
      // eslint-disable-next-line
      content: data.message ? data.message.replace(/\n/g, '<br>') : '',
      toUserId: data.toUserId,
      toName: data.toName,
      fromUserId: data.userId,
      fromName: data.name,
      labels: data.labels
    })
  },

  UPDATE_LIKE_POST (state, { index, isLike }) {
    let _ = state.comments[index]
    _.isLike = !isLike
    _.likeNum = isLike ? --_.likeNum : ++_.likeNum
  },

  UPDATE_DELETE_POST (state, index) {
    state.comments.splice(index, 1)
  },

  UPDATE_DELETE_REPLY (state, { index, rIndex }) {
    state.comments[index].replyList.splice(rIndex, 1)
  }
}

const actions = {
  // 获取讨论内容
  async getCommentsList ({ commit }, data) {
    try {
      let res = await GetPostsList(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)
      let comments = res.result.rows

      // 需要GetUsersInfo获取用户信息
      // 将每个贴子的userId收集
      let userIds = []
      for (let i in comments) {
        let _i = comments[i]
        userIds.push(_i.userId)
        for (let j in _i.replyVoList) {
          let _j = _i.replyVoList[j]
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
      commit('GET_COMMENTS_LIST', { comments, usersInfo, data })

      // loadStatus用于滚动加载的状态判断
      let loadStatus = {
        loaded: true,
        allLoaded: comments.length < data.limit
      }
      return loadStatus
    } catch (err) {
      console.log(err)
    }
  },

  // 发贴子
  async createPost ({ commit }, data) {
    try {
      let res = await CreatePost(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '发布成功' })
      return true
    } catch (err) {
      console.log(err)
    }
  },

  // 回复
  async replyPost ({ commit }, data) {
    try {
      let res = await ReplyPost(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '回复成功' })
      data.replyId = res.result.replyId
      // 获取用户标签
      let userIds = []
      userIds.push(res.result.fromUserId)
      let replyUserInfo = await GetUsersInfo(userIds)
      data.labels = replyUserInfo.result[0].labels

      commit('UPDATE_REPLY_POST', data)
      return true
    } catch (err) {
      console.log(err)
    }
  },

  // 点赞
  async likePost ({ commit }, { postId, isLike, index }) {
    try {
      // 如果目前没点赞，则type=1(点赞)
      let likeType = 1
      if (isLike) likeType = 2
      let res = await LikePost({ postId, likeType })
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('UPDATE_LIKE_POST', { index, isLike })
    } catch (err) {
      console.log(err)
    }
  },

  // 删除贴子
  async deletePost ({ commit }, { postId, replyId, index }) {
    try {
      let res = await DeletePost(postId)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '删除成功' })
      commit('UPDATE_DELETE_POST', index)
    } catch (err) {
      console.log(err)
    }
  },

  // 删除回复
  async deletePostReply ({ commit }, { replyId, index, rIndex }) {
    try {
      let res = await DeleteReply(replyId)
      if (res.code === 0) return commit('REQUEST_FAIL', res)

      commit('BOXY_SHOW', { type: 'tip', message: '删除成功' })
      commit('UPDATE_DELETE_REPLY', { index, rIndex })
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
