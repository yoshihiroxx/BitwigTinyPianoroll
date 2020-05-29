import { Record } from 'immutable';
import KeyBinds from './KeyBinds';
import Theme from './Theme';

// @todo write tests
export type PreferencesRecordType = {
  sequencer: {
    ppq: number;
  };
  osc: {
    clientMode: string;
    isEnabled: boolean;
    clientPort: string;
    serverPort: string;
  };
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
  osc: {
    clientMode: 'bitwig',
    isEnabled: true,
    clientPort: '',
    serverPort: ''
  },
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
