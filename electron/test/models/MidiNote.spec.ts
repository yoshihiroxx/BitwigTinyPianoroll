import MidiNote from '../../app/models/MidiNote';

describe('Model MidiNote', () => {
  test('MidiNote Can be loaded', () => {
    const mn = new MidiNote();
    expect(typeof mn).toBe('object');
  });
  test('Create New MidiNote', () => {
    const mn = new MidiNote({
      noteNumber: 121,
      startBeat: 0.32,
      lengthInBeats: 10.2,
      velocity: 67
    });
    expect(mn.noteNumber).toEqual(121);
    expect(mn.startBeat).toEqual(0.32);
    expect(mn.lengthInBeats).toEqual(10.2);
    expect(mn.velocity).toEqual(67);
  });
});
