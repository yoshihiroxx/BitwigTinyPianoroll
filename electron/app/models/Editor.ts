import { Record, List } from 'immutable';

export type EditorRecordType = {
  name: string;
  lengthInBeats: number;
  loopLengthInBeats: number;
  color: List<number>;
  copyFrom: () => void;
};

const defaultState: EditorRecordType = {
  name: '',
  lengthInBeats: 0,
  loopLengthInBeats: 1,
  color: List(),
  copyFrom: () => undefined
};

const Editor = Record(defaultState);

export default Editor;
