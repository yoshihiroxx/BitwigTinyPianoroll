import { promises as fs } from 'fs';
import MidiParser from 'midi-parser-js';
import Tool, { ToolRecord } from '../../app/tool/Tool';
import PenTool from '../../app/tool/PenTool';
import EraserTool from '../../app/tool/EraserTool';
import MoveTool from '../../app/tool/MoveTool';
import RectTool from '../../app/tool/RectTool';
import MidiList, { createMidiListByMidiFile } from '../../app/models/MidiList';
import MidiNote from '../../app/models/MidiNote';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

function getMidiNoteRandomly(midiList: MidiList): MidiNote {
  const index = getRandomInt(0, midiList.get('notes').count());
  return midiList.getIn(['notes', index]);
}

describe('Tool', () => {
  let pt: Tool;
  let et: Tool;
  beforeAll(async () => {
    const file = await fs.readFile('./test/midi/testpattern.mid', 'base64');
    const parsedMidi = MidiParser.parse(file);
    const ml: MidiList = createMidiListByMidiFile(parsedMidi);
    pt = new PenTool();
    pt = pt.set('notes', ml);
    et = new EraserTool(pt);
  });

  test('Tool Can be loaded', () => {
    const mt = new MoveTool();
    const rt = new RectTool();
    expect(pt instanceof Tool).toBeTruthy();
    expect(et instanceof Tool).toBeTruthy();
    expect(mt instanceof Tool).toBeTruthy();
    expect(rt instanceof Tool).toBeTruthy();
    expect(pt instanceof EraserTool).toBeFalsy();
  });

  test('handleTool', () => {
    console.log(et.get('notes'));
    expect(et instanceof Tool).toBeTruthy();
    expect(et instanceof EraserTool).toBeTruthy();
    expect(et instanceof PenTool).toBeFalsy();
  });

  test('PenTool Behavior', () => {
    expect(pt.get('isDrawing')).toBeFalsy();
    pt = pt.onDrag(1, 121);
    pt = pt.set('noteLength', 3);
    pt = pt.onClick(1, 110);
    expect(pt.get('isDrawing')).toBeTruthy();
    pt = pt.onDrag(1, 111);
    expect(pt.get('isDrawing')).toBeTruthy();
    pt = pt.onRelease(1, 112);
    expect(pt.get('isDrawing')).toBeFalsy();
    pt = pt.onDrag(1, 121);
    pt = pt.onDrag(2, 211);
    expect(pt.get('isDrawing')).toBeFalsy();
    expect(pt.getIn(['drawing', 'notes', 0])).toEqual(
      new MidiNote({ noteNumber: 112, startBeat: 1, lengthInBeats: 3 })
    );
  });

  test('EraserTool Behavior', () => {
    et = et.onClick(1, 110);
    et = et.onDrag(1, 111);
    et = et.onDrag(2, 111);
    const mn = getMidiNoteRandomly(et.get('notes'));
    et = et.onDrag(mn);
    et = et.onDrag(2, 111);
    et = et.onDrag(0.25, 113);
    et = et.onRelease(1, 112);
    et = et.onDrag(1, 111);
    expect(et.getIn(['selections', 'notes']).size).toEqual(1);
  });
});
