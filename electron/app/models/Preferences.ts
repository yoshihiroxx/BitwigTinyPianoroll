import { Record } from 'immutable';
import KeyBinds from './KeyBinds';
import Theme from './Theme';
import GeneralPref from './GeneralPref';

// @todo write tests
export type PreferencesRecordType = {
  sequencer: {
    ppq: number;
  };
  general: GeneralPref;
  keyBinds: KeyBinds;
  theme: Theme;
  output: {
    defaultDirectory: string;
    midi: {
      formatType: number;
    };
  };
};

const PreferencesRecord = Record<PreferencesRecordType>({
  sequencer: {
    ppq: 960
  },
  general: new GeneralPref(),
  keyBinds: new KeyBinds(),
  theme: new Theme(),
  output: {
    defaultDirectory: './',
    midi: {
      formatType: 1
    }
  }
});

export default class Preferences extends PreferencesRecord {}
