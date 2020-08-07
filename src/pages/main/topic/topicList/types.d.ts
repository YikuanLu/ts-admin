export interface TopicItem {
  articleNum: number;
  clickUserNum: number;
  createTime: string;
  creatorName: string;
  enabled: boolean;
  followUserNum: number;
  groupName: string;
  icon: string;
  id: string;
  name: string;
  sort: number | null;
  updateTime: string;
}

export interface EditTopicInfo {
  cover: string;
  description: string;
  groupId: string;
  groupName: string;
  icon: string;
  id: string;
  name: string;
  recommended: boolean;
  sort: number;
}
