import React, { FC, useEffect, ReactElement, useState } from 'react'
import { Modal, Button, message } from 'antd'
import { AxiosPromise } from 'axios'
import { isEqual } from 'lodash'
import { AddMatchListProps } from '@/components/main/common/addArticleTableData/type'
import style from '@/components/main/common/addArticleTableData/style.module.sass'
import { ArticleItem } from '@/pages/main/article/type'
import { ListRes, SearchItem } from '@/components/common/normalTable/types'
import NormalTable from '@/components/common/normalTable'
import { columns } from '@/components/main/common/addArticleTableData/columns'
import { getArticlesList } from '@/api/main'

const api = (data: ListRes): AxiosPromise => getArticlesList<ListRes>(data)

const AddArticleTableData: FC<AddMatchListProps> = (props: AddMatchListProps) => {
  const {
    onChange,
    value,
    isSingle = true } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [matchList, saveMatchList] = useState<ArticleItem[]>([])

  useEffect((): void => {
    if (onChange) {
      onChange(matchList.map((item: ArticleItem): {} => ({
        ...item
      })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchList])

  useEffect((): void => {
    if (!value || !matchList || value.length === 0) return
    if (!isEqual(value, matchList)) {
      saveMatchList(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const sendMessage = (data: ArticleItem): void => {
    const oldArrLength = matchList.length
    const newArrLength = matchList.filter((item: ArticleItem): boolean =>
      item.id !== data.id).length
    setModalVisible(false)
    if (oldArrLength !== newArrLength) {
      message.error('已添加该文章')
    } else {
      message.success('添加文章成功')
      saveMatchList([...matchList, data])
    }
  }

  const deleteSeason = (data: ArticleItem): void => {
    saveMatchList(matchList.filter(
      (item: ArticleItem): boolean => item.id !== data.id)
    )
  }

  const searchList: SearchItem[] = [
    {
      name: '文章标题',
      type: 'input',
      key: 'title'
    },
  ]

  // 展示当前选中的
  const currentItem = (data: ArticleItem): ReactElement => (
    <div
      className={style.btn}
    >
      <span className={style.title}>
        {data.title}
      </span>
      <span onClick={(): void => { deleteSeason(data) }}>X</span>
    </div>
  )

  const isShowAddBtn = (): ReactElement | null => {
    if (isSingle) {
      if (matchList.length > 0) return null
    }
    return (
      <Button
        type="primary"
        onClick={(): void => { setModalVisible(true) }}
      >
        添加文章
      </Button>
    )
  }
  return (
    <div>
      <div className={style.btnList}>
        {
          matchList.map((values: ArticleItem): ReactElement => (
            <div key={values.id}>
              {currentItem(values)}
            </div>
          ))
        }
      </div>
      {isShowAddBtn()}
      <Modal
        width="70%"
        title="添加文章"
        visible={modalVisible}
        destroyOnClose
        footer={null}
        onCancel={(): void => { setModalVisible(false) }}
      >
        <NormalTable
          searchList={searchList}
          api={api}
          initSearchData={{ released: 1 }}
          tableProps={{
            columns: columns(sendMessage)
          }}
          scrollX={650}
        />
      </Modal>
    </div>
  )
}
export default AddArticleTableData
