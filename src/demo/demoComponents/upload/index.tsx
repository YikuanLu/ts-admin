import React from 'react'
// import { Form } from 'antd'
import ProUpload from '@/components/common/upload/uploadMultiple'

const defaultImg = {
  fileName: '8e44f323179142789c97ea1acc63daf2.jpeg',
  format: null,
  height: 0,
  orientation: 0,
  url: 'https://zch-oss-demo.oss-cn-beijing.aliyuncs.com/e03f915833a2467183bff895219e0d15.jpeg',
  width: 0
}

const UploadDemo: React.FC = () => (
  <ProUpload
    filesLength={2}
    uploadType="image"
    value={[defaultImg]}
  />
)

export default UploadDemo
