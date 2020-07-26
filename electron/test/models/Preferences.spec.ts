import Preferences from '../../app/models/Preferences';

describe('actions', () => {
  it('should increment should create increment action', () => {
    const pref = new Preferences();
    expect(pref).toMatchSnapshot();
  });
});
