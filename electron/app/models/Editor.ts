import { Record, List } from 'immutable';

export type EditorRecordType = {
  trackId: number;
  clipId: number;
};

const defaultState: EditorRecordType = {
  trackId: 0,
  clipId: 0
};

const Editor = Record(defaultState);

export default Editor;
