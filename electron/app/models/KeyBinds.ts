import { Record, List } from 'immutable';
import keyCodes from '../keycode';

type KeyBindsType = {
  eraser: KeyBind;
  rect: KeyBind;
  copy: KeyBind;
  paste: KeyBind;
  pitchUp: KeyBind;
  pitchDown: KeyBind;
  increaseBeat: KeyBind;
  decreaseBeat: KeyBind;
  removeNotes: KeyBind;
  keepSelectionNotes: KeyBind;
};

export type KeyBind = {
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  codes: Array<number>;
};

const KeyBindsRecord = Record<KeyBindsType>({
  eraser: {
    metaKey: false,
    altKey: true,
    shiftKey: false,
    codes: [keyCodes.option]
  },
  rect: {
    metaKey: true,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.cmd_left, keyCodes.cmd_right]
  },
  copy: {
    metaKey: true,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.c]
  },
  paste: {
    metaKey: true,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.p]
  },
  pitchUp: {
    metaKey: false,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.up]
  },
  pitchDown: {
    metaKey: false,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.down]
  },
  increaseBeat: {
    metaKey: false,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.right]
  },
  decreaseBeat: {
    metaKey: false,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.left]
  },
  removeNotes: {
    metaKey: false,
    altKey: false,
    shiftKey: false,
    codes: [keyCodes.delete]
  },
  keepSelectionNotes: {
    metaKey: false,
    altKey: true,
    shiftKey: false,
    codes: [keyCodes.option]
  }
});

export default class KeyBinds extends KeyBindsRecord {}