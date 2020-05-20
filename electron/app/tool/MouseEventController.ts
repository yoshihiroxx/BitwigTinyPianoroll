import MidiNote from '../models/MidiNote';
import { notEqual } from 'assert';
import { monitorEventLoopDelay } from 'perf_hooks';

function switchToolByKey(pressingKeys: List) {
  return pressingKeys.has('cmd')? new SelectTool() : new PenTool();
}

interface onClickTempMethod  {
  process: ()=>{
    applyPressingKeyStates();
    applyNotes();
  }
}

class ToolManager(){
  tool = null;
  getTool(){
    return tool
  }
}
