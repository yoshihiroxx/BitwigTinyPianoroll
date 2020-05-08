import MidiList from '../../app/models/MidiList';
import MidiNote from '../../app/models/MidiNote';

describe('Model MidiNote', () => {
  test('MidiList Can be loaded', () => {
    const ml = new MidiList();
    expect(typeof ml).toBe('object');
  });
  test('Add a MidiNote to MidiList', () => {
    const mn: MidiNote = new MidiNote({
      note_number: 133,
      start_beat: 23.1,
      length_in_beats: 33.23,
      velocity: 122
    });
    let ml: MidiList = new MidiList();
    ml = ml.addNote(mn);

    expect(ml.get('notes').get(0)).toMatchObject(mn);
  });
});
