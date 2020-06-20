import { remote } from 'electron';
import MidiParser from 'midi-parser-js';
import { GetStage, Dispatch } from '../reducers/types';

export const LOAD_MIDIFILE = 'LOAD_MIDIFILE';

export function loadMidiFile(path: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const readfile = (_path: string) => {
      return new Promise((resolve, reject) => {
        remote.require('fs').readFile(_path, 'base64', (err, data) => {
          return err ? reject(err) : resolve(data);
        });
      });
    };
    readfile(path)
      .then(data => {
        const parsedMidi = MidiParser.parse(data);
        const payload = {
          parsedMidi
        };
        dispatch({
          type: LOAD_MIDIFILE,
          payload
        });
        return true;
      })
      .catch(function(error) {
        throw new Error(error);
        return false;
      });
  };
}
