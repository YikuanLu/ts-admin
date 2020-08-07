export interface ImageDesc {
  fileName: string,
  format: null,
  height: number,
  orientation: number,
  url: string,
  width: number,
  thumbUrl?: string,
  name?: string,
}

export interface UploadProps {
  getIsEmpty?: (status: boolean) => void,
  canUpload?: boolean,
  unUploadMsg?: string,
  filesLength?: number, // 可上传数量
  value?: string | { fileName: string, videoCover: string },
  showText?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (val: any) => void,
  getVideoInfo?: (val: VideoInfo) => void,
  uploadType?: 'image' | 'video',
  circleAvatar?: boolean,
  imageSize?: number,
  videoSize?: number,
  aspect?: number
}

export interface MultipleUploadProps {
  setIsDone?: () => boolean
  filesLength?: number; // 可上传数量
  value?: ImageDesc[];
  showText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (val: any) => void;
  getVideoInfo?: (val: VideoInfo) => void;
  uploadType?: 'image' | 'video';
}

export interface VideoInfo {
  duration?: number;
  fileName?: string;
  format?: string;
  height?: number;
  url?: string;
  videoCover?: string;
  width?: number;
}

export interface ProgressEvent {
  loaded: number,
  total: number
}
