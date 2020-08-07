import React, { FC, useState, useEffect } from 'react'
import { useParams, useLocation, useHistory, Link } from 'react-router-dom'
import { Space, Button, Card, Tabs, message } from 'antd'
import { getParamObj } from '@/utils/commonFn'

import style from './style.module.sass'
import ReportList from '@/components/main/option/reportList'
import ReportHistoryList from '@/components/main/option/reportHistoryList'
import { getArticleReportInfo, getUserReportInfo, getCommentReportInfo } from '@/api/main/report'
import ImgMask from '@/components/main/option/reportList/imgMask'
import { ArticleReportInfoProps, UserReportInfoProps, CommentReportInfoProps } from './type'
import NoneWrap from '@/components/common/noneContent'

const { TabPane } = Tabs


const DefaultBaseReportInfo = {
  information: {
    authorUser: '',
    businessId: '',
    id: '',
    nickName: '',
    releaseTime: '',
    title: '',
    unsolved: false
  },
  user: {
    businessId: '',
    createTime: '',
    id: '',
    userName: '',
    unsolved: false
  },
  comment: {
    businessId: '',
    content: '',
    createTime: '',
    id: '',
    nickName: '',
    pics: [],
    userId: '',
    videos: [],
    unsolved: false
  },
}

export const acceptanceResultEnum = [
  {
    key: 'RETRACT',
    name: '撤回文章（受理成功后，文章将被撤回）',
    message: '撤回文章',
    toast: '文章已撤回，请至文章列表查看',
    type: 'information'
  }, {
    key: 'DISABLE_USER',
    name: '撤回文章，并禁用作者（受理成功后，文章将被撤回且文章作者将被禁用）',
    message: '撤回文章，并禁用作者',
    toast: '已撤回文章并禁用作者，请至文章、用户列表查看',
    type: 'information'
  }, {
    key: 'IGNORE',
    name: '无效举报，忽略',
    message: '无效举报，忽略',
    toast: '已受理',
    type: 'information'
  }, {
    key: 'DISABLE_USER',
    name: '禁用用户（受理成功后，用户将被禁用）',
    message: '禁用用户',
    toast: '用户已禁用，请至用户列表查看',
    type: 'user'
  }, {
    key: 'IGNORE',
    name: '无效举报，忽略',
    message: '无效举报，忽略',
    toast: '已受理',
    type: 'user'
  }, {
    key: 'RETRACT',
    name: '屏蔽回复（受理成功后，回复将被屏蔽）',
    message: '屏蔽回复',
    toast: '回复已撤回，请至回复列表查看',
    type: 'comment'
  }, {
    key: 'DISABLE_USER',
    name: '屏蔽回复，并禁用回复用户（受理成功后，回复将被屏蔽且回复用户将被禁用）',
    message: '屏蔽回复，并禁用回复用户',
    toast: '已屏蔽回复并禁用作者，请至回复、用户列表查看',
    type: 'comment'
  }, {
    key: 'IGNORE',
    name: '无效举报，忽略',
    message: '无效举报，忽略',
    toast: '已受理',
    type: 'comment'
  }
]

