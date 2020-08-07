import BraftEditor from 'braft-editor'
import { FormInstance } from 'antd/lib/form'
import { isArray } from 'lodash'
import { VideoInfo } from '@/components/common/upload/upload'
import { RaceConvertToBackTs, PolymerItem, TreeListItem, UploadInfo, ExternalResources, MatchAssociation } from '../type'
import { SportType } from '../statusType'

// 文章内容校验
export const validateContentFC = (
  value: BraftEditor,
  form: FormInstance
): Promise<void> =>
  new Promise((resolve, reject) => {
    const content = BraftEditor.createEditorState(value).toHTML()
    if (content.length > 7) {
      resolve()
    } else {
      const type = form.getFieldValue('articlesType')
      const videoInfo = form.getFieldValue('videoInfo')
      if (type === 'VIDEO') {
        resolve()
      } else if (Object.keys(videoInfo).length === 0) {
        reject('请输入文章内容或上传视频')
      } else if (!videoInfo.fileName) {
        reject('请输入文章内容或上传视频')
      } else {
        resolve()
      }
    }
  })

// 视频效验
export const validateVideFC = (
  value: VideoInfo,
  form: FormInstance
): Promise<void> =>
  new Promise((resolve, reject) => {
    const type = form.getFieldValue('articlesType')
    if ((Object.keys(value).length <= 1 || !value.fileName) && type === 'VIDEO') {
      reject('请上传视频')
    } else {
      resolve()
    }
  })


// 将关联赛事的结构整理为后端需要的结构
export const RaceConvertToBack: RaceConvertToBackTs = (data, normalList) => {
  if (isArray(data)) {
    return data.map((item: string): {
      type: string,
      id: string
    } => {
      const id = item.split('-')[1]
      const raceKey: number = normalList.findIndex(
        (items: PolymerItem) => items.id === id
      )

      return {
        type: normalList[raceKey].type,
        id: normalList[raceKey].id
      }
    })
  }
  return []
}


// 将聚合球员和聚合球队的数据转为后端需要的结构
export const RaceConvertObjToBack = (data:string[]):{type:string, id:string}[] => {
  if (isArray(data)) {
    return data.map((item: string): {type:string, id:string} => JSON.parse(item))
  }
  return []
}
// 将后端给出的聚合数据转换为树形结构
export const polymerConverTree = (data:PolymerItem[]):TreeListItem[] => {
  const arr:TreeListItem[] = []
  // eslint-disable-next-line array-callback-return
  Object.keys(SportType).map((item: string): void => {
    arr.push(
      {
        title: SportType[item],
        key: item,
        type: item,
        children: []
      })
  })
  for (const item of data as PolymerItem[]) {
    for (const key in arr) {
      if (arr[key].type === item.type) {
        arr[key].children.push({
          title: item.name,
          key: `${item.type}-${item.id}`,
          type: item.type,
          children: []
        })
      }
    }
  }
  return arr
}

// 将后台给来的关联赛事转为回填需要的结构
export const polymerConverMatchAssociation = (data:MatchAssociation[]):string[] => {
  const arr = data || []
  return arr.map((item:MatchAssociation):string => `${item.type}-${item.id}`)
}


// 判断资源列表
export const handleExternalResources = (data:UploadInfo) :ExternalResources[] => {
  const {
    download,
    sourceUrl,
    sourceCover,
  } = data
  const arr: ExternalResources[] = []
  if (sourceCover) {
    arr.push({
      sourceUrl,
      type: 'image',
      url: sourceCover,
      ref: undefined,
      position: 'cover'
    })
  }
  if (download) {
    Object.keys(download).forEach((key: string): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arr.push(...download[key].map((item: any): {} => ({
        sourceUrl,
        type: key === 'images' ? 'image' : 'video',
        url: key === 'images' ? item : item.src,
        ref: item.ref,
        position: 'normal'
      })))
    })
  }
  return arr
}
