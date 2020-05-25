import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Pianoroll, {
  PianorollStateType
} from '../components/organisms/PianoRoll';
import { handleEvent, handleTool, onMouseEvent } from '../actions/tool';
import MidiClip from '../models/MidiClip';
import { ModelType } from '../models/ModelCreator';

function mapStateToProps(state: ModelType) {
  return {
    cref: 'he',
    crefRoot: 4,
    scale: {
      centre: 'c',
      defree: {
        name: 'major',
        values: [0, 2, 4, 5, 7, 9, 11]
      }
    },
    clip: state.editor.project.tracks.getIn([0, 0]),
    tool: state.editor.tool,
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

export default connect(mapStateToProps, mapDispatchToProps)(Pianoroll);
