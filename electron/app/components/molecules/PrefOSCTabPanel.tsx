import React from 'react';
import { TextField, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import PrefButton from '../atoms/PrefButton';
import PrefTabPanel from '../atoms/PrefTabPanel';

type Props = {
  oscSettings: unknown;
  index: number;
  currentIndex: number;
  theme: Theme;
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

export default function PrefThemeTabPanel(props: Props) {
  const { index, currentIndex, oscSettings, theme } = props;

  const classes = useStyles();

  return (
    <PrefTabPanel value={currentIndex} index={index}>
      <Paper>
        <Typography>Pianoroll</Typography>
        <Grid container spacing={1} className={classes.root}>
          <Grid className={classes.paper} item xs={12}>
            <TextField
              id="outlined-basic"
              label="value"
              variant="outlined"
              className={classes.input}
            />
            <TextField
              id="outlined-basic"
              label="alpha"
              variant="outlined"
              className={classes.input}
            />
          </Grid>
          <Grid className={classes.paper} item xs={12}>
            <TextField
              id="outlined-basic"
              label="ServerPort"
              variant="outlined"
              className={classes.input}
            />
          </Grid>
          <Grid className={classes.paper} item xs={12}>
            <TextField
              id="outlined-basic"
              label="ClientPort"
              variant="outlined"
              className={classes.input}
            />
          </Grid>
          <Grid className={classes.paper} item xs={12}>
            <PrefButton variant="contained" color="primary">
              Test Connection
            </PrefButton>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={1} className={classes.root}>
        <Grid className={classes.paper} item xs={6} spacing={3}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid className={classes.paper} item xs={6} spacing={3}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>

        <Grid container item xs={12} spacing={3}>
          <span>Client Mode</span>
          <span>{oscSettings.osc.clientMode}</span>
          <span>clientPort</span>
          <span>{oscSettings.osc.clientPort}</span>
          <span>serverPort</span>

          <span>{oscSettings.osc.serverPort}</span>
          <form noValidate autoComplete="off">
            <PrefButton variant="contained" color="primary">
              Save
            </PrefButton>
          </form>
        </Grid>
      </Grid>
    </PrefTabPanel>
  );
}
