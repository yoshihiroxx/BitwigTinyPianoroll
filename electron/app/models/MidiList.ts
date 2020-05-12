import { Record, List } from 'immutable';
import MidiNote from './MidiNote';
import {
  ParsedMidi,
  implementsMidiEvent,
  implementsNoteEvent
} from './ParsedMidi';

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

export function createMidiListByMidiFile(parsedMidi: ParsedMidi) {
  let result: MidiList = new MidiList();
  const ppq: number = parsedMidi.timeDivision;
  let sumOfDeltaTime = 0;
  let midiSequence = List(parsedMidi.track[1].event);
  midiSequence = midiSequence.shift();
  let noteOnList: List<MidiNote> = List();

  midiSequence.forEach(event => {
    if (implementsMidiEvent(event)) {
      sumOfDeltaTime += event.deltaTime;
      switch (event.type) {
        case 9: // note on
          if (implementsNoteEvent(event)) {
            noteOnList = noteOnList.push(
              new MidiNote({
                noteNumber: event.data[0],
                startBeat: sumOfDeltaTime / ppq,
                velocity: event.data[1]
              })
            );
          }
          break;
        // note off {}
        case 8: {
          if (implementsNoteEvent(event)) {
            let mn = noteOnList.find(noteOn => {
              return noteOn.get('noteNumber') === event.data[0];
            });
            const index = noteOnList.findIndex(noteOn => {
              return noteOn.get('noteNumber') === event.data[0];
            });
            if (mn instanceof MidiNote) {
              const lengthInBeats = sumOfDeltaTime / ppq - mn.get('startBeat');
              mn = mn.set('lengthInBeats', lengthInBeats);
              result = result.addNote(mn);
              noteOnList = noteOnList.remove(index);
            } else {
              console.log(
                'invalide data has supplied. check event has given data is correct below.'
              );
              console.log(event);
            }
          }
          break;
        }
        case 255: // end of clip
          break;
        default:
          break;
      }
    }
  });
  return result;
}
