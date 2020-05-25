import { Record, List } from 'immutable';
import ClipRecord, { ClipRecordProps } from './Clip';

type TrackRecordType = {
  clips: List<ClipRecordProps>;
};

const TrackRecord = Record<TrackRecordType>({
  clips: List()
});

export default class Track extends TrackRecord {
  getClip(id: number) {
    return this.getIn(['tracks', id]);
  }
}