const ReportDetail: FC = () => {
  const { type } = useParams()
  const { search } = useLocation()
  const { id, businessId } = getParamObj(search)
  const history = useHistory()
  const [reportListLength, saveReportListLength] = useState<number>(0)
  const [reportHistoryListLength, saveReportHistoryListLength] = useState<number>(0)
  const [baseReportInfo, saveBaseReportInfo] = useState<{
    information: ArticleReportInfoProps;
    user: UserReportInfoProps;
    comment: CommentReportInfoProps;
  }>(DefaultBaseReportInfo)


  useEffect(() => {
    const types = ['information', 'user', 'comment']
    if (id && businessId && types.includes(type)) {
      if (type === 'information') {
        getArticleReportInfo<{ id: string }, ArticleReportInfoProps>({ id }).then((res) => {
          const { data } = res
          saveBaseReportInfo({ ...baseReportInfo, information: data })
        })
      }
      if (type === 'user') {
        getUserReportInfo<{ id: string }, UserReportInfoProps>({ id }).then((res) => {
          const { data } = res
          saveBaseReportInfo({ ...baseReportInfo, user: data })
        })
      }
      if (type === 'comment') {
        getCommentReportInfo<{ id: string }, CommentReportInfoProps>({ id }).then((res) => {
          const { data } = res
          saveBaseReportInfo({ ...baseReportInfo, comment: data })
        })
      }
    } else {
      message.error('页面参数错误')
      history.replace('/report')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id, businessId])

  const showBtnsEle = (): React.ReactElement => (
    <Space>
      <Button
        type="primary"
        ghost
        onClick={(): void => {
          history.replace('/report')
        }}
      >
        返回

      </Button>
    </Space>
  )

  const renderImg = (data: {
    type: string, url:
    { imgUrl: string, videoUrl?: string }
  }[]): React.ReactElement | null =>
    (
      data.length > 0 ? (
        <div className={style.imageBox}>
          {
            data.map((item) => (
              <ImgMask key={item.url.imgUrl} canClick type={item.type} url={item.url} />
            ))
          }
        </div>
      )
        : null
    )

  const articleInfoEle = (): React.ReactElement => (
    <>
      <div>
        <span>文章标题：</span>
        <Link
          target="_blank"
          to={`/article/edit?id=${businessId}`}
        >
          {baseReportInfo.information.title}
        </Link>
      </div>
      <div>
        <span>文章作者：</span>
        <span>{`${'['}${baseReportInfo.information.authorUser}]${baseReportInfo.information.nickName}`}</span>
      </div>
      <div>
        <span>发布时间：</span>
        <span>{baseReportInfo.information.releaseTime}</span>
      </div>
    </>
  )
  const userInfoEle = (): React.ReactElement => (
    <>
      <div>
        <span>被举报用户：</span>
        <Link
          target="_blank"
          to={`/userInfo/edit?id=${businessId}`}
        >
          {`${'['}${baseReportInfo.user.businessId}]${baseReportInfo.user.userName}`}
        </Link>
      </div>
      <div>
        <span>注册时间：</span>
        <span>{`${baseReportInfo.user.createTime}`}</span>
      </div>
    </>
  )
  const commentInfoEle = (): React.ReactElement => {
    const { pics, videos } = baseReportInfo.comment
    const imgList = pics.map((item) =>
      ({ type: 'img', url: { imgUrl: item.url } }))
      .concat(videos.map((item) => (
        { type: 'video', url: { imgUrl: item.videoCover, videoUrl: item.url } }
      )))
    return (
      <>
        <div>
          <span>回复ID：</span>
          <Link
            target="_blank"
            to={`/comment?id=${businessId}`}
          >
            {`${baseReportInfo.comment.businessId}`}
          </Link>
        </div>
        <div>
          <span>回复信息：</span>
          <span>
            <NoneWrap showText={baseReportInfo.comment.content} />
            {renderImg(imgList)}
          </span>
        </div>
        <div>
          <span>回复用户：</span>
          <span>{`${'['}${baseReportInfo.comment.userId}]${baseReportInfo.comment.nickName}`}</span>
        </div>
        <div>
          <span>回复时间：</span>
          <span>{`${baseReportInfo.comment.createTime}`}</span>
        </div>
      </>
    )
  }

  const reportInfo = (): React.ReactElement | null => {
    if (type === 'information') {
      return articleInfoEle()
    }
    if (type === 'user') {
      return userInfoEle()
    }
    if (type === 'comment') {
      return commentInfoEle()
    }
    return null
  }

  return (
    <Card
      headStyle={{ padding: 0 }}
      bodyStyle={{ padding: '30px 0px' }}
      bordered={false}
      title={showBtnsEle()}
    >
      <div className={style.baseInfo}>
        <h4>基本信息</h4>
        <div className={style.infoBox}>{reportInfo()}</div>
        <Tabs
          defaultActiveKey="1"
          size="small"
          style={{ marginBottom: 32 }}
          type="card"
        >
          <TabPane
            forceRender
            tab={`举报记录(${reportListLength})`}
            key="1"
          >
            <ReportList
              listLength={(data: number): void => { saveReportListLength(data) }}
            />
          </TabPane>
          <TabPane
            forceRender
            tab={`受理记录(${reportHistoryListLength})`}
            key="2"
          >
            <ReportHistoryList
              listLength={(data: number): void => { saveReportHistoryListLength(data) }}
            />
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
}

export default ReportDetail
