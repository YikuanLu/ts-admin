import { lazy } from 'react'

const MaterialList = lazy(() => import('@/pages/main/material/list'))
const MaterialEdit = lazy(() => import('@/pages/main/material/edit'))
const ArticleList = lazy(() => import('@/pages/main/article/list'))
const ArticleEdit = lazy(() => import('@/pages/main/article/edit'))
const CommentList = lazy(() => import('@/pages/main/comment/list'))
const labelType = lazy(() => import('@/pages/main/thesaurus/labelType'))
const labelList = lazy(() => import('@/pages/main/thesaurus/labelList'))
const SectionList = lazy(() => import('@/pages/main/topic/sectionList'))
const TopicList = lazy(() => import('@/pages/main/topic/topicList/list'))
const TopicEdit = lazy(() => import('@/pages/main/topic/topicList/edit'))
const OptionReportList = lazy(() => import('@/pages/main/option/report/list'))
const ScrollBanner = lazy(() => import('@/pages/main/appOption/scrollBanner'))
const OptionReportDetail = lazy(() =>
  import('@/pages/main/option/report/detail')
)
const articleShielded = lazy(() =>
  import('@/pages/main/option/shielded/articleShielded/list')
)
const topicShielded = lazy(() =>
  import('@/pages/main/option/shielded/topicShielded/list')
)
const userShielded = lazy(() =>
  import('@/pages/main/option/shielded/userShielded/list')
)
const RecommendGameList = lazy(() =>
  import('@/pages/main/appOption/recommendGame/list')
)

export const mainRoutes = [
  {
    name: '素材管理',
    key: 'main-material',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '文章素材',
        key: 'main-material-list',
        isShowInMenu: true,
        subMenu: false,
        path: '/material/list',
        component: MaterialList
      },
      {
        name: '文章素材编辑',
        key: 'main-material-edit',
        from: 'main-material-list',
        isShowInMenu: false,
        subMenu: false,
        path: '/material/list/:id',
        component: MaterialEdit
      }
    ]
  },
  {
    name: '文章管理',
    key: 'main-article',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '文章列表',
        key: 'main-article-list',
        isShowInMenu: true,
        subMenu: false,
        path: '/article',
        component: ArticleList
      },
      {
        name: '文章编辑',
        key: 'main-article-edit',
        from: 'main-article-list',
        isShowInMenu: false,
        subMenu: false,
        path: '/article/:type',
        component: ArticleEdit
      }
    ]
  },
  {
    name: '回复管理',
    key: 'main-comment',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '回复列表',
        key: 'main-comment-list',
        isShowInMenu: true,
        subMenu: false,
        path: '/comment',
        component: CommentList
      }
    ]
  },
  {
    name: '词库管理',
    key: 'main-thesaurus',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '标签分类',
        key: 'main-thesaurus-labelType',
        isShowInMenu: true,
        subMenu: false,
        path: '/label-type',
        component: labelType
      },
      {
        name: '标签列表',
        key: 'main-thesaurus-labelList',
        isShowInMenu: true,
        subMenu: false,
        path: '/label-list',
        component: labelList
      }
    ]
  },
  {
    name: '话题管理',
    key: 'main-topic',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '版块列表',
        key: 'main-topic-sectionList',
        isShowInMenu: true,
        subMenu: false,
        path: '/section',
        component: SectionList
      },
      {
        name: '话题列表',
        key: 'main-topic-topicList',
        isShowInMenu: true,
        subMenu: false,
        path: '/topic',
        component: TopicList
      },
      {
        name: '话题编辑',
        key: 'main-topic-topicEdit',
        isShowInMenu: false,
        subMenu: false,
        path: '/topic/:type',
        component: TopicEdit
      }
    ]
  },
  {
    name: '管理工具',
    key: 'main-option',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '举报列表',
        key: 'main-option-reportList',
        isShowInMenu: true,
        subMenu: false,
        path: '/report',
        component: OptionReportList
      },
      {
        name: '举报详情',
        key: 'main-option-reportDetail',
        isShowInMenu: false,
        subMenu: false,
        exact: true,
        path: '/report/:type',
        component: OptionReportDetail
      },
      {
        name: '屏蔽列表',
        key: 'main-shielded',
        isShowInMenu: true,
        subMenu: true,
        routes: [
          {
            name: '文章屏蔽',
            key: 'main-shielded-articleList',
            isShowInMenu: true,
            subMenu: false,
            path: '/shielded/article',
            component: articleShielded
          },
          {
            name: '话题屏蔽',
            key: 'main-shielded-topicList',
            isShowInMenu: true,
            subMenu: false,
            path: '/shielded/topic',
            component: topicShielded
          },
          {
            name: '用户屏蔽',
            key: 'main-shielded-userList',
            isShowInMenu: true,
            subMenu: false,
            path: '/shielded/user',
            component: userShielded
          }
        ]
      }
    ]
  },
  {
    name: 'APP配置',
    key: 'main-appOption',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '轮播图管理列表',
        key: 'main-appOption-scrollBannerList',
        isShowInMenu: true,
        subMenu: false,
        path: '/scrollBanner',
        component: ScrollBanner
      },
      {
        name: '赛事推荐管理',
        key: 'main-appOption-RecommendGameList',
        isShowInMenu: true,
        subMenu: false,
        path: '/recommend/list',
        component: RecommendGameList
      }
    ]
  }
]
