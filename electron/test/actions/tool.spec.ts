import MidiNote from '../../app/models/MidiNote';
import { onMouseEvent } from '../../app/actions/tool';
import { ActionType } from '../../app/reducers/types';

describe('actions', () => {
  test('onMouseEvent behavior', () => {
    let action = onMouseEvent('click', 0, 0);
    expect(action).toHaveProperty('type');
    expect(action).toHaveProperty('payload');
    expect(typeof action.payload.beatOrNote).toEqual('number');
    expect(typeof action.payload.noteNumber).toEqual('number');
    expect(action).toHaveProperty('meta');

    action = onMouseEvent('click', new MidiNote());
    expect(action).toHaveProperty('type');
    expect(action).toHaveProperty('payload');
    expect(action.payload.beatOrNote instanceof MidiNote).toBeTruthy();
    expect(action).toHaveProperty('meta');

    action = onMouseEvent('drag', 0, 0);
    expect(action).toHaveProperty('type');
    expect(action).toHaveProperty('payload');
    expect(typeof action.payload.beatOrNote).toEqual('number');
    expect(typeof action.payload.noteNumber).toEqual('number');
    expect(action).toHaveProperty('meta');

    action = onMouseEvent('drag', new MidiNote());
    expect(action).toHaveProperty('type');
    expect(action).toHaveProperty('payload');
    expect(action.payload.beatOrNote instanceof MidiNote).toBeTruthy();
    expect(action).toHaveProperty('meta');

    action = onMouseEvent('release', 0, 0);
    expect(action).toMatchSnapshot();

    action = onMouseEvent('release', new MidiNote());
    expect(action).toMatchSnapshot();
  });
});
