import { Record, List } from 'immutable';
import ClipRecord, { ClipRecordProps } from './Clip';

type TrackRecordType = {
  clips: List<ClipRecordProps>;
};

const TrackRecord = Record<TrackRecordType>({
  clips: List()
});

export default class Track extends TrackRecord {}
