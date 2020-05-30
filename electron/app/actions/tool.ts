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
export const HANDLE_MOUSE_EVENT = 'HANDLE_MOUSE_EVENT';
export const ADD_NOTE = 'ADD_NOTE';
export const REMOVE_NOTE = 'REMOVE_NOTE';
export const CLEAR_SELECTIONS = 'CLEAR_SELECTIONS';
export const SET_SELECTIONS = 'SET_SELECTIONS';

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
    } else if (tool instanceof LengthTool) {
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
    } else if (tool instanceof LengthTool) {
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

export function onKeyEvent(event) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { editor, preferences } = getState();
    const tool = editor.get('tool');
    const actionNames: Array<string> = [
      'copy',
      'paste',
      'pitchUp',
      'pitchDown',
      'increaseBeat',
      'decreaseBeat',
      'removeNotes'
    ];

    let matchedAction = '';
    actionNames.forEach((actionName: string) => {
      const keyBind: KeyBind = preferences.keyBinds.get(actionName);
      if (!keyBind) {
        throw new Error(`${actionName}: is not defined in KeyBinds`);
      }
      if (
        keyBind.codes.some((value: number) => {
          return value === event.keyCode;
        }) &&
        keyBind.metaKey === event.metaKey &&
        keyBind.altKey === event.altKey &&
        keyBind.shiftKey === event.shiftKey
      ) {
        matchedAction = actionName;
      }
    });

    console.log(matchedAction);

    switch (matchedAction) {
      case 'pitchUp':
        {
          const selections = tool.get('selections');
          if (!tool.get('isDrawing')) {
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(removeNote(note));
            });
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(
                addNote(note.set('noteNumber', note.get('noteNumber') + 1))
              );
            });
            dispatch(setSelections(selections.slidePitch(1)));
          }
        }
        break;
      case 'pitchDown':
        {
          const selections = tool.get('selections');
          if (!tool.get('isDrawing')) {
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(removeNote(note));
            });
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(
                addNote(note.set('noteNumber', note.get('noteNumber') - 1))
              );
            });
            dispatch(setSelections(selections.slidePitch(-1)));
          }
        }
        break;
      case 'increaseBeat':
        {
          const selections = tool.get('selections');
          if (!tool.get('isDrawing')) {
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(removeNote(note));
            });
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(
                addNote(note.set('startBeat', note.get('startBeat') + 0.25))
              );
            });
            dispatch(setSelections(selections.slideBeat(0.25)));
          }
        }
        break;
      case 'decreaseBeat':
        {
          const selections = tool.get('selections');
          if (!tool.get('isDrawing')) {
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(removeNote(note));
            });
            selections.get('notes').forEach((note: MidiNote) => {
              dispatch(
                addNote(note.set('startBeat', note.get('startBeat') - 0.25))
              );
            });
            dispatch(setSelections(selections.slideBeat(-0.25)));
          }
        }
        break;
      case 'removeNotes': {
        const selections = tool.get('selections');
        if (!tool.get('isDrawing')) {
          selections.get('notes').forEach((note: MidiNote) => {
            dispatch(removeNote(note));
          });
          dispatch(clearSelections());
        }
        break;
      }
      default:
        return {
          type: 'ERROR',
          payload: {},
          meta: {},
          error: new Error(`${matchedAction} is not defined.`)
        };
    }
  };
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
