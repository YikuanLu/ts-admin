import React, { FC, useEffect, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'
import { Table, Button, message } from 'antd'
import { reGetMedial } from '@/api/common'
import { ExternalResources } from '@/pages/main/article/type'

export interface ListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toReGet?: (res: any) => void
}

const showContent = (data: { url: string, type: string, id: string }): React.ReactElement => {
  if (data.type === 'image') {
    return <img style={{ width: '160px' }} src={data.url} alt="" />
  }
  return (
    <video
      controls
      style={{ width: '160px' }}
      src={data.url}
    >
      <track
        default
        kind="captions"
        srcLang="en"
      />
    </video>
  )
}

const DownloadDemo: FC<ListProps> = (props: ListProps) => {
  const { dataSource = [], toReGet } = props
  const [externalResources, saveExternalResources] = useState<ExternalResources[]>([])
  useEffect((): void => {
    saveExternalResources(dataSource)
  }, [dataSource])
  const columns: ColumnsType<ExternalResources> = [
    {
      title: '类型',
      align: 'center',
      render: (value): React.ReactElement => <div>{value.type}</div>
    },
    {
      title: '位置',
      align: 'center',
      dataIndex: 'position',
      render: (value): React.ReactElement => (<div>{value === 'normal' ? '--' : '文章封面'}</div>)
    },
    {
      title: '内容',
      align: 'center',
      render: (value): React.ReactElement => showContent(value)
    },
    {
      title: '操作',
      align: 'center',
      width: 300,
      render: (_, value, index): React.ReactElement => (
        <div>
          <Button type="primary" size="small" style={{ marginRight: '8px' }}>
            <a target="_blank" rel="noopener noreferrer" href={value.url} download>下载</a>
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={(): void => {
              if (value.ref) {
                reGetMedial({ ref: value.ref }).then((res) => {
                  const { data } = res
                  if (res.status === 200) {
                    message.success('重新获取成功')
                    const newArr = externalResources
                    newArr[index].url = `${data}`
                    saveExternalResources([])
                    saveExternalResources(newArr)
                  }
                  if (toReGet) {
                    toReGet(res)
                  }
                })
              } else if (value.sourceUrl) {
                window.open(value.sourceUrl)
              } else {
                message.error('原链接已失效')
              }
            }}
          >
            重新获取
          </Button>

          {value.sourceUrl
            && (
              <Button type="primary" size="small" style={{ marginLeft: '8px' }}>
                <a target="_blank" rel="noopener noreferrer" href={value.sourceUrl}>查看原链接</a>
              </Button>
            )}

        </div>
      )
    }
  ]
  return (
    <Table
      rowKey="url"
      size="small"
      pagination={false}
      columns={columns}
      dataSource={externalResources}
    />
  )
}

export default DownloadDemo
