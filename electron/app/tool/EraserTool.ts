import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool from './Tool';

export default class EraserTool extends Tool {
  public onClick(beatOrNote: any, noteNum?: number) {
    // @todo move note to select layer
    const nextState = this.setIsDrawing(true);
    if (beatOrNote instanceof MidiNote) {
      this.selections.find((note, id) => {});
    } else if (typeof beatOrNote === 'number' && typeof noteNum === 'number') {
      console.log('nothing to do when clicked on grid with a EraserTool.');
    }
    return nextState;
  }

  public onDrag(beatOrNote: any, noteNum?: number) {
    if (!this.get('isDrawing')) return this;

    if (beatOrNote instanceof MidiNote) {
      const mn = beatOrNote;
      const found = this.getIn(['notes', 'notes']).find((note: MidiNote) => {
        return note.equals(mn);
      });
      if (!this.hasInSelections(found)) {
        let notes = this.getIn(['selections', 'notes']);
        notes = notes.push(found);
        return this.setIn(['selections', 'notes'], notes);
      }
    } else if (typeof beatOrNote === 'number' && typeof noteNum === 'number') {
      return this;
    }
    // if drawing
    // findNote()
    // if !select add note to selection
    // const note = this.getIn(['notes', 'notes']).find((n, id) => {
    //   const from = n.get('startBeat');
    //   const to = from + n.get('lengthInBeats');
    //   if (n.get('noteNumber') === noteNum) {
    //     return !!(beatOrNote >= from && beatOrNote <= to);
    //   }
    //   return false;
    // });
    return this;
  }

  public onRelease(beat: number, noteNum: number) {
    const nextState = this.setIsDrawing(false);
    return nextState;
  }

  private setIsDrawing(nextProp: boolean) {
    return this.set('isDrawing', nextProp);
  }

  private hasInSelections(mn: MidiNote): boolean {
    if (
      this.getIn(['selections', 'notes']).find((note: MidiNote) => {
        return note.equals(mn);
      })
    ) {
      return true;
    }
    return false;
  }

  public prepareToChange() {
    return this.set('selections', new MidiList());
  }
}
