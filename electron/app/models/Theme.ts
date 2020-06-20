import { Record, List } from 'immutable';
import keyCode from './keycode';

export type color = {
  value: number;
  alpha: number;
};

export type ThemeType = {
  pianoroll: {
    background: color;
    notes: {
      text: color;
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

const ThemeRecord = Record<ThemeType>({
  pianoroll: {
    background: {
      value: 0x444444,
      alpha: 1
    },
    notes: {
      text: {
        value: 0x000000,
        alpha: 0.4
      },
      common: {
        value: 0x33bb99,
        alpha: 1
      },
      selection: {
        value: 0x33ddff,
        alpha: 1
      },
      drawing: {
        value: 0xbbff33,
        alpha: 1
      }
    },
    lines: {
      horizontal: {
        main: {
          value: 0xffffff,
          alpha: 0.7
        },
        sub: {
          value: 0xffffff,
          alpha: 0.4
        }
      },
      vertical: {
        quarter: {
          value: 0xffffff,
          alpha: 0.2
        },
        beat: {
          value: 0xffffff,
          alpha: 0.2
        },
        bar: {
          value: 0xffffff,
          alpha: 0.4
        }
      }
    }
  }
});

export default class Theme extends ThemeRecord {}
