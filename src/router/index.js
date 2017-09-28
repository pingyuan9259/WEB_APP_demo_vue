/* 路由配置
 * 作者：平原
 * 创建：2017-5-27 */

import Vue from 'vue'
import Router from 'vue-router'
import { APP_TOKEN_KEY } from '../config'
import Cookie from '../utils/cookie'
import Index from '../components/app/Index/'
import User from '../components/app/User/'
import Login from '../components/app/Login/'
import Home from '../components/pages/Home/'
import LiveShow from '../components/app/LiveShow/'
import PlayBack from '../components/app/LiveShow/playBack'
import Lessons from '../components/pages/Lessons/'
import LessonDetails from '../components/pages/LessonDetails/'
import MyLessons from '../components/pages/MyLessons/'
import MyLessonDetails from '../components/pages/MyLessonDetails/'
import LessonSchedules from '../components/modules/LessonSchedules/'
import LessonHomework from '../components/modules/LessonHomework/'
import LessonComments from '../components/modules/LessonComments/'
import HomeworkComments from '../components/pages/HomeworkComments/'
import MyProfile from '../components/pages/MyProfile/'
import MyAccount from '../components/pages/MyAccount'

import Writing from '../components/app/Writing'
import writingEditPage from '../components/pages/writingEditPage'
import WritingArticles from '../components/pages/WritingArticles'
import WritingDraft from '../components/pages/WritingDraft'
import WritingHistory from '../components/pages/WritingHistory'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      component: Index,
      alias: '/',
      children: [
        {
          path: '',
          name: 'Home',
          component: Home
        },
        {
          path: 'lessons',
          name: 'Lessons',
          component: Lessons
        },
        {
          path: 'lessons/details',
          name: 'LessonDetails',
          component: LessonDetails
        }
      ]
    },
    {
      path: '/user',
      alias: '/teacher',
      name: 'User',
      meta: { needLogin: true },
      component: User,
      redirect: '/user/lessons',
      children: [
        {
          path: 'lessons',
          name: 'MyLessons',
          meta: { needLogin: true },
          component: MyLessons
        },
        {
          path: 'lessons/details',
          name: 'MyLessonDetails',
          meta: { needLogin: true },
          component: MyLessonDetails,
          redirect: 'lessons/details/schedules',
          children: [
            {
              path: 'schedules',
              name: 'LessonSchedules',
              meta: {
                initStateDisabled: true, // 有此项则store不会被初始化
                needLogin: true
              },
              component: LessonSchedules
            },
            {
              path: 'homework',
              name: 'LessonHomework',
              meta: {
                initStateDisabled: true,
                needLogin: true
              },
              component: LessonHomework
            },
            {
              path: 'comments',
              name: 'LessonComments',
              meta: {
                initStateDisabled: true,
                needLogin: true
              },
              component: LessonComments
            }
          ]
        },
        {
          path: 'lessons/homework-comments',
          name: 'HomeworkComments',
          meta: { needLogin: true },
          component: HomeworkComments
        },
        {
          path: 'my-profile',
          name: 'MyProfile',
          meta: { needLogin: true },
          component: MyProfile
        },
        {
          path: 'my-account',
          name: 'MyAccount',
          meta: { needLogin: true },
          component: MyAccount
        }
      ]
    },
    {
      path: '/writing',
      name: 'Writing',
      meta: { needLogin: true },
      component: Writing,
      redirect: '/writing/article',
      children: [
        {
          path: 'edit',
          name: 'writingEditPage',
          meta: { needLogin: true },
          component: writingEditPage
        },
        {
          path: 'article',
          name: 'WritingArticles',
          meta: { needLogin: true },
          component: WritingArticles
        },
        {
          path: 'draft',
          name: 'WritingDraft',
          meta: { needLogin: true },
          component: WritingDraft
        },
        {
          path: 'history',
          name: 'WritingHistory',
          meta: { needLogin: true },
          component: WritingHistory
        }
      ]
    },
    {
      path: '/liveshow',
      name: 'LiveShow',
      meta: { needLogin: true },
      component: LiveShow
    },
    {
      path: '/playback',
      name: 'PlayBack',
      meta: { needLogin: true },
      component: PlayBack
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
    if (!Cookie.getCookie(APP_TOKEN_KEY)) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
