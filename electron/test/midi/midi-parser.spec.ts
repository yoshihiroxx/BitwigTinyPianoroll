import MidiParser from 'midi-parser-js';
import { promises as fs } from 'fs';

describe('Model Clip', () => {
  test('midiParser Can be loaded', () => {
    expect(typeof MidiParser).toBe('object');
  });
  test('load MIDI file', async () => {
    const file = await fs.readFile('./test/midi/written.mid', 'base64');
    const midiArray = MidiParser.parse(file);
    console.log(JSON.stringify(midiArray, null, 2));
  });
  test('load bitwig file', async () => {
    const file = await fs.readFile('./test/midi/exportedByLogic.mid', 'base64');
    const midiArray = MidiParser.parse(file);
    // console.log(JSON.stringify(midiArray, null, 2));
  });
});
