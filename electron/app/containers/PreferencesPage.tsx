import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import PreferencesComponent from '../components/templates/Preferences';
import { increment } from '../actions/counter';
import { ModelType } from '../reducers/types';

function mapStateToProps(state: ModelType) {
  return {
    preferences: state.preferences
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      increment
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreferencesComponent);
