import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Pianoroll, {
  PianorollStateType
} from '../components/organisms/PianoRoll';
import {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync
} from '../actions/counter';
import MidiClip from '../models/MidiClip';

function mapStateToProps(state: PianorollStateType) {
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
    clip: new MidiClip(),
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
      increment,
      decrement,
      incrementIfOdd,
      incrementAsync
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Pianoroll);
