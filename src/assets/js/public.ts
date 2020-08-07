import Moment from 'moment'
// 列表字段为空时转换成'--'
export const showDefaultProps = (data: string | string[]): string | string[] => {
  if (data === null) {
    return '--'
  }
  if (data instanceof Moment) {
    return Moment(data).format('YYYY-MM-DD HH:mm:ss')
  }
  if (data instanceof Array) {
    if (data.length <= 0) {
      return '--'
    }
    return data
  }
  return data || '--'
}
