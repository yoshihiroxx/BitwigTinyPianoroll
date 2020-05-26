import { Record, List } from 'immutable';
import keyCode from './keycode';

type ConfigType = {
  keyBinds: {
    eraser: List<number>;
    rect: List<number>;
  };
};

const Config = Record<ConfigType>({
  keyBinds: {
    eraser: List([keyCode.cmd_right, keyCode.cmd_left]),
    rect: List([keyCode.option])
  }
});

export default new Config();
