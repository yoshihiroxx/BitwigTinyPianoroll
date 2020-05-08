import MidiParser from 'midi-parser-js';
import fs from 'fs';

describe('Model Clip', () => {
  test('midiParser Can be loaded', () => {
    expect(typeof MidiParser).toBe('object');
  });
  test('load MIDI file', (done) => {
    fs.readFile('./test/midi/testpattern.mid', 'base64', (err, data) => {
      const midiArray = MidiParser.parse(data);
      console.log(midiArray);
      done();
    });
  });
});
