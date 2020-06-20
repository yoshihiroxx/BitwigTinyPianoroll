import KeyBinds, { KeyBind } from '../models/KeyBinds';
import {
  setSelections,
  addNote,
  removeNote,
  clearSelections,
  setKeepSelections
} from './tool';
import { GetState, Dispatch } from '../reducers/types';

function matchedActionName(event, keyBinds: KeyBinds, isKeyUp: boolean) {
  let matchedAction = '';
  const actionNames: Array<string> = [
    'copy',
    'paste',
    'pitchUp',
    'pitchDown',
    'increaseBeat',
    'decreaseBeat',
    'removeNotes',
    'keepSelectionNotes'
  ];
  actionNames.forEach((actionName: string) => {
    const keyBind: KeyBind = keyBinds.get(actionName);
    if (!keyBind) {
      throw new Error(`${actionName}: is not defined in KeyBinds`);
    }
    if (
      keyBind.codes.some((value: number) => {
        return value === event.keyCode;
      }) &&
      ((keyBind.metaKey === event.metaKey &&
        keyBind.altKey === event.altKey &&
        keyBind.shiftKey === event.shiftKey) ||
        isKeyUp)
    ) {
      matchedAction = actionName;
    }
  });
  return matchedAction;
}

export function onKeyDown(event) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { editor, preferences } = getState();
    const tool = editor.get('tool');

    const matchedAction = matchedActionName(event, preferences.keyBinds, false);

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
      case 'keepSelectionNotes':
        dispatch(setKeepSelections(true));
        break;
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

export function onKeyUp(event) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { editor, preferences } = getState();
    const tool = editor.get('tool');
    const matchedAction = matchedActionName(event, preferences.keyBinds, true);
    switch (matchedAction) {
      case 'keepSelectionNotes':
        dispatch(setKeepSelections(false));
        break;
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
