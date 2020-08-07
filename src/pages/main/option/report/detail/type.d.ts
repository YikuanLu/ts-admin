
export interface ImgItem {
  commentId: string;
  fileName: string;
  format: string;
  height: number;
  orderNum: number;
  orientation: number;
  url: string;
  width: number;
}

export interface VideoItem {
  commentId: string;
  fileName: string;
  format: string;
  duration: number;
  height: number;
  orderNum: number;
  url: string;
  videoCover: string;
  width: number;
}

export interface ArticleReportInfoProps {
  authorUser: string;
  businessId: string;
  id: string;
  nickName: string;
  releaseTime: string;
  title: string;
  unsolved:boolean;
}
export interface UserReportInfoProps {
  businessId: string;
  createTime: string;
  id: string;
  userName: string;
  unsolved:boolean;
}
export interface CommentReportInfoProps {
  businessId: string;
  content: string;
  createTime: string;
  id: string;
  nickName: string;
  pics: ImgItem[];
  userId: string;
  videos: VideoItem[];
  unsolved:boolean;
}
