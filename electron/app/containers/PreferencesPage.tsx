import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import Preferences from '../components/templates/Preferences';
import { ModelType } from '../reducers/types';
import { onChangePreferences } from '../actions/preferences';

function mapStateToProps(state: ModelType) {
  return {
    preferences: state.preferences
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      onChangePreferences
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export type Props = PropsFromRedux;

export default connector(Preferences);
