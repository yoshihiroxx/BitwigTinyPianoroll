import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool from './Tool';

export default class MoveTool extends Tool {
  onClick(beatOrNote: any, noteNumber?: number) {
    // @todo move note to select layer
    if (beatOrNote instanceof MidiNote) {
      const nextState = this.setIsDrawing(true);
      let selections = this.get('selections');
      if (!selections.hasNote(beatOrNote)) {
        selections = new MidiList({ notes: List([beatOrNote]) });
      }
      selections = selections.sortNoteToFirst(beatOrNote);
      const drawing = selections;
      return nextState.set('selections', selections).set('drawing', drawing);
    }
    return this;
  }

  onDrag(beatOrNote: any, noteNumber?: number) {
    // selection copty to drawing
    if (!this.get('isDrawing')) return this;
    if (typeof beatOrNote === 'number' && typeof noteNumber === 'number') {
      const clicked: MidiNote = this.getIn(['drawing', 'notes']).first();
      const offsetBeat = beatOrNote - clicked.get('startBeat');
      const offsetNoteNumber = noteNumber - clicked.get('noteNumber');
      const nextDrawingList = this.getIn(['drawing', 'notes']).map(
        (n: MidiNote) => {
          return n
            .set('startBeat', n.get('startBeat') + offsetBeat)
            .set('noteNumber', n.get('noteNumber') + offsetNoteNumber);
        }
      );
      return this.setIn(['drawing', 'notes'], nextDrawingList);
    }
    return this;
  }

  onRelease(beatOrNote: any, noteNumber?: number) {
    // return this
    let nextState = this.setIsDrawing(false);
    nextState = nextState.set('selections', this.get('drawing'));
    return nextState;
  }

  prepareToChange() {
    return this.set('drawing', new MidiList());
  }
}
