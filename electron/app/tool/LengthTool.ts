import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool from './Tool';

export default class LengthTool extends Tool {
  onClick(beatOrNote: unknown, noteNumber?: number) {
    const nextState = this.setIsDrawing(true);
    if (beatOrNote instanceof MidiNote) {
      const note = beatOrNote;
      let selections = this.get('selections');
      if (!selections.hasNote(note)) {
        selections = new MidiList({ notes: List([note]) });
      }
      selections = selections.sortNoteToFirst(note);
      const drawing = selections;
      return nextState.set('selections', selections).set('drawing', drawing);
    }
    return this;
  }

  onDrag(beatOrNote: unknown, noteNumber?: number) {
    if (!this.get('isDrawing')) return this;
    if (typeof beatOrNote === 'number' && typeof noteNumber === 'number') {
      const clicked: MidiNote = this.getIn(['drawing', 'notes']).first();
      const offsetBeat =
        beatOrNote - clicked.get('startBeat') - clicked.get('lengthInBeats');
      const nextDrawingList = this.getIn(['drawing', 'notes']).map(
        (n: MidiNote) => {
          let lengthInBeats = n.get('lengthInBeats') + offsetBeat;
          if (lengthInBeats < 0.25) {
            lengthInBeats = 0.25;
          }
          return n.set('lengthInBeats', lengthInBeats);
        }
      );
      return this.setIn(['drawing', 'notes'], nextDrawingList);
    }
    return this;
  }

  onRelease(beat: number, noteNum: number) {
    let nextState = this.setIsDrawing(false);
    nextState = nextState.set(
      'noteLength',
      nextState
        .getIn(['drawing', 'notes'])
        .get(0)
        .get('lengthInBeats')
    );
    console.log(
      nextState
        .getIn(['drawing', 'notes'])
        .get(0)
        .get('lengthInBeats')
    );
    return nextState;
  }

  prepareToChange() {
    let selections = this.get('selections');
    if (this.getIn(['drawing', 'notes']).size > 0) {
      selections = this.get('drawing');
    }
    const drawing = new MidiList();
    return this.set('selections', selections).set('drawing', drawing);
  }
}
