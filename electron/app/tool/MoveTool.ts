import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import Tool from './Tool';

export default class MovenTool extends Tool {
  onClick(note, beat, number) {
    // @todo move note to select layer
    if (this.get('selection').hasnot(note)) {
      // clear selection if cmd on
      // push note to selections
    }
  }

  onDrag(note, beat, number) {
    // selection copty to drawing
  }

  onRelease(mouseX, mouseY) {
    // return this
  }
}
