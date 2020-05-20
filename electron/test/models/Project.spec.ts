import Project, { TrackRecordType } from '../../app/models/Project';

describe('Model Project', () => {
  test('Project Can be loaded', () => {
    const p = new Project();
    expect(typeof p).toBe('object');
  });
});
