// 标签分类
export interface LabelListModels {
  articleNum: number; // 文章数量
  createName: string; // 创建人名称
  createTime: string; // 创建时间
  description: string; // 描述
  enabled: boolean; // 是否禁用
  groupName: string; // 标签分类名称
  id: number; // id
  name: string; // 标签名称
  updateTime: string; // 修改时间
  userNum: number; // 用户数量
  count: number; // 分类下的标签数
}

export interface ConfirmProps {
  title?: string;
  content?: string;
  okFC?: () => void;
}

export interface SectionItem {
  clickUserNum: number;
  createName: string;
  createTime: string;
  deleted: boolean;
  description: string;
  enabled: boolean;
  id: string;
  name: string;
  sort: number;
  topicNum: string;
  updateTime: string;
}

export interface LabelItem {
  description: string;
  groupId: string;
  id?: string;
  name: string;
}
