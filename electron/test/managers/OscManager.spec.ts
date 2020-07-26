import { spy, stub } from 'sinon';
import OscManager from '../../app/managers/OscManager';
import { IPCArgments } from '../../app/reducers/types';

describe('managers', () => {
  let om = null;
  beforeEach(() => {
    om = new OscManager();
  });
  afterEach(() => {
    om.oscPort.close();
  });
  it('create OscManager instance', () => {
    om.initOSCServer();
    expect(om).toBeInstanceOf(OscManager);
  });

  it('route OSC messages correctly', () => {
    const mySpy = jest.spyOn(om.oscPort, 'send');
    om.routeOSCMessage('/v1/bitwig/cursorclip/notes', {
      type: 'set',
      payload: {
        noteNumber: 10,
        start: 1,
        velocity: 120,
        channel: 0
      },
      error: false
    });
    expect(mySpy).toHaveBeenCalled();

    const myStub = stub(om, 'publish');

    const ipcArgments: IPCArgments = {
      type: 'set',
      payload: {
        hoge: 20,
        fuga: 'nyaa'
      },
      error: false
    };

    om.routeOSCMessage('/v1/tinypianoroll/oscclip/notes', ipcArgments);

    expect(myStub.withArgs(ipcArgments).called).toBe(true);
    // expect(spp.called).toBe(true);
  });
});
