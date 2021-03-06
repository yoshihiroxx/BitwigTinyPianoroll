import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { handleTool, onMouseEvent } from '../actions/tool';
import { ModelType } from '../reducers/types';
import PianoRollToolBar from '../components/molecules/PianoRollToolBar';

function mapStateToProps(state: ModelType) {
  return {
    cref: 'treble',
    octave: 4,
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
      onMouseEvent
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PianoRollToolBar);
