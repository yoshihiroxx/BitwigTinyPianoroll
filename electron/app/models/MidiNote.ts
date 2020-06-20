import { Record, List } from 'immutable';

const MidiNoteRecord = Record({
  noteNumber: 0,
  startBeat: 0,
  lengthInBeats: 0.25,
  velocity: 60
});

export default class MidiNote extends MidiNoteRecord {
  setVelocity(velocity: number) {
    return this.set('startBeat', velocity);
  }
}
