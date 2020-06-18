import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Pianoroll from '../components/organisms/PianoRoll';
import { handleTool, onMouseEvent } from '../actions/tool';
import { onKeyDown, onKeyUp } from '../actions/keyEvents';
import { ModelType } from '../reducers/types';

function mapStateToProps(state: ModelType) {
  return {
    scale: {
      centre: 'c',
      defree: {
        name: 'major',
        values: [0, 2, 4, 5, 7, 9, 11]
      }
    },
    clip: state.editor.project.tracks.getIn([0, 0]),
    tool: state.editor.tool,
    keyBinds: state.preferences.keyBinds,
    theme: state.preferences.theme,
    zoom: {
      x: 1,
      y: 1
    },
    pan: {
      x: 1,
      y: 1
    }
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      handleTool,
      onMouseEvent,
      onKeyDown,
      onKeyUp
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Pianoroll);
