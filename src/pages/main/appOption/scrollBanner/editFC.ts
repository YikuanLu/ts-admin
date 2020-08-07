import moment from 'moment'
import {
  FormDataParams,
  BannerItemDetailProps,
  BannerBackEndProps
} from './types'
import { getOssUrl } from '@/config/publicConfig'
import { DataProps } from '@/utils/axios'

export const corverDataToBackEnd = (
  data: FormDataParams
): BannerBackEndProps => {
  const businessId = data.type === 'MATCH' ? data.businessId : data.businessArticleId
  const imgUrl = data.image.includes('http')
    ? data.image.split(`${getOssUrl()}/`)[1]
    : data.image
  return {
    businessId: businessId && businessId[0].id,
    matchType: data.businessId && data.businessId[0].type,
    enable: !!data.enable,
    image: imgUrl,
    sort: data.sort,
    startTime: data.time[0].format('YYYY-MM-DD HH:mm:ss'),
    endTime: data.time[1].format('YYYY-MM-DD HH:mm:ss'),
    title: data.title,
    type: data.type,
    link: data.link
  }
}

export const corverDataToForm = (data: BannerItemDetailProps): DataProps => ({
  businessArticleId: data.articleTitle
    ? [{ id: data.businessId, title: data.articleTitle }]
    : [],
  businessId: data.type === 'MATCH' ? [data.schedule] : [],
  enable: data.enable,
  image: data.image,
  sort: data.sort,
  time: [moment(data.startTime), moment(data.endTime)],
  title: data.title,
  type: data.type,
  link: data.link
})

export const mergeBannerObject = (obj: BannerItemDetailProps): DataProps => ({
  enable: obj.enable,
  endTime: obj.endTime,
  id: obj.id,
  image: obj.image,
  sort: obj.sort,
  startTime: obj.startTime,
  title: obj.title,
  type: obj.type
})
