import { Record, List } from 'immutable';
import keyCode from './keycode';

type color = {
  value: number;
  alpha: number;
};

type ConfigType = {
  keyBinds: {
    eraser: List<number>;
    rect: List<number>;
  };
  appearances: {
    pianoroll: {
      background: Color;
      notes: {
        common: color;
        selection: color;
        drawing: color;
      };
      lines: {
        horizontal: {
          main: color;
          sub: color;
        };
        vertical: {
          quarter: color;
          beat: color;
          bar: color;
        };
      };
    };
  };
};

const Config = Record<ConfigType>({
  keyBinds: {
    eraser: List([keyCode.option]),
    rect: List([keyCode.cmd_left, keyCode.cmd_right])
  },
  appearances: {
    pianoroll: {
      background: {
        value: 0x444444,
        alpha: 1
      },
      notes: {
        common: {
          value: 0x33bb33,
          alpha: 1
        },
        selection: {
          value: 0x3333bb,
          alpha: 1
        },
        drawing: {
          value: 0xbb3333,
          alpha: 1
        }
      },
      lines: {
        horizontal: {
          main: {
            value: 0x33bb33,
            alpha: 1
          },
          sub: {
            value: 0x33bb33,
            alpha: 1
          }
        },
        vertical: {
          quarter: {
            value: 0x33bb33,
            alpha: 1
          },
          beat: {
            value: 0x33bb33,
            alpha: 1
          },
          bar: {
            value: 0x33bb33,
            alpha: 1
          }
        }
      }
    }
  }
});

export default new Config();
