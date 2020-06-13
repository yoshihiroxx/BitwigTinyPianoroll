import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  Toolbar,
  Typography,
  Paper,
  Grid
} from '@material-ui/core';
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
  createStyles,
  styled
} from '@material-ui/core/styles';
import { display } from '@material-ui/system';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    paper: {
      // padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary
    },
    input: {
      margin: theme.spacing(2)
    }
  })
);

export default function PreferencesComponent(props: Props) {
  const { preferences } = props;

  const [value, setValue] = React.useState(0);

  const classes = useStyles(preferences.theme);

  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#F1831A'
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        light: '#0066ff',
        main: '#0044ff',
        // dark: will be calculated from palette.secondary.main,
        contrastText: '#ffcc00'
      }
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      // contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      // tonalOffset: 0.2
    },
    spacing: 8
  });

  const PrefButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '23px'
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <PrefAppBar position="static">
        <Toolbar>
          <Typography variant="h6">Preferences</Typography>
        </Toolbar>
        <Tabs
          value={value}
          variant="fullWidth"
          onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="OSC" {...a11yProps(0)} />
          <Tab label="GENERAL" {...a11yProps(0)} />
          <Tab label="THEME" {...a11yProps(0)} />
        </Tabs>
      </PrefAppBar>
      <PrefThemeTabPanel
        currentIndex={value}
        index={2}
        state={preferences.theme}
      />
    </ThemeProvider>
  );
}
