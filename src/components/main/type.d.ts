export interface ModalProps {
  visible: boolean,
  itemData?: StoreValue,
  title?: string,
  cancelFn: () => void,
  updataList: (val?: StoreValue) => void,
}
