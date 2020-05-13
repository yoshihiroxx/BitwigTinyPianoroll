import { remote } from 'electron';
import { GetStage, Dispatch } from '../reducers/types';

export const LOAD_MIDIFILE = 'LOAD_MIDIFILE';

export function loadMidiFile(filename: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    console.log(state);
    const baseDir = `/Users/y/work/BitwigTinyPianoroll/electron/test/midi/${filename}`;
    const readfile = path => {
      return new Promise((resolve, reject) => {
        remote.require('fs').readFile(path, 'base64', (err, data) => {
          return err ? reject(err) : resolve(data);
        });
      });
    };
    readfile(baseDir)
      .then(function(data) {
        console.log(`The file content is : ${data}`);
        const payload = {
          data
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
