import { Record, List } from 'immutable';
import Project, { ProjectRecordType } from './Project';
import Tool, { ToolRecordType } from '../tool/Tool';
import PenTool from '../tool/PenTool';

export type EditorRecordType = {
  project: ProjectRecordType;
  tool: ToolRecordType;
};

const defaultState: EditorRecordType = {
  project: new Project(),
  tool: new PenTool()
};

const EditorRecord = Record(defaultState);

class Editor extends EditorRecord {}

export default Editor;
