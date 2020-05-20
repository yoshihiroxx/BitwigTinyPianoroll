import counter from '../../app/reducers/counter';
import project from '../../app/reducers/project';
import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER
} from '../../app/actions/counter';
import { LOAD_MIDIFILE } from '../../app/actions/debug';
import Project from '../../app/models/Project';

describe('reducers', () => {
  describe('counter', () => {
    it('should handle initial state', () => {
      expect(counter(undefined, {})).toMatchSnapshot();
    });

    it('should handle INCREMENT_COUNTER', () => {
      expect(project(new Project(), { type: LOAD_MIDIFILE })).toMatchSnapshot();
    });

    it('should handle DECREMENT_COUNTER', () => {
      expect(counter(1, { type: DECREMENT_COUNTER })).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(counter(1, { type: 'unknown' })).toMatchSnapshot();
    });
  });
});
