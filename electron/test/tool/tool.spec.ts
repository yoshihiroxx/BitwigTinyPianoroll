import { promises as fs } from 'fs';
import MidiParser from 'midi-parser-js';
import Tool from '../../app/tool/Tool';
import PenTool from '../../app/tool/PenTool';
import EraserTool from '../../app/tool/EraserTool';
import MoveTool from '../../app/tool/MoveTool';
import RectTool from '../../app/tool/RectTool';
import MidiList, { createMidiListByMidiFile } from '../../app/models/MidiList';
import MidiNote from '../../app/models/MidiNote';

describe('Tool', () => {
  let pt: Tool;
  beforeAll(async () => {
    const file = await fs.readFile('./test/midi/testpattern.mid', 'base64');
    const parsedMidi = MidiParser.parse(file);
    const ml: MidiList = createMidiListByMidiFile(parsedMidi);
    pt = new PenTool({ notes: ml });
  });

  test('Tool Can be loaded', () => {
    const t = new Tool();
    const et = new EraserTool();
    const mt = new MoveTool();
    const rt = new RectTool();
    expect(t instanceof Tool).toBeTruthy();
    expect(pt instanceof Tool).toBeTruthy();
    expect(et instanceof Tool).toBeTruthy();
    expect(mt instanceof Tool).toBeTruthy();
    expect(rt instanceof Tool).toBeTruthy();
  });

  test('PenTool Behavior', () => {
    pt = pt.set('noteLength', 3);
    pt = pt.onClick(1, 110);
    pt = pt.onDrag(1, 111);
    pt = pt.onRelease(1, 112);
    expect(pt.getIn(['drawing', 'notes', 0])).toEqual(
      new MidiNote({ noteNumber: 112, startBeat: 1, lengthInBeats: 3 })
    );
  });

  test('EraserTool Behavior', () => {
    let et = new EraserTool();
    et = et.onClick(1, 110);
    et = et.onDrag(1, 111);
    et = et.onDrag(2, 111);
    et = et.onDrag(2, 111);
    et = et.onRelease(1, 112);
    console.log(et);
  });
});
