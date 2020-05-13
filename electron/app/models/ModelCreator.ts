import { Record } from 'immutable';
import Project, { ProjectRecordType } from './Project';
import Preferences, { PreferencesRecordType } from './Preferences';

export type ModelType = {
  project: ProjectRecordType;
  preferences: PreferencesRecordType;
};

const defaultState = {
  project: Project,
  preferences: Preferences
};

const Model = Record({ defaultState });

export default Model;
