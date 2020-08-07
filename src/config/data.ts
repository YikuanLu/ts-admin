// 体育项目
export const sportTypesList = [
  {
    name: '篮球',
    key: 'BASKETBALL'
  },
  {
    name: '足球',
    key: 'FOOTBALL'
  }
]

export enum SportTypes {
  'BASKETBALL'='篮球',
  'FOOTBALL'='足球',
}

export type SportType = keyof typeof SportTypes
