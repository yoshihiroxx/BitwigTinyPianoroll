import { List, Record } from 'immutable';
import MidiList from '../models/MidiList';

type ToolType = {
  notes: MidiList;
  selections: MidiList;
  drawing: MidiList;
  noteLength: number;
};

const ToolRecord = Record<ToolType>({
  notes: new MidiList(),
  selections: new MidiList(),
  drawing: new MidiList(),
  noteLength: 1
});

export default class Tool extends ToolRecord {
  onClick(beat: number, noteNum: number) {
    return this;
  }

  onDrag(beat: number, noteNum: number) {
    return this;
  }

  onRelease(beat: number, noteNum: number) {
    return this;
  }

  magnet(notes: MidiList) {
    return this;
  }
}
