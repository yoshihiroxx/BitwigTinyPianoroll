import { spy, stub } from 'sinon';
import Subscribable from '../../app/managers/Subscribable';

describe('managers', () => {
  it('create OscManager instance', () => {
    const sub = new Subscribable();
    const mySpy = spy(sub, 'on');
    sub.on('test', arg => {});
    sub.publish('test', 20);
    expect(mySpy.called).toBe(true);
  });
});
