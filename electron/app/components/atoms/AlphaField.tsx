/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

type Props = {
  onValidated: (value: number) => void;
};

export default function AlphaColorField(props: Props & TextFieldProps) {
  const { onValidated, ...other } = props;

  const [isError, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  return (
    <TextField
      helperText={helperText}
      error={isError}
      variant="outlined"
      size="small"
      fullWidth
      onChange={e => {
        const value = Number(e.target.value);
        if (value < 0 || value > 1) {
          setError(true);
          setHelperText('The value range is 0~1.');
        }
        setError(false);
        setHelperText('');
        onValidated(value);
      }}
      {...other}
    />
  );
}
