export interface AddMatchListProps {
  onChange?: <T>(val: T) => void;
  matchSearchList: PolymerItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}
