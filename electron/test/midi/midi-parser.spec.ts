import MidiParser from 'midi-parser-js';
import { promises as fs } from 'fs';

describe('Model Clip', () => {
  test('midiParser Can be loaded', () => {
    expect(typeof MidiParser).toBe('object');
  });
  test('load MIDI file', async () => {
    const file = await fs.readFile('./test/midi/testpattern.mid', 'base64');
    const midiArray = MidiParser.parse(file);
    console.log(midiArray.track[0]);
    console.log(midiArray.track[1]);
  });
});
