import { Record, List } from 'immutable';
import keyCode from '../keycode';

type KeyBindsType = {
  eraser: List<number>;
  rect: List<number>;
};

const KeyBindsRecord = Record<KeyBindsType>({
  eraser: List([keyCode.option]),
  rect: List([keyCode.cmd_left, keyCode.cmd_right])
});

export default class KeyBinds extends KeyBindsRecord {}
