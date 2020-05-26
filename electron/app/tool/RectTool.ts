import { List } from 'immutable';
import { start } from 'repl';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool from './Tool';

export default class RectTool extends Tool {
  onClick(beatOrNote: unknown, noteNumber?: number) {
    let nextState = this.setIsDrawing(true);
    if (typeof beatOrNote === 'number' && typeof noteNumber === 'number') {
      nextState = nextState.set('selections', new MidiList());
      nextState = nextState.set('eventStart', {
        beat: beatOrNote,
        noteNumber
      });
      return nextState;
    }
    if (beatOrNote instanceof MidiNote) {
      return this;
    }
    return this;
  }

  onDrag(beatOrNote: unknown, noteNumber?: number) {
    if (!this.get('isDrawing')) return this;
    if (typeof beatOrNote === 'number' && typeof noteNumber === 'number') {
      const eventStart = this.get('eventStart');
      const lowBeat =
        beatOrNote < eventStart.beat ? beatOrNote : eventStart.beat;
      const lowNoteNumber =
        noteNumber < eventStart.noteNumber ? noteNumber : eventStart.noteNumber;
      const highBeat =
        beatOrNote > eventStart.beat ? beatOrNote : eventStart.beat;
      const highNoteNumber =
        noteNumber > eventStart.noteNumber ? noteNumber : eventStart.noteNumber;
      const notes = this.filterNotesByRect(
        lowBeat,
        lowNoteNumber,
        highBeat,
        highNoteNumber
      );
      return this.setIn(['selections', 'notes'], notes);
    }

    return this;
  }

  onRelease(beat: number, noteNum: number) {
    const nextState = this.setIsDrawing(false);
    return nextState;
  }

  private filterNotesByRect(
    startBeat: number,
    startNoteNumber: number,
    endBeat: number,
    endNoteNumber: number
  ) {
    if (startBeat > endBeat)
      throw new Error('startBeat must be less than endBeat');
    if (startNoteNumber > endNoteNumber)
      throw new Error('startNoteNumber must be less than endNoteNumber');

    let notes: List<MidiNote> = this.getIn(['notes', 'notes']);
    notes = notes.filter((n: MidiNote) => {
      return (
        n.get('startBeat') + n.get('lengthInBeats') > startBeat &&
        n.get('noteNumber') > startNoteNumber
      );
    });
    notes = notes.filter((n: MidiNote) => {
      return (
        n.get('startBeat') < endBeat && n.get('noteNumber') < endNoteNumber
      );
    });
    return notes;
  }
}
