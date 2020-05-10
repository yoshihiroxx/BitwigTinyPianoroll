import MidiParser from 'midi-parser-js';
import { promises as fs } from 'fs';
import MidiList, { createMidiListByMidiFile } from '../../app/models/MidiList';
import MidiNote from '../../app/models/MidiNote';

describe('Model MidiNote', () => {
  test('MidiList Can be loaded', () => {
    const ml = new MidiList();
    expect(typeof ml).toBe('object');
  });
  test('Add a MidiNote to MidiList', () => {
    const mn: MidiNote = new MidiNote({
      noteNumber: 133,
      startBeat: 23.1,
      lengthInBeats: 33.23,
      velocity: 122
    });
    let ml: MidiList = new MidiList();
    ml = ml.addNote(mn);

    expect(ml.get('notes').get(0)).toMatchObject(mn);
  });
  test('Create MidiList by midi file', async () => {
    const file = await fs.readFile('./test/midi/testpattern.mid', 'base64');
    const parsedMidi = MidiParser.parse(file);
    const ml = createMidiListByMidiFile(parsedMidi);
    expect(ml instanceof MidiList).toBeTruthy();
  });
});
