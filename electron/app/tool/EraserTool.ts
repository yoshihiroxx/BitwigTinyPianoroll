import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import Tool from './Tool';

export default class EraserTool extends Tool {
  pressingKeys = List();

  handlingNotes = List();

  onClick(beat: number, noteNum: number) {
    // @todo move note to select layer
    let note = new MidiNote();
    note = note.set('startBeat', beat);
    note = note.set('noteNumber', noteNum);
    const newDrawing = this.get('drawing')
      .set('notes')
      .push(note);
    return this;
  }

  onDrag(note, beat, number) {
    this.handlingNotes = this.handlingNotes.setIn([0, 'x']);
    // @todo update note pos and rerender
  }

  onRelease(mouseX, mouseY) {
    // @todo add Note
    this.addNote();
    this.handlingNotes = List();
  }
}
