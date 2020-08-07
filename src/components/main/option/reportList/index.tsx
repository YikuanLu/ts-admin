import React, { FC, useEffect, useState } from 'react'
import { List } from 'antd'

import { useParams, useLocation } from 'react-router-dom'
import style from './style.module.sass'
import ImgMask from './imgMask'
import { getComplainDetailList } from '@/api/main/report'
import { getParamObj } from '@/utils/commonFn'
import { ComplainDetailItem, ListParams, ListRes } from './type'
import { ReportType } from './reportType'
import NoneWrap from '@/components/common/noneContent'

interface ReportListProps {
  listLength?: (data: number) => void,
}

const ReportList: FC<ReportListProps> = (props: ReportListProps) => {
  const { listLength } = props
  const { type } = useParams()
  const { search } = useLocation()
  const { businessId } = getParamObj(search)
  const [listData, saveListData] = useState<{
    count: number,
    list: ComplainDetailItem[]
  }>({
    count: 0,
    list: [],
  })
  const getList = (page = 0, pageSize: number): void => {
    getComplainDetailList<ListParams, ListRes>({
      businessId: `${businessId}`,
      type: type.toUpperCase(),
      size: pageSize,
      page,
    }).then((res) => {
      const { data: { content, count } } = res
      saveListData({ ...listData, list: content, count })
    })
  }
  useEffect((): void => {
    getList(0, 30)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect((): void => {
    if (listLength) {
      listLength(listData.count)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData])

  const renderImg = (data: string[]): React.ReactElement => (
    data.length > 0 ? (
      <div className={style.imageBox}>
        {
          data.map((item) => (
            <ImgMask canClick type="img" key={item} url={{ imgUrl: item }} />
          ))
        }
      </div>
    )
      : <span>--</span>
  )

  return (
    <List
      itemLayout="vertical"
      size="small"
      pagination={{
        onChange: (page, pageSize = 30): void => {
          getList(page - 1, pageSize)
        },
        onShowSizeChange: (current, size): void => {
          getList(current - 1, size)
        },
        pageSizeOptions: ['10', '30'],
        defaultPageSize: 30,
        total: listData.count
      }}
      dataSource={listData.list}
      renderItem={(record): React.ReactElement => (
        <List.Item>
          <div className={style.reportItem}>
            <div>
              <span>举报时间：</span>
              <span>{record.createTime}</span>
            </div>
            <div>
              <span>举报类型：</span>
              <span><NoneWrap showText={ReportType[record.type]} /></span>
            </div>
            <div>
              <span>补充说明：</span>
              <span style={{ width: '100%' }}><NoneWrap showText={record.additionalDescription} /></span>
            </div>
            <div>
              <span>图片：</span>
              {renderImg(record.imageNames)}
            </div>
            <div>
              <span>举报人：</span>
              <span>{`[${record.userId}]${record.userName}`}</span>
            </div>
            <div>
              <span>受理单号：</span>
              <span>{record.number}</span>
            </div>
          </div>
        </List.Item>
      )}
    />
  )
}

export default ReportList
