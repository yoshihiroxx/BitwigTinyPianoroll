import React from 'react';
import { Link } from 'react-router-dom';

import PrefSelect from '../atoms/PrefSelect';
import PrefTabPanel from '../atoms/PrefTabPanel';
import PrefAppBar from '../atoms/PrefAppBar';

import styles from './Preferences.css';
import routes from '../../constants/routes.json';
import Preferences from '../../models/Preferences';
import PrefThemeTabPanel from '../molecules/PrefThemeTabPanel';
import Theme from '../../models/Theme';

type Props = {
  increment: () => void;
  incrementIfOdd: () => void;
  incrementAsync: () => void;
  decrement: () => void;
  counter: number;
  preferences: Preferences;
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function PreferencesComponent(props: Props) {
  const { preferences } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return <div>Preferences does not support yet.</div>;
}
