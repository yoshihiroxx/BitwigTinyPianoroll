import { Record, List } from 'immutable';
import MidiNote from './MidiNote';
import { ClipRecordProps } from './Clip';
import MidiList, { createMidiListByMidiFile } from './MidiList';
import {
  ParsedMidi,
  implementsParsedMidi,
  implementsMidiEvent,
  implementsTrackHeaderEvent
} from './ParsedMidi';

function calcLengthInBeatsFromParsedMidi(parsedMidi: ParsedMidi) {
  let sum = 0;
  const ppq: number = parsedMidi.timeDivision;
  let midiSequence = List(parsedMidi.track[1].event);
  midiSequence = midiSequence.shift();
  midiSequence.forEach(event => {
    if (implementsMidiEvent(event)) {
      sum += event.deltaTime;
    }
  });
  return sum / ppq;
}

type MidiClipStateProps = ClipRecordProps & {
  midiList: MidiList;
};

const defaultMidiClipValues: MidiClipStateProps = {
  name: '',
  lengthInBeats: 0,
  loopLengthInBeats: 1,
  color: List(),
  copyFrom: () => undefined,
  midiList: new MidiList()
};

const MidiClipRecord = Record<MidiClipStateProps>(defaultMidiClipValues);

export default class MidiClip extends MidiClipRecord {
  constructor(parsedMidiFile?: ParsedMidi) {
    super();
    if (parsedMidiFile == null) {
      return this;
    }
    if (implementsParsedMidi(parsedMidiFile)) {
      if (implementsTrackHeaderEvent(parsedMidiFile.track[1].event[0])) {
        const clipName: string = parsedMidiFile.track[1].event[0].data;
        const midiList = createMidiListByMidiFile(parsedMidiFile);
        let newRecord = this.set('name', clipName);
        newRecord = newRecord.set('midiList', midiList);
        const lengthInBeats = calcLengthInBeatsFromParsedMidi(parsedMidiFile);
        newRecord = newRecord.set('lengthInBeats', lengthInBeats);
        newRecord = newRecord.set('loopLengthInBeats', lengthInBeats);
        return newRecord;
      }
    }
    return this;
  }

  addNote(note: MidiNote) {}

  removeNote(beatInLength: number) {}
}
