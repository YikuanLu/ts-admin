import React, { useRef, MutableRefObject, ReactElement } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { AxiosPromise } from 'axios'
import { Button, Space, Modal, message, } from 'antd'
import { useHistory } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import ProTable, { ProTableHandles } from '@/components/common/table/proTable'
import { SearchItem, ListParams } from '@/components/common/table/types'

import style from '../style.module.sass'
import { toGetClientUser, changeUserForbidden, deleteUser } from '@/api/user'
import NoneWrap from '@/components/common/noneContent'
import { UserInfoItem } from '@/pages/main/article/type'


const searchList: SearchItem[] = [
  {
    name: '创建时间',
    type: 'rangePicker',
    key: 'createTime',
    rangeDateKey: {
      startTime: 'createStartTime',
      endTime: 'createEndTime'
    }
  },
  {
    name: '用户UID',
    type: 'number',
    key: 'uuid'
  },
  {
    name: '用户名',
    type: 'input',
    key: 'mobile'
  },
  {
    name: '用户昵称',
    type: 'input',
    key: 'nickname'
  },
  {
    name: '用户状态',
    type: 'select',
    key: 'forbidden',
    selectList: [{
      name: '启用',
      key: 'false'
    }, {
      name: '禁用',
      key: 'true'
    }
    ]
  },
]

const api = (data: ListParams): AxiosPromise => toGetClientUser(data)


const UserInfoList: React.FC = () => {
  const tableRef = useRef<ProTableHandles>() as MutableRefObject<ProTableHandles>
  const history = useHistory()

  const changeStatusModel = (userInfo: UserInfoItem, index: number): void => {
    const { forbidden, id } = userInfo
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: forbidden ? '是否启用该用户' : '是否禁用该用户',
      okText: '确认',
      cancelText: '取消',
      onOk: (): void => {
        changeUserForbidden({ userId: id, forbidden: !forbidden }).then(() => {
          tableRef.current.updataItem({ forbidden: !forbidden }, index)
          message.success('修改成功')
        })
      }
    })
  }
  const deleteModel = (userInfo: UserInfoItem): void => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否删除该用户',
      okText: '确认',
      cancelText: '取消',
      onOk: (): void => {
        deleteUser({ id: userInfo.id }).then(() => {
          tableRef.current.deleteItem(userInfo.id)
          message.success('删除')
        })
      }
    })
  }
  const columns: ColumnsType = [
    {
      title: '用户ID',
      width: 80,
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: '用户名',
      width: 50,
      dataIndex: 'mobile',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '用户昵称',
      width: 140,
      render: (value): ReactElement => {
        const { nickName, avatar, uuid } = value
        return (
          <>
            <div className={style.outBox}>
              <div className={style.logo}>
                <img src={avatar} alt="" />
              </div>
              <div className={style.textBox}>
                <div className={style.uid}>
                  {`[${uuid}]` || '[--]'}
                  {` ${nickName}` || ' --'}
                </div>
              </div>
            </div>
          </>
        )
      }
    },
    {
      title: '用户状态',
      width: 40,
      dataIndex: 'forbidden',
      render: (value): ReactElement => {
        const styles = value ? style.close : style.open
        return (
          <div className={styles}>
            {value ? '· 完全禁用' : '· 启用'}
          </div>
        )
      }
    },
    {
      title: '关注数',
      width: 40,
      dataIndex: 'followNum',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '粉丝数',
      width: 40,
      dataIndex: 'beFollowNum',
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '上次登录位置',
      width: 60,
      dataIndex: 'address',
      render: (value): ReactElement => (
        <NoneWrap noneText="未知地址" showText={value} />
      )
    },
    {
      title: '上次登录时间',
      width: 60,
      dataIndex: 'loginTime',
      key: 'loginTime',
      sorter: true,
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '用户IP',
      width: 60,
      dataIndex: 'ipAddress',
      render: (value): ReactElement => (
        <NoneWrap noneText="未知" showText={value} />
      )
    },
    {
      title: '创建时间',
      width: 60,
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
      render: (value): ReactElement => (
        <NoneWrap showText={value} />
      )
    },
    {
      title: '可用操作',
      width: 80,
      fixed: 'right',
      render: (_, record, index): ReactElement => {
        const itemData = record as UserInfoItem
        return (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={(): void => {
                history.push({ pathname: '/userInfo/edit', search: `?id=${itemData.id}` })
              }}
            >
              编辑
            </Button>
            <Button
              size="small"
              className={itemData.forbidden ? style.greenBtn : ''}
              danger={!itemData.forbidden}
              type={!itemData.forbidden ? 'primary' : 'default'}
              onClick={(): void => { changeStatusModel(itemData, index) }}
            >
              {itemData.forbidden ? '启用' : '禁用'}
            </Button>

            {itemData.forbidden && (
              <Button
                size="small"
                danger
                type="primary"
                onClick={(): void => { deleteModel(itemData) }}
              >
                删除
              </Button>
            )}
          </Space>
        )
      }
    },
  ]

  const headerBtnGroup = (
    <Button
      style={{ marginBottom: '10px' }}
      type="primary"
      onClick={(): void => {
        history.push({ pathname: '/userInfo/create' })
      }}
    >
      添加用户
    </Button>
  )
  return (
    <div>
      <ProTable
        ref={tableRef}
        api={api}
        headerBtnGroup={headerBtnGroup}
        scrollX={2200}
        tableProps={{
          columns,
        }}
        searchList={searchList}
      />
    </div>
  )
}

export default UserInfoList
