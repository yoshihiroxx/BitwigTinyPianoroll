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
  octave: number;
};

export default function NoteLabelBar(props: Props) {
  const { octave, cref } = props;

  return (
    <div className={styles.noteLabelBar}>
      <ul>
        <li>{`F${octave + 1}`}</li>
        <li>{`D${octave + 1}`}</li>
        <li>{`B${octave}`}</li>
        <li>{`G${octave}`}</li>
        <li>{`A${octave}`}</li>
        <li>{`C${octave}`}</li>
      </ul>
    </div>
  );
}
