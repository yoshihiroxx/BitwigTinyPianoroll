import React from 'react';
import { TextField, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import PrefTabPanel, { PrefPaper } from '../atoms/PrefTabPanel';
import Theme from '../../models/Theme';
import PrefButton from '../atoms/PrefButton';
import HexColorField from '../atoms/HexColorField';

type Props = {
  state: Theme;
  index: number;
  currentIndex: number;
};

const updateTheme = function() {
  // @todo Apply edited theme to application state.
};

export default function PrefThemeTabPanel(props: Props) {
  const { index, currentIndex, state } = props;

  const [editing, setEditing] = React.useState(state);

  return (
    <PrefTabPanel value={currentIndex} index={index}>
      <PrefPaper>
        <Typography>Pianoroll</Typography>

        <Typography>General</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <HexColorField
              id="outlined-basic"
              label="background"
              variant="outlined"
              defaultValue={state.pianoroll.background.value
                .toString(16)
                .toUpperCase()}
              onValidated={value => {
                setEditing(
                  editing.setIn(['pianoroll', 'background', 'value'], value)
                );
              }}
            />
          </Grid>
        </Grid>
        <Typography>Notes</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <HexColorField
              id="outlined-basic"
              label="text"
              variant="outlined"
              defaultValue={state.pianoroll.notes.text.value
                .toString(16)
                .toUpperCase()}
              onValidated={value => {
                setEditing(
                  editing.setIn(['pianoroll', 'notes', 'text', 'value'], value)
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="common"
              variant="outlined"
              defaultValue={state.pianoroll.notes.common.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="selection"
              variant="outlined"
              defaultValue={state.pianoroll.notes.selection.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="drawing"
              variant="outlined"
              defaultValue={state.pianoroll.notes.drawing.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
        </Grid>
        <Typography>Lines</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="horizontal-main"
              variant="outlined"
              defaultValue={state.pianoroll.lines.horizontal.main.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="horizontal-sub"
              variant="outlined"
              defaultValue={state.pianoroll.lines.horizontal.sub.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="vertical-quarter"
              variant="outlined"
              defaultValue={state.pianoroll.lines.vertical.quarter.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="vertical-beat"
              variant="outlined"
              defaultValue={state.pianoroll.lines.vertical.beat.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="vertical-bar"
              variant="outlined"
              defaultValue={state.pianoroll.lines.vertical.bar.value
                .toString(16)
                .toUpperCase()}
            />
          </Grid>
        </Grid>
        <PrefButton variant="contained" color="primary" onClick={updateTheme}>
          Save
        </PrefButton>
      </PrefPaper>
    </PrefTabPanel>
  );
}
