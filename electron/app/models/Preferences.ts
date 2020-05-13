import { Record } from 'immutable';

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
  theme: {
    file: string;
  };
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
  theme: {
    file: ''
  },
  output: {
    defaultDirectory: './',
    midi: {
      formatType: 1
    }
  }
});

export default class Preferences extends PreferencesRecord {}
