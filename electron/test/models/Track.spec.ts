import Track from '../../app/models/Track';

describe('Model Track', () => {
  test('Track Can be loaded', () => {
    const t = new Track();
    expect(typeof t).toBe('object');
  });
});
