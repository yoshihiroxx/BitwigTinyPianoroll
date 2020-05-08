import MidiNote from '../../app/models/MidiNote';

describe('Model MidiNote', () => {
  test('MidiNote Can be loaded', () => {
    const mn = new MidiNote();
    expect(typeof mn).toBe('object');
  });
  test('Create New MidiNote', () => {
    const mn = new MidiNote({
      note_number: 121,
      start_beat: 0.32,
      length_in_beats: 10.2,
      velocity: 67
    });
    expect(mn.note_number).toEqual(121);
    expect(mn.start_beat).toEqual(0.32);
    expect(mn.length_in_beats).toEqual(10.2);
    expect(mn.velocity).toEqual(67);
  });
});
