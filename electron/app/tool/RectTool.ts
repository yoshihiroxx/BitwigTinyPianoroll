import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import Tool from './Tool';

export default class RectTool extends Tool {
  pressingKeys = List();

  handlingNotes = List();

  constructor(selections) {
    super();
    this.handlingNotes = selections;
  }

  onClick(note, beat, number) {
    // @todo move note to select layer
    this.handlingNotes = this.pressingKeys.has('cmd')
      ? this.handlingNotes.push(note)
      : (this.handlingNotes = List(note));
    this.updateSelections();
  }

  onDrag(note, beat, number) {
    this.handlingNotes = this.handlingNotes.push(note);
    this.updateSelections();
    // @todo update note pos and rerender
  }

  onRelease(mouseX, mouseY) {
    // @todo add Note
    this.updateSelections();
  }
}
