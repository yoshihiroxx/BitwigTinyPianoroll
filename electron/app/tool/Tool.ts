/* eslint-disable no-dupe-class-members */
import { List, Record } from 'immutable';
import MidiList from '../models/MidiList';
import MidiNote from '../models/MidiNote';

//-------------------------------------------------------
//
// Do not modifiy the [[ notes:MidiList ]] in this class.
//
//-------------------------------------------------------

export type ToolRecordType = {
  notes: MidiList;
  selections: MidiList;
  drawing: MidiList;
  noteLength: number;
  isDrawing: boolean;
  shouldKeepSelection: boolean;
  eventStart: {
    beat: number;
    noteNumber: number;
  };
};

export const ToolRecord = Record<ToolRecordType>({
  notes: new MidiList(),
  selections: new MidiList(),
  drawing: new MidiList(),
  noteLength: 1,
  isDrawing: false,
  shouldKeepSelection: false,
  eventStart: {
    beat: 0,
    noteNumber: 0
  }
});

export default class Tool extends ToolRecord {
  constructor(tool?: Tool) {
    super();
    if (tool instanceof Tool) {
      return this.set('notes', tool.get('notes'))
        .set('selections', tool.get('selections'))
        .set('drawing', tool.get('drawing'))
        .set('noteLength', tool.get('noteLength'))
        .set('isDrawing', tool.get('isDrawing'));
    }
    return this;
  }

  public onClick(beat: number, noteNum: number): Tool;

  public onClick(note: MidiNote): Tool;

  public onClick(beatOrNote: any, noteNum?: number) {
    return this;
  }

  public onClickEdge(side: string, note: MidiNote) {
    return this;
  }

  public onDrag(beat: number, noteNum: number): Tool;

  public onDrag(note: MidiNote): Tool;

  public onDrag(beatOrNote: any, noteNum?: number) {
    return this;
  }

  public onDragNote(note: MidiNote) {
    return this;
  }

  public onRelease(beat: number, noteNum: number) {
    return this.set('isDrawing', false);
  }

  public magnet(notes: MidiList) {
    return this;
  }

  public prepareToChange() {
    return this.set('isDrawing', false).set('shouldKeepSelection', false);
  }

  public clearSelection() {
    return this.set('selections', new MidiList());
  }

  protected setIsDrawing(nextProp: boolean) {
    return this.set('isDrawing', nextProp);
  }
}
