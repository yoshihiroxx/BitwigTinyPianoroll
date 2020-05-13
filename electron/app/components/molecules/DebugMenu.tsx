import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Editor.css';

type Props = {
  scale: {
    centre: number;
    degree: {
      name: string;
      values: Array<number>;
    };
  };
};

export default function NoteLabelBar(props: Props) {
  const {
    increment,
    incrementIfOdd,
    incrementAsync,
    decrement,
    counter
  } = props;

  return <div>Open</div>;
}
