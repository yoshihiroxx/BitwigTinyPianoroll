/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Box, Grid, TextField, Typography, Paper } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import PrefButton from '../atoms/PrefButton';
import styles from './PrefThemeTabPanel.css';

interface PrefTabPanelProps {
  children?: React.ReactNode;
  currentIndex: number;
  index: number;
  uiConfig: UIConfigType;
  state: any;
}

type UIConfigType = {
  osc: {
    server: InputContentType;
    client: InputContentType;
  };
};

type InputContentType = {
  title: string;
  inputs: Array<InputType>;
}

type InputType = {
  title: string;
  description: string;
  type: string;
  keys: Array<string>;
};

const applyNewPreferences = (nextPreferences: any) => {
  // @todo Apply newPreferences to Store
};

const renderSectionContents = ( inputContents:InputContentType ):React.ReactElement => {
  return (<TextField />)
}

export default function PrefTabPanel(props: PrefTabPanelProps) {
  const { children, currentIndex, index, uiConfig, state, ...other } = props;

  const [editing, setEditing] = React.useState(state);

  const sections: Array<React.ReactElement> = [];

  Object.keys(uiConfig).forEach((key, id) => {
    const inputContents = uiConfig[key];
    if(inputContents instanceof In)
    const section : Array<React.ReactElement> = renderSectionContents(uiConfig[key]);
  }

  Object.keys(uiConfig).forEach((key, id) => {
    if (!uiConfig[key].title || !uiConfig[key].inputs) return;
    const section = (() => {
      const inputs: Array<React.ReactElement> = [];
      uiConfig[key].inputs.forEach(input => {
        inputs.push(<TextField />);
      });
      return (
        <div className={styles.settingBlock} key={id}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography>{uiConfig[key].title}</Typography>
            </Grid>
            <Grid item xs={8}>
              {inputs}
            </Grid>
          </Grid>
        </div>
      );
    })();
    sections.push(section);
  });

  return (
    <Box
      p={3}
      role="tabpanel"
      hidden={currentIndex !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {sections}
      <PrefButton
        variant="contained"
        color="primary"
        onClick={() => {
          applyNewPreferences(editing);
        }}
      >
        Save
      </PrefButton>
    </Box>
  );
}

export const PrefPaper = styled(Grid)({
  textAlign: 'center'
});
