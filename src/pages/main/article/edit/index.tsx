import React, { FC, useEffect, useState, ReactElement } from 'react'
import {
  Row,
  Col,
  Form,
  Input,
  Radio,
  Button,
  InputNumber,
  message,
  Modal,
  Descriptions,
  // DatePicker,
  TreeSelect,
  Card
} from 'antd'

import BraftEditor from 'braft-editor'
import { useHistory, useLocation, Prompt, useParams } from 'react-router-dom'
import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { isEqual } from 'lodash'
// import moment from 'moment'
import { articleTypes } from '@/pages/main/statusType'
import RichEdit from '@/components/common/richEdit'
import ProUpload from '@/components/common/upload'
import DownloadList from '@/components/main/article/DownloadList'
import { getClientUser } from '@/api/user'
import { UserInfoItem, UploadInfo, ExternalResources, ILocation, RaceProp, PolymerItem, FileConvertData, SeasonItem } from '../type'
import { createArticle, getArticleDetail } from '@/api/main'
import style from '../style.module.sass'
import { getParamObj, clearObj } from '@/utils/commonFn'
import { validateContentFC, validateVideFC, RaceConvertToBack, polymerConverTree, handleExternalResources, polymerConverMatchAssociation } from './editFC'
import AddMatchList from '@/components/main/article/AddMatchList'
import { sportScheduleList, sportTeamList, sportPlayerList } from '@/api/sport/base'
import { ProSportSelection } from '@/components/main/article/ProSportSelection'
import { getLabelList, getTopicList } from '@/api/main/article'
import { ProUserSelection } from '@/components/main/article/ProUserSelection'
import { ProLablesSelection } from '@/components/main/article/ProLablesSelection'
import { ProTopicSelection } from '@/components/main/article/ProTopicSelection'
import { getOssUrl } from '@/config/publicConfig'


const { Group } = Radio
const { TextArea } = Input
const { confirm } = Modal
const { SHOW_CHILD } = TreeSelect
const rowSpan = 16
const formItemLayout = {
  labelCol: {
    lg: { span: 4 },
    md: { span: 24 }
  },
  wrapperCol: {
    lg: { span: 20 },
    md: { span: 24 }
  }
}
const defaultObj = {
  id: '',
  title: '',
  released: false,
  articlesType: '',
  sortType: '',
  sortValue: 0,
  content: '',
  imagesName: [],
  sourceUrl: '',
  videoInfo: { fileName: '', width: 0, height: 0, format: '', duration: 0, videoCover: '' },
  cover: { fileName: '', orientation: 0, width: 0, height: 0, url: '', format: '' },
  matchAssociation: [],
  competition: [],
  teams: [],
  labels: [],
  teamMembers: [],
  reprinted: false,
  videoCover: '',
  sourceCover: '',
  authorUser: '',
  authorUserName: '',
  releaseUser: '',
  timingTime: null,
  reptileArticleId: '',
  download: {
    images: [],
    videos: [{
      url: '',
      ref: ''
    }]
  }
}
const defaultUploadInfo: UploadInfo = defaultObj
const defaultFileConvertData: FileConvertData = defaultObj
// const vType = { PICTURE: 'COMMUNITY', VIDEO: 'COMMUNITY', INFORMATION: 'INFORMATION' }

const defaultRace: RaceProp = {
  normalList: [{
    name: '足球',
    id: '0',
    type: 'FOOTBALL',
  }],
  treeList: [
    {
      title: '足球',
      key: '0',
      type: 'FOOTBALL',
      children: []
    }, {
      title: '篮球',
      key: '1',
      type: 'BASKETBALL',
      children: []
    }
  ]
}

