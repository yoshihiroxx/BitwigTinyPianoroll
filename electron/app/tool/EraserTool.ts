import { List } from 'immutable';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';
import Tool from './Tool';

export default class EraserTool extends Tool {
  public onClick(beatOrNote: any, noteNum?: number) {
    // @todo move note to select layer
    let nextState = this.setIsDrawing(true);
    if (beatOrNote instanceof MidiNote) {
      nextState = nextState.set('selections', new MidiList());
      this.getIn(['selections', 'notes']).find((note, id) => {});
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
