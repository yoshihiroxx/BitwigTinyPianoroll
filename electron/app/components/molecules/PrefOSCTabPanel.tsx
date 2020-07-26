import React from 'react';
import { TextField, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PrefButton from '../atoms/PrefButton';
import PrefTabPanel from '../atoms/PrefTabPanel';
import Theme from '../../models/Theme';
import styles from './PrefThemeTabPanel.css';
import UIConfig from '../../extraResources/settings/prefrencesUIConfig.json';
import PrefTextField from '../atoms/PrefTextField';
import GeneralPref from '../../models/GeneralPref';

type Props = {
  state: GeneralPref;
  index: number;
  currentIndex: number;
  onSave: () => void;
};

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

const StyledToggleButton = withStyles({
  selected: {
    color: '#f0f',
    background: 'black',
    label: {
      color: '#0fd'
    }
  }
})(ToggleButton);

export default function PrefThemeTabPanel(props: Props) {
  const { index, currentIndex, state, onSave } = props;

  const classes = useStyles();

  const [editing, setEditing] = React.useState(state.general);

  const [clientMode, setClientMode] = React.useState('bitwig');

  const sections: Array<React.Component> = [];

  return (
    <PrefTabPanel value={currentIndex} index={index}>
      <Typography variant="h5">OSC</Typography>

      <div className={styles.settingBlock}>
        <Grid container spacing={2} className={styles.inputGroup}>
          <Grid item xs={4}>
            <Typography>Bitwig</Typography>
          </Grid>
          <Grid xs={8} item>
            <Typography>OSC Mode</Typography>
            <ToggleButtonGroup
              value={editing.get('clientMode')}
              exclusive
              onChange={(e, newClientMode) => {
                if (newClientMode !== null) {
                  setEditing(editing.setIn(['clientMode'], newClientMode));
                }
              }}
              aria-label="text alignment"
            >
              <ToggleButton value="bitwig" aria-label="left aligned">
                Bitwig
              </ToggleButton>
              <StyledToggleButton value="" aria-label="centered">
                <Typography>OFF</Typography>
              </StyledToggleButton>
              {/* <ToggleButton value="fl" aria-label="right aligned" disabled>
                FL Studio
              </ToggleButton>
              <ToggleButton value="ableton" aria-label="justified" disabled>
                Ableton
              </ToggleButton> */}
            </ToggleButtonGroup>
            <Typography>Client</Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <PrefTextField
                  className={styles.input}
                  label="host"
                  fullWidth
                  size="small"
                  defaultValue={editing.clientHost}
                  onChange={e => {
                    setEditing(editing.setIn(['clientHost'], e.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <PrefTextField
                  className={styles.input}
                  label="port"
                  fullWidth
                  size="small"
                  defaultValue={editing.clientPort}
                  onChange={e => {
                    setEditing(
                      editing.setIn(['clientPort'], Number(e.target.value))
                    );
                  }}
                />
              </Grid>
            </Grid>

            <Typography>Server</Typography>
            <Grid container spacing={2} className={styles.inputGroup}>
              <Grid item xs={8}>
                <PrefTextField
                  className={styles.input}
                  label="host"
                  fullWidth
                  size="small"
                  defaultValue={editing.serverHost}
                  onChange={e => {
                    setEditing(editing.setIn(['serverHost'], e.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <PrefTextField
                  className={styles.input}
                  label="port"
                  fullWidth
                  size="small"
                  defaultValue={editing.serverPort}
                  onChange={e => {
                    setEditing(
                      editing.setIn(['serverPort'], Number(e.target.value))
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <PrefButton
        variant="contained"
        color="primary"
        onClick={() => {
          onSave(state.set('general', editing));
        }}
      >
        Save
      </PrefButton>
    </PrefTabPanel>
  );
}
