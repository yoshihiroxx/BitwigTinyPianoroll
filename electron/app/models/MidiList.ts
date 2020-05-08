import { Record, List } from 'immutable';
import MidiNote from './MidiNote';

type MidiListRecordType = {
  notes: List<MidiNote>;
};

const MidiListRecord = Record<MidiListRecordType>({
  notes: List()
});

export default class MidiList extends MidiListRecord {
  addNote(midiNote: MidiNote) {
    return this.set('notes', this.notes.push(midiNote));
  }

  getNotes() {
    return this.notes;
  }
}
