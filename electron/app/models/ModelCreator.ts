import { Record } from 'immutable';
import Project, { ProjectRecordType } from './Project';
import Preferences, { PreferencesRecordType } from './Preferences';
import Tool, { ToolRecordType } from '../tool/Tool';
import PenTool from '../tool/PenTool';
import Editor, { EditorRecordType } from './Editor';

export type ModelType = {
  preferences: PreferencesRecordType;
  editor: EditorRecordType;
};

const defaultState = {
  preferences: Preferences,
  editor: Editor
};

const Model = Record({ defaultState });

export default Model;
