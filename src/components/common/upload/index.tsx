import React, { useState, useEffect, ReactElement } from 'react'
import { Upload, Progress, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  RcCustomRequestOptions,
  UploadChangeParam,
  UploadFile
} from 'antd/lib/upload/interface'
import ImgCrop from 'antd-img-crop'
import { UploadProps, VideoInfo } from '@/components/common/upload/upload'
import { getUploadSign, uploadFn } from '@/api/common'
import style from './style.module.sass'
import 'antd/dist/antd.css'
import videoImg from '@/assets/img/videoImg.png'
import { sourceSize, getOssUrl } from '@/config/publicConfig'

const ProUpload: React.FC<UploadProps> = (props: UploadProps) => {
  const {
    value,
    onChange,
    uploadType = 'image',
    showText = '',
    filesLength = 1,
    circleAvatar = false,
    imageSize = sourceSize.imageSize,
    videoSize = sourceSize.videoSize,
    canUpload,
    unUploadMsg = '无法上传',
    getIsEmpty,
    aspect = 1 / 1
  } = props
  const defaultFileList: UploadFile[] = []
  const [saveFileName, setsaveFileName] = useState('')
  const [realSourceType, setrealSourceType] = useState('')
  const [sourceUrl, seturl] = useState(getOssUrl())
  const [progressPercent, setprogressPercent] = useState(0)
  const [previewVisible, setpreviewVisible] = useState(false)
  const [videoInfo, setvideoInfo] = useState<VideoInfo>({})
  const [showUrl, setShowUrl] = useState<string | undefined>()
  const [filesList, setfilesList] = useState(defaultFileList)

  // 上传前效验
  const beforeUpload = (file: File): Promise<void> =>
    new Promise((resolve, reject) => {
      if (canUpload === false) {
        message.error(unUploadMsg)
        reject()
      }
      if (file) {
        const type = file.type.split('/')[0]
        if ((type === uploadType)) {
          if (file.size > imageSize && type === 'image') {
            message.error(`图片必须小于${imageSize / 1048576}MB！`)
            reject()
          } else if (file.size > videoSize && type === 'video') {
            message.error(`视频必须小于${videoSize / 1048576}MB！`)
            reject()
          } else {
            resolve()
          }
        } else {
          message.error('请上传正确的文件格式')
          reject()
        }
      }
    })

  const saveVideoInfo = (fileName: string): void => {
    const newUrl: string = fileName.includes(sourceUrl) ? fileName : `${sourceUrl}/${fileName}`
    setShowUrl(newUrl)
    const dom = document.createElement('video')
    dom.src = newUrl || '--'
    dom.addEventListener('loadedmetadata', () => {
      // 加载数据
      setvideoInfo(
        {
          ...videoInfo,
          fileName,
          width: dom.videoWidth,
          height: dom.videoHeight,
          duration: Math.floor(dom.duration),
        }
      )
      setsaveFileName(fileName)
    })
  }

  const customRequest = async (options: RcCustomRequestOptions): Promise<void> => {
    const { type } = options.file
    setvideoInfo({ ...videoInfo, format: type })
    const uploadFileType = type.split('/')[1]
    // 截取资源类型而不是资源格式用作判断
    setrealSourceType(type.split('/')[0])
    const params = {
      type: uploadFileType
    }
    if (getIsEmpty) {
      getIsEmpty(false)
    }
    const res = await getUploadSign(params)
    const { data } = res
    const { url, formData: dataForm, fileName } = data
    seturl(url)
    const formData = new FormData()
    dataForm.map((item: { key: string, value: string }) => {
      formData.append(item.key, item.value)
      return item
    })
    formData.append('file', options.file)
    const onUploadProgress = {
      onUploadProgress: (progressEvent: { loaded: number, total: number }): void => {
        const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
        setprogressPercent(percent)
        options.onProgress({ percent }, options.file)
      }
    }
    const response = await uploadFn(`${url}`, formData, onUploadProgress)
    if (response.status === 200) {
      options.onSuccess({ msg: 'success' }, options.file)
      if (type.split('/')[0] === 'video') {
        saveVideoInfo(fileName)
      } else {
        setsaveFileName(fileName)
      }
    } else {
      if (getIsEmpty) {
        getIsEmpty(true)
      }
      message.error('上传失败')
    }
  }

  const changeFilesList = (img?: string): void => {
    if (filesList.length !== 1) {
      if (uploadType === 'image' && typeof value === 'string') {
        setfilesList([{ uid: '1234123', size: 0, name: 'shipin ', type: 'image/jpeg', thumbUrl: img }])
      } else {
        setfilesList([{ uid: '1234123', size: 0, name: 'shipin ', type: 'image/jpeg', thumbUrl: img || videoImg }])
      }
    }
  }

  useEffect((): void => {
    if ((typeof value === 'string' && value.includes('.'))) {
      const newUrl: string = value.includes(sourceUrl) ? value : `${sourceUrl}/${value}`
      setShowUrl(newUrl)
      setsaveFileName(value)
      changeFilesList(newUrl)
    } else if (typeof value === 'object') {
      const { fileName = '', videoCover = '' } = value
      if (fileName) {
        saveVideoInfo(fileName)
        changeFilesList(videoCover)
      } else if (getIsEmpty) {
        getIsEmpty(true)
      }
    }
    // eslint-disable-next-line
  }, [value])


  useEffect(() => {
    if (onChange) {
      if (realSourceType === 'video' || uploadType === 'video') {
        onChange(videoInfo)
      } else {
        const url = saveFileName.includes(sourceUrl)
          ? saveFileName.split(sourceUrl)[1] : saveFileName
        onChange(url)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return (): void => { }
    // eslint-disable-next-line
  }, [saveFileName])

  const handleChange = (info: UploadChangeParam): void => {
    // 修改视频上传以后push进数组的type类型,用以替换上传以后的控件展示
    const data = [{ ...info.fileList[0], type: 'image/png', key: 'value' }]
    setfilesList(data)
  }

  const uploadBtn = (
    <div>
      <PlusOutlined />
      <div>{showText}</div>
    </div>
  )

  const remove = (): Promise<boolean> =>
    new Promise((_, reject) => {
      setfilesList([])
      if (getIsEmpty) {
        getIsEmpty(true)
      }
      if (onChange) {
        if (uploadType === 'video') {
          onChange({})
        } else {
          onChange('')
        }
      }
      reject(false)
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePreviewFile = (file: File | Blob): Promise<any> => new Promise((resolve) => {
    const getInfo = (): void => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e): void => {
        if (e.target) {
          const dataUrl = e.target.result
          resolve(dataUrl)
        }
      }
    }
    // eslint-disable-next-line no-unused-expressions
    realSourceType === 'image' ? getInfo() : resolve(videoImg)
  })

  const showPreview = (): void => {
    setpreviewVisible(true)
  }

  const uploadVm = (): ReactElement => {
    if (uploadType === 'image') {
      return (
        <ImgCrop aspect={aspect} rotate>
          <Upload
            className={`${circleAvatar && 'avatar'}`}
            accept="image/*,video/*"
            method="post"
            fileList={filesList}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            onPreview={(): void => { showPreview() }}
            previewFile={handlePreviewFile}
            listType="picture-card"
            customRequest={customRequest}
            onRemove={remove}
          >
            {filesList.length >= filesLength ? null : uploadBtn}
          </Upload>
        </ImgCrop>
      )
    }
    return (
      <Upload
        className={`${circleAvatar && 'avatar'}`}
        accept="image/*,video/*"
        method="post"
        fileList={filesList}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        onPreview={(): void => { showPreview() }}
        previewFile={handlePreviewFile}
        listType="picture-card"
        customRequest={customRequest}
        onRemove={remove}
      >
        {filesList.length >= filesLength ? null : uploadBtn}
      </Upload>
    )
  }

  return (
    <div>
      <Progress style={{ display: 'none' }} percent={progressPercent} size="small" />
      {uploadVm()}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={(): void => { setpreviewVisible(false) }}
        destroyOnClose
      >
        {showUrl
          && (uploadType === 'image'
            ? <img className={style.mediaWidth} src={showUrl || '--'} alt="" /> : (
              <video
                className={style.mediaWidth}
                controls
                src={showUrl}
              />
            ))}
      </Modal>
    </div>
  )
}

export default ProUpload
