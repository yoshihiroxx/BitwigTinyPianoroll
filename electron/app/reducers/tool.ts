import { Action } from 'redux';
import { ActionType } from './types';
import {
  PenTool,
  EraserTool,
  MoveTool,
  RectTool,
  LengthTool
} from '../tool/Tools';
import {
  HANDLE_MOUSE_EVENT,
  HANDLE_TOOL,
  SET_SELECTIONS,
  handleMouseEvent,
  handleTool,
  focusClip,
  SET_KEEP_SELECTIONS
} from '../actions/tool';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';

type Actions =
  | ReturnType<typeof handleMouseEvent>
  | ReturnType<typeof handleTool>;

export default function tool(state = new PenTool(), action: Actions) {
  switch (action.type) {
    case HANDLE_MOUSE_EVENT: {
      switch (action.meta.event) {
        case 'click': {
          if (typeof action.payload.beatOrNote === 'number') {
            return state.onClick(
              action.payload.beatOrNote,
              action.payload.noteNumber
            );
          }
          if (action.payload.beatOrNote instanceof MidiNote) {
            return state.onClick(action.payload.beatOrNote);
          }
          return state;
        }
        case 'drag':
          return state.onDrag(
            action.payload.beatOrNote,
            action.payload.noteNumber
          );
        case 'release': {
          const nextState = state.onRelease(
            action.payload.beatOrNote,
            action.payload.noteNumber
          );
          return nextState;
        }
        default:
          return state;
      }
    }
    case HANDLE_TOOL: {
      // let nextState = state;
      // if (action.meta.force) {
      //   nextState = nextState.set('isDrawing', false);
      //   nextState = nextState.set('drawing', new MidiList());
      // }
      if (state.get('isDrawing')) return state;
      switch (action.meta.toolType) {
        case 'pen':
          return new PenTool(state.prepareToChange());

        case 'eraser':
          return new EraserTool(state.prepareToChange());

        case 'move':
          return new MoveTool(state.prepareToChange());

        case 'rect':
          return new RectTool(state.prepareToChange());

        case 'length':
          return new LengthTool(state.prepareToChange());

        default:
          throw new Error(`${action.meta.toolType}: This tool is not defined.`);
          return state;
      }
    }
    case SET_SELECTIONS: {
      return state.set('selections', action.payload.selections);
    }

    case SET_KEEP_SELECTIONS: {
      return state.set('shouldKeepSelection', action.payload.value);
    }

    default:
      return state;
  }
}
