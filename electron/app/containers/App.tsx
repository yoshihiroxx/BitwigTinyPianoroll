import React, { ReactNode } from 'react';
import { bindActionCreators, Dispatch } from 'redux';

import { connect, ConnectedProps } from 'react-redux';
import { reloadPreferences } from '../actions/preferences';
import { ModelType } from '../reducers/types';

function mapStateToProps(state: ModelType) {
  return {
    preferences: state.preferences
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      reloadPreferences
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  children: ReactNode;
} & PropsFromRedux;

function App(props: Props) {
  const { children } = props;
  // eslint-disable-next-line react/destructuring-assignment
  props.reloadPreferences();
  return <>{children}</>;
}

export default connector(App);
