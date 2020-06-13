import React, { ReactComponentElement, ReactElement } from 'react';
import { TextField, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { ipcRenderer, remote } from 'electron';
import { fromJS, List } from 'immutable';
import PrefTabPanel, { PrefPaper } from '../atoms/PrefTabPanel';
import Theme from '../../models/Theme';
import PrefButton from '../atoms/PrefButton';
import HexColorField from '../atoms/HexColorField';
import AlphaColorField from '../atoms/AlphaField';
import styles from './PrefThemeTabPanel.css';
import UIConfig from '../../settings/prefrencesUIConfig.json';

type Props = {
  state: Theme;
  index: number;
  currentIndex: number;
};

const updateTheme = (theme: Theme) => {
  // @todo Apply edited theme to application state.
  ipcRenderer.send('update-theme', theme.toObject());
};

export default function PrefThemeTabPanel(props: Props) {
  const { index, currentIndex, state } = props;

  const [editing, setEditing] = React.useState(state);

  const uiConfig = UIConfig.tabs.theme.pianoroll;
  const sections: Array<React.Component> = [];

  const renderColorInputs = (inputs: Array<InputData>) => {
    const list: Array<ReactElement> = [];
    inputs.forEach((inputData: InputData) => {
      list.push(
        <div key={`input-${inputData.title}`}>
          <Typography variant="subtitle1">{inputData.title}</Typography>
          <span>{inputData.description}</span>
          <Grid container spacing={2} className={styles.inputGroup}>
            <Grid item xs={8}>
              <HexColorField
                id="outlined-basic"
                label="value"
                className={styles.input}
                defaultValue={(() => {
                  let itrValue: unknown = state;
                  inputData.keys.forEach((key: string) => {
                    if (!itrValue[key]) {
                      throw new Error(
                        `${key}: does not found the key in value`
                      );
                    }
                    itrValue = itrValue[key];
                  });
                  return itrValue.value.toString(16).toUpperCase();
                })()}
                onValidated={value => {
                  let keysToValue = List(inputData.keys);
                  keysToValue = keysToValue.push('value');
                  setEditing(editing.setIn(keysToValue.toArray(), value));
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <AlphaColorField
                id="outlined-basic"
                label="alpha"
                variant="outlined"
                className={styles.input}
                defaultValue={(() => {
                  let itrValue: unknown = state;
                  inputData.keys.forEach((key: string) => {
                    if (!itrValue[key]) {
                      throw new Error(
                        `${key}: does not found the key in value`
                      );
                    }
                    itrValue = itrValue[key];
                  });
                  return itrValue.alpha.toString();
                })()}
                onValidated={value => {
                  let keysToAlpha = List(inputData.keys);
                  keysToAlpha = keysToAlpha.push('alpha');
                  setEditing(editing.setIn(keysToAlpha.toArray(), value));
                }}
              />
            </Grid>
          </Grid>
        </div>
      );
    });
    return list;
  };

  Object.keys(uiConfig).forEach((key, id) => {
    if (!uiConfig[key].title || !uiConfig[key].inputs) return;
    const section = (() => {
      return (
        <div className={styles.settingBlock} key={id}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography>{uiConfig[key].title}</Typography>
            </Grid>
            <Grid item xs={8}>
              {renderColorInputs(uiConfig[key].inputs)}
            </Grid>
          </Grid>
        </div>
      );
    })();
    sections.push(section);
  });

  type InputData = {
    title: string;
    description: string;
    type: string;
    keys: Array<string>;
  };

  return (
    <PrefTabPanel value={currentIndex} index={index}>
      <Typography variant="h5">Pianoroll</Typography>
      {sections}
      <PrefButton
        variant="contained"
        color="primary"
        onClick={() => {
          updateTheme(editing);
        }}
      >
        Save
      </PrefButton>
    </PrefTabPanel>
  );
}
