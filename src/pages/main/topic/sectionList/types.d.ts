export interface EditSectionItem {
  description?: string;
  id?: string;
  name: string;
  sort?: string;
}

export interface SectionItem{
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
export interface ModalProps {
  initData?:EditSectionItem
  visible: boolean;
  itemData?: StoreValue;
  cancelFn: () => void;
  updataList: (val?: StoreValue) => void;
}

export interface ConfirmProps{
  title?:string;
  content?:string;
  okFC?:()=>void;
}
