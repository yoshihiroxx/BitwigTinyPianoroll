import ClipRecord from '../../app/models/Clip';

describe('Model Clip', () => {
  test('Clip Can be loaded', () => {
    const c = new ClipRecord();
    expect(typeof c).toBe('object');
  });

  test('should handle initial state', () => {
    let c = new ClipRecord();
    c = c.set('name', 'hoge');
    expect(c.get('name')).toMatch('hoge');
  });
});
