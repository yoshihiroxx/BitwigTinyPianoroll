import React from 'react';
import styles from './NoteLabelBar.css';

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

  return (
    <div className={styles.noteLabelBar}>
      <ul>
        <li>F5</li>
        <li>D5</li>
        <li>B4</li>
        <li>G4</li>
        <li>E4</li>
        <li>C4</li>
      </ul>
    </div>
  );
}
