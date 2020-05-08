import Clip from '../../app/models/Clip';

describe('Model Clip', () => {
  test('Clip Can be loaded', () => {
    const c = new Clip();
    expect(typeof c).toBe('object');
  });

  test('should handle initial state', () => {
    let c = new Clip({});
    c = c.setName('hoge');
    console.log(c.get('name'));
    expect(c.get('name')).toMatch('hoge');
  });
});
