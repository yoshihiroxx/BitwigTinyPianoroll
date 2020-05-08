import { Record, List } from 'immutable';

const MidiNoteRecord = Record({
  note_number: 0,
  start_beat: 0,
  length_in_beats: 1,
  velocity: 60
});

export default class MidiNote extends MidiNoteRecord {
  setVelocity(velocity: number) {
    return this.set('start_beat', velocity);
  }
}
