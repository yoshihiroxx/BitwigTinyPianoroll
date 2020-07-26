import { List } from 'immutable';
import { ipcRenderer } from 'electron';
import MidiClip from '../models/MidiClip';
import MidiNote from '../models/MidiNote';
import { PenTool, EraserTool, MoveTool, RectTool } from '../tool/Tools';
import StretchTool from '../tool/StretchTool';
import LengthTool from '../tool/LengthTool';
import { GetState, Dispatch, ActionType } from '../reducers/types';

export const HANDLE_CLICK = 'HANDLE_CLICK';
export const HANDLE_TOOL = 'HANDLE_TOOL';
export const HANDLE_DRAG = 'HANDLE_DRAG';
export const HANDLE_RELEASE = 'HANDLE_RELEASE';
export const HANDLE_MOUSE_EVENT = 'HANDLE_MOUSE_EVENT';
export const ADD_NOTE = 'ADD_NOTE';
export const REMOVE_NOTE = 'REMOVE_NOTE';
export const CLEAR_SELECTIONS = 'CLEAR_SELECTIONS';
export const SET_SELECTIONS = 'SET_SELECTIONS';
export const SET_KEEP_SELECTIONS = 'SET_KEEP_SELECTIONS';
export const FAILED_ADD_NOTE = 'FAILED_ADD_NOTE';

const TIMEOUT = 5000;

export function clearSelections() {
  return {
    type: CLEAR_SELECTIONS,
    payload: {},
    meta: {}
  };
}

export function setSelections(selections: MidiList) {
  return {
    type: SET_SELECTIONS,
    payload: {
      selections
    },
    meta: {}
  };
}

export function handleMouseEvent(
  event: string,
  beatOrNote: number | MidiNote,
  noteNumber?: number
) {
  return {
    type: HANDLE_MOUSE_EVENT,
    payload: {
      event,
      beatOrNote,
      noteNumber
    },
    meta: {
      event
    }
  };
}

export function handleTool(toolType: string) {
  return {
    type: HANDLE_TOOL,
    payload: {},
    meta: {
      toolType
    }
  };
}

export function addNote(note: MidiNote) {
  return {
    type: ADD_NOTE,
    payload: {
      note
    },
    meta: {},
    error: null
  };
}

export function removeNote(note: MidiNote) {
  return {
    type: REMOVE_NOTE,
    payload: {
      note
    },
    meta: {},
    error: null
  };
}

export function requestAddNote(note: MidiNote) {
  return (dispatch: Dispatch, getState: GetState) => {
    const mode = getState().preferences.general.clientMode;
    if (mode === '') {
      dispatch(addNote(note));
    } else if (mode === 'bitwig') {
      ipcRenderer.send('/v1/bitwig/cursorclip/notes', {
        type: 'set',
        payload: note.toObject(),
        meta: { actionType: 'SET_NOTE' },
        error: false
      });
      dispatch(handleError());
    }
  };
}
export function requestRemoveNote(note: MidiNote) {
  return (dispatch: Dispatch, getState: GetState) => {
    const mode = getState().preferences.general.clientMode;
    if (mode === '') {
      dispatch(removeNote(note));
    } else if (mode === 'bitwig') {
      ipcRenderer.send('/v1/bitwig/cursorclip/notes', {
        type: 'set',
        payload: note.toObject(),
        meta: { actionType: 'CLEAR_NOTE' },
        error: false
      });
      dispatch(handleError());
    }
  };
}

// @todo
// export function reserveError(note: MidiNote) {
//   return (dispatch: Dispatch, getState: GetState) => {
//     setTimeout(() => {
//     }, TIMEOUT);
//   };
// }

export function handleError() {
  return {
    type: FAILED_ADD_NOTE,
    pyaload: {},
    meta: {
      message: 'error occured'
    },
    error: true
  };
}

export function setKeepSelections(value: boolean) {
  return {
    type: SET_KEEP_SELECTIONS,
    payload: {
      value
    },
    meta: {},
    error: null
  };
}

function handleMouseRelease(
  event: string,
  beatOrNote: number | MidiNote,
  noteNumber: number
) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { editor } = getState();
    const tool = editor.get('tool');

    const selections = tool.get('selections');
    if (tool instanceof EraserTool) {
      selections.get('notes').forEach((note: MidiNote) => {
        dispatch(requestRemoveNote(note));
      });
    } else if (tool instanceof MoveTool) {
      selections.get('notes').forEach((note: MidiNote) => {
        if (!tool.get('shouldKeepSelection')) dispatch(requestRemoveNote(note));
      });
    } else if (tool instanceof LengthTool) {
      selections.get('notes').forEach((note: MidiNote) => {
        dispatch(requestRemoveNote(note));
      });
    }

    const drawing = editor.getIn(['tool', 'drawing']);
    if (tool instanceof PenTool) {
      drawing.get('notes').forEach((note: MidiNote) => {
        dispatch(requestAddNote(note));
      });
    } else if (tool instanceof MoveTool) {
      drawing.get('notes').forEach((note: MidiNote) => {
        dispatch(requestAddNote(note));
      });
    } else if (tool instanceof LengthTool) {
      drawing.get('notes').forEach((note: MidiNote) => {
        dispatch(requestAddNote(note));
      });
    }

    dispatch(handleMouseEvent('release', 0, 0));
    dispatch(handleTool('pen'));
  };
}

export function onMouseEvent(
  event: string,
  beatOrNote: number | MidiNote,
  noteNumber?: number
) {
  switch (event) {
    case 'click':
      return handleMouseEvent(event, beatOrNote, noteNumber);
    case 'drag':
      return handleMouseEvent(event, beatOrNote, noteNumber);
    case 'release':
      return handleMouseRelease();
    default:
      return {
        type: 'ERROR',
        payload: {},
        meta: {},
        error: new Error(`${event} is not defined.`)
      };
  }
}

export function focusClip(trackId: number, clipId: number) {
  return {
    type: 'HANDLE_CLIP',
    payload: {
      trackId,
      clipId
    }
  };
}