const ArticleEdit: FC = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const { search } = useLocation()
  const [modalVisible, setModalVisible] = useState(false)
  const [canLink, setCanLink] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [linkToPath, saveLinkToPath] = useState<string>('')
  const [externalResources, saveExternalResources] = useState<ExternalResources[]>([])
  const [backupData, saveBackupData] = useState<UploadInfo>(defaultUploadInfo)
  const [initData, saveInitData] = useState<FileConvertData>(defaultFileConvertData)
  const [initUser, saveInitUser] = useState<UserInfoItem>({} as UserInfoItem)
  const [raceList, setRaceList] = useState(defaultRace)
  const { type: pageType } = useParams()


  // 获取体育项目下的赛事的平铺数据
  const getSportsSeasonList = (): void => {
    sportScheduleList({}).then((res): void => {
      const { data } = res
      setRaceList({
        treeList: polymerConverTree(data as PolymerItem[]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        normalList: data as PolymerItem[]
      })
    })
  }

  // 获取文章详情
  const getDetail = (id: string): void => {
    getArticleDetail({ id }).then((res) => {
      setIsLoading(false)
      const { data,
        data: {
          videoCover,
          cover,
          sortValue,
          authorUserName,
          authorUser,
          authorUserUuid,
          matchAssociation,
          subject
        }
      } = res
      // console.log(data)
      const saveData = {
        ...data,
        content: data.content,
        authorUser: authorUser !== '0' && authorUserName ? authorUser : undefined,
        videoCover: videoCover ? videoCover.url : '',
        matchAssociation: polymerConverMatchAssociation(matchAssociation),
        cover: cover && cover.fileName ? cover.url : undefined,
        sortValue: sortValue || null,
        subjectId: subject
      }

      // 资源列表
      saveExternalResources(handleExternalResources(data as UploadInfo))
      if (authorUser !== '0' && authorUserName) {
        saveInitUser({
          id: authorUser,
          nickName: authorUserName,
          uuid: authorUserUuid
        })
      }
      form.setFieldsValue(saveData)
    }).catch((): void => {
      setIsLoading(false)
    })
  }

  // 检测文章内容是否有变动
  const checkHasChange = (): boolean => {
    const oldData = clearObj({ ...initData, videoInfo: { fileName: initData.videoInfo.fileName } })
    const newData = clearObj({
      ...backupData,
      videoInfo: { fileName: backupData.videoInfo.fileName }
    })
    return isEqual(oldData, newData)
  }

  const handleClose = (event: BeforeUnloadEvent): void => {
    // eslint-disable-next-line no-param-reassign
    event.returnValue = true
  }

  useEffect(() => {
    const { id } = getParamObj(search)
    window.addEventListener('beforeunload', handleClose, false)
    // 获取赛事列表(平铺数据)
    getSportsSeasonList()
    if (pageType === 'edit') {
      if (id) {
        getDetail(id)
      } else {
        throw Error('文章编辑缺少id')
      }
    } else {
      setIsLoading(false)
    }
    return (): void => {
      window.removeEventListener('beforeunload', handleClose, false)
    }
    // eslint-disable-next-line
  }, [])

  useEffect((): void => {
    if (checkHasChange()) {
      window.sessionStorage.removeItem('canLogOut')
    } else {
      window.sessionStorage.setItem('canLogOut', 'false')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backupData])
  const toBack = (): void => {
    if (!checkHasChange()) {
      confirm({
        title: '您有未编辑完成的文章内容或标题',
        icon: <ExclamationCircleOutlined />,
        content: '单击OK按钮后，返回列表后将不会保存，是否确定返回？',
        onOk() {
          setCanLink(true)
          history.replace('/article')
        },
      })
    } else {
      setCanLink(true)
      history.replace('/article')
    }
  }

  const toReleaseData = (obj: UploadInfo, released: boolean): void => {
    createArticle(obj).then((): void => {
      // 页面来源(编辑/新建)
      setCanLink(true)
      const isEdit = pageType === 'edit'
      let msg = ''
      if (released) {
        msg = '文章已发布到用户平台~'
      } else if (isEdit) {
        msg = '文章修改成功~'
      } else {
        msg = '文章创建成功~'
      }
      message.success(msg)
      if (linkToPath === '') {
        history.replace('/article')
      }
    }).catch((): void => {
    })
  }

  const readyToRelease = (result: FileConvertData, released: boolean): void => {
    const { id } = getParamObj(search)
    setCanLink(false)
    // 替换视频封面和文章封面的资源路径为空
    const reg = new RegExp(`:"${getOssUrl()}/`, 'g')
    let obj: UploadInfo = {
      id: id || null,
      released,
      appCreate: false,
      ...result,
      content: result.content ? result.content.toHTML() : '',
      videoInfo: { ...result.videoInfo, videoCover: result.videoCover },
      matchAssociation: RaceConvertToBack(result.matchAssociation as [], raceList.normalList),
      teams: result.teams,
      labels: result.labels.map((item): string => item.id)
    }
    obj = JSON.parse(JSON.stringify(obj).replace(reg, ':"'))
    if (released) {
      confirm({
        title: '温馨提示',
        icon: <ExclamationCircleOutlined />,
        content: '发布后文章会立即发布到用户平台，是否确定立即发布？',
        onOk() {
          toReleaseData(obj, released)
        },
      })
    } else {
      toReleaseData(obj, released)
    }
  }

  const getReleaseData = (released: boolean): void => {
    form.validateFields().then((result): void => {
      readyToRelease(result as FileConvertData, released)
    }).catch((error): void => {
      const { errorFields, values } = error
      if (errorFields.length > 0) {
        message.error(errorFields[0].errors[0])
      } else {
        readyToRelease(values, released)
      }
    })
  }

  const renderExternalResources = (): ReactElement | null => (externalResources.length > 0
    ? (
      <Row>
        <Col span={rowSpan}>
          <Descriptions
            bordered
          >
            <Descriptions.Item>
              <DownloadList dataSource={externalResources} />
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    ) : null)


  const showBtn = (): ReactElement => (
    pageType === 'create'
      ? (
        <div className={style.JustifyCenter}>
          <Button type="default" onClick={(): void => { getReleaseData(true) }}>
            创建并发布
          </Button>
          <Button style={{ marginLeft: '15px' }} type="primary" onClick={(): void => { getReleaseData(false) }}>
            创建文章
          </Button>
        </div>
      )
      : (
        <div className={style.JustifyCenter}>
          <Button type="default" onClick={toBack}>
            取消
          </Button>
          <Button style={{ marginLeft: '15px' }} type="primary" onClick={(): void => { getReleaseData(false) }}>
            保存
          </Button>
        </div>
      )
  )

  const handlePrompt = (locations: ILocation): boolean => {
    const { pathname } = locations
    saveLinkToPath(pathname)
    if (!canLink && !checkHasChange()) {
      setModalVisible(true)
      return false
    }
    return true
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const disabledDate = (current: any): boolean =>
  //   // Can not select days before today and today
  useEffect(() => {
    if (canLink === true) {
      history.push(linkToPath)
    }
  }, [canLink, history, linkToPath])
  return (
    <Card loading={isLoading} bordered={false}>
      <div>
        <Button onClick={toBack} style={{ float: 'right', color: '#31B7F3' }}>
          <LeftOutlined style={{ color: '#31B7F3' }} />
          <span>返回列表</span>
        </Button>
      </div>
      <Form
        form={form}
        layout="horizontal"
        labelAlign="left"
        initialValues={{
          articlesType: pageType === 'edit' ? null : articleTypes[0].key,
          reprinted: pageType === 'edit' && true,
          sortType: 'NORMAL',
          content: BraftEditor.createEditorState('')
        }}
        onValuesChange={(): void => {
          const data = form.getFieldsValue()
          const { title, content, competition = [], videoInfo: {
            duration,
            fileName,
            height,
            width } } = data
          const newObj = {
            ...data,
            content: content.toHTML(),
            videoInfo: {
              duration, fileName, height, width
            },
            competition: competition.map((item: SeasonItem): {} =>
              ({ type: item.type, id: item.id }))
          }
          if ((pageType !== 'create' && title && !initData.title) || (pageType === 'create' && !initData.articlesType)) {
            // 进入页面且标题第一次改动的时候记录一次值或者为创建的时候记录一次
            saveInitData(clearObj(newObj) as FileConvertData)
          }
          saveBackupData(clearObj(newObj) as UploadInfo)
        }}
      >
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              {...formItemLayout}
              label="文章类型"
              name="articlesType"
              rules={[{ required: true, message: '请选择文章类型' }]}
            >
              <Group>
                {
                  articleTypes.map((item) => (
                    <Radio key={item.key} value={item.key}>
                      {item.name}
                    </Radio>
                  ))
                }
              </Group>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item
              {...formItemLayout}
              label="文章标题"
              name="title"
              rules={
                [
                  { required: true, message: '请输入文章标题', }
                ]
              }
            >
              <Input placeholder="长度最长40" maxLength={40} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="authorUser"
              {...formItemLayout}
              label="作者"
              rules={
                [
                  { required: true, message: '请选择作者', }
                ]
              }
            >
              <ProUserSelection
                articleType={backupData.articlesType}
                initUsers={initUser}
                placeholder="选择用户"
                api={getClientUser}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="subjectId"
              {...formItemLayout}
              label="所属话题"
            >
              <ProTopicSelection
                placeholder="选择话题"
                api={getTopicList}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="content"
              {...formItemLayout}
              label="文章内容"
              rules={
                [
                  {
                    validator: (_, value): Promise<void> =>
                      validateContentFC(value, form)
                  }
                ]
              }
            >
              <RichEdit />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item
              {...formItemLayout}
              label="视频"
            >
              <Form.Item
                name="videoInfo"
                style={{ display: 'inline-block' }}
                rules={
                  [
                    {
                      validator: (_, value): Promise<void> =>
                        validateVideFC(value, form)
                    }
                  ]
                }
              >
                <ProUpload
                  uploadType="video"
                  showText="上传视频"
                  filesLength={1}
                />
              </Form.Item>

              <Form.Item
                name="videoCover"
                style={{ display: 'inline-block' }}
              >
                <ProUpload
                  aspect={16 / 9}
                  uploadType="image"
                  showText="上传封面"
                />
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="cover"
              {...formItemLayout}
              label="文章封面"
            >
              <ProUpload
                aspect={4 / 3}
                uploadType="image"
                showText="建议上传4/3比例的图片"
              />
            </Form.Item>
          </Col>
        </Row>
        {renderExternalResources()}
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              {...formItemLayout}
              label="权重类型"
              name="sortType"
            >
              <Group>
                <Radio value="NORMAL">常规排序</Radio>
                <Radio value="RECOMMEND">推荐排序</Radio>
                <Radio value="TOP">置顶排序</Radio>
              </Group>
            </Form.Item>

          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              {...formItemLayout}
              label="排序值"
              name="sortValue"
              rules={
                [
                  {
                    required: backupData.sortType !== 'NORMAL',
                    message: '请输入排序值'
                  },
                ]
              }
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="timingTime"
              {...formItemLayout}
              label="定时发布"
            >
              <DatePicker showTime disabledDate={disabledDate} />
            </Form.Item>
          </Col>
        </Row> */}
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="note"
              {...formItemLayout}
              label="备注"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              {...formItemLayout}
              label="来源"
              name="reprinted"
              rules={[{ required: true, message: '请选择文章类型' }]}
            >
              <Group>
                <Radio value={false}>
                  原创
                </Radio>
                <Radio value>
                  转载
                </Radio>
              </Group>
            </Form.Item>
          </Col>
        </Row>
        {
          backupData.reprinted && (
            <div>
              <Row>
                <Col span={rowSpan}>
                  <Form.Item
                    {...formItemLayout}
                    label="转载平台"
                    name="reprintPlatform"
                    rules={[{ required: backupData.reprinted, message: '请填写转载平台' }]}
                  >
                    <Input placeholder="转载平台" />
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="原文链接"
                    name="sourceLink"
                  >
                    <Input placeholder="原文链接" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )
        }
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="matchAssociation"
              {...formItemLayout}
              label="关联赛事"
            >
              <TreeSelect
                {...{
                  treeData: raceList.treeList,
                  treeCheckable: true,
                  showSearch: true,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  filterTreeNode: (inputNumber: string, treeNode: any): boolean =>
                    treeNode.title.toLowerCase().includes(inputNumber.toLowerCase()),
                  showCheckedStrategy: SHOW_CHILD,
                  placeholder: '选择赛事',
                  style: {
                    width: '100%',
                  },
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="teams"
              {...formItemLayout}
              label="关联球队"
            >
              <ProSportSelection
                selectProps={{ mode: 'multiple' }}
                placeholder="选择球队"
                api={sportTeamList}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="teamMembers"
              {...formItemLayout}
              label="关联球员"
            >
              <ProSportSelection
                selectProps={{ mode: 'multiple' }}
                placeholder="关联球员"
                api={sportPlayerList}
                dataType="sport"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="labels"
              {...formItemLayout}
              label="关联标签"
            >
              <ProLablesSelection
                selectProps={{ mode: 'multiple' }}
                placeholder="关联标签"
                api={getLabelList}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={rowSpan}>
            <Form.Item
              name="competition"
              {...formItemLayout}
              label="关联比赛"
            >
              <AddMatchList matchSearchList={raceList.normalList} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {showBtn()}
      <Prompt message={handlePrompt} when />
      <Modal
        title="提示"
        visible={modalVisible}
        closable={false}
        footer={(
          <div>
            <Button onClick={(): void => {
              setModalVisible(false)
              setCanLink(true)
            }}
            >
              不保存

            </Button>
            <Button onClick={(): void => {
              getReleaseData(false)
              setModalVisible(false)
            }}
            >
              保存

            </Button>
            <Button onClick={(): void => {
              setModalVisible(false)
              saveLinkToPath('')
            }}
            >
              取消

            </Button>
          </div>
        )}
      >
        <p>文章已被修改，是否保存此次变动？</p>
      </Modal>
    </Card>
  )
}

export default ArticleEdit
