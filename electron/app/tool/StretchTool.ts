import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool from './Tool';

export default class StretchTool extends Tool {
  onClick(beatOrNote: any, noteNumber?: number) {
    const nextState = this.setIsDrawing(true);
    if (typeof beatOrNote === 'number') {
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
  }

  onDrag(beat: number, noteNum: number) {
    if (this.get('isDrawing')) {
      return this.onClick(beat, noteNum);
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

  setIsDrawing(nextProp: boolean) {
    return this.set('isDrawing', nextProp);
  }

  prepareToChange() {
    return this.set('drawing', new MidiList());
  }
}
