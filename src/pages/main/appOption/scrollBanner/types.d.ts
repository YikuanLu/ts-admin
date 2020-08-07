import moment from 'moment'
import BannerTypes from './data'
import { ArticleItem } from '@/pages/main/article/type'

export interface BannerItemProps {
  creatorName: string
  enable: boolean
  endTime: string
  id: string
  image: string
  sort: number
  startTime: string
  title: string
  type: keyof typeof BannerTypes
}

export interface FormDataParams{
  businessId: { type: string, id: string }[];
  businessArticleId:ArticleItem [];
  enable: boolean;
  image: string;
  sort: 1;
  time: [moment, moment];
  title: string;
  type: 'MATCH' | 'ARTICLE' | 'CUSTOM';
  link: string;
}

export interface BannerItemDetailProps{
  articleTitle?: string;
  businessId: string;
  enable: boolean;
  endTime: string;
  id: string;
  image: string;
  link?: string;
  schedule: Match;
  sort: number;
  startTime: string;
  title: string;
  type: keyof typeof BannerTypes
}

// 后端需要的结构
export interface BannerBackEndProps{
  businessId: string;
  matchType: string;
  enable: boolean;
  image: string;
  sort: number;
  startTime: string;
  endTime:string;
  title: string;
  type: 'MATCH' | 'ARTICLE' | 'CUSTOM';
  link: string;
  id?: string;
}
