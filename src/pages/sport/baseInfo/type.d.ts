export interface SportItem {
  articleNum: number;
  createId: string;
  createName: string;
  createTime: string;
  description: string;
  forbidden: boolean;
  id: string;
  informationHot: number;
  informationPopularity: number;
  matchHot: number;
  matchPopularity: number;
  name: string;
  subjectNum: number;
  updateId: string;
  updateName: string;
  updateTime: string;
}
export interface ModalProps {
  type?: string,
  visible: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemData?: any,
  cancelFn: () => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updataList: (val?: any) => void
}
