/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

interface PrefTabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export default function PrefTabPanel(props: PrefTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export const PrefPaper = styled(Grid)({
  textAlign: 'center'
});
