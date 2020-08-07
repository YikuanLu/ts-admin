export interface AddMatchListProps {
  onChange?: <T>(val: T) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  initData?: Moment | Moment[] | string | number;
  disabledTime?: { minTime?: moment, maxTime?: moment };
  isSingle?: boolean;
  rangePickerFormat?: string;
}
