import { spy, stub, mock } from 'sinon';
import { ipcRenderer } from 'electron';
import Preferences from '../../app/models/Preferences';
import * as actions from '../../app/actions/preferences';

describe('actions', () => {
  it('should updatePreferences should create updatePreferences action', () => {
    expect(actions.updatePreferences(new Preferences())).toMatchSnapshot();
  });

  it('onChangePreferences should return Action', () => {
    const pref = new Preferences();
    const fn = actions.onChangePreferences(pref);
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    const getState = () => ({
      preferences: pref,
      editor: null
    });
    fn(dispatch, getState);
    // const stubIpcOnce = stub(ipcRenderer, 'once');
    // stubIpcOnce.callsFake(dispatch);
    // ipcOnceStub.onCall(0);

    expect((ipcRenderer.once as jest.Mock).mock.calls.length).toBe(1);
    expect((ipcRenderer.send as jest.Mock).mock.calls.length).toBe(1);
    // expect(dispatch.called).toBe(true);
  });
});
