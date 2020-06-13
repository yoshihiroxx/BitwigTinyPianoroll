export const LOAD_MIDIFILE = 'LOAD_MIDIFILE';
export const NEW_MIDIFILE = 'NEW_MIDIFILE';

export function onLoadMidiFile(parsedMidi: unknown) {
  return {
    type: LOAD_MIDIFILE,
    payload: {
      parsedMidi
    },
    error: null
  };
}

export function onCreateNewMidiFile() {
  return {
    type: NEW_MIDIFILE,
    payload: {},
    error: null
  };
}
