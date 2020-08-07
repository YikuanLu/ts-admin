import React, { useState } from 'react'
import { Button } from 'antd'
import UploadDemo from '@/demo/demoComponents/upload'
import EichEditDemo from '@/demo/demoComponents/richEdit'
import CallerDemo from '@/demo/demoComponents/caller'
import SelectLoadMore from '@/demo/demoComponents/selectLoadMore'
import ColorPicker from '@/demo/demoComponents/colorPicker'
import EditTable from '@/demo/demoComponents/editTable'

type DemoType = 'upload' | 'edit' | 'caller' | 'select' | 'colorPicker' | 'editTable'

const defaultShow: DemoType = 'editTable'

const demoList: Array<{ name: string, key: DemoType }> = [
  {
    name: 'RichEditDemo',
    key: 'edit'
  },
  {
    name: 'UploadDemo',
    key: 'upload'
  },
  {
    name: 'CallerDemo',
    key: 'caller'
  },
  {
    name: 'SelectLoadMore',
    key: 'select'
  },
  {
    name: '可编辑列表',
    key: 'editTable'
  },
]

const Demo: React.FC = () => {
  const [showDemo, setShowDemo] = useState<DemoType>(defaultShow)
  const showDemoController = (type: DemoType): React.ReactElement => {
    switch (type) {
      case 'upload':
        return <UploadDemo />
      case 'edit':
        return <EichEditDemo />
      case 'caller':
        return <CallerDemo />
      case 'select':
        return <SelectLoadMore />
      case 'colorPicker':
        return <ColorPicker />
      case 'editTable':
        return <EditTable />
      default:
        return (
          <div>请选择demo</div>
        )
    }
  }
  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {
          demoList.map((item) => (
            <Button
              type="primary"
              key={item.key}
              style={{ marginRight: '10px' }}
              onClick={(): void => {
                setShowDemo(item.key)
              }}
            >
              {item.name}
            </Button>
          ))
        }
      </div>
      {showDemoController(showDemo)}
    </div>
  )
}

export default Demo
