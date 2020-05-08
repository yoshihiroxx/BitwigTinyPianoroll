import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import EditorPage from './containers/EditorPage';
import PreferencesPage from './containers/PreferencesPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.EDITOR} component={EditorPage} />
        <Route path={routes.PREFERENCES} component={PreferencesPage} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
