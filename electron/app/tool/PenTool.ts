import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool from './Tool';

export default class PenTool extends Tool {
  onClick(beatOrNote: unknown, noteNumber?: number) {
    let nextState = this.setIsDrawing(true);
    if (typeof beatOrNote === 'number') {
      nextState = nextState.set('selections', new MidiList());
      const note = new MidiNote({
        noteNumber,
        startBeat: beatOrNote,
        lengthInBeats: this.get('noteLength')
      });

      const newDrawing = this.get('drawing')
        .get('notes')
        .set(0, note);
      return nextState.setIn(['drawing', 'notes'], newDrawing);
    }
    if (beatOrNote instanceof MidiNote) {
      return this;
    }
    return this;
  }

  onDrag(beatOrNote: unknown, noteNumber?: number) {
    if (this.get('isDrawing')) {
      return this.onClick(beatOrNote, noteNumber);
    }
    return this;
  }

  onRelease(beat: number, noteNum: number) {
    const nextState = this.setIsDrawing(false);
    const note = new MidiNote({
      noteNumber: noteNum,
      startBeat: beat,
      lengthInBeats: this.get('noteLength')
    });

    const newDrawing = this.get('drawing')
      .get('notes')
      .set(0, note);
    return nextState.setIn(['drawing', 'notes'], newDrawing);
  }

  prepareToChange() {
    return this.set('drawing', new MidiList());
  }
}
