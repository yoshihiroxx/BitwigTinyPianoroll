import counter from '../../app/reducers/counter';
import project from '../../app/reducers/project';
import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER
} from '../../app/actions/counter';
import { LOAD_MIDIFILE } from '../../app/actions/debug';
import Project from '../../app/models/Project';

describe('Reducer - Project', () => {
  test('project returns Project Instance', () => {
    const projectState = project(new Project(), { type: 'UNDEFINE_ACTION' });
    expect(projectState instanceof Project).toBeTruthy();
  });
});
