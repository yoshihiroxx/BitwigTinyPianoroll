import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type counterStateType = {
  counter: number;
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<counterStateType, Action<string>>;

export type bitwigTinyPianorollStoreType = {
  project: {
    tracks: Array<{
      clips: Array<{}>;
    }>;
  };
  preferences: {
    sequencer: {
      ppq: number;
    };
    osc: {
      clientMode: string;
      isEnabled: boolean;
      clientPort: string;
      serverPosrt: string;
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
};
