import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import Tool from './Tool';

export default class PenTool extends Tool {
  onClick(beat: number, noteNum: number) {
    // @todo move note to select layer
    const note = new MidiNote({
      noteNumber: noteNum,
      startBeat: beat,
      lengthInBeats: this.get('noteLength')
    });

    const newDrawing = this.get('drawing')
      .get('notes')
      .set(0, note);
    return this.setIn(['drawing', 'notes'], newDrawing);
  }

  onDrag(beat: number, noteNum: number) {
    return this.onClick(beat, noteNum);
    // @todo update note pos and rerender
  }

  onRelease(beat: number, noteNum: number) {
    // @todo add Note
    return this.onClick(beat, noteNum);
  }
}
