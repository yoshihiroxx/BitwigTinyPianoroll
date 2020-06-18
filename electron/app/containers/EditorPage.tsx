import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Editor from '../components/templates/Editor';
import {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync
} from '../actions/counter';
import { ModelType } from '../reducers/types';

function mapStateToProps(state: ModelType) {
  return {
    clip: state.editor.project.tracks.getIn([0, 0])
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      increment,
      decrement,
      incrementIfOdd,
      incrementAsync
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
