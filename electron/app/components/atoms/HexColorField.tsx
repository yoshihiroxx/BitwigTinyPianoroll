/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

type Props = {
  onValidated: (value: number) => void;
};

export default function HexColorField(props: Props & TextFieldProps) {
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
        if (e.target.value.length !== 6) {
          setError(true);
          setHelperText('Invalid value');
          return;
        }
        const re = /[0-9A-Fa-f]{6}/;
        if (!re.test(e.target.value)) {
          setError(true);
          setHelperText('Invalid value');
          return;
        }
        setError(false);
        setHelperText('');
        onValidated(parseInt(e.target.value, 16));
      }}
      {...other}
    />
  );
}
