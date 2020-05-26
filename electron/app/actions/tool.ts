import { List } from 'immutable';
import MidiClip from '../models/MidiClip';
import MidiNote from '../models/MidiNote';
import { PenTool, EraserTool, MoveTool, RectTool } from '../tool/Tools';

import StretchTool from '../tool/StretchTool';
import LengthTool from '../tool/LengthTool';
import { GetState, Dispatch } from '../reducers/types';

export const HANDLE_CLICK = 'HANDLE_CLICK';
export const HANDLE_TOOL = 'HANDLE_TOOL';
export const HANDLE_DRAG = 'HANDLE_DRAG';
export const HANDLE_RELEASE = 'HANDLE_RELEASE';
export const HANDLE_EVENT = 'HANDLE_EVENT';
export const HANDLE_MOUSE_EVENT = 'HANDLE_MOUSE_EVENT';
export const ADD_NOTE = 'ADD_NOTE';
export const REMOVE_NOTE = 'REMOVE_NOTE';

export function handleEvent(
  event: string,
  beatOrNote: number | MidiNote,
  noteNumber: number
) {
  return {
    type: HANDLE_EVENT,
    event,
    payload: {
      beatOrNote,
      noteNumber
    }
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

function addNote(note: MidiNote) {
  return {
    type: ADD_NOTE,
    payload: {
      note
    },
    meta: {},
    error: null
  };
}

function removeNote(note: MidiNote) {
  return {
    type: REMOVE_NOTE,
    payload: {
      note
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
        dispatch(removeNote(note));
      });
    } else if (tool instanceof MoveTool) {
      selections.get('notes').forEach((note: MidiNote) => {
        dispatch(removeNote(note));
      });
    }

    const drawing = editor.getIn(['tool', 'drawing']);
    if (tool instanceof PenTool) {
      drawing.get('notes').forEach((note: MidiNote) => {
        dispatch(addNote(note));
      });
    } else if (tool instanceof MoveTool) {
      drawing.get('notes').forEach((note: MidiNote) => {
        dispatch(addNote(note));
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
