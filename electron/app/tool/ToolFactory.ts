import { List } from 'immutable';
import Tool from './Tool';
import PenTool from './PenTool';
import EraserTool from './EraserTool';
import MoveTool from './MoveTool';
import RectTool from './RectTool';
import LengthTool from './LengthTool';

import MidiNote from '../models/MidiNote';

const keySettings = {
  command: 'Eraser',
  rightClick: null,
  option: ''
};

export default class ToolManager {
  subscribers = List();

  update(note: MidiNote, mouseEvent?: string, keystroke: List<number>) {}

  emit(toolType: string) {
    this.subscribers.forEach(callback => {
      callback(toolType);
    });
  }

  on(callback) {
    this.subscribers.push(callback);
  }
}
