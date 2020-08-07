import React, { useState, useEffect, useRef } from 'react'
import {
  Upload,
  Progress,
  Modal,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  RcCustomRequestOptions,
  UploadFile,
  UploadChangeParam
} from 'antd/lib/upload/interface'
import { StoreValue } from 'antd/lib/form/interface'
import { MultipleUploadProps } from '@/components/common/upload/upload'
import { getUploadSign, uploadFn } from '@/api/common'
import style from './style.module.sass'
import { sourceSize } from '@/config/publicConfig'

const ProUpload: React.FC<MultipleUploadProps> = (props: MultipleUploadProps) => {
  const {
    value,
    onChange,
    showText = '',
    filesLength = 1
  } = props

  const defaultFileList: UploadFile[] = []
  const [progressPercent, setprogressPercent] = useState(0)
  const [showUrl, setShowUrl] = useState<string | undefined>()

  const [canChangeFiles, setcanChangeFiles] = useState(true)

  const [filesList, setFilesList] = useState(defaultFileList)

  const createFormData = (
    dataForm: StoreValue,
    options: RcCustomRequestOptions
  ): FormData => {
    const formData = new FormData()
    dataForm.forEach((item: { key: string, value: string }) => {
      formData.append(item.key, item.value)
    })
    formData.append('file', options.file)
    return formData
  }

  // 自定义上传方法
  const customRequest = async (
    options: RcCustomRequestOptions
  ): Promise<void> => {
    if (!options.file.type.includes('image/')) {
      message.error('文件类型错误')
      return
    }
    if (filesList.length > filesLength) {
      message.error('超出图片张数')
    }

    const { type } = options.file
    const uploadFileType = type.split('/')[1]
    const params = {
      type: uploadFileType
    }
    const res = await getUploadSign(params)
    const { url, formData: dataForm, fileName } = res.data
    const formData = createFormData(dataForm, options)

    const onUploadProgress = {
      onUploadProgress: (progressEvent: ProgressEvent): void => {
        const percent = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        )
        setprogressPercent(percent)
        options.onProgress({ percent }, options.file)
      }
    }

    const response = await uploadFn(url, formData, onUploadProgress)
    if (response.status === 200) {
      setcanChangeFiles(true)
      options.onSuccess({
        msg: 'success',
        name: fileName,
        url: `${url}/${fileName}`
      }, options.file)
    } else {
      message.error('上传失败')
    }
  }

  useEffect(() => {
    // if (value) {
    //   const arr = value.map((item, index) => ({
    //     uid: `${item.fileName}${index}`,
    //     size: 0,
    //     name: item.name,
    //     type: 'image/jpeg',
    //     thumbUrl: item.thumbUrl ? item.thumbUrl : item.url
    //   })) as UploadFile[]
    //   setFilesList(arr)
    // }
  }, [value])

  const preFilesListLength = useRef<number>(0)
  useEffect(() => {
    if (!onChange || !canChangeFiles) return
    const ifUploadDone = filesList.every((item) => item.status === 'done')
    if (ifUploadDone) {
      const arr = filesList.map((item) =>
        item.response
      )
      setcanChangeFiles(false)
      onChange(arr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesList, canChangeFiles])

  const handleChange = (info: UploadChangeParam): void => {
    setFilesList([...info.fileList])
  }

  useEffect(() => {
    if (!onChange) return
    if (preFilesListLength.current > filesList.length) {
      const arr = filesList.map((item) => item.response)
      onChange(arr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesList.length])

  const handleRemove = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
      if (onChange) {
        preFilesListLength.current = filesList.length
        resolve(true)
        return
      }
      reject(false)
    })

  const uploadBtn = (
    <div>
      <PlusOutlined />
      <div>{showText}</div>
    </div>
  )

  const [previewVisible, setpreviewVisible] = useState(false)

  useEffect(
    () => {
      if (showUrl) {
        setpreviewVisible(true)
      }
    }, [showUrl]
  )
  return (
    <div>
      <Progress style={{ display: 'none' }} percent={progressPercent} size="small" />
      <Upload
        accept="image/*"
        beforeUpload={async (file, files): Promise<void> =>
          new Promise<void>((resolve, rejects) => {
            if (!file.type.includes('image/')) {
              message.error('文件类型错误')
              return
            }
            if (files.length + filesList.length > filesLength) {
              message.error('超出图片张数')
              rejects()
            }
            if (file.size > sourceSize.imageSize) {
              message.error(`图片必须小于${sourceSize.imageSize / 1048576}MB！`)
              rejects()
            }
            resolve()
          })}
        onPreview={(file): void => {
          setShowUrl(file.response.url)
        }}
        method="post"
        // multiple
        fileList={filesList}
        listType="picture-card"
        customRequest={customRequest}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {filesList.length >= filesLength ? null : uploadBtn}
      </Upload>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={(): void => {
          setpreviewVisible(false)
          setShowUrl('')
        }}
      >
        <img className={style.mediaWidth} src={showUrl || '--'} alt="" />
      </Modal>
    </div>
  )
}

export default ProUpload
