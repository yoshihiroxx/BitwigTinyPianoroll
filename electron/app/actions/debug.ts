import { remote } from 'electron';
import MidiParser from 'midi-parser-js';
import { GetStage, Dispatch } from '../reducers/types';

export const LOAD_MIDIFILE = 'LOAD_MIDIFILE';

export function loadMidiFile(path: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    console.log(state);
    const readfile = (_path: string) => {
      return new Promise((resolve, reject) => {
        remote.require('fs').readFile(_path, 'base64', (err, data) => {
          return err ? reject(err) : resolve(data);
        });
      });
    };
    readfile(path)
      .then(data => {
        console.log(`The file content is : ${data}`);
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
        console.log(error);
        return false;
      });
  };
}
