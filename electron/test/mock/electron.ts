import { spy } from 'sinon';

// eslint-disable-next-line import/prefer-default-export
export const ipcRenderer = {
  on: jest.fn(),
  once: jest.fn(),
  send: jest.fn()
};
