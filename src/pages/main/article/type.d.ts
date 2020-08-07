import { EditorState } from 'braft-editor'

export interface RecordMap {
  createTime: string; // 创建时间
  quoteArticleId: number; // 文章ID
  text: string; // 文本
}

export type Status = 'RELEASE' | 'NOT_RELEASE' | 'TO_BE_REVIEW' | 'REVOKED'

export type Types = 'PICTURE' | 'VIDEO' | 'INFORMATION'

export type SortType = 'NORMAL' | 'TOP' | 'RECOMMEND'

export interface TagItem {
  groupId: string;
  groupName: string;
  id: string;
  name: string
}
export interface UserInfoItem {
  id: string,
  avatar?: string,
  nickName: string,
  sex?: string,
  forbidden?: boolean,
  mobile?: string,
  ipAddress?: string,
  address?: string,
  loginTime?: string,
  createTime?: string,
  uuid?:number
}
export interface MaterialItem {
  auditId: number; // 审核人ID
  auditName: string; // 审核人
  auditTime: string; // 审核时间
  channels: string[]; // 外部频道
  collectNum: number; // 外部收藏数
  commentNum: number; // 外部回复数
  content: string; // 内容
  cover: string;// 封面
  createTime: string; // 创建时间
  downloadPlatform: string; // 下载平台
  downloadTime: string; // 下载时间
  giveNum: number; // 外部点赞数
  id: number; // UID
  keywords: string[], // 关键字
  link: string; // 原文链接
  quote: boolean // 是否引用
  records: RecordMap[]; // 操作记录
  releaseTime: string; // 外部发布时间
  shareNum: number; // 外部转发数
  status: Status; // 审核状态
  subjectHot: number; // 热度
  subjectName: string; // 外部话题
  title: string; // 文章标题
  type: Types; // 类型
  viewNum: number; // 外部浏览数
}
export interface ParamObj {
  id?: string;
  type: string
}

export interface DownloadParam {
  images: string[];
  videos: {
    url: string;
    ref?: string
  }[]
}

export interface ExternalResources {
  url: string;
  type: string;
  ref: string | undefined;
  sourceUrl: string | null;
  position:string
}


export interface ArticleItem {
  articlesType: Types;
  authorUser: string;
  authorUserName: string;
  authorUserUuid: string;
  clickNum: number;
  clickUserNum: number;
  commentNum: number;
  cover: string;
  createTime: string;
  giveNum: number;
  id: string;
  platformType: string;
  releaseTime: string;
  releaseUser: string;
  releaseUserName: string;
  releaseUserUuid: string;
  retractType: null;
  sortType: SortType;
  sortValue: number;
  status: Status;
  subject: null;
  subjectId: string;
  timingTime: null;
  title:string;
  topicGroupName: string;
  topicName: string;
  updateTime: string;
}

export interface UploadInfo {
  id: string | null;
  released?: boolean;
  appCreate?: boolean; // 是否app端创建
  articlesType: string; // 文章类型
  title: string; // 文章标题
  authorUser: number | string; // 作者id
  authorUserName: string; // 作者姓名
  releaseUser: string | null; // 发布者
  content: string|EditorState; // 文章内容
  reptileArticleId: string;
  timingTime: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imagesName: any;
  sourceCover:string|null,
  sourceUrl: string | null;
  videoInfo: {// 视频内容
    duration: number; // 视频时长
    fileName: string | null;// 视频文件名称
    format: string | null; // 视频格式
    height: number; // 视频高度
    videoCover: string | null |undefined; // 视频封面
    width: number; // 视频高度
  } ;
  labels:string[],
  videoCover: null | undefined | string;
  matchAssociation:string[]|{type:string, id:string}[]
  competition:string[]|{type:string, id:string}[]
  teams:{type:string, id:string}[]
  teamMembers:{type:string, id:string}[]
  cover: {
    fileName: string,
    width: number,
    height: number,
    format: string,
    url: string,
    orientation: number
  } | null | undefined | string;// 文章封面
  sortType: string;// 排序类型
  sortValue?: number;// 排序值
  note?: string; // 备注
  download?: DownloadParam;
  articlesTyped?:string
  reprinted?:boolean
}
export interface FileConvertData extends UploadInfo {
  teams:{id:string, type:string}[]
  teamMembers:{id:string, type:string}[]
  labels:TagItem[]
}

export interface ILocation {
  pathname: string;
  search?: string;
  hash?: string;
}
export type PolymerSportType ='FOOTBALL' | 'BASKETBALL'
export interface PolymerItem{ id: string, name: string, type: PolymerSportType}

export interface TreeListItem{
  children: TreeListItem[];
  title:string;
  key:string;
  type: string;
}
export interface RaceProp {
  normalList: PolymerItem[]
  treeList: TreeListItem[]
}
export interface RaceConvertToBackTs {
  (
    data: string[],
    normalList: PolymerItem[]
  ): {
    type: string,
    id: string
  }[];
}

export interface MatchAssociation{
  id: string;
  name:string;
  type:string;
}

export interface SeasonItem {
  id: string;
  matchShortName: string;
  chatRoomId: string;
  guestTeamId: string;
  guestTeamLogo: string;
  guestTeamName: string;
  guestTeamScore: number;
  homeTeamId: string;
  homeTeamLogo: string;
  homeTeamName: string;
  homeTeamScore: number;
  matchEnglishName: string;
  matchEnglishShortName: string;
  matchId: string;
  matchLogo: string;
  matchName: string;
  progressStatus: string;
  realStartTime: null;
  seasonId: string;
  seasonName: string;
  seasonShowName: string;
  stage: string;
  startTime: string;
  status: string;
  statusName: string;
  type: string;
  venue: string;
}
