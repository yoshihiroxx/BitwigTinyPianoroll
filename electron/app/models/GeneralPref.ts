import { Record, List } from 'immutable';

export type GeneralPrefType = {
  clientMode: string;
  isEnabled: boolean;
  clientHost: string;
  serverHost: string;
  clientPort: number;
  serverPort: number;
};

const GeneralPrefRecord = Record<GeneralPrefType>({
  clientMode: 'bitwig',
  isEnabled: true,
  clientHost: '127.0.0.1',
  clientPort: 3301,
  serverHost: '127.0.0.1',
  serverPort: 3330
});

export default class GeneralPref extends GeneralPrefRecord {}
