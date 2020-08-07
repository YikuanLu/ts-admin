import { EditorState } from 'braft-editor/index'

export declare interface EditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  onChange?: (editorState: EditorState) => void,
}

export declare interface UploadFnParams {
  file: File;
  progress: (progress: number) => void;
  libraryId: string;
  success: (
    res: {
      url: string;
      meta: {
        id: string;
        title: string;
        alt: string;
        loop: boolean;
        autoPlay: boolean;
        controls: boolean;
        poster: string;
      };
    }
  ) => void;
  error: (
    err: {
      msg: string;
    }
  ) => void;
}
