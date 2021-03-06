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
  public addNote(midiNote: MidiNote) {
    return this.set('notes', this.notes.push(midiNote));
  }

  public setNotes(notes: List<MidiNote>) {
    return this.set('notes', notes);
  }

  public getNotes() {
    return this.notes;
  }

  public hasNote(note: MidiNote) {
    const found = this.get('notes').find(n => {
      return n.equals(note);
    });
    return found instanceof MidiNote;
  }

  public slidePitch(noteNumber: number) {
    const nextNotes = this.get('notes').map(note => {
      return note.set('noteNumber', note.get('noteNumber') + noteNumber);
    });
    return this.set('notes', nextNotes);
  }

  public slideBeat(beat: number) {
    const nextNotes = this.get('notes').map(note => {
      return note.set('startBeat', note.get('startBeat') + beat);
    });
    return this.set('notes', nextNotes);
  }

  public sortNoteToFirst(note: MidiNote) {
    const nextNotes = this.get('notes').sort(n => {
      if (n.equals(note)) {
        return -1;
      }
      return 0;
    });
    return this.set('notes', nextNotes);
  }
}

export function createMidiListByMidiFile(parsedMidi: ParsedMidi): MidiList {
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
              throw new Error(
                `${event}invalide data has supplied. check event has given data is correct below.`
              );
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
