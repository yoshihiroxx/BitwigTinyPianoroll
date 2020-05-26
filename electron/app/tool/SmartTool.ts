import { List } from 'immutable';
import { threadId } from 'worker_threads';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool, { PenTool, MoveTool, LengthTool } from './Tool';

export default class SmartTool extends Tool {
  onClick(beatOrNote: any, noteNumber?: number) {
    const nextState = this.setIsDrawing(true);
    if (typeof beatOrNote === 'number') {
      return new PenTool(this).onClick(beatOrNote, noteNumber);
    }
    if (beatOrNote instanceof MidiNote) {
      return new MoveTool(this).onClick(beatOrNote);
    }
  }

  onClickEdge(note: MidiNote) {
    return new LengthTool.onClickEdge(note);
  }

  onDrag(beat: number, noteNumber: number) {
    if (this.isDrawing) {
      throw new Error('Called this method while isDrawing[true]');
    }
    if (typeof beatOrNote === 'number') {
      const found = this.getIn(['notes', 'notes']).find(note => {
        return (
          note.noteNumber === noteNumber &&
          note.startBeat >= beat &&
          note.startBeat + note.lengthInBeats <= beat
        );
      });
      if (found instanceof MidiNote) {
      }
    }
    if (beatOrNote instanceof MidiNote) {
      return this;
    }
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
