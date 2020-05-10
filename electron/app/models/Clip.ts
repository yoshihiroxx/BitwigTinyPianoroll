import { Record, RecordOf, List } from 'immutable';

export type ClipRecordProps = {
  name: string;
  lengthInBeats: number;
  loopLengthInBeats: number;
  color: List<number>;
  copyFrom: () => void;
};

const defaultClipValues: ClipRecordProps = {
  name: '',
  lengthInBeats: 0,
  loopLengthInBeats: 1,
  color: List(),
  copyFrom: () => undefined
};

const ClipRecord = Record(defaultClipValues);

export default ClipRecord;
