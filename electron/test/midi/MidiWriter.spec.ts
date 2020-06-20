import fs from 'fs';
import MidiParser from 'midi-parser-js';
import MidiWriter, {
  createVariableLengthBuffer
} from '../../app/midi/MidiWriter';
import MidiClip from '../../app/models/MidiClip';
import MidiList, { createMidiListByMidiFile } from '../../app/models/MidiList';
import MetaEvent from '../../app/midi/MetaEvent';
import NoteEvent from '../../app/midi/NoteEvent';
import HeaderChunk from '../../app/midi/HeaderChunk';
import * as util from '../../app/midi/Utils';

function buf2bin(buffer) {
  // buffer is an ArrayBuffer
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => `000000000${x.toString(2)}`.slice(-8))
    .join(' ');
}

describe('midi', () => {
  describe('Header Chunk', () => {
    test('header chunk', () => {
      const buffer = HeaderChunk(1, 960, 1);
      expect(buffer.byteLength).toEqual(14);
    });
  });
  describe('MidiWriter', () => {
    test('createMeataEvent - string', () => {
      const buffer = MetaEvent(10 * 960, 'TestMidiClip1');
      console.log(buf2bin(buffer));

      expect(buffer.byteLength).toEqual(18);
    });

    test('variableLengthBuffer', () => {
      let buffer = util.createVariableLengthBuffer(1);
      expect(buffer.byteLength).toEqual(1);
      buffer = util.createVariableLengthBuffer(0);
      expect(buffer.byteLength).toEqual(1);
      buffer = util.createVariableLengthBuffer(7);
      expect(buffer.byteLength).toEqual(1);
      buffer = util.createVariableLengthBuffer(16129);
      expect(buffer.byteLength).toEqual(2);
      buffer = util.createVariableLengthBuffer(127);
      expect(buffer.byteLength).toEqual(1);
      buffer = util.createVariableLengthBuffer(128);
      expect(buffer.byteLength).toEqual(2);
      buffer = util.createVariableLengthBuffer(0xffff);
      expect(buffer.byteLength).toEqual(3);
      buffer = util.createVariableLengthBuffer(0xffffff);
      expect(buffer.byteLength).toEqual(4);
    });

    test('count string', () => {
      const text = 'MidiClip';
      expect(text.length).toEqual(8);
    });

    test('generateFromClip', () => {
      const mw = new MidiWriter();
      const file = fs.readFileSync(
        './test/midi/maschine-pattern2.mid',
        'base64'
      );
      const midiArray = MidiParser.parse(file);

      let clip = new MidiClip(midiArray);
      clip = clip.set('name', 'MidiClip');
      const buffer = mw.buildFromClip(clip);
      fs.writeFileSync('./test/midi/written.mid', Buffer.from(buffer));
    });

    test('noteEvent', async () => {
      const noteOnBuffer = NoteEvent(1, 1, 60, 67);
      const noteOnView = new Uint8Array(noteOnBuffer);
      expect(noteOnView[0]).toEqual(1);
      expect(noteOnView[1]).toEqual((0x9 << 4) | 1);
      expect(noteOnView[2]).toEqual(60);
      expect(noteOnView[3]).toEqual(67);

      const noteOffBuffer = NoteEvent(2, 1, 60, 0);
      const noteOffView = new Uint8Array(noteOffBuffer);
      expect(noteOffView[0]).toEqual(2);
      expect(noteOffView[1]).toEqual((0x8 << 4) | 1);
      expect(noteOffView[2]).toEqual(60);
      expect(noteOffView[3]).toEqual(0);
    });
  });

  test('noteEvent', async () => {
    const buffer = new ArrayBuffer(2);
    const array = new DataView(buffer);
    array.setUint8(0, 20);
    console.log(buffer);
  });
});
