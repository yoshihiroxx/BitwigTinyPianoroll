import { Record, List } from 'immutable';
import TrackRecord, { TrackRecordType } from './Track';

export type ProjectRecordType = {
  tracks: List<TrackRecordType>;
};

const ProjectRecord = Record<ProjectRecordType>({
  tracks: List()
});

export default class Project extends ProjectRecord {}
