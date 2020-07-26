/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

type Props = {};

export default function PrefTextField(props: Props & TextFieldProps) {
  const { ...other } = props;

  const [isError, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  return (
    <TextField
      helperText={helperText}
      error={isError}
      variant="outlined"
      size="small"
      fullWidth
      {...other}
    />
  );
}
