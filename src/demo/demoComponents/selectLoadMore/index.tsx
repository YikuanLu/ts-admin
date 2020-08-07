import React, { FC, useState, useEffect } from 'react'
import { Select } from 'antd'

const { Option } = Select

interface ListItem {
  name: string,
  key: string
}

const SelectLoadMore: FC = () => {
  const [list, setlist] = useState<ListItem[]>([])
  useEffect(() => {
    setlist([
      {
        name: 'a',
        key: 'a'
      }
    ])
  }, [])
  return (
    <div>
      <Select>
        {
          list.map((item) => (
            <Option value={item.key} key={item.key}>
              {item.name}
            </Option>
          ))
        }
      </Select>
    </div>
  )
}

export default SelectLoadMore
