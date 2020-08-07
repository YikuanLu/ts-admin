import { RaceProp } from '@/pages/main/article/type'
import { ScrollBannerFormProps } from './type'

export const defaultRace: RaceProp = {
  normalList: [
    {
      name: '足球',
      id: '0',
      type: 'FOOTBALL'
    }
  ],
  treeList: [
    {
      title: '足球',
      key: '0',
      type: 'FOOTBALL',
      children: []
    },
    {
      title: '篮球',
      key: '1',
      type: 'BASKETBALL',
      children: []
    }
  ]
}

export const defaultFormData: ScrollBannerFormProps = {
  businessId: [],
  image: '',
  time: [],
  title: '',
  type: 'ARTICLE'
}
