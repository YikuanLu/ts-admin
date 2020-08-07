import { lazy } from 'react'

const SportsList = lazy(() => import('@/pages/sport/baseInfo/list'))

const BasketballMatch = lazy(() =>
  import('@/pages/sport/basketball/match/list')
)
const BasketballMatchItem = lazy(() =>
  import('@/pages/sport/basketball/match/edit')
)

const BasketballSeason = lazy(() =>
  import('@/pages/sport/basketball/season/list')
)

const BasketballTeam = lazy(() => import('@/pages/sport/basketball/team/list'))
const BasketballTeamItem = lazy(() =>
  import('@/pages/sport/basketball/team/edit')
)

const BasketballPlayer = lazy(() =>
  import('@/pages/sport/basketball/player/list')
)
const BasketballPlayerItem = lazy(() =>
  import('@/pages/sport/basketball/player/edit')
)

const BasketballSchedule = lazy(() =>
  import('@/pages/sport/basketball/schedule/list')
)

const BasketballRecordEdit = lazy(() =>
  import('@/pages/sport/basketball/dataRecord')
)

const FootballMatch = lazy(() => import('@/pages/sport/football/match/list'))
const FootballMatchItem = lazy(() =>
  import('@/pages/sport/football/match/edit')
)
const FootballSeason = lazy(() => import('@/pages/sport/football/season/list'))
const FootballTeam = lazy(() => import('@/pages/sport/football/team/list'))
const FootballTeamItem = lazy(() => import('@/pages/sport/football/team/edit'))
const FootballPlayer = lazy(() => import('@/pages/sport/football/player/list'))
const FootballPlayerItem = lazy(() =>
  import('@/pages/sport/football/player/edit')
)
const FootballSchedule = lazy(() =>
  import('@/pages/sport/football/schedule/list')
)

export const sportRoutes = [
  {
    name: '基础信息',
    key: 'sport-baseInfo',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '体育项目',
        key: 'sport-baseInfo-sports',
        isShowInMenu: true,
        subMenu: false,
        path: '/sports/base',
        component: SportsList
      }
    ]
  },
  {
    name: '篮球比赛',
    key: 'sport-basketball',
    isShowInMenu: true,
    subMenu: true,
    routes: [
      {
        name: '赛程赛果',
        key: 'sport-basketball-schedule',
        isShowInMenu: true,
        subMenu: false,
        path: '/basketball/schedule',
        component: BasketballSchedule
      },
      {
        name: '赛事列表',
        key: 'sport-basketball-list',
        isShowInMenu: true,
        subMenu: false,
        path: '/basketball/match',
        component: BasketballMatch
      },
      {
        name: '赛事详情',
        key: 'sport-basketball-edit',
        isShowInMenu: false,
        subMenu: false,
        exact: true,
        path: '/basketball/match/:id',
        component: BasketballMatchItem
      },
      {
        name: '赛季列表',
        key: 'sport-basketball-season',
        isShowInMenu: true,
        subMenu: false,
        path: '/basketball/season',
        component: BasketballSeason
      },
      {
        name: '球队列表',
        key: 'sport-basketball-team',
        isShowInMenu: true,
        subMenu: false,
        path: '/basketball/team',
        component: BasketballTeam
      },
      {
        name: '球队编辑',
        key: 'sport-basketball-team-edit',
        exact: true,
        isShowInMenu: false,
        subMenu: false,
        path: '/basketball/team/:id',
        component: BasketballTeamItem
      },
      {
        name: '球员列表',
        key: 'sport-basketball-player',
        isShowInMenu: true,
        subMenu: false,
        path: '/basketball/player',
        component: BasketballPlayer
      },
      {
        name: '球员编辑',
        key: 'sport-basketball-player-edit',
        exact: true,
        isShowInMenu: false,
        subMenu: false,
        path: '/basketball/player/:id',
        component: BasketballPlayerItem
      },
      {
        name: '数据记录',
        key: 'sport-basketball-record',
        isShowInMenu: true,
        subMenu: false,
        path: '/basketball/record',
        component: BasketballRecordEdit
      }
    ]
  },
  {
    name: '足球比赛',
    key: 'sport-football',
    isShowInMenu: true,
    subMenu: true,
    routes: [

      {
        name: '赛程赛果',
        key: 'sport-football-schedule',
        isShowInMenu: true,
        subMenu: false,
        path: '/football/schedule',
        component: FootballSchedule
      },
      {
        name: '赛事列表',
        key: 'sport-football-list',
        isShowInMenu: true,
        subMenu: false,
        path: '/football/match',
        component: FootballMatch
      },
      {
        name: '赛事详情',
        key: 'sport-football-edit',
        isShowInMenu: false,
        subMenu: false,
        exact: true,
        path: '/football/match/:id',
        component: FootballMatchItem
      },
      {
        name: '赛季列表',
        key: 'sport-football-season',
        isShowInMenu: true,
        subMenu: false,
        path: '/football/season',
        component: FootballSeason
      },
      {
        name: '球队列表',
        key: 'sport-football-team',
        isShowInMenu: true,
        subMenu: false,
        path: '/football/team',
        component: FootballTeam
      },
      {
        name: '球队编辑',
        key: 'sport-football-team-edit',
        exact: true,
        isShowInMenu: false,
        subMenu: false,
        path: '/football/team/:type',
        component: FootballTeamItem
      },
      {
        name: '球员列表',
        key: 'sport-football-player',
        isShowInMenu: true,
        subMenu: false,
        path: '/football/player',
        component: FootballPlayer
      },
      {
        name: '球员编辑',
        key: 'sport-football-player-edit',
        exact: true,
        isShowInMenu: false,
        subMenu: false,
        path: '/football/player/:type',
        component: FootballPlayerItem
      },
    ]
  }
]
