import MidiParser from 'midi-parser-js';
import { promises as fs } from 'fs';
import MidiClip from '../../app/models/MidiClip';

describe('Model MidiClip', () => {
  test('MidiClip Can be loaded', () => {
    const mc = new MidiClip();
    expect(typeof mc).toBe('object');
  });

  test('Create MidiClip from Midifile', async () => {
    const file = await fs.readFile('./test/midi/testpattern.mid', 'base64');
    const parsedMidi = MidiParser.parse(file);
    const mc = new MidiClip(parsedMidi);
    const clipName = parsedMidi.track[1].event[0].data;
    expect(mc.get('name')).toEqual(clipName);
    expect(mc.get('lengthInBeats')).toEqual(4);
    expect(mc.get('loopLengthInBeats')).toEqual(4);
    console.log(mc.get('midiList').toJS());
  });

  test('Add Multiple Midi Notes to MidiClip', () => {
    const mc = new MidiClip();
    mc.addNote();
  });

  test('Remove Multiple Midi Notes from MidiClip', () => {
    const mc = new MidiClip();
    mc.removeNote();
  });
});
