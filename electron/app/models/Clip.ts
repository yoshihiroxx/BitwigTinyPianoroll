import { Record, List } from 'immutable';

const ClipRecord = Record({
  name: '',
  bpm: 0,
  notes: List(),
  bars: 0,
  time_signature: List(),
});

export default class Clip extends ClipRecord {
  setName(name: string) {
    return this.set('name', name);
  }
}
