import React from 'react';
import styles from './Ruler.css';

type Props = {
  zoom: {
    x: number;
    y: number;
  };
  pan: {
    x: number;
    y: number;
  };
};

export default function Ruler(props: Props) {
  const {
    increment,
    incrementIfOdd,
    incrementAsync,
    decrement,
    counter
  } = props;

  return <div className={styles.ruler}>i am ruler</div>;
}
